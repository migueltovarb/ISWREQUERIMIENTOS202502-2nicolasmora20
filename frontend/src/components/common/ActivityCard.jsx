import React from 'react';

const ActivityCard = ({ activity, onRegister, isRegistered }) => {
    const getCategoryLabel = (category) => {
        const labels = {
            environmental: '🌱 Ambiental',
            social: '🤝 Social',
            education: '📚 Educación',
            health: '💊 Salud',
            other: '📌 Otro'
        };
        return labels[category] || category;
    };

    const getCategoryColor = (category) => {
        const colors = {
            environmental: '#4caf50',
            social: '#2196f3',
            education: '#ff9800',
            health: '#f44336',
            other: '#9c27b0'
        };
        return colors[category] || '#757575';
    };

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{
                height: '120px',
                background: `linear-gradient(135deg, ${getCategoryColor(activity.category)}22 0%, ${getCategoryColor(activity.category)}44 100%)`,
                borderRadius: '0.25rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${getCategoryColor(activity.category)}`,
                fontSize: '3rem'
            }}>
                {getCategoryLabel(activity.category).split(' ')[0]}
            </div>

            <div style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: '500',
                backgroundColor: `${getCategoryColor(activity.category)}22`,
                color: getCategoryColor(activity.category),
                marginBottom: '0.5rem',
                width: 'fit-content'
            }}>
                {getCategoryLabel(activity.category)}
            </div>

            <h3 style={{ marginBottom: '0.5rem' }}>{activity.title}</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                📅 {activity.date} | 📍 {activity.location}
            </p>
            {activity.hours && (
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    ⏱️ {activity.hours} horas
                </p>
            )}
            <p style={{ marginBottom: '1rem', flex: 1, fontSize: '0.95rem' }}>
                {activity.description.length > 100
                    ? activity.description.substring(0, 100) + '...'
                    : activity.description}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    color: activity.spots > 0 ? 'var(--success-color)' : 'var(--error-color)'
                }}>
                    {activity.spots > 0 ? `${activity.spots} cupos` : 'Sin cupos'}
                </span>
                {isRegistered ? (
                    <button className="btn" style={{ backgroundColor: 'var(--success-color)', color: 'white', cursor: 'default' }} disabled>
                        ✓ Inscrito
                    </button>
                ) : (
                    <button
                        className="btn btn-primary"
                        onClick={() => onRegister(activity)}
                        disabled={activity.spots === 0}
                        style={{ opacity: activity.spots === 0 ? 0.5 : 1 }}
                    >
                        Inscribirse
                    </button>
                )}
            </div>
        </div>
    );
};

export default ActivityCard;
