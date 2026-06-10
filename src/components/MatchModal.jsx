import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

export default function MatchModal({ isOpen, onClose, selectedLeague, onMatchCreated }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados para controlar la apertura de nuestros dropdowns personalizados
  const [openPlayer1, setOpenPlayer1] = useState(false);
  const [openPlayer2, setOpenPlayer2] = useState(false);

  const [formData, setFormData] = useState({
    team1Id: '',
    team1Name: '', // Guardamos el nombre para mostrarlo en el botón personalizado
    team2Id: '',
    team2Name: '',
    matchDate: '',
    matchType: 'SHORT'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && selectedLeague) {
      setLoading(true);
      api.get(`/v1/leagues/${selectedLeague}/leaderboard?page=0&size=50`)
        .then(res => {
          const data = Array.isArray(res.data) ? res.data : (res.data.content || []);
          setParticipants(data);
        })
        .catch(() => { })
        .finally(() => setLoading(false));
    }
  }, [isOpen, selectedLeague]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.team1Id || !formData.team2Id || !formData.matchDate) {
      alert("Please fill in all required fields.");
      return;
    }
    if (formData.team1Id === formData.team2Id) {
      alert("A player cannot play against themselves.");
      return;
    }

    setSubmitting(true);

    const payload = {
      leagueId: Number(selectedLeague),
      team1Id: Number(formData.team1Id),
      team2Id: Number(formData.team2Id),
      matchDate: formData.matchDate,
      matchType: formData.matchType
    };

    api.post('/v1/matches', payload)
      .then(() => {
        alert("Match scheduled successfully.");
        onMatchCreated();
        setFormData({ team1Id: '', team1Name: '', team2Id: '', team2Name: '', matchDate: '', matchType: 'SHORT' });
        onClose();
      })
      .catch(err => {
        alert(err.response?.data?.message || "An error occurred while scheduling the match.");
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">

        <div className="p-4 bg-slate-900 text-white font-bold flex justify-between items-center shrink-0">
          <div>
            <span className="text-xs uppercase text-indigo-400 block tracking-wider font-semibold">Schedule</span>
            <span className="text-sm block">Schedule Match (League ID: {selectedLeague})</span>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">

          {/* PLAYER 1 CUSTOM DROPDOWN */}
          <div className="relative">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Home (Player 1)</label>
            <button
              type="button"
              disabled={loading || submitting}
              onClick={() => { setOpenPlayer1(!openPlayer1); setOpenPlayer2(false); }}
              className="w-full border rounded-lg p-2.5 bg-slate-50 text-sm text-left outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium flex justify-between items-center"
            >
              <span>{formData.team1Name || (loading ? '🔄 Loading...' : '-- Select a player --')}</span>
              <svg className="h-4 w-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </button>

            {openPlayer1 && !loading && (
              <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1">
                {participants.map(p => (
                  <button
                    key={`custom-p1-${p.team.id}`}
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                    onClick={() => {
                      setFormData({ ...formData, team1Id: p.team.id, team1Name: p.team.teamName });
                      setOpenPlayer1(false);
                    }}
                  >
                    {p.team.teamName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PLAYER 2 CUSTOM DROPDOWN */}
          <div className="relative">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Away (Player 2)</label>
            <button
              type="button"
              disabled={loading || submitting}
              onClick={() => { setOpenPlayer2(!openPlayer2); setOpenPlayer1(false); }}
              className="w-full border rounded-lg p-2.5 bg-slate-50 text-sm text-left outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium flex justify-between items-center"
            >
              <span>{formData.team2Name || (loading ? '🔄 Loading...' : '-- Select a player --')}</span>
              <svg className="h-4 w-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </button>

            {openPlayer2 && !loading && (
              <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1">
                {participants.map(p => (
                  <button
                    key={`custom-p2-${p.team.id}`}
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                    onClick={() => {
                      setFormData({ ...formData, team2Id: p.team.id, team2Name: p.team.teamName });
                      setOpenPlayer2(false);
                    }}
                  >
                    {p.team.teamName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DATE INPUT */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Scheduled Date</label>
            <input
              type="date"
              required
              className="w-full border rounded-lg p-2.5 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-slate-700"
              value={formData.matchDate}
              onChange={(e) => setFormData({ ...formData, matchDate: e.target.value })}
              disabled={submitting}
            />
          </div>

          {/* SCORING FORMAT */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Scoring Format</label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <button
                type="button"
                disabled={submitting}
                className={`p-3 rounded-xl border text-xs font-bold transition-all ${formData.matchType === 'SHORT' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}
                onClick={() => setFormData({ ...formData, matchType: 'SHORT' })}
              >
                SHORT (Best of 3)
              </button>
              <button
                type="button"
                disabled={submitting}
                className={`p-3 rounded-xl border text-xs font-bold transition-all ${formData.matchType === 'LONG' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}
                onClick={() => setFormData({ ...formData, matchType: 'LONG' })}
              >
                LONG (Best of 5)
              </button>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4 border-t mt-6 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || loading || !formData.team1Id || !formData.team2Id}
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 min-w-[120px] transition-all shadow-xs"
            >
              {submitting ? 'Scheduling...' : 'Create Match'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}