import React from 'react';

export default function Navbar({ isAdmin, onLogin, onLogout, leagues, selectedLeague, onLeagueChange }) {
    return (
        <nav className="bg-slate-950 text-white shadow-md mb-8">
            <div className="max-w-6xl mx-auto px-4 py-3 sm:py-0 sm:h-16 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">

                <div className="flex items-center gap-2">
                    <span className="text-xl">🏆</span>
                    <h1 className="text-lg font-bold tracking-tight">Tennis League Manager</h1>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <select
                        className="bg-slate-800 text-sm text-white border border-slate-700 rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500 max-w-[180px] sm:max-w-none"
                        value={selectedLeague}
                        onChange={(e) => onLeagueChange(e.target.value)}
                    >
                        {leagues.map(l => (
                            <option key={`nav-l-${l.id}`} value={l.id}>{l.name} - {l.season}</option>
                        ))}
                    </select>

                    {isAdmin ? (
                        <div className="flex items-center gap-3">
                            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full font-semibold border border-emerald-500/20 whitespace-nowrap">
                                ⚙️ Admin Mode
                            </span>
                            <button
                                onClick={onLogout}
                                className="text-xs font-semibold bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded-lg transition-all"
                            >
                                Logout
                            </button>
                        </div>
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
        </nav>
    );
}