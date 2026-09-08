/** @typedef {import('node:http').Server} HttpServer */
/** @typedef {import('node:http').IncomingMessage} IncomingMessage */
/** @typedef {import('node:http').ServerResponse} ServerResponse */
/** @typedef {import('node:child_process').ChildProcess} AppProcess */
/** @typedef {import('jose').KeyLike} KeyLike */
/** @typedef {{ nonce: string, challenge: string }} KeycloakLoginState */

import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import { spawn } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { after, before, describe, test } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  exportJWK,
  generateKeyPair,
  SignJWT,
} from "jose";

const serverRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const frontendOrigin = "http://localhost:8080";

/** @type {HttpServer | undefined} */
let keycloakServer;
/** @type {AppProcess | undefined} */
let applicationProcess;
/** @type {string} */
let keycloakOrigin;
/** @type {string} */
let applicationOrigin;
/** @type {KeycloakLoginState | undefined} */
let keycloakState;
/** @type {KeyLike | undefined} */
let signingKey;
/** @type {KeyLike | undefined} */
let verificationKey;
/** @type {Record<string, unknown> | undefined} */
let publicJwk;
/** @type {string | null | undefined} */
let codeVerifier;

function randomString(bytes = 24) {
  return randomBytes(bytes).toString("base64url");
}

/** @param {IncomingMessage} request */
function readForm(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => resolve(new URLSearchParams(body)));
    request.on("error", reject);
  });
}

/** @param {ServerResponse} response */
/** @param {number} status */
/** @param {Record<string, unknown>} value */
function json(response, status, value) {
  response.writeHead(status, { "content-type": "application/json" });
  response.end(JSON.stringify(value));
}

/** @param {HttpServer} server */
function startServer(server) {
  server.listen(0, "127.0.0.1");
  return once(server, "listening").then(() => {
    const address = server.address();
    assert.ok(address && typeof address === "object");
    return `http://127.0.0.1:${address.port}`;
  });
}

async function waitForHealth(url) {
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${url}/health`);
      if (response.ok) return;
    } catch {
      // The child process may still be starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Application did not become healthy at ${url}`);
}

/** @param {AppProcess | undefined} child */
async function stopProcess(child) {
  if (!child || child.exitCode !== null) return;
  child.kill();
  await once(child, "exit");
}

function cookiePair(response) {
  const cookies = response.headers.getSetCookie?.() ?? [];
  const value = cookies[0] ?? response.headers.get("set-cookie");
  assert.ok(value, "Expected the application to set a session cookie");
  return value.split(";", 1)[0];
}

async function createIdToken(nonce) {
  return new SignJWT({
    sub: "keycloak-user-001",
    nonce,
    email: "rahul@example.test",
    preferred_username: "rahul",
    name: "Rahul Sharma",
  })
    .setProtectedHeader({ alg: "RS256", kid: "test-key-1", typ: "JWT" })
    .setIssuer(keycloakOrigin + "/realms/sovara-local")
    .setAudience("sovara-backend-local")
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(signingKey);
}

