import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const EditProfilePage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        skills: '',
        interests: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/users/me/');
            setFormData({
                first_name: response.data.first_name || '',
                last_name: response.data.last_name || '',
                phone: response.data.phone || '',
                skills: response.data.skills || '',
                interests: response.data.interests || ''
            });
        } catch (error) {
            console.error("Error fetching profile", error);
            alert('Error al cargar el perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.patch('/users/update_me/', formData);
            alert('Perfil actualizado exitosamente');
            navigate('/profile');
        } catch (error) {
            console.error("Error updating profile", error);
            alert('Error al actualizar el perfil: ' + (error.response?.data?.error || error.message));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Cargando...</div>;

    return (
        <div className="container" style={{ padding: '2rem 0', maxWidth: '600px' }}>
            <div className="card">
                <h1 style={{ marginBottom: '1.5rem' }}>Editar Perfil</h1>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                borderRadius: '0.25rem',
                                border: '1px solid var(--border-color)'
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Apellido
                        </label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                borderRadius: '0.25rem',
                                border: '1px solid var(--border-color)'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Teléfono
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Ej: +57 300 123 4567"
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                borderRadius: '0.25rem',
                                border: '1px solid var(--border-color)'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Habilidades
                        </label>
                        <textarea
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            placeholder="Ej: Comunicación, Trabajo en equipo, Primeros auxilios"
                            rows="3"
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                borderRadius: '0.25rem',
                                border: '1px solid var(--border-color)',
                                fontFamily: 'inherit',
                                resize: 'vertical'
                            }}
                        />
                        <small style={{ color: 'var(--text-light)' }}>Separa las habilidades con comas</small>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Intereses
                        </label>
                        <textarea
                            name="interests"
                            value={formData.interests}
                            onChange={handleChange}
                            placeholder="Ej: Medio ambiente, Educación, Salud"
                            rows="3"
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                borderRadius: '0.25rem',
                                border: '1px solid var(--border-color)',
                                fontFamily: 'inherit',
                                resize: 'vertical'
                            }}
                        />
                        <small style={{ color: 'var(--text-light)' }}>Separa los intereses con comas</small>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ flex: 1 }}
                            disabled={saving}
                        >
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline"
                            style={{ flex: 1 }}
                            onClick={() => navigate('/profile')}
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

export default EditProfilePage;
