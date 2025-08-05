/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect } from "react";
import {
  MdDashboard,
  MdLogout,
  MdClose,
  MdStorefront,
  MdHome,
  MdReportProblem,
  MdPayment,
  MdKeyboardArrowDown,
} from "react-icons/md";
import {
  FaUserFriends,
  FaUserAlt,
  FaUserShield,
  FaTools,
  FaCar,
  FaBroom,
  FaUserTag,
} from "react-icons/fa";
import logo from "../../assets/logo.png";
import styles from "./Sidebar.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import { toast } from "react-toastify";

const Sidebar = ({ mobileOpen, setMobileOpen, handleToggleSidebar }) => {
  const { logOutUser } = useAuth();
  const [activeLink, setActiveLink] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const sidebarRef = useRef(null);
  const dropdownRefs = [useRef(null), useRef(null)];

  const handleDropdownClick = (e, index) => {
    e.preventDefault();
    setOpenDropdown((prev) => (prev === index ? null : index));
  };

  const handleLinkClick = (label) => {
    setActiveLink(label);
    if (window.innerWidth <= 768) {
      setMobileOpen(false);
    };
  };

  useEffect(() => {
    dropdownRefs.forEach((ref, idx) => {
      if (ref.current) {
        ref.current.style.maxHeight = openDropdown === idx ? `${ref.current.scrollHeight}px` : "0px";
      };
    });
  }, [openDropdown]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        window.innerWidth <= 768 &&
        mobileOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setMobileOpen(false);
      };
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [mobileOpen, setMobileOpen]);

  const handleLogout = () => {
    logOutUser();
    toast.success("Logout successful");
  };

  return (
    <aside ref={sidebarRef} className={`${styles.sidebar} ${mobileOpen ? styles.mobileOpen : ""}`}>
      <header className={styles.sidebarHeader}>
        <Link to="/" className={styles.headerLogo} onClick={handleToggleSidebar}><img src={logo} alt="logo" /></Link>
        <button className={styles.mobileCloseBtn} onClick={handleToggleSidebar}><MdClose /></button>
      </header>

      <div className={styles.sidebarScrollArea}>
        <nav className={styles.sidebarNav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link to="/" className={`${styles.navLink} ${activeLink === "Dashboard" ? styles.active : ""}`} onClick={() => handleLinkClick("Dashboard")}>
                <MdDashboard />
                <span className={styles.navLabel}>Dashboard</span>
              </Link>
            </li>

            <li className={styles.navItem}>
              <Link to="/flat" className={`${styles.navLink} ${activeLink === "Flat" ? styles.active : ""}`} onClick={() => handleLinkClick("Flat")}>
                <MdHome />
                <span className={styles.navLabel}>Flat</span>
              </Link>
            </li>

            <li className={styles.navItem}>
              <Link to="/flat-owner" className={`${styles.navLink} ${activeLink === "Flat Owner" ? styles.active : ""}`} onClick={() => handleLinkClick("Falt Owner")}>
                <FaUserFriends />
                <span className={styles.navLabel}>Flat Owner</span>
              </Link>
            </li>

            <li className={styles.navItem}>
              <Link to="/tenant" className={`${styles.navLink} ${activeLink === "Tenant" ? styles.active : ""}`} onClick={() => handleLinkClick("Tenant")}>
                <FaUserAlt />
                <span className={styles.navLabel}>Tenant</span>
              </Link>
            </li>

            <li className={styles.navItem}>
              <Link to="/security-guard" className={`${styles.navLink} ${activeLink === "Security Guard" ? styles.active : ""}`} onClick={() => handleLinkClick("Security Guard")}>
                <FaUserShield />
                <span className={styles.navLabel}>Security Guard</span>
              </Link>
            </li>

            <li className={styles.navItem}>
              <Link to="/maintenance-staff" className={`${styles.navLink} ${activeLink === "Maintenance Staff" ? styles.active : ""}`} onClick={() => handleLinkClick("Maintenance Staff")}>
                <FaTools />
                <span className={styles.navLabel}>Maintenance Staff</span>
              </Link>
            </li>

            <li className={styles.navItem}>
              <Link to="/visitor" className={`${styles.navLink} ${activeLink === "Visitor" ? styles.active : ""}`} onClick={() => handleLinkClick("Visitor")}>
                <MdStorefront />
                <span className={styles.navLabel}>Visitor</span>
              </Link>
            </li>

            <li className={styles.navItem}>
              <Link to="/vehicle" className={`${styles.navLink} ${activeLink === "Vehicle" ? styles.active : ""}`} onClick={() => handleLinkClick("Vehicle")}>
                <FaCar />
                <span className={styles.navLabel}>Vehicle</span>
              </Link>
            </li>

            <li className={styles.navItem}>
              <Link
                to="/complaint"
                className={`${styles.navLink} ${activeLink === "Complaint" ? styles.active : ""}`}
                onClick={() => handleLinkClick("Complaint")}
              >
                <MdReportProblem />
                <span className={styles.navLabel}>Complaint</span>
              </Link>
            </li>

            <li className={styles.navItem}>
              <Link to="/maid" className={`${styles.navLink} ${activeLink === "Maid" ? styles.active : ""}`} onClick={() => handleLinkClick("Maid")}>
                <FaBroom />
                <span className={styles.navLabel}>Maid</span>
              </Link>
            </li>

            <li className={`${styles.navItem} ${styles.dropdownContainer} ${openDropdown === 0 ? styles.open : ""}`}>
              <Link to="#" className={`${styles.navLink} ${styles.dropdownToggle}`} onClick={(e) => handleDropdownClick(e, 0)}>
                <MdPayment />
                <span className={styles.navLabel}>Payments</span>
                <MdKeyboardArrowDown className={styles.dropdownIcon} />
              </Link>
              <ul className={styles.dropdownMenu} ref={dropdownRefs[0]}>
                {[
                  { label: "Tenant Registration", route: "/tenant-registration-payment" },
                  { label: "Maid Registration", route: "/maid-registration-payment" },
                ].map((item) => (
                  <li className={styles.navItem} key={item.label}>
                    <Link
                      to={item.route}
                      className={`${styles.navLink} ${styles.dropdownLink} ${activeLink === item.label ? styles.active : ""}`}
                      onClick={() => handleLinkClick(item.label)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li className={styles.navItem}>
              <Link to="/role" className={`${styles.navLink} ${activeLink === "Role" ? styles.active : ""}`} onClick={() => handleLinkClick("Role")}>
                <FaUserTag />
                <span className={styles.navLabel}>Role & Permission</span>
              </Link>
            </li>

            <li className={styles.navItem}>
              <Link to="#" className={`${styles.navLink} ${activeLink === "Logout" ? styles.active : ""}`} onClick={handleLogout}>
                <MdLogout />
                <span className={styles.navLabel}>Logout</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
