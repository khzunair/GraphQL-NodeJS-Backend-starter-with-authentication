import { createRole } from "./createRole";
import { updateRole } from "./updateRole";
import { deleteRole } from "./deleteRole";
import { toggleRoleStatus } from "./toggleRoleStatus";

export const roleMutations = {
  createRole,
  updateRole,
  deleteRole,
  toggleRoleStatus
};