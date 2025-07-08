import mongoose from "mongoose";

const PermissionSchema = new mongoose.Schema(
  {
    access: {
      type: Boolean,
      default: false,
    },
    create: {
      type: Boolean,
      default: false,
    },
    update: {
      type: Boolean,
      default: false,
    },
    delete: {
      type: Boolean,
      default: false,
    },
    approve: {
      type: Boolean,
      default: false,
    },
    export: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  },
);

const roleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    enum: ['Flat Owner', 'Tenant', 'Security Guard', 'Maintenance Staff', 'Admin'],
    required: [true, "Role name is required"],
  },
  permissions: {
    user: {
      type: PermissionSchema,
      default: () => ({}),
    },
    vehicle: {
      type: PermissionSchema,
      default: () => ({}),
    },
    visitor: {
      type: PermissionSchema,
      default: () => ({}),
    },
    maid: {
      type: PermissionSchema,
      default: () => ({}),
    },
    tenant: {
      type: PermissionSchema,
      default: () => ({}),
    },
    flatOwner: {
      type: PermissionSchema,
      default: () => ({}),
    },
    securityGuard: {
      type: PermissionSchema,
      default: () => ({}),
    },
    maintenanceStaff: {
      type: PermissionSchema,
      default: () => ({}),
    },
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Role = mongoose.model("Role", roleSchema);

export default Role;