before(async () => {
  ({ privateKey: signingKey, publicKey: verificationKey } = await generateKeyPair("RS256"));
  publicJwk = await exportJWK(verificationKey);
  publicJwk.kid = "test-key-1";
  publicJwk.alg = "RS256";
  publicJwk.use = "sig";

  keycloakServer = createServer(async (request, response) => {
    const requestUrl = new URL(request.url, "http://localhost");
    const issuer = `${keycloakOrigin}/realms/sovara-local`;

    if (requestUrl.pathname === "/realms/sovara-local/.well-known/openid-configuration") {
      json(response, 200, {
        issuer,
        authorization_endpoint: `${keycloakOrigin}/realms/sovara-local/protocol/openid-connect/auth`,
        token_endpoint: `${keycloakOrigin}/realms/sovara-local/protocol/openid-connect/token`,
        userinfo_endpoint: `${keycloakOrigin}/realms/sovara-local/protocol/openid-connect/userinfo`,
        end_session_endpoint: `${keycloakOrigin}/realms/sovara-local/protocol/openid-connect/logout`,
        jwks_uri: `${keycloakOrigin}/realms/sovara-local/protocol/openid-connect/certs`,
      });
      return;
    }

    if (requestUrl.pathname.endsWith("/protocol/openid-connect/certs")) {
      json(response, 200, { keys: [publicJwk] });
      return;
    }

    if (requestUrl.pathname.endsWith("/protocol/openid-connect/auth")) {
      const redirectUri = requestUrl.searchParams.get("redirect_uri");
      const state = requestUrl.searchParams.get("state");
      const nonce = requestUrl.searchParams.get("nonce");
      const challenge = requestUrl.searchParams.get("code_challenge");
      assert.equal(requestUrl.searchParams.get("code_challenge_method"), "S256");
      assert.ok(redirectUri && state && nonce && challenge);
      keycloakState = { nonce, challenge };
      const callback = new URL(redirectUri);
      callback.searchParams.set("code", "test-authorization-code");
      callback.searchParams.set("state", state);
      response.writeHead(302, { location: callback.toString() });
      response.end();
      return;
    }

    if (requestUrl.pathname.endsWith("/protocol/openid-connect/token")) {
      const form = await readForm(request);
      assert.equal(form.get("client_id"), "sovara-backend-local");
      assert.equal(form.get("client_secret"), "test-client-secret");
      assert.equal(form.get("code"), "test-authorization-code");
      codeVerifier = form.get("code_verifier");
      assert.ok(codeVerifier);
      const derivedChallenge = createHash("sha256").update(codeVerifier).digest("base64url");
      assert.equal(derivedChallenge, keycloakState.challenge);
      json(response, 200, {
        access_token: "test-access-token",
        token_type: "Bearer",
        expires_in: 300,
        id_token: await createIdToken(keycloakState.nonce),
      });
      return;
    }

    if (requestUrl.pathname.endsWith("/protocol/openid-connect/userinfo")) {
      assert.equal(request.headers.authorization, "Bearer test-access-token");
      json(response, 200, {
        sub: "keycloak-user-001",
        email: "rahul@example.test",
        preferred_username: "rahul",
        name: "Rahul Sharma",
      });
      return;
    }

    if (requestUrl.pathname.endsWith("/protocol/openid-connect/logout")) {
      response.writeHead(302, { location: frontendOrigin + "/" });
      response.end();
      return;
    }

    json(response, 404, { error: "not_found" });
  });
  keycloakOrigin = await startServer(keycloakServer);

  const appPortServer = createServer();
  applicationOrigin = await startServer(appPortServer);
  appPortServer.close();
  await once(appPortServer, "close");

  const applicationPort = new URL(applicationOrigin).port;
  applicationProcess = spawn(process.execPath, [join(serverRoot, "dist", "index.js")], {
    cwd: serverRoot,
    env: {
      ...process.env,
      SERVER_PORT: applicationPort,
      FRONTEND_ORIGIN: frontendOrigin,
      KEYCLOAK_ISSUER: `${keycloakOrigin}/realms/sovara-local`,
      KEYCLOAK_CLIENT_ID: "sovara-backend-local",
      KEYCLOAK_CLIENT_SECRET: "test-client-secret",
      KEYCLOAK_REDIRECT_URI: `${applicationOrigin}/api/auth/callback/keycloak`,
      KEYCLOAK_POST_LOGOUT_REDIRECT_URI: `${frontendOrigin}/`,
      SESSION_COOKIE_SECURE: "true",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  applicationProcess.stderr.setEncoding("utf8");
  applicationProcess.stderr.on("data", (chunk) => {
    process.stderr.write(`[app] ${chunk}`);
  });
  await waitForHealth(applicationOrigin);
});

after(async () => {
  await stopProcess(applicationProcess);
  keycloakServer?.close();
});

describe("Keycloak authentication flow", () => {
  test("rejects an unauthenticated session", async () => {
    const response = await fetch(`${applicationOrigin}/api/auth/session`);
    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), { authenticated: false });
  });

  test("rejects a callback with an unknown state", async () => {
    const response = await fetch(
      `${applicationOrigin}/api/auth/callback/keycloak?code=bad&state=unknown`,
    );
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: "invalid_login_callback" });
  });

  test("performs login, verifies the ID token, and creates a session", async () => {
    const login = await fetch(
      `${applicationOrigin}/api/auth/login?returnTo=/workbench`,
      { redirect: "manual" },
    );
    assert.equal(login.status, 302);
    const keycloakLoginUrl = login.headers.get("location");
    assert.ok(keycloakLoginUrl);
    assert.match(keycloakLoginUrl, /code_challenge_method=S256/);

    const keycloakLogin = await fetch(keycloakLoginUrl, { redirect: "manual" });
    assert.equal(keycloakLogin.status, 302);
    const callbackUrl = keycloakLogin.headers.get("location");
    assert.ok(callbackUrl);

    const callback = await fetch(callbackUrl, { redirect: "manual" });
    assert.equal(callback.status, 302);
    assert.equal(callback.headers.get("location"), `${frontendOrigin}/workbench`);
    const cookie = cookiePair(callback);

    const session = await fetch(`${applicationOrigin}/api/auth/session`, {
      headers: { cookie },
    });
    assert.equal(session.status, 200);
    const body = await session.json();
    assert.equal(body.authenticated, true);
    assert.equal(body.user.keycloakSubject, "keycloak-user-001");
    assert.equal(body.user.email, "rahul@example.test");
    assert.ok(body.csrfToken);

    const csrfFailure = await fetch(`${applicationOrigin}/api/auth/logout`, {
      method: "POST",
      headers: { cookie },
    });
    assert.equal(csrfFailure.status, 403);

    const logout = await fetch(`${applicationOrigin}/api/auth/logout`, {
      method: "POST",
      headers: { cookie, "x-csrf-token": body.csrfToken },
    });
    assert.equal(logout.status, 200);
    const logoutBody = await logout.json();
    assert.equal(logoutBody.loggedOut, true);
    assert.match(logoutBody.logoutUrl, /openid-connect\/logout/);

    const afterLogout = await fetch(`${applicationOrigin}/api/auth/session`, {
      headers: { cookie },
    });
    assert.equal(afterLogout.status, 401);
  });
});
