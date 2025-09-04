import { UserPermission } from "@/convex/schema";
export const hasAdmin = (role: string) => {
  return role === "ADMIN" || role === "SUPERADMIN";
};

export const hasCreatePostPermissions = (
  permissions: typeof UserPermission
) => {
  return permissions.includes("CREATE_POST");
};

export const hasCreateEventPermissions = (
  permissions: typeof UserPermission
) => {
  return permissions.includes("CREATE_EVENT") || permissions.includes("ALL");
};

export const hasCreateGroupPermissions = (
  permissions: typeof UserPermission
) => {
  return permissions.includes("CREATE_GROUP") || permissions.includes("ALL");
};

export const hasCreatePostInGroupPermissions = (
  permissions: typeof UserPermission
) => {
  return (
    permissions.includes("CREATE_POST_IN_GROUP") || permissions.includes("ALL")
  );
};
