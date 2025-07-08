import {
  FaUserFriends,
  FaUserAlt,
  FaUserShield,
  FaUserCheck,
  FaBroom,
  FaCar,
} from "react-icons/fa";
import DashboardCard from "../components/Card/DashboardCard.jsx";

const Dashboard = () => {
  const stats = [
    {
      label: "Flat Owners",
      value: 40,
      icon: <FaUserFriends size={20} />,
      color: "text-primary",
      to: "/flat-owners",
    },
    {
      label: "Tenants",
      value: 65,
      icon: <FaUserAlt size={20} />,
      color: "text-success",
      to: "/tenants",
    },
    {
      label: "Security Guards",
      value: 6,
      icon: <FaUserShield size={20} />,
      color: "text-warning",
      to: "/security-guards",
    },
    {
      label: "Visitors",
      value: 150,
      icon: <FaUserCheck size={20} />,
      color: "text-info",
      to: "/visitors",
    },
    {
      label: "Maids",
      value: 25,
      icon: <FaBroom size={20} />,
      color: "text-danger",
      to: "/maids",
    },
    {
      label: "Vehicles",
      value: 70,
      icon: <FaCar size={20} />,
      color: "text-secondary",
      to: "/vehicles",
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
