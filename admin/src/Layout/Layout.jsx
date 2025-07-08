import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import styles from './Layout.module.css';

const Layout = ({ handleToggleSidebar, mobileOpen, setMobileOpen }) => {
  return (
    <div className={`d-flex flex-column ${styles.layoutContainer}`}>
      <div className="flex-shrink-0">
        <Navbar handleToggleSidebar={handleToggleSidebar} />
      </div>
      <div className={`d-flex flex-grow-1 ${styles.mainContent}`}>
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} handleToggleSidebar={handleToggleSidebar} />
        <div className={`${styles.outletContent}`}><Outlet /></div>
      </div>
    </div>
  );
};

export default Layout;
