import { databaseConfigured } from "../database/pool.js";
import { membershipRepository } from "../database/memberships.js";
import { userRepository } from "../database/users.js";
import { assignmentRepository } from "../database/assignments.js";
import { isOrganizationRole, type OrganizationRole } from "../organization/roles.js";
import { permissionsForRole, type Permission } from "../organization/permissions.js";
import type { ApplicationSession } from "./session.js";

export type AuthenticationData = {
  sessionId: string;
  keycloakSubject: string;
  email: string | null;
  username: string | null;
  displayName: string | null;
};

export type AuthorizationData = {
  userId: string | null;
  organizationId: string | null;
  role: OrganizationRole | null;
  permissions: readonly Permission[];
  divisionId: string | null;
  departmentId: string | null;
  teamId: string | null;
  managerUserId: string | null;
};

export type AuthContext = {
  authentication: AuthenticationData;
  authorization: AuthorizationData;
};

function authenticationFromSession(session: ApplicationSession): AuthenticationData {
  return {
    sessionId: session.sessionId,
    keycloakSubject: session.subject,
    email: session.email,
    username: session.username,
    displayName: session.displayName,
  };
}

function fallbackAuthorization(session: ApplicationSession): AuthorizationData {
  const role = session.role && isOrganizationRole(session.role) ? session.role : null;
  return {
    userId: session.applicationUserId,
    organizationId: session.organizationId,
    role,
    permissions: role ? permissionsForRole(role) : [],
    divisionId: null,
    departmentId: null,
    teamId: null,
    managerUserId: null,
  };
}

export async function resolveAuthContext(session: ApplicationSession): Promise<AuthContext> {
  const authentication = authenticationFromSession(session);
  if (!databaseConfigured) {
    return { authentication, authorization: fallbackAuthorization(session) };
  }

  const user = await userRepository().findByKeycloakSubject(session.subject);
  if (!user || user.status !== "ACTIVE") {
    return {
      authentication,
      authorization: {
        userId: user?.id ?? null,
        organizationId: null,
        role: null,
        permissions: [],
        divisionId: null,
        departmentId: null,
        teamId: null,
        managerUserId: null,
      },
    };
  }

  const membership = (await membershipRepository().listForUser(user.id))
    .find((candidate) => candidate.status === "ACTIVE");
  const role = membership && isOrganizationRole(membership.role) ? membership.role : null;
  const assignment = membership
    ? await assignmentRepository().findPrimary(user.id, membership.organizationId)
    : null;

  return {
    authentication,
    authorization: {
      userId: user.id,
      organizationId: membership?.organizationId ?? null,
      role,
      permissions: role ? permissionsForRole(role) : [],
      divisionId: assignment?.divisionId ?? null,
      departmentId: assignment?.departmentId ?? null,
      teamId: assignment?.teamId ?? null,
      managerUserId: assignment?.managerUserId ?? null,
    },
  };
}
