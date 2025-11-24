import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [remember, setRemember] = useState(true);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = await login(email, password, { remember });
            const from = location.state?.from?.pathname;
            if (from) navigate(from, { replace: true });
            else if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'coordinator') navigate('/coordinator');
            else navigate('/volunteer');
        } catch (err) {
            setError('Credenciales incorrectas. Intenta con admin@example.com / admin123');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', marginTop: '4rem' }}>
            <div className="card">
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Iniciar Sesión</h2>
                {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Correo Electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Ingresar
                    </button>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                        <label style={{ fontSize: '0.9rem' }}>
                            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ marginRight: '0.5rem' }} />
                            Recordar sesión
                        </label>
                        <Link to="/recover-password" style={{ color: 'var(--primary-color)', fontSize: '0.9rem' }}>
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                </form>
                <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                    <p>Prueba con:</p>
                    <ul style={{ paddingLeft: '1.2rem' }}>
                        <li>admin@example.com / admin123</li>
                        <li>coord@example.com / coord123</li>
                        <li>vol@example.com / vol123</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
