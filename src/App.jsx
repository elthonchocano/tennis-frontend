import React, { useState, useEffect } from 'react';
import api from './api/axios';
import Navbar from './components/Navbar';
import AdminPanel from './components/AdminPanel';
import MatchModal from './components/MatchModal';
import ResultModal from './components/ResultModal';
import TeamMatchesPanel from './components/TeamMatchesPanel';
import LeaderboardTable from './components/LeaderboardTable';
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
          <div className="lg:col-span-2">
            <LeaderboardTable 
              leaderboard={leaderboard}
              loading={loading}
              onViewMatches={fetchTeamMatches}
            />
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