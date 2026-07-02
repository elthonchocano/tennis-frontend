import React from 'react';

export default function LeaderboardTable({ leaderboard, loading, onViewMatches }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white font-bold flex justify-between items-center">
                <span>Current Standings</span>
                {loading && <span className="text-xs text-slate-400 animate-pulse">Syncing...</span>}
            </div>

            <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            <th className="py-3 px-4 text-center w-12">Pos</th>
                            <th className="py-3 px-4">Player</th>
                            <th className="py-3 px-4 text-center w-40 hidden sm:table-cell">W / L</th>
                            <th className="py-3 px-4 text-center w-20">Points</th>
                            <th className="py-3 px-4 text-center w-24 hidden sm:table-cell">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                        {leaderboard.map((row, i) => (
                            <tr key={row.team.id} className="hover:bg-slate-50/50 transition-colors">

                                <td className="py-4 px-4 text-center font-mono text-slate-400">
                                    {i + 1}
                                </td>

                                <td className="py-4 px-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                                        <span className="font-semibold text-slate-900 truncate">
                                            {row.team.teamName}
                                        </span>

                                        <div className="flex sm:hidden items-center justify-between mt-1 w-full gap-2">
                                            {/* Contenedor de estadísticas compacto */}
                                            <div className="flex flex-col text-[10px] font-mono leading-tight">
                                                <div>
                                                    <span className="text-emerald-600 font-bold">{row.matchesWon}W</span>
                                                    <span className="text-slate-300 mx-0.5">-</span>
                                                    <span className="text-rose-600 font-bold">{row.matchesLost}L</span>
                                                </div>
                                                <div className="text-slate-500">
                                                    Sets: <span className="text-emerald-600">{row.setsWon}</span>/<span className="text-rose-600">{row.setsLost}</span>
                                                </div>
                                            </div>

                                            {/* Botón a la derecha, manteniendo la fila delgada */}
                                            <button
                                                onClick={() => onViewMatches(row.team.id, row.team.teamName)}
                                                className="flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full shrink-0"
                                            >
                                                🏸
                                            </button>
                                        </div>
                                    </div>
                                </td>

                                <td className="py-4 px-4 text-center font-mono text-xs hidden sm:table-cell">
                                    <div className="flex flex-col gap-0.5">
                                        <div>
                                            <span className="text-emerald-600">{row.matchesWon}W</span> - <span className="text-rose-600">{row.matchesLost}L</span>
                                        </div>
                                        <div className="text-[10px] text-slate-400">
                                            Sets: <span className="text-emerald-600">{row.setsWon}</span> - <span className="text-rose-600">{row.setsLost}</span>
                                        </div>
                                    </div>
                                </td>

                                <td className="py-4 px-4 text-center font-bold text-indigo-600 font-mono">
                                    {row.points}
                                </td>

                                <td className="py-4 px-4 text-center hidden sm:table-cell">
                                    <button
                                        onClick={() => onViewMatches(row.team.id, row.team.teamName)}
                                        className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-full hover:bg-indigo-700 transition-all shadow-sm whitespace-nowrap"
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
    );
}