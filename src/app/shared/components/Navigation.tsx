import React from 'react';
import {NavLink} from 'react-router-dom';

const Navigation: React.FC = () => {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">ReactXDemo</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarColor04" aria-controls="navbarColor04" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarColor04">

                    <ul className="navbar-nav me-auto">
                        <li className="nav-item" role="presentation">
                            <NavLink
                                to="/events"
                                className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}
                            >
                                HOME
                            </NavLink>
                        </li>
                        {/*<li className="nav-item" role="presentation">*/}
                        {/*    <NavLink*/}
                        {/*        to="/registration"*/}
                        {/*        className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}*/}
                        {/*    >*/}
                        {/*        Register*/}
                        {/*    </NavLink>*/}
                        {/*</li>*/}
                        {/*<li className="nav-item" role="presentation">*/}
                        {/*    <NavLink*/}
                        {/*        to="/login"*/}
                        {/*        className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}*/}
                        {/*    >*/}
                        {/*        Login*/}
                        {/*    </NavLink>*/}
                        {/*</li>*/}
                        <li className="nav-item" role="presentation">
                            <NavLink
                                to="/events"
                                className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}
                            >
                                Events
                            </NavLink>
                        </li>
                    </ul>

                </div>
            </div>
        </nav>
    );
};

export default Navigation;
