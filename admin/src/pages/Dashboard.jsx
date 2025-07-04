import React from "react";
import {
  FaShoppingCart,
  FaTags,
  FaBoxOpen,
  FaThLarge,
  FaUsers,
  FaStar,
  FaTruck,
  FaChartLine,
  FaMoneyBillAlt,
  FaStore,
  FaUserTie,
  FaListAlt,
  FaClipboardList,
  FaBell,
  FaWallet,
  FaGlobe,
  FaWarehouse,
  FaGift,
  FaRegCalendarAlt,
  FaRegChartBar,
} from "react-icons/fa";
import DashboardCard from "../components/Card/DashboardCard";

const Dashboard = () => {
  const stats = [
    { label: "Products", value: 120, icon: <FaBoxOpen size={20} />, color: "text-primary", to: "/products" },
    { label: "Orders", value: 58, icon: <FaShoppingCart size={20} />, color: "text-success", to: "#" },
    { label: "Categories", value: 10, icon: <FaThLarge size={20} />, color: "text-warning", to: "#" },
    { label: "Brands", value: 7, icon: <FaTags size={20} />, color: "text-danger", to: "#" },
    { label: "Customers", value: 350, icon: <FaUsers size={20} />, color: "text-primary", to: "#" },
    { label: "Reviews", value: 45, icon: <FaStar size={20} />, color: "text-warning", to: "#" },
    { label: "Shipped", value: 112, icon: <FaTruck size={20} />, color: "text-success", to: "#" },
    { label: "Analytics", value: "View", icon: <FaChartLine size={20} />, color: "text-info", to: "#" },
    { label: "Revenue", value: "$5,400", icon: <FaMoneyBillAlt size={20} />, color: "text-success", to: "#" },
    { label: "Stores", value: 4, icon: <FaStore size={20} />, color: "text-danger", to: "#" },
    { label: "Admins", value: 3, icon: <FaUserTie size={20} />, color: "text-primary", to: "#" },
    { label: "Subcategories", value: 15, icon: <FaListAlt size={20} />, color: "text-warning", to: "#" },
    { label: "Tasks", value: 27, icon: <FaClipboardList size={20} />, color: "text-success", to: "#" },
    { label: "Notifications", value: 9, icon: <FaBell size={20} />, color: "text-danger", to: "#" },
    { label: "Wallet", value: "$920", icon: <FaWallet size={20} />, color: "text-success", to: "#" },
    { label: "Website Visitors", value: "1.2K", icon: <FaGlobe size={20} />, color: "text-info", to: "#" },
    { label: "Inventory", value: 88, icon: <FaWarehouse size={20} />, color: "text-primary", to: "#" },
    { label: "Coupons", value: 12, icon: <FaGift size={20} />, color: "text-danger", to: "#" },
    { label: "Events", value: 5, icon: <FaRegCalendarAlt size={20} />, color: "text-warning", to: "#" },
    { label: "Reports", value: "Generate", icon: <FaRegChartBar size={20} />, color: "text-primary", to: "#" },
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
