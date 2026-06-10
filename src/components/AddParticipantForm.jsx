import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AddParticipantForm({ selectedLeague, onParticipantAdded }) {
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 1. Cargar los equipos disponibles al montar el componente o cambiar la liga
  useEffect(() => {
    setLoadingTeams(true);
    axios.get('/v1/teams')
      .then(res => {
        // Adaptamos por si la API viene paginada (.content) o como lista directa
        const data = res.data.content || res.data;
        setTeams(data);
      })
      .catch(err => {
        console.error("Error al obtener la lista de equipos:", err);
      })
      .finally(() => setLoadingTeams(false));
  }, [selectedLeague]);

  // 2. Manejar el envío del formulario al backend de Quarkus
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedLeague) {
      alert("Por favor, selecciona una liga activa primero.");
      return;
    }
    if (!selectedTeamId) {
      alert("Por favor, selecciona un equipo o jugador.");
      return;
    }

    setSubmitting(true);

    // Formato exacto según tu Record de Java: LeagueParticipantRowRequest
    const payload = {
      teamId: Number(selectedTeamId)
    };

    // POST http://localhost:8080/v1/leagues/{leagueId}/participants
    axios.post(`/v1/leagues/${selectedLeague}/participants`, payload)
      .then(() => {
        alert("Participante añadido con éxito a la liga.");
        setSelectedTeamId(''); // Limpiamos el selector
        
        // Callback para refrescar la tabla del Leaderboard principal automáticamente
        if (onParticipantAdded) {
          onParticipantAdded();
        }
      })
      .catch(err => {
        console.error("Error al registrar participante:", err);
        // Si el backend arroja un BadRequest (ej: jugador ya inscrito), mostramos el mensaje real
        const errorMsg = err.response?.data?.message || "Ocurrió un error al inscribir al participante.";
        alert(errorMsg);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
      <div className="mb-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Inscribir Participante en la Liga
        </h3>
        <p className="text-[11px] text-slate-500">
          Selecciona un jugador/equipo registrado para añadirlo a la tabla de clasificaciones actual.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-end">
        {/* Selector de Equipos */}
        <div className="flex-1 w-full">
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
            Jugador o Equipo disponible
          </label>
          <select
            required
            className="w-full border rounded-lg p-2.5 bg-slate-50 text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            disabled={loadingTeams || submitting}
          >
            <option value="">
              {loadingTeams ? '🔄 Cargando jugadores...' : '-- Selecciona un jugador --'}
            </option>
            {teams.map(team => (
              <option key={`add-part-${team.id}`} value={team.id}>
                {team.teamName} (ID: {team.id})
              </option>
            ))}
          </select>
        </div>

        {/* Botón de envío */}
        <div className="w-full sm:w-auto">
          <button
            type="submit"
            disabled={submitting || loadingTeams || !selectedTeamId}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-5 rounded-lg transition-colors disabled:bg-slate-200 disabled:text-slate-400 font-sans min-w-[140px]"
          >
            {submitting ? 'Inscribiendo...' : 'Inscribir'}
          </button>
        </div>
      </form>
    </div>
  );
}