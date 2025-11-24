import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const CoordinatorDashboard = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const response = await api.get('/activities/');
            setActivities(response.data);
        } catch (error) {
            console.error("Error fetching activities", error);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryLabel = (category) => {
        const labels = {
            environmental: 'Ambiental',
            social: 'Social',
            education: 'Educación',
            health: 'Salud',
            other: 'Otro'
        };
        return labels[category] || category;
    };

    const getStatusBadge = (status) => {
        const styles = {
            draft: { bg: '#ffeaa7', color: '#d63031' },
            published: { bg: '#55efc4', color: '#00b894' },
            completed: { bg: '#74b9ff', color: '#0984e3' },
            cancelled: { bg: '#dfe6e9', color: '#636e72' }
        };
        const labels = {
            draft: 'Borrador',
            published: 'Publicada',
            completed: 'Completada',
            cancelled: 'Cancelada'
        };
        const style = styles[status] || styles.draft;
        return (
            <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontSize: '0.85rem',
                fontWeight: '500',
                backgroundColor: style.bg,
                color: style.color
            }}>
                {labels[status] || status}
            </span>
        );
    };

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Cargando...</div>;

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Gestión de Actividades</h1>
                <Link to="/coordinator/create-activity" className="btn btn-primary">
                    ➕ Nueva Actividad
                </Link>
            </div>

            {/* Estadísticas rápidas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card" style={{ textAlign: 'center', backgroundColor: '#e3f2fd' }}>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1976d2', margin: 0 }}>
                        {activities.length}
                    </p>
                    <p style={{ color: '#1565c0', margin: '0.5rem 0 0 0' }}>Total Actividades</p>
                </div>
                <div className="card" style={{ textAlign: 'center', backgroundColor: '#e8f5e9' }}>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#388e3c', margin: 0 }}>
                        {activities.filter(a => a.status === 'published').length}
                    </p>
                    <p style={{ color: '#2e7d32', margin: '0.5rem 0 0 0' }}>Publicadas</p>
                </div>
                <div className="card" style={{ textAlign: 'center', backgroundColor: '#fff3e0' }}>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f57c00', margin: 0 }}>
                        {activities.filter(a => a.status === 'draft').length}
                    </p>
                    <p style={{ color: '#ef6c00', margin: '0.5rem 0 0 0' }}>Borradores</p>
                </div>
            </div>

            {/* Tabla de actividades */}
            <div className="card">
                <h2 style={{ marginBottom: '1.5rem' }}>Mis Actividades</h2>
                {activities.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                        <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                            No tienes actividades creadas
                        </p>
                        <p>Crea tu primera actividad para comenzar</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--background-color)' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Título</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Categoría</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>Fecha</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>Cupos</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>Estado</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activities.map((activity) => (
                                    <tr key={activity.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <strong>{activity.title}</strong>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {getCategoryLabel(activity.category)}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            {activity.date}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            {activity.spots}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            {getStatusBadge(activity.status)}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                <Link
                                                    to={`/coordinator/edit-activity/${activity.id}`}
                                                    className="btn btn-outline"
                                                    style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                                                >
                                                    ✏️ Editar
                                                </Link>
                                                <Link
                                                    to={`/coordinator/attendance/${activity.id}`}
                                                    className="btn btn-outline"
                                                    style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                                                >
                                                    ✓ Asistencia
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoordinatorDashboard;
