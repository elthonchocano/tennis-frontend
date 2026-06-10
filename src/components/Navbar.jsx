import React from 'react';
import LeagueSelector from './LeagueSelector';

export default function Navbar({ isAdmin, onLogin, onLogout, leagues, selectedLeague, onLeagueChange }) {
    return (
        <nav className="bg-slate-950 text-white shadow-md mb-8">
            <div className="max-w-6xl mx-auto px-4 py-3 sm:py-0 sm:h-16 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">

                <div className="flex items-center justify-between w-full sm:w-auto gap-2">
                    <div className="flex items-center gap-2.5">
                        {/* Logo Vectorial - Opción 3 (Integrated) */}
                        <svg className="w-8 h-8 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="50" r="46" fill="#1e1b4b" stroke="#ca8a04" strokeWidth="4"/>
                            <path d="M50 25C44.48 25 40 29.48 40 35C40 40.52 44.48 45 50 45C55.52 45 60 40.52 60 35C60 29.48 55.52 25 50 25Z" fill="white"/>
                            <path d="M43 31C45 33.5 45 36.5 43 39" stroke="#1e1b4b" strokeWidth="1.5" strokeLinecap="round"/>
                            <path d="M57 31C55 33.5 55 36.5 57 39" stroke="#1e1b4b" strokeWidth="1.5" strokeLinecap="round"/>
                            <path d="M36 50C36 62 44 67 50 75C56 67 64 62 64 50V48H36V50Z" fill="#ca8a04"/>
                            <path d="M32 50C32 55.5 34 58 36 58V48H32V50Z" fill="#ca8a04"/>
                            <path d="M68 50C68 55.5 66 58 64 58V48H68V50Z" fill="#ca8a04"/>
                            <path d="M44 75H56V78H44V75Z" fill="#ca8a04"/>
                            <path d="M47 78H53V83H47V78Z" fill="#ca8a04"/>
                            <path d="M22 55C24 67 33 79 45 83.5" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M78 55C76 67 67 79 55 83.5" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        
                        <h1 className="text-base sm:text-lg font-bold tracking-tight whitespace-nowrap">
                            Tennis League Manager
                        </h1>
                    </div>
                    
                    <div className="flex sm:hidden items-center gap-2 shrink-0">
                        {isAdmin ? (
                            <button
                                onClick={onLogout}
                                className="text-xs font-semibold bg-rose-600 hover:bg-rose-700 px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={onLogin}
                                className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-all shadow-sm whitespace-nowrap"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
                    <div className="w-full sm:w-auto flex justify-center">
                        <LeagueSelector
                            leagues={leagues}
                            selectedLeague={selectedLeague}
                            onLeagueChange={onLeagueChange}
                        />
                    </div>

                    <div className="hidden sm:flex items-center justify-center gap-3 shrink-0">
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