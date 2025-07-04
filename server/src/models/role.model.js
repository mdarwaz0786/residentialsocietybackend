import mongoose from "mongoose";

const UserPermissionSchema = new mongoose.Schema(
  {
    access: {
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
  },
  {
    _id: false,
  },
);

const RolePermissionSchema = new mongoose.Schema(
  {
    access: {
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
  },
  {
    _id: false,
  },
);

const VisitorPermissionSchema = new mongoose.Schema(
  {
    access: {
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
  },
  {
    _id: false,
  },
);

const MaidPermissionSchema = new mongoose.Schema(
  {
    access: {
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
  },
  {
    _id: false,
  },
);

const VehiclePermissionSchema = new mongoose.Schema(
  {
    access: {
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
  },
  {
    _id: false,
  },
);

const TenantPermissionSchema = new mongoose.Schema(
  {
    access: {
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
  },
  {
    _id: false,
  },
);

const roleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: [true, "role name is required"],
    trim: true,
    unique: true,
  },
  permissions: {
    user: {
      type: UserPermissionSchema,
      default: () => ({}),
    },
    role: {
      type: RolePermissionSchema,
      default: () => ({}),
    },
    vehicle: {
      type: VehiclePermissionSchema,
      default: () => ({}),
    },
    visitor: {
      type: VisitorPermissionSchema,
      default: () => ({}),
    },
    maid: {
      type: MaidPermissionSchema,
      default: () => ({}),
    },
    tenant: {
      type: TenantPermissionSchema,
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