import React, { useState, useEffect } from 'react';
import api from './api/axios';
import Navbar from './components/Navbar';
import AdminPanel from './components/AdminPanel';
import MatchModal from './components/MatchModal';
import ResultModal from './components/ResultModal';
import TeamMatchesPanel from './components/TeamMatchesPanel';
import LeaderboardTable from './components/LeaderboardTable';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';

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

  const [isPanelVisible, setIsPanelVisible] = useState(false);

  const fetchLeagues = () => {
    api.get('/v1/leagues?page=0&size=50')
      .then(res => {
        setLeagues(Array.isArray(res.data) ? res.data : []);
        if (res.data && res.data.length > 0) {
          setSelectedLeague(res.data[0].id);
        }
      })
      .catch(err => console.error("Error al cargar ligas", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeagues();
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
    setSelectedTeam(null);
    setMatches([]);
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <Navbar
        isAdmin={isAuthenticated}
        onLogin={redirectToLogin}
        onLogout={logout}
        leagues={leagues}
        selectedLeague={selectedLeague}
        onLeagueChange={setSelectedLeague}
      />

      <div className="max-w-6xl mx-auto px-4 pb-12 flex-grow w-full">

        {isAuthenticated && (
          <div className="mb-6">
            <button
              onClick={() => setIsPanelVisible(!isPanelVisible)}
              className="text-[10px] uppercase tracking-widest font-bold bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-all shadow-sm"
            >
              {isPanelVisible ? "▲ Hide Admin Panel" : "▼ Show Admin Panel"}
            </button>
          </div>
        )}

        {isAuthenticated && isPanelVisible && (
          <AdminPanel
            selectedLeague={selectedLeague}
            onOpenMatchModal={() => setIsMatchModalOpen(true)}
            onParticipantAdded={handleRefreshData}
            onLeagueAdded={fetchLeagues}
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

      <Footer />

      <ScrollToTop />

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