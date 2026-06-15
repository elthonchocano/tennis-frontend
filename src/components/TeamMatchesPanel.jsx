import React, { forwardRef } from 'react';

const TeamMatchesPanel = forwardRef(({ selectedTeam, matches, loadingMatches, onOpenResultModal }, ref) => {
  return (
    <div ref={ref} className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-fit">
      <div className="p-4 bg-indigo-600 text-white font-bold">
        {selectedTeam ? `Matches: ${selectedTeam.name}` : 'Select a team'}
      </div>

      <div className="p-4 min-h-[300px]">
        {loadingMatches ? (
          <div className="text-center py-10 animate-pulse text-slate-400">Fetching API...</div>
        ) : matches.length > 0 ? (
          <div className="space-y-4">
            {matches.map((m, idx) => {
              let homeSetsWon = 0;
              let awaySetsWon = 0;

              if (m.walkover) {
                homeSetsWon = (m.winner && m.winner.id === m.team1.id) ? 2 : 0;
                awaySetsWon = (m.winner && m.winner.id === m.team2.id) ? 2 : 0;
              } else if (m.sets && m.sets.length > 0) {
                m.sets.forEach(set => {
                  if (set.team1Games > set.team2Games) {
                    homeSetsWon++;
                  } else if (set.team2Games > set.team1Games) {
                    awaySetsWon++;
                  } else if (set.team1Games === 6 && set.team2Games === 6) {
                    const p1 = parseInt(set.team1TieBreakPoints || 0, 10);
                    const p2 = parseInt(set.team2TieBreakPoints || 0, 10);
                    if (p1 > p2) homeSetsWon++;
                    else if (p2 > p1) awaySetsWon++;
                  }
                });
              }

              const isTeam1Winner = (m.winner && m.winner.id === m.team1.id);
              const isTeam2Winner = (m.winner && m.winner.id === m.team2.id);
              const matchKey = m.id || `match-${idx}`;

              return (
                <div key={matchKey} className="p-4 border rounded-xl bg-white shadow-xs border-slate-200">
                  <div className="flex justify-between items-center text-[11px] mb-3 px-0.5">
                    <span className="font-bold text-slate-900">
                      {m.matchDate ? new Date(m.matchDate.includes('T') ? m.matchDate : `${m.matchDate}T00:00:00`).toLocaleDateString() : 'N/D'}
                    </span>
                    <div className="flex items-center gap-2">
                      {m.walkover && (
                        <span className="text-amber-700 font-bold text-[9px] uppercase tracking-wider bg-amber-100 px-1.5 py-0.5 rounded">
                          W.O.
                        </span>
                      )}
                      <span className="text-indigo-600 font-semibold text-[10px] uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md">
                        {m.matchType || 'SHORT'}
                      </span>
                      {onOpenResultModal && (
                        <button
                          onClick={() => onOpenResultModal(m)}
                          title="Edit Score"
                          className="text-xs text-slate-400 hover:text-indigo-600 p-0.5 rounded transition-all"
                        >
                          📝
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg overflow-hidden border border-slate-100">
                    <div className="grid grid-cols-12 bg-slate-900 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white border-b border-slate-200">
                      <div className="col-span-5"></div>
                      <div className="col-span-7 flex justify-end gap-3 sm:gap-5 text-center">
                        {m.sets && m.sets.length > 0 && !m.walkover ? (
                          [...m.sets].sort((a, b) => a.setNumber - b.setNumber)
                            .map((set) => <div key={`head-${matchKey}-${set.setNumber}`} className="w-8">S{set.setNumber}</div>)
                        ) : (
                          <div className="w-8">RES</div>
                        )}
                        <div className="w-7 bg-slate-900 font-extrabold border-l border-slate-200 pl-1.5">Tot</div>
                      </div>
                    </div>

                    <div className="p-3 space-y-2.5 font-sans text-slate-700">
                      <div className="grid grid-cols-12 items-center">
                        <div className="col-span-5 flex items-center gap-1.5 min-w-0">
                          <span className={`text-xs truncate ${isTeam1Winner ? 'text-slate-900 font-bold' : 'text-slate-500 font-normal'}`}>
                            {m.team1.teamName}
                          </span>
                          {isTeam1Winner && <span className="text-[10px] shrink-0">👑</span>}
                        </div>
                        <div className="col-span-7 flex justify-end gap-3 sm:gap-5 text-center font-mono text-sm">
                          {m.sets && m.sets.length > 0 && !m.walkover ? (
                            [...m.sets].sort((a, b) => a.setNumber - b.setNumber)
                              .map((set) => {
                                const hasTiebreak = set.team1Games === 6 && set.team2Games === 6 && set.team1TieBreakPoints > 0;
                                const isWinner = (set.team1Games > set.team2Games) || (set.team1Games === 6 && set.team2Games === 6 && set.team1TieBreakPoints > set.team2TieBreakPoints);
                                return (
                                  <div key={`s1-${matchKey}-${set.setNumber}`} className="w-8 flex items-center justify-center gap-0.5 relative">
                                    <span className={isWinner ? "text-slate-900 font-bold" : "text-slate-400 font-medium"}>
                                      {set.team1Games}
                                    </span>
                                    {hasTiebreak && <span className="text-[9px] text-amber-600 font-bold align-super">({set.team1TieBreakPoints})</span>}
                                  </div>
                                );
                              })
                          ) : (
                            <div className="w-8 text-slate-300">-</div>
                          )}
                          <div className="w-7 text-indigo-600 font-extrabold border-l border-slate-200 pl-1.5 text-center bg-indigo-50/50 rounded-sm">
                            {homeSetsWon}
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-200/60 my-0.5"></div>

                      <div className="grid grid-cols-12 items-center">
                        <div className="col-span-5 flex items-center gap-1.5 min-w-0">
                          <span className={`text-xs truncate ${isTeam2Winner ? 'text-slate-900 font-bold' : 'text-slate-500 font-normal'}`}>
                            {m.team2.teamName}
                          </span>
                          {isTeam2Winner && <span className="text-[10px] shrink-0">👑</span>}
                        </div>
                        <div className="col-span-7 flex justify-end gap-3 sm:gap-5 text-center font-mono text-sm">
                          {m.sets && m.sets.length > 0 && !m.walkover ? (
                            [...m.sets].sort((a, b) => a.setNumber - b.setNumber)
                              .map((set) => {
                                const hasTiebreak = set.team1Games === 6 && set.team2Games === 6 && set.team2TieBreakPoints > 0;
                                const isWinner = (set.team2Games > set.team1Games) || (set.team2Games === 6 && set.team1Games === 6 && set.team2TieBreakPoints > set.team1TieBreakPoints);
                                return (
                                  <div key={`s2-${matchKey}-${set.setNumber}`} className="w-8 flex items-center justify-center gap-0.5 relative">
                                    <span className={isWinner ? "text-slate-900 font-bold" : "text-slate-400 font-medium"}>
                                      {set.team2Games}
                                    </span>
                                    {hasTiebreak && <span className="text-[9px] text-amber-600 font-bold align-super">({set.team2TieBreakPoints})</span>}
                                  </div>
                                );
                              })
                          ) : (
                            <div className="w-8 text-slate-300">-</div>
                          )}
                          <div className="w-7 text-indigo-600 font-extrabold border-l border-slate-200 pl-1.5 text-center bg-indigo-50/50 rounded-sm">
                            {awaySetsWon}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400 italic text-sm">
            {selectedTeam ? 'No matches recorded.' : 'Click "View Matches" on the leaderboard.'}
          </div>
        )}
      </div>
    </div>
  );
});

export default TeamMatchesPanel;