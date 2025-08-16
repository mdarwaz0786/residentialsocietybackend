import { useState, useRef, useEffect } from "react";
import { MdMenu } from "react-icons/md";
import styles from "./Navbar.module.css";
// import avatar from "../../assets/avatar.png";
import logo from "../../assets/logoCopy.png";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import { toast } from "react-toastify";

const Navbar = ({ handleToggleSidebar }) => {
  const { logOutUser, user } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      };
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logOutUser();
    toast.success("Logout successful");
  };
  console.log(user)
  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <div className={styles.logoSection}>
          <Link to="/"><img src={logo} alt="Logo" className={styles.logo} /></Link>
        </div>
        <div className={styles.menuSection} onClick={handleToggleSidebar}>
          <MdMenu />
        </div>
      </div>

      <div className={styles.navRight}>
        <div className={styles.profile} ref={dropdownRef}>
          <img src={user?.profilePhoto} alt="avatar" className={styles.avatar} onClick={toggleDropdown} />
          <div className="dropdown" onClick={toggleDropdown}>
            <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Admin</button>
          </div>
          {dropdownOpen && (
            <ul className={styles.dropdownMenu}>
              <Link to="/profile" className="text-decoration-none"><li className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>My Profile</li></Link>
              <Link to="#" className="text-decoration-none"><li className={styles.dropdownItem} onClick={() => { setDropdownOpen(false); handleLogout() }}>Logout</li></Link>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;