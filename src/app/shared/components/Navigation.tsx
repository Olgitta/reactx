import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation: React.FC = () => {
    return (
        <nav>
            <ul className="nav nav-pills">
                <li role="presentation">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        Register
                    </NavLink>
                </li>
                <li role="presentation">
                    <NavLink
                        to="/login"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        Login
                    </NavLink>
                </li>
                <li role="presentation">
                    <NavLink
                        to="/events"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        Events
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation;
