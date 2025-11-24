import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        volunteers: 0,
        coordinators: 0,
        admins: 0,
        totalActivities: 0,
        activeActivities: 0,
        completedActivities: 0,
        totalInscriptions: 0,
        certificatesIssued: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [usersRes, activitiesRes, inscriptionsRes] = await Promise.all([
                api.get('/users/'),
                api.get('/activities/'),
                api.get('/inscriptions/')
            ]);

            const users = usersRes.data.results || usersRes.data;
            const activities = activitiesRes.data.results || activitiesRes.data;
            const inscriptions = inscriptionsRes.data.results || inscriptionsRes.data;

            setStats({
                totalUsers: users.length,
                volunteers: users.filter(u => u.role === 'volunteer').length,
                coordinators: users.filter(u => u.role === 'coordinator').length,
                admins: users.filter(u => u.role === 'admin').length,
                totalActivities: activities.length,
                activeActivities: activities.filter(a => a.status === 'published').length,
                completedActivities: activities.filter(a => a.status === 'completed').length,
                totalInscriptions: inscriptions.length,
                certificatesIssued: inscriptions.filter(i => i.attended).length
            });
        } catch (error) {
            console.error("Error fetching stats", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Cargando estadísticas...</div>;

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h1 style={{ marginBottom: '2rem' }}>Panel de Administración</h1>

            {/* Estadísticas Generales */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Resumen General</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="card" style={{ textAlign: 'center', backgroundColor: '#e3f2fd' }}>
                        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1976d2', margin: 0 }}>
                            {stats.totalUsers}
                        </p>
                        <p style={{ color: '#1565c0', margin: '0.5rem 0 0 0', fontWeight: '500' }}>Total Usuarios</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center', backgroundColor: '#e8f5e9' }}>
                        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#388e3c', margin: 0 }}>
                            {stats.totalActivities}
                        </p>
                        <p style={{ color: '#2e7d32', margin: '0.5rem 0 0 0', fontWeight: '500' }}>Total Actividades</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center', backgroundColor: '#fff3e0' }}>
                        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f57c00', margin: 0 }}>
                            {stats.totalInscriptions}
                        </p>
                        <p style={{ color: '#ef6c00', margin: '0.5rem 0 0 0', fontWeight: '500' }}>Inscripciones</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center', backgroundColor: '#f3e5f5' }}>
                        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#7b1fa2', margin: 0 }}>
                            {stats.certificatesIssued}
                        </p>
                        <p style={{ color: '#6a1b9a', margin: '0.5rem 0 0 0', fontWeight: '500' }}>Certificados Emitidos</p>
                    </div>
                </div>
            </div>

            {/* Usuarios por Rol */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Usuarios por Rol</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2196f3', margin: 0 }}>
                            {stats.volunteers}
                        </p>
                        <p style={{ color: 'var(--text-light)', margin: '0.5rem 0 0 0' }}>Voluntarios</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4caf50', margin: 0 }}>
                            {stats.coordinators}
                        </p>
                        <p style={{ color: 'var(--text-light)', margin: '0.5rem 0 0 0' }}>Coordinadores</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff9800', margin: 0 }}>
                            {stats.admins}
                        </p>
                        <p style={{ color: 'var(--text-light)', margin: '0.5rem 0 0 0' }}>Administradores</p>
                    </div>
                </div>
            </div>

            {/* Actividades por Estado */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Actividades por Estado</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4caf50', margin: 0 }}>
                            {stats.activeActivities}
                        </p>
                        <p style={{ color: 'var(--text-light)', margin: '0.5rem 0 0 0' }}>Activas</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2196f3', margin: 0 }}>
                            {stats.completedActivities}
                        </p>
                        <p style={{ color: 'var(--text-light)', margin: '0.5rem 0 0 0' }}>Completadas</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff9800', margin: 0 }}>
                            {stats.totalActivities - stats.activeActivities - stats.completedActivities}
                        </p>
                        <p style={{ color: 'var(--text-light)', margin: '0.5rem 0 0 0' }}>Otras</p>
                    </div>
                </div>
            </div>

            {/* Métricas de Participación */}
            <div className="card">
                <h2 style={{ marginBottom: '1rem' }}>Métricas de Participación</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                            Tasa de Asistencia
                        </p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)', margin: 0 }}>
                                {stats.totalInscriptions > 0
                                    ? Math.round((stats.certificatesIssued / stats.totalInscriptions) * 100)
                                    : 0}%
                            </p>
                            <p style={{ color: 'var(--text-light)', margin: 0 }}>
                                ({stats.certificatesIssued} de {stats.totalInscriptions})
                            </p>
                        </div>
                    </div>
                    <div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                            Promedio Inscripciones por Actividad
                        </p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)', margin: 0 }}>
                                {stats.totalActivities > 0
                                    ? (stats.totalInscriptions / stats.totalActivities).toFixed(1)
                                    : 0}
                            </p>
                            <p style={{ color: 'var(--text-light)', margin: 0 }}>
                                voluntarios
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
