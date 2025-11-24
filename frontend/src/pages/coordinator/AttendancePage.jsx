import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AttendancePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activity, setActivity] = useState(null);
    const [inscriptions, setInscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [activityRes, inscriptionsRes] = await Promise.all([
                api.get(`/activities/${id}/`),
                api.get(`/activities/${id}/attendance/`)
            ]);
            setActivity(activityRes.data);
            setInscriptions(inscriptionsRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
            alert('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    const handleAttendanceChange = (inscriptionId, attended) => {
        setInscriptions(inscriptions.map(ins =>
            ins.id === inscriptionId ? { ...ins, attended } : ins
        ));
    };

    const handleNotesChange = (inscriptionId, notes) => {
        setInscriptions(inscriptions.map(ins =>
            ins.id === inscriptionId ? { ...ins, notes } : ins
        ));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const attendance = inscriptions.map(ins => ({
                id: ins.id,
                attended: ins.attended || false,
                notes: ins.notes || ''
            }));

            await api.patch(`/activities/${id}/attendance/`, { attendance });
            alert('Asistencia guardada exitosamente');
            navigate('/coordinator');
        } catch (error) {
            console.error("Error saving attendance", error);
            alert('Error al guardar la asistencia');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Cargando...</div>;
    if (!activity) return <div className="container" style={{ padding: '2rem' }}>Actividad no encontrada</div>;

    return (
        <div className="container" style={{ padding: '2rem 0', maxWidth: '900px' }}>
            <div className="card">
                <h1 style={{ marginBottom: '0.5rem' }}>Control de Asistencia</h1>
                <h3 style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>{activity.title}</h3>

                <form onSubmit={handleSubmit}>
                    {inscriptions.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>
                            No hay voluntarios inscritos en esta actividad
                        </p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Voluntario</th>
                                        <th style={{ padding: '1rem', textAlign: 'center', width: '120px' }}>Asistió</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Notas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inscriptions.map((inscription) => (
                                        <tr key={inscription.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <div>
                                                    <strong>{inscription.user_name}</strong>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={inscription.attended || false}
                                                    onChange={(e) => handleAttendanceChange(inscription.id, e.target.checked)}
                                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                                />
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <input
                                                    type="text"
                                                    value={inscription.notes || ''}
                                                    onChange={(e) => handleNotesChange(inscription.id, e.target.value)}
                                                    placeholder="Notas opcionales..."
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.5rem',
                                                        borderRadius: '0.25rem',
                                                        border: '1px solid var(--border-color)'
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ flex: 1 }}
                            disabled={saving || inscriptions.length === 0}
                        >
                            {saving ? 'Guardando...' : 'Guardar Asistencia'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline"
                            style={{ flex: 1 }}
                            onClick={() => navigate('/coordinator')}
                            disabled={saving}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AttendancePage;
