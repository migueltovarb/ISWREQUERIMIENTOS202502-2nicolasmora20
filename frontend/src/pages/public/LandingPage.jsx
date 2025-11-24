import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Únete al cambio hoy mismo</h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', marginBottom: '2rem' }}>
                    Conecta con causas que te apasionan y marca la diferencia en tu comunidad.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '0.75rem 1.5rem' }}>
                        Regístrate como Voluntario
                    </Link>
                    <Link to="/login" className="btn btn-outline" style={{ fontSize: '1.1rem', padding: '0.75rem 1.5rem' }}>
                        Iniciar Sesión
                    </Link>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div className="card">
                    <h3>Impacto Real</h3>
                    <p>Participa en proyectos que transforman vidas y comunidades.</p>
                </div>
                <div className="card">
                    <h3>Comunidad</h3>
                    <p>Conoce a personas con tus mismos intereses y valores.</p>
                </div>
                <div className="card">
                    <h3>Crecimiento</h3>
                    <p>Desarrolla nuevas habilidades y enriquece tu perfil profesional.</p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
