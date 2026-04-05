import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar-container">
      <ul className="nav-links">
        <li>
          <NavLink to="/categorias" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            Todas las categorías
          </NavLink>
        </li>
        <li>
          <NavLink to="/destacados" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            Productos destacados
          </NavLink>
        </li>
        <li>
          <NavLink to="/productores" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            Productores
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
