import React from 'react';
import LeagueSelector from './LeagueSelector';

export default function Navbar({ isAdmin, onLogin, onLogout, leagues, selectedLeague, onLeagueChange }) {
    return (
        <nav className="bg-slate-950 text-white shadow-md mb-8">
            <div className="max-w-6xl mx-auto px-4 py-4 sm:py-0 sm:h-16 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">

                <div className="flex items-center gap-2">
                    <span className="text-xl">🏆</span>
                    <h1 className="text-lg font-bold tracking-tight whitespace-nowrap">Tennis League Manager</h1>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
                    <div className="w-full sm:w-auto flex justify-center">
                        <LeagueSelector
                            leagues={leagues}
                            selectedLeague={selectedLeague}
                            onLeagueChange={onLeagueChange}
                        />
                    </div>

                    <div className="flex items-center justify-center gap-3 shrink-0">
                        {isAdmin ? (
                            <>
                                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1.5 rounded-xl font-semibold border border-emerald-500/20 whitespace-nowrap">
                                    ⚙️ Admin Mode
                                </span>
                                <button
                                    onClick={onLogout}
                                    className="text-xs font-semibold bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onLogin}
                                className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-lg transition-all shadow-sm whitespace-nowrap"
                            >
                                🔐 Admin Login
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </nav>
    );
}