import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const { register } = useAuth();
    const navigate = useNavigate();

    const validateField = (name, value) => {
        const errs = { ...errors };
        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) errs.email = 'Correo inválido'; else delete errs.email;
        }
        if (name === 'password') {
            if (value.length < 8 || !/[A-Z]/.test(value) || !/[0-9]/.test(value) ||
                !/[!@#$%^&*()_\-+=\[\]{};:,./<>?\\|`~]/.test(value)) {
                errs.password = 'Debe tener 8+, mayúscula, número y especial';
            } else delete errs.password;
        }
        if (name === 'confirmPassword') {
            if (value !== formData.password) errs.confirmPassword = 'No coincide'; else delete errs.confirmPassword;
        }
        setErrors(errs);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validaciones cliente
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Correo inválido');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        if (formData.password.length < 8 ||
            !/[A-Z]/.test(formData.password) ||
            !/[0-9]/.test(formData.password) ||
            !/[!@#$%^&*()_\-+=\[\]{};:,./<>?\\|`~]/.test(formData.password)) {
            alert('La contraseña debe tener 8+ caracteres, incluir mayúsculas, números y especiales');
            return;
        }
        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            alert('Registro creado. Revisa tu correo para confirmar la cuenta y luego inicia sesión.');
            navigate('/login');
        } catch (error) {
            alert('Error en el registro: ' + error.message);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '500px', marginTop: '4rem' }}>
            <div className="card">
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Registro de Voluntario</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nombre Completo</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Correo Electrónico</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }}
                            required
                        />
                        {errors.email && <small style={{ color: 'red' }}>{errors.email}</small>}
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }}
                            required
                        />
                        {errors.password && <small style={{ color: 'red' }}>{errors.password}</small>}
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Confirmar Contraseña</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }}
                            required
                        />
                        {errors.confirmPassword && <small style={{ color: 'red' }}>{errors.confirmPassword}</small>}
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Registrarse
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
