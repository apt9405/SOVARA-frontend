import assert from "node:assert/strict";
import test from "node:test";
import { resolveAuthContext } from "../../dist/auth/context.js";
import { createSession } from "../../dist/auth/session.js";

test("auth context keeps Keycloak identity separate from authorization data", async () => {
  const session = createSession({
    subject: "keycloak-user-001",
    email: "person@example.test",
    username: "person",
    displayName: "Person Example",
  });
  const context = await resolveAuthContext(session);

  assert.equal(context.authentication.keycloakSubject, "keycloak-user-001");
  assert.equal(context.authentication.email, "person@example.test");
  assert.equal(context.authorization.userId, null);
  assert.equal(context.authorization.organizationId, null);
  assert.equal(context.authorization.role, null);
  assert.deepEqual(context.authorization.permissions, []);
  assert.equal("role" in context.authentication, false);
  assert.equal("organizationId" in context.authentication, false);
});
