import { NavLink } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";

const Navigation = () => {
    return (
        <nav className="nav nav-tabs">
            <NavLink
                to="/"
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
                Page 1
            </NavLink>
            <NavLink
                to="/page2"
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
                Page 2
            </NavLink>
        </nav>
    );
};

export default Navigation;
