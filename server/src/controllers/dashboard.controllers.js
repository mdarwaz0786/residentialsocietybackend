import Flat from "../models/flat.model.js";
import FlatOwner from "../models/flatOwner.model.js";
import Tenant from "../models/tenant.model.js";
import Vehicle from "../models/vehicle.model.js";
import Complaint from "../models/complaint.model.js";
import Visitor from "../models/visitor.model.js";
import Maid from "../models/maid.model.js";
import Role from "../models/role.model.js";
import SecurityGuard from "../models/securityGuard.model.js";
import MaintenanceStaff from "../models/maintenanceStaff.model.js";
import TenantRegistrationPayment from "../models/tenantRegistrationPayment.model.js";
import MaidRegistrationPayment from "../models/maidRegistrationPayment.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalFlats,
      totalFlatOwners,
      totalTenants,
      totalVehicles,
      totalComplaints,
      totalVisitors,
      totalMaids,
      totalRoles,
      totalSecurityGuards,
      totalMaintenanceStaff,
      totalTenantRegistrationPayments,
      totalMaidRegistrationPayments,
    ] = await Promise.all([
      Flat.countDocuments(),
      FlatOwner.countDocuments(),
      Tenant.countDocuments(),
      Vehicle.countDocuments(),
      Complaint.countDocuments(),
      Visitor.countDocuments(),
      Maid.countDocuments(),
      Role.countDocuments(),
      SecurityGuard.countDocuments(),
      MaintenanceStaff.countDocuments(),
      TenantRegistrationPayment.countDocuments(),
      MaidRegistrationPayment.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalFlats,
        totalFlatOwners,
        totalTenants,
        totalVehicles,
        totalComplaints,
        totalVisitors,
        totalMaids,
        totalRoles,
        totalSecurityGuards,
        totalMaintenanceStaff,
        totalTenantRegistrationPayments,
        totalMaidRegistrationPayments,
        totalSettings: 1,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  };
};
