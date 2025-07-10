/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect } from "react";
import {
  MdDashboard,
  MdSettings,
  MdLogout,
  MdKeyboardArrowDown,
  MdClose,
  MdStorefront,
} from "react-icons/md";
import {
  FaUserFriends,
  FaUserAlt,
  FaUserShield,
  FaTools,
  FaCar,
  FaBroom,
  FaUserTag,
  FaUsers,
} from "react-icons/fa";
import logo from "../../assets/logo.png";
import styles from "./Sidebar.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import { toast } from "react-toastify";

const Sidebar = ({ mobileOpen, setMobileOpen, handleToggleSidebar }) => {
  const { logOutUser } = useAuth();
  const [openDropdowns, setOpenDropdowns] = useState([]);
  const [activeLink, setActiveLink] = useState(null);
  const dropdownRefs = [useRef(null), useRef(null)];
  const sidebarRef = useRef(null);

  const handleDropdownClick = (e, index) => {
    e.preventDefault();
    setOpenDropdowns((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
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
        ref.current.style.maxHeight = openDropdowns.includes(idx)
          ? `${ref.current.scrollHeight}px`
          : "0px";
      };
    });
  }, [openDropdowns]);

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
        <Link to="/" className={styles.headerLogo} onClick={handleToggleSidebar}><img src={logo} alt="Logo" /></Link>
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
              <Link to="#" className={`${styles.navLink} ${activeLink === "Flat Owner" ? styles.active : ""}`} onClick={() => handleLinkClick("Falt Owner")}>
                <FaUserFriends />
                <span className={styles.navLabel}>Flat Owner</span>
              </Link>
            </li>

            <li className={styles.navItem}>
              <Link to="#" className={`${styles.navLink} ${activeLink === "Tenant" ? styles.active : ""}`} onClick={() => handleLinkClick("Tenant")}>
                <FaUserAlt />
                <span className={styles.navLabel}>Tenant</span>
              </Link>
            </li>

            <li className={styles.navItem}>
              <Link to="#" className={`${styles.navLink} ${activeLink === "Security Guard" ? styles.active : ""}`} onClick={() => handleLinkClick("Security Guard")}>
                <FaUserShield />
                <span className={styles.navLabel}>Security Guard</span>
              </Link>
            </li>

            <li className={styles.navItem}>
              <Link to="#" className={`${styles.navLink} ${activeLink === "Maintenance Staff" ? styles.active : ""}`} onClick={() => handleLinkClick("Maintenance Staff")}>
                <FaTools />
                <span className={styles.navLabel}>Maintenance Staff</span>
              </Link>
            </li>

            <li className={`${styles.navItem} ${styles.dropdownContainer} ${openDropdowns.includes(0) ? styles.open : ""}`}>
              <Link to="#" className={`${styles.navLink} ${styles.dropdownToggle}`} onClick={(e) => handleDropdownClick(e, 0)}>
                <MdStorefront />
                <span className={styles.navLabel}>Visitors</span>
                <MdKeyboardArrowDown className={styles.dropdownIcon} />
              </Link>
              <ul className={styles.dropdownMenu} ref={dropdownRefs[0]}>
                {
                  [{ label: "All Visitors", route: "/all-visitor" }, { label: "Today's Visitors", route: "/today-visitor" }, { label: "Upcoming Visitors", route: "/upcoming-visitor" }].map((item) => (
                    <li className={styles.navItem} key={item.label}>
                      <Link to={item.route} className={`${styles.navLink} ${styles.dropdownLink} ${activeLink === item.label ? styles.active : ""}`} onClick={() => handleLinkClick(item.label)}>{item.label}</Link>
                    </li>
                  ))
                }
              </ul>
            </li>

            <li className={styles.navItem}>
              <Link to="#" className={`${styles.navLink} ${activeLink === "Vehicle" ? styles.active : ""}`} onClick={() => handleLinkClick("Vehicle")}>
                <FaCar />
                <span className={styles.navLabel}>Vehicle</span>
              </Link>
            </li>

            <li className={styles.navItem}>
              <Link to="#" className={`${styles.navLink} ${activeLink === "Maid" ? styles.active : ""}`} onClick={() => handleLinkClick("Maid")}>
                <FaBroom />
                <span className={styles.navLabel}>Maid</span>
              </Link>
            </li>

            <li className={styles.navItem}>
              <Link to="#" className={`${styles.navLink} ${activeLink === "Role" ? styles.active : ""}`} onClick={() => handleLinkClick("Role")}>
                <FaUserTag />
                <span className={styles.navLabel}>Role</span>
              </Link>
            </li>

            <li className={styles.navItem}>
              <Link to="/user" className={`${styles.navLink} ${activeLink === "User" ? styles.active : ""}`} onClick={() => handleLinkClick("User")}>
                <FaUsers />
                <span className={styles.navLabel}>User</span>
              </Link>
            </li>

            <li className={styles.navItem}>
              <Link to="#" className={`${styles.navLink} ${activeLink === "Settings" ? styles.active : ""}`} onClick={() => handleLinkClick("Settings")}>
                <MdSettings />
                <span className={styles.navLabel}>Settings</span>
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
