import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const CertificatesPage = () => {
    const [inscriptions, setInscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInscriptions();
    }, []);

    const fetchInscriptions = async () => {
        try {
            const response = await api.get('/inscriptions/');
            const data = response.data;
            const list = Array.isArray(data) ? data : [];
            // Filtrar solo las actividades completadas
            const completed = list.filter(ins => ins.attended);
            setInscriptions(completed);
        } catch (error) {
            console.error("Error fetching inscriptions", error);
        } finally {
            setLoading(false);
        }
    };

    const downloadCertificate = async (inscriptionId) => {
        try {
            const response = await api.get(`/inscriptions/${inscriptionId}/certificate/`, {
                responseType: 'blob'
            });

            // Crear un enlace temporal para descargar el PDF
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `certificado_${inscriptionId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading certificate", error);
            alert('Error al descargar el certificado: ' + (error.response?.data?.error || error.message));
        }
    };

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Cargando...</div>;

    return (
        <div className="container" style={{ padding: '2rem 0', maxWidth: '900px' }}>
            <div className="card">
                <h1 style={{ marginBottom: '1.5rem' }}>Mis Certificados</h1>

                {inscriptions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                        <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                            No tienes certificados disponibles
                        </p>
                        <p>Completa actividades para obtener certificados de participación</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {inscriptions.map((inscription) => (
                            <div
                                key={inscription.id}
                                className="card"
                                style={{
                                    backgroundColor: 'var(--background-color)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1.5rem'
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: '0 0 0.5rem 0' }}>{inscription.activity_title}</h3>
                                    <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                                        <span>📅 {inscription.activity_date}</span>
                                        <span>⏱️ {inscription.activity_hours} horas</span>
                                        <span style={{ color: 'var(--success-color)', fontWeight: '500' }}>
                                            ✓ Completada
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => downloadCertificate(inscription.id)}
                                    className="btn btn-primary"
                                    style={{ marginLeft: '1rem' }}
                                >
                                    📄 Descargar Certificado
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#e3f2fd', borderRadius: '0.25rem', border: '1px solid #2196f3' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#1565c0' }}>
                        <strong>💡 Nota:</strong> Los certificados incluyen un código único de validación y están firmados digitalmente por el coordinador de la actividad.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CertificatesPage;
