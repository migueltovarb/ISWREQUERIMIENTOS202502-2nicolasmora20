import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

const ConfirmEmailPage = () => {
  const { uid, token } = useParams();
  const [message, setMessage] = useState('Confirmando correo...');
  const [error, setError] = useState('');

  useEffect(() => {
    const confirm = async () => {
      try {
        const res = await api.post('/auth/email_verification_confirm/', { uid, token });
        setMessage(res.data?.message || 'Email confirmado. Ya puedes iniciar sesión.');
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      }
    };
    confirm();
  }, [uid, token]);

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '4rem' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Confirmación de Correo</h2>
        {error ? (
          <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>
        ) : (
          <div style={{ color: 'green', marginBottom: '1rem' }}>{message}</div>
        )}
        <div style={{ textAlign: 'center' }}>
          <Link to="/login" className="btn btn-primary">Ir a Iniciar Sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmailPage;
