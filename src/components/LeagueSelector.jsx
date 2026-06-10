import React, { useState, useRef, useEffect } from 'react';

export default function LeagueSelector({ leagues, selectedLeague, onLeagueChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentLeague = leagues.find(l => String(l.id) === String(selectedLeague));

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left w-full max-w-[240px] sm:max-w-xs" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl p-2.5 flex items-center justify-between outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-left"
            >
                <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-xs font-bold text-slate-200 truncate">
                        {currentLeague ? currentLeague.name : 'Select League'}
                    </span>
                    <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider mt-0.5 truncate">
                        {currentLeague ? currentLeague.season : 'No Active League'}
                    </span>
                </div>
                <span className={`text-slate-400 text-xs transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-full min-w-[250px] rounded-xl bg-slate-900 border border-slate-700 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-100">
                    <div className="max-h-60 overflow-y-auto p-1.5 space-y-1">
                        {leagues.map(l => (
                            <button
                                key={`custom-l-${l.id}`}
                                type="button"
                                onClick={() => {
                                    onLeagueChange(l.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left p-2.5 rounded-lg transition-colors flex flex-col ${String(l.id) === String(selectedLeague) ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                            >
                                <span className="text-xs font-bold truncate w-full">{l.name}</span>
                                <span className={`text-[10px] mt-0.5 ${String(l.id) === String(selectedLeague) ? 'text-indigo-200' : 'text-slate-400'}`}>
                                    {l.season}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}