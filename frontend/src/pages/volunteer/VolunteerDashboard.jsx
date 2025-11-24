import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ActivityCard from '../../components/common/ActivityCard';
import Modal from '../../components/common/Modal';
import api from '../../services/api';

const VolunteerDashboard = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [registeredIds, setRegisteredIds] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    fetchActivities();
    fetchInscriptions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [activities, filters]);

  const fetchActivities = async () => {
    try {
      const response = await api.get('/activities/');
      const data = response.data;
      setActivities(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching activities", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInscriptions = async () => {
    try {
      const response = await api.get('/inscriptions/');
      const data = response.data;
      const list = Array.isArray(data) ? data : [];
      const ids = list.map(ins => ins.activity);
      setRegisteredIds(ids);
    } catch (error) {
      console.error("Error fetching inscriptions", error);
    }
  };

  const applyFilters = () => {
    let filtered = [...activities];

    // Filtro por búsqueda
    if (filters.search) {
      filtered = filtered.filter(act =>
        act.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        act.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filtro por categoría
    if (filters.category) {
      filtered = filtered.filter(act => act.category === filters.category);
    }

    // Filtro por fecha desde
    if (filters.dateFrom) {
      filtered = filtered.filter(act => act.date >= filters.dateFrom);
    }

    // Filtro por fecha hasta
    if (filters.dateTo) {
      filtered = filtered.filter(act => act.date <= filters.dateTo);
    }

    setFilteredActivities(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const handleRegisterClick = (activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const confirmRegistration = async () => {
    if (selectedActivity) {
      try {
        await api.post('/inscriptions/', { activity: selectedActivity.id });
        setRegisteredIds([...registeredIds, selectedActivity.id]);

        // Actualizar cupos
        setActivities(activities.map(act =>
          act.id === selectedActivity.id ? { ...act, spots: act.spots - 1 } : act
        ));

        setIsModalOpen(false);
        setSelectedActivity(null);
        alert('¡Inscripción exitosa!');
      } catch (error) {
        console.error("Error registering", error);
        alert('Error al inscribirse: ' + (error.response?.data?.detail || error.message));
      }
    }
  };

  if (loading) return <div className="container" style={{ padding: '2rem' }}>Cargando actividades...</div>;

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Actividades Disponibles</h1>
        <Link to="/certificates" className="btn btn-primary">
          📄 Mis Certificados
        </Link>
      </div>

      {/* Barra de filtros */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Filtros</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Buscar</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Título o descripción..."
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Categoría</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)' }}
            >
              <option value="">Todas</option>
              <option value="environmental">Ambiental</option>
              <option value="social">Social</option>
              <option value="education">Educación</option>
              <option value="health">Salud</option>
              <option value="other">Otro</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Desde</label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Hasta</label>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)' }}
            />
          </div>
        </div>
        <button
          onClick={clearFilters}
          className="btn btn-outline"
          style={{ marginTop: '1rem' }}
        >
          Limpiar Filtros
        </button>
      </div>

      {/* Lista de actividades */}
      {filteredActivities.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
          <p style={{ fontSize: '1.2rem' }}>No se encontraron actividades</p>
          <p>Intenta ajustar los filtros</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filteredActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              isRegistered={registeredIds.includes(activity.id)}
              onRegister={() => handleRegisterClick(activity)}
            />
          ))}
        </div>
      )}

      {/* Modal de confirmación */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirmar Inscripción"
      >
        {selectedActivity && (
          <div>
            <p>¿Estás seguro de que deseas inscribirte en:</p>
            <h3 style={{ margin: '1rem 0' }}>{selectedActivity.title}</h3>
            <p><strong>Fecha:</strong> {selectedActivity.date}</p>
            <p><strong>Ubicación:</strong> {selectedActivity.location}</p>
            <p><strong>Cupos disponibles:</strong> {selectedActivity.spots}</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button onClick={confirmRegistration} className="btn btn-primary" style={{ flex: 1 }}>
                Confirmar
              </button>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VolunteerDashboard;
