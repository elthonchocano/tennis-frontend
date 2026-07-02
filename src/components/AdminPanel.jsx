import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import AddLeagueModal from './AddLeagueModal';
import { useAuth } from '../context/AuthContext';

export default function AdminPanel({ selectedLeague, onOpenMatchModal, onParticipantAdded, onLeagueAdded }) {    
    const [playerForm, setPlayerForm] = useState({ firstName: '', lastName: '', phoneNumber: '', hand: 'R' });
    const [loadingPlayer, setLoadingPlayer] = useState(false);
    const [teams, setTeams] = useState([]);
    const [isLeagueModalOpen, setIsLeagueModalOpen] = useState(false);

    const [openTeamDropdown, setOpenTeamDropdown] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState('');
    const [selectedTeamName, setSelectedTeamName] = useState('');

    const { user } = useAuth();

    const isSuperAdmin = user?.groups?.includes('super-admin');

    const fetchTeams = () => {
        axios.get('/v1/teams')
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : (res.data.content || []);
                setTeams(data);
            })
            .catch((err) => {
                console.error("Error fetching teams:", err);
            });
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
            .catch((err) => {
                console.error("Error creating player:", err);
            })
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
                setSelectedTeamName('');
                if (onParticipantAdded) onParticipantAdded();
            })
            .catch(() => {
                alert("Error enrolling player. Please check if the player is already in this league.");
            });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                <div className="flex flex-col gap-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Management</h3>
                    {isSuperAdmin && (
                        <button
                            type="button"
                            onClick={() => setIsLeagueModalOpen(true)}
                            className="w-full bg-emerald-600 text-white text-xs font-bold py-2.5 px-4 rounded-lg hover:bg-emerald-700 transition-all"
                        >
                            🏅 New League
                        </button>
                    )}
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
                    <input type="text" required placeholder="First Name" className="w-full border rounded-lg p-2 text-xs bg-slate-50" value={playerForm.firstName} onChange={(e) => setPlayerForm({ ...playerForm, firstName: e.target.value })} />
                    <input type="text" required placeholder="Last Name" className="w-full border rounded-lg p-2 text-xs bg-slate-50" value={playerForm.lastName} onChange={(e) => setPlayerForm({ ...playerForm, lastName: e.target.value })} />
                    <input type="text" placeholder="Phone" className="w-full border rounded-lg p-2 text-xs bg-slate-50" value={playerForm.phoneNumber} onChange={(e) => setPlayerForm({ ...playerForm, phoneNumber: e.target.value })} />
                    <select className="w-full border rounded-lg p-2 text-xs bg-slate-50 text-slate-600 outline-none" value={playerForm.hand} onChange={(e) => setPlayerForm({ ...playerForm, hand: e.target.value })}>
                        <option value="R">Right-handed (R)</option>
                        <option value="L">Left-handed (L)</option>
                    </select>
                    <button type="submit" disabled={loadingPlayer} className="w-full sm:col-span-2 lg:col-span-1 bg-slate-900 text-white text-xs font-bold py-2.5 rounded-lg hover:bg-slate-800 transition-colors">
                        {loadingPlayer ? '...' : 'Add'}
                    </button>
                </form>
            </div>

            <div className="border-t border-slate-100"></div>

            {/* Sección de Registro */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registration</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Assign the player to the current league.</p>
                </div>

                <form onSubmit={handleAddParticipant} className="md:col-span-3 flex flex-col sm:flex-row gap-3 items-end relative">
                    <div className="flex-1 w-full relative">
                        <button type="button" onClick={() => setOpenTeamDropdown(!openTeamDropdown)} className="w-full border rounded-lg p-2.5 bg-slate-50 text-xs text-left text-slate-700 font-medium flex justify-between items-center focus:ring-2 focus:ring-indigo-500 outline-none">
                            <span>{selectedTeamName || "-- Select a player --"}</span>
                            <svg className="h-3 w-3 text-slate-500" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                        </button>
                        {openTeamDropdown && Array.isArray(teams) && (
                            <div className="absolute left-0 right-0 bottom-full sm:bottom-auto sm:mt-1 mb-1 sm:mb-0 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1">
                                {teams.length === 0 ? <div className="px-4 py-2 text-xs text-slate-400">No players available</div> : teams.map(t => (
                                    <button key={`custom-team-opt-${t.id}`} type="button" className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 transition-colors" onClick={() => { setSelectedTeamId(t.id); setSelectedTeamName(t.teamName); setOpenTeamDropdown(false); }}>
                                        {t.teamName}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button type="submit" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-6 rounded-lg transition-all shrink-0">
                        Enroll in League
                    </button>
                </form>
            </div>

            {/* Modal para crear nueva liga */}
            <AddLeagueModal
                isOpen={isLeagueModalOpen}
                onClose={() => setIsLeagueModalOpen(false)}
                onLeagueAdded={onLeagueAdded}
            />
        </div>
    );
}