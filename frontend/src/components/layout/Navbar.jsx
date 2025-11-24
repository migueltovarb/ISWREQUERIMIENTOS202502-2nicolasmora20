import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="navbar-brand">
                    Voluntariado
                </Link>
                <div className="navbar-links">
                    <Link to="/">Inicio</Link>
                    {!user && (
                        <>
                            <Link to="/login" className="btn btn-outline">Iniciar Sesión</Link>
                            <Link to="/register" className="btn btn-primary">Registrarse</Link>
                        </>
                    )}
                    {user && (
                        <>
                            {user.role === 'volunteer' && <Link to="/volunteer">Mi Panel</Link>}
                            {user.role === 'coordinator' && <Link to="/coordinator">Coordinación</Link>}
                            {user.role === 'admin' && <Link to="/admin">Administración</Link>}
                            <Link to="/profile">Mi Perfil</Link>
                            <div className="user-menu">
                                <span>{user.first_name || user.username}</span>
                                <button onClick={handleLogout} className="btn-logout">Salir</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
