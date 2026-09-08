import type { Request, Response } from "express";
import { authConfig } from "./config.js";
import { randomToken, type IdentityClaims } from "./oidc.js";

export const SESSION_COOKIE = "__Host-sovara_session";

export type ApplicationSession = IdentityClaims & {
  sessionId: string;
  csrfToken: string;
  createdAt: number;
  expiresAt: number;
};

const sessions = new Map<string, ApplicationSession>();

function cookieAttributes(): string {
  return [
    `${SESSION_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    ...(authConfig.sessionCookieSecure ? ["Secure"] : []),
  ].join("; ");
}

export function createSession(identity: IdentityClaims): ApplicationSession {
  const now = Date.now();
  const session: ApplicationSession = {
    ...identity,
    sessionId: randomToken(32),
    csrfToken: randomToken(32),
    createdAt: now,
    expiresAt: now + authConfig.sessionTtlMs,
  };
  sessions.set(session.sessionId, session);
  return session;
}

export function getSession(request: Request): ApplicationSession | null {
  const raw = request.headers.cookie?.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`))?.[1];
  if (!raw) return null;
  const session = sessions.get(decodeURIComponent(raw));
  if (!session || session.expiresAt <= Date.now()) {
    if (session) sessions.delete(session.sessionId);
    return null;
  }
  return session;
}

export function setSessionCookie(response: Response, sessionId: string): void {
  response.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=${encodeURIComponent(sessionId)}; Path=/; HttpOnly; SameSite=Lax${
      authConfig.sessionCookieSecure ? "; Secure" : ""
    }`,
  );
}

export function clearSessionCookie(response: Response): void {
  response.setHeader("Set-Cookie", `${cookieAttributes()} Max-Age=0`);
}

export function deleteSession(session: ApplicationSession): void {
  sessions.delete(session.sessionId);
}

export function hasValidCsrfToken(session: ApplicationSession, value: unknown): boolean {
  return typeof value === "string" && value.length > 0 && value === session.csrfToken;
}

export function cleanupExpiredSessions(): void {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (session.expiresAt <= now) sessions.delete(id);
  }
}

setInterval(cleanupExpiredSessions, 60_000).unref();
