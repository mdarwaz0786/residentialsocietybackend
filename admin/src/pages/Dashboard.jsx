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
} from "react-icons/fa";
import DashboardCard from "../components/Card/DashboardCard";

const Dashboard = () => {
  const stats = [
    {
      label: "Flats",
      value: 80,
      icon: <FaHome size={20} />,
      color: "text-primary",
      to: "/flat",
    },
    {
      label: "Flat Owners",
      value: 40,
      icon: <FaUserFriends size={20} />,
      color: "text-primary",
      to: "/flat-owner",
    },
    {
      label: "Tenants",
      value: 65,
      icon: <FaUserAlt size={20} />,
      color: "text-success",
      to: "/tenant",
    },
    {
      label: "Security Guards",
      value: 6,
      icon: <FaUserShield size={20} />,
      color: "text-warning",
      to: "/security-guard",
    },
    {
      label: "Maintenance Staff",
      value: 12,
      icon: <FaTools size={20} />,
      color: "text-dark",
      to: "/maintenance-staff",
    },
    {
      label: "Visitors",
      value: 150,
      icon: <FaUserCheck size={20} />,
      color: "text-info",
      to: "/visitor",
    },
    {
      label: "Maids",
      value: 25,
      icon: <FaBroom size={20} />,
      color: "text-danger",
      to: "/maid",
    },
    {
      label: "Vehicles",
      value: 70,
      icon: <FaCar size={20} />,
      color: "text-secondary",
      to: "/vehicle",
    },
    {
      label: "Roles",
      value: 5,
      icon: <FaUserTag size={20} />,
      color: "text-muted",
      to: "/role",
    },
    {
      label: "Settings",
      value: 1,
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
