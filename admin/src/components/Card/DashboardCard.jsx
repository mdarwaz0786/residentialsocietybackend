import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DashboardCard.module.css";

const DashboardCard = ({ label, value, icon, color = "text-primary", to }) => {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(to)} className={`card shadow-sm border-0 p-3 d-flex flex-row align-items-center ${styles.card}`}>
      <div className={`me-3 ${styles.iconBox} ${color}`}>{icon}</div>
      <div className="flex-grow-1">
        <div className={styles.label}>{label}</div>
        <div className={styles.value}>{value}</div>
      </div>
    </div>
  );
};

export default DashboardCard;
