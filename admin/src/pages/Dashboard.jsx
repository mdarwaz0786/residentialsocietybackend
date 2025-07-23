/* eslint-disable react-hooks/exhaustive-deps */
import {
  FaUserFriends,
  FaUserAlt,
  FaUserShield,
  FaUserCheck,
  FaBroom,
  FaCar,
  FaTools,
  FaCog,
  FaUserTag,
  FaHome,
  FaExclamationCircle,
  FaMoneyBillWave,
} from "react-icons/fa";
import DashboardCard from "../components/Card/DashboardCard";
import { useAuth } from "../context/auth.context";
import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const { validToken } = useAuth();
  const [stat, setStat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/v1/dashboard/stats', {
          headers: {
            Authorization: validToken,
          },
        });
        setStat(res?.data?.data);
      } catch (err) {
        console.error('Error fetching stats:', err.message);
      } finally {
        setLoading(false);
      };
    };

    fetchStats();
  }, []);

  if (loading) return <p>Loading...</p>;

  const stats = [
    {
      label: "Flats",
      value: stat?.totalFlats || 0,
      icon: <FaHome size={20} />,
      color: "text-primary",
      to: "/flat",
    },
    {
      label: "Flat Owners",
      value: stat?.totalFlatOwners || 0,
      icon: <FaUserFriends size={20} />,
      color: "text-primary",
      to: "/flat-owner",
    },
    {
      label: "Tenants",
      value: stat?.totalTenants || 0,
      icon: <FaUserAlt size={20} />,
      color: "text-success",
      to: "/tenant",
    },
    {
      label: "Security Guards",
      value: stat?.totalSecurityGuards || 0,
      icon: <FaUserShield size={20} />,
      color: "text-warning",
      to: "/security-guard",
    },
    {
      label: "Maintenance Staff",
      value: stat?.totalMaintenanceStaff || 0,
      icon: <FaTools size={20} />,
      color: "text-dark",
      to: "/maintenance-staff",
    },
    {
      label: "Visitors",
      value: stat.totalVisitors || 0,
      icon: <FaUserCheck size={20} />,
      color: "text-info",
      to: "/visitor",
    },
    {
      label: "Vehicles",
      value: stat?.totalVehicles || 0,
      icon: <FaCar size={20} />,
      color: "text-secondary",
      to: "/vehicle",
    },
    {
      label: "Complaints",
      value: stat?.totalComplaints || 0,
      icon: <FaExclamationCircle size={20} />,
      color: "text-danger",
      to: "/complaint",
    },
    {
      label: "Maids",
      value: stat?.totalMaids || 0,
      icon: <FaBroom size={20} />,
      color: "text-danger",
      to: "/maid",
    },
    {
      label: "Payments",
      value: stat?.totalPayments || 0,
      icon: <FaMoneyBillWave size={20} />,
      color: "text-primary",
      to: "/payment",
    },
    {
      label: "Roles",
      value: stat?.totalRoles || 0,
      icon: <FaUserTag size={20} />,
      color: "text-muted",
      to: "/role",
    },
    {
      label: "Settings",
      value: stat?.totalSettings || 0,
      icon: <FaCog size={20} />,
      color: "text-black-50",
      to: "/setting",
    },
  ];

  return (
    <div className="container">
      <h5 className="mb-4">Dashboard</h5>
      <div className="row g-4">
        {stats.map((stat, idx) => (
          <div className="col-sm-6 col-md-4 col-lg-3" key={idx}>
            <DashboardCard {...stat} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
