import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar-container">
      <ul className="nav-links">
        <li className="nav-item active">Todas las categorías</li>
        <li className="nav-item">Productos destacados</li>
        <li className="nav-item">Productores</li>
      </ul>
    </nav>
  );
};

export default Navbar;
