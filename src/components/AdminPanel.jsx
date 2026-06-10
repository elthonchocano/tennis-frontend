import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

export default function AdminPanel({ selectedLeague, onOpenMatchModal, onParticipantAdded }) {
    const [playerForm, setPlayerForm] = useState({ firstName: '', lastName: '', phoneNumber: '', hand: 'R' });
    const [loadingPlayer, setLoadingPlayer] = useState(false);
    const [teams, setTeams] = useState([]);
    const [selectedTeamId, setSelectedTeamId] = useState('');

    const fetchTeams = () => {
        axios.get('/v1/teams')
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : (res.data.content || []);
                setTeams(data);
            })
            .catch(() => {});
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const handleCreatePlayer = (e) => {
        e.preventDefault();
        setLoadingPlayer(true);

        axios.post('/v1/players', playerForm)
            .then(() => {
                alert("Player created successfully.");
                setPlayerForm({ firstName: '', lastName: '', phoneNumber: '', hand: 'R' });
                fetchTeams();
            })
            .catch(() => {})
            .finally(() => setLoadingPlayer(false));
    };

    const handleAddParticipant = (e) => {
        e.preventDefault();
        if (!selectedLeague || !selectedTeamId) {
            alert("Please select a player and ensure there is an active league.");
            return;
        }

        axios.post(`/v1/leagues/${selectedLeague}/participants`, {
            teamId: Number(selectedTeamId)
        })
            .then(() => {
                alert("Successfully enrolled in the league.");
                setSelectedTeamId('');
                if (onParticipantAdded) onParticipantAdded();
            })
            .catch(() => {
                alert("Error enrolling player. Please check if the player is already in this league.");
            });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Schedule</h3>
                    <button
                        type="button"
                        onClick={onOpenMatchModal}
                        className="w-full bg-indigo-600 text-white text-xs font-bold py-2.5 px-4 rounded-lg hover:bg-indigo-700 transition-all"
                    >
                        📅 New Match
                    </button>
                </div>

                <form onSubmit={handleCreatePlayer} className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                    <div className="grid-cols-1 sm:col-span-2 lg:col-span-5">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">1. Register New Player</h3>
                    </div>
                    <input
                        type="text" required placeholder="First Name" className="w-full border rounded-lg p-2 text-xs bg-slate-50"
                        value={playerForm.firstName} onChange={(e) => setPlayerForm({ ...playerForm, firstName: e.target.value })}
                    />
                    <input
                        type="text" required placeholder="Last Name" className="w-full border rounded-lg p-2 text-xs bg-slate-50"
                        value={playerForm.lastName} onChange={(e) => setPlayerForm({ ...playerForm, lastName: e.target.value })}
                    />
                    <input
                        type="text" placeholder="Phone" className="w-full border rounded-lg p-2 text-xs bg-slate-50"
                        value={playerForm.phoneNumber} onChange={(e) => setPlayerForm({ ...playerForm, phoneNumber: e.target.value })}
                    />
                    <select
                        className="w-full border rounded-lg p-2 text-xs bg-slate-50 text-slate-600"
                        value={playerForm.hand} onChange={(e) => setPlayerForm({ ...playerForm, hand: e.target.value })}
                    >
                        <option value="R">Right-handed (R)</option>
                        <option value="L">Left-handed (L)</option>
                    </select>
                    <button type="submit" disabled={loadingPlayer} className="w-full sm:col-span-2 lg:col-span-1 bg-slate-900 text-white text-xs font-bold py-2.5 rounded-lg">
                        {loadingPlayer ? '...' : 'Add'}
                    </button>
                </form>
            </div>

            <div className="border-t border-slate-100"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registration</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Assign the player to the current league.</p>
                </div>

                <form onSubmit={handleAddParticipant} className="md:col-span-3 flex flex-col sm:flex-row gap-3 items-end">
                    <div className="flex-1 w-full">
                        <select
                            required
                            className="w-full border rounded-lg p-2.5 bg-slate-50 text-xs text-slate-700"
                            value={selectedTeamId}
                            onChange={(e) => setSelectedTeamId(e.target.value)}
                        >
                            <option value="">-- Select a player --</option>
                            {Array.isArray(teams) && teams.map(t => (
                                <option key={`team-opt-${t.id}`} value={t.id}>
                                    {t.teamName} (ID: {t.id})
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-6 rounded-lg transition-all"
                    >
                        Enroll in League
                    </button>
                </form>
            </div>
        </div>
    );
}