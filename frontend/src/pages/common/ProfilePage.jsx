import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ProfilePage = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({ activitiesCompleted: 0, totalHours: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
        fetchStats();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/users/me/');
            setProfile(response.data);
        } catch (error) {
            console.error("Error fetching profile", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/inscriptions/');
            const completed = response.data.filter(ins => ins.status === 'attended');
            setStats({
                activitiesCompleted: completed.length,
                totalHours: completed.length * 4 // Estimado: 4 horas por actividad
            });
        } catch (error) {
            console.error("Error fetching stats", error);
        }
    };

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Cargando perfil...</div>;
    if (!profile) return <div className="container" style={{ padding: '2rem' }}>Error al cargar perfil</div>;

    return (
        <div className="container" style={{ padding: '2rem 0', maxWidth: '800px' }}>
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1>Mi Perfil</h1>
                    <Link to="/profile/edit" className="btn btn-primary">Editar Perfil</Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '3rem',
                            fontWeight: 'bold',
                            margin: '0 auto'
                        }}>
                            {profile.first_name?.charAt(0) || profile.username?.charAt(0) || 'U'}
                        </div>
                        <h3 style={{ marginTop: '1rem' }}>{profile.first_name} {profile.last_name}</h3>
                        <p style={{ color: 'var(--text-light)', textTransform: 'capitalize' }}>{profile.role}</p>
                    </div>

                    <div>
                        <h3 style={{ marginBottom: '1rem' }}>Información Personal</h3>
                        <div style={{ marginBottom: '0.75rem' }}>
                            <strong>Correo:</strong> {profile.email}
                        </div>
                        {profile.phone && (
                            <div style={{ marginBottom: '0.75rem' }}>
                                <strong>Teléfono:</strong> {profile.phone}
                            </div>
                        )}
                        {profile.skills && (
                            <div style={{ marginBottom: '0.75rem' }}>
                                <strong>Habilidades:</strong> {profile.skills}
                            </div>
                        )}
                        {profile.interests && (
                            <div style={{ marginBottom: '0.75rem' }}>
                                <strong>Intereses:</strong> {profile.interests}
                            </div>
                        )}
                    </div>
                </div>

                {profile.role === 'volunteer' && (
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Estadísticas</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                            <div className="card" style={{ textAlign: 'center', backgroundColor: 'var(--background-color)' }}>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)', margin: 0 }}>
                                    {stats.activitiesCompleted}
                                </p>
                                <p style={{ color: 'var(--text-light)', margin: '0.5rem 0 0 0' }}>Actividades Completadas</p>
                            </div>
                            <div className="card" style={{ textAlign: 'center', backgroundColor: 'var(--background-color)' }}>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success-color)', margin: 0 }}>
                                    {stats.totalHours}
                                </p>
                                <p style={{ color: 'var(--text-light)', margin: '0.5rem 0 0 0' }}>Horas de Voluntariado</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
