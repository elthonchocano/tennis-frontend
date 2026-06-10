import React, { useState, useEffect } from 'react';
import api from './api/axios';
import Navbar from './components/Navbar';
import AdminPanel from './components/AdminPanel';
import MatchModal from './components/MatchModal';
import ResultModal from './components/ResultModal';
import TeamMatchesPanel from './components/TeamMatchesPanel';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated, redirectToLogin, logout } = useAuth();
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [activeMatch, setActiveMatch] = useState(null);

  useEffect(() => {
    api.get('/v1/leagues?page=0&size=50')
      .then(res => {
        setLeagues(res.data);
        if (res.data.length > 0) setSelectedLeague(res.data[0].id);
      })
      .catch(() => { });
  }, []);

  const fetchLeaderboard = (leagueId) => {
    if (!leagueId) return;
    setLoading(true);
    api.get(`/v1/leagues/${leagueId}/leaderboard?page=0&size=50`)
      .then(res => {
        setLeaderboard(res.data.content || res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeaderboard(selectedLeague);
  }, [selectedLeague]);

  const fetchTeamMatches = (teamId, teamName) => {
    setSelectedTeam({ id: teamId, name: teamName });
    setLoadingMatches(true);
    api.get(`/v1/leagues/${selectedLeague}/teams/${teamId}/matches?page=0&size=50`)
      .then(res => {
        setMatches(res.data.content || res.data);
        setLoadingMatches(false);
      })
      .catch(() => {
        setLoadingMatches(false);
      });
  };

  const handleRefreshData = () => {
    fetchLeaderboard(selectedLeague);
    if (selectedTeam) {
      fetchTeamMatches(selectedTeam.id, selectedTeam.name);
    }
  };

  const handleOpenResultModal = (match) => {
    setActiveMatch(match);
    setIsResultModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar
        isAdmin={isAuthenticated}
        onLogin={redirectToLogin}
        onLogout={logout}
        leagues={leagues}
        selectedLeague={selectedLeague}
        onLeagueChange={setSelectedLeague}
      />

      <div className="max-w-6xl mx-auto px-4 pb-12">
        {isAuthenticated && (
          <AdminPanel
            selectedLeague={selectedLeague}
            onOpenMatchModal={() => setIsMatchModalOpen(true)}
            onParticipantAdded={handleRefreshData}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white font-bold flex justify-between items-center">
              <span>Current Standings</span>
              {loading && <span className="text-xs text-slate-400 animate-pulse">Syncing...</span>}
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead className="bg-slate-100 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="p-4 text-center">Pos</th>
                    <th className="p-4">Player</th>
                    <th className="p-4 text-center">W / L</th>
                    <th className="p-4 text-center">Points</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leaderboard.map((row, i) => (
                    <tr key={row.team.id} className="hover:bg-indigo-50 transition-colors">
                      <td className="p-4 text-center font-mono text-slate-400">{i + 1}</td>
                      <td className="p-4 font-semibold">{row.team.teamName}</td>
                      <td className="p-4 text-center text-xs">
                        <span className="text-green-600">{row.matchesWon}W</span> - <span className="text-red-600">{row.matchesLost}L</span>
                      </td>
                      <td className="p-4 text-center font-bold text-indigo-600">{row.points}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => fetchTeamMatches(row.team.id, row.team.teamName)}
                          className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full hover:bg-indigo-700 transition-all shadow-sm whitespace-nowrap"
                        >
                          View Matches
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <TeamMatchesPanel
            selectedTeam={selectedTeam}
            matches={matches}
            loadingMatches={loadingMatches}
            onOpenResultModal={isAuthenticated ? handleOpenResultModal : null}
          />
        </div>
      </div>

      <MatchModal
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
        selectedLeague={selectedLeague}
        onMatchCreated={handleRefreshData}
      />

      <ResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        activeMatch={activeMatch}
        onResultsSaved={handleRefreshData}
      />
    </div>
  );
}

export default App;