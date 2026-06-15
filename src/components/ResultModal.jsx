import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function ResultModal({ isOpen, onClose, activeMatch, onResultsSaved }) {
  const [sets, setSets] = useState([]);
  const [walkover, setWalkover] = useState(false);
  const [walkoverWinnerId, setWalkoverWinnerId] = useState('');
  const [walkoverWinnerName, setWalkoverWinnerName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [openWinner, setOpenWinner] = useState(false);

  useEffect(() => {
    if (isOpen && activeMatch) {
      setWalkover(activeMatch.walkover || false);
      setWalkoverWinnerId(activeMatch.walkoverWinnerId || '');

      const winner = activeMatch.walkoverWinnerId === activeMatch.team1.id
        ? activeMatch.team1.teamName
        : activeMatch.walkoverWinnerId === activeMatch.team2.id
          ? activeMatch.team2.teamName
          : '';
      setWalkoverWinnerName(winner);

      const maxSets = activeMatch.matchType === 'LONG' ? 5 : 3;
      const initialSets = [];

      for (let i = 1; i <= maxSets; i++) {
        const existingSet = activeMatch.sets?.find(s => s.setNumber === i);
        initialSets.push({
          setNumber: i,
          team1Games: existingSet ? String(existingSet.team1Games) : '',
          team2Games: existingSet ? String(existingSet.team2Games) : '',
          team1TieBreakPoints: existingSet?.team1TieBreakPoints ? String(existingSet.team1TieBreakPoints) : '',
          team2TieBreakPoints: existingSet?.team2TieBreakPoints ? String(existingSet.team2TieBreakPoints) : ''
        });
      }
      setSets(initialSets);
    }
  }, [isOpen, activeMatch]);

  if (!isOpen || !activeMatch) return null;

  const handleGameChange = (index, team, value) => {
    const updatedSets = [...sets];
    updatedSets[index][team] = value;

    const t1 = parseInt(updatedSets[index].team1Games, 10);
    const t2 = parseInt(updatedSets[index].team2Games, 10);
    if (t1 !== 6 || t2 !== 6) {
      updatedSets[index].team1TieBreakPoints = '';
      updatedSets[index].team2TieBreakPoints = '';
    }
    setSets(updatedSets);
  };

  const handleTiebreakChange = (index, team, value) => {
    const updatedSets = [...sets];
    updatedSets[index][team] = value;
    setSets(updatedSets);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    let payload = {};

    if (walkover) {
      if (!walkoverWinnerId) {
        alert("Please select the winner by Walkover.");
        setSubmitting(false);
        return;
      }
      payload = {
        walkover: true,
        walkoverWinnerId: Number(walkoverWinnerId),
        sets: []
      };
    } else {
      try {
        const validSets = sets
          .filter(s => s.team1Games !== '' && s.team2Games !== '')
          .map(s => {
            const t1Games = parseInt(s.team1Games, 10);
            const t2Games = parseInt(s.team2Games, 10);

            if (t1Games === 6 && t2Games === 6 && (!s.team1TieBreakPoints || !s.team2TieBreakPoints)) {
              throw new Error(`Missing Tie-break points in Set ${s.setNumber}`);
            }

            return {
              setNumber: s.setNumber,
              team1Games: t1Games,
              team2Games: t2Games,
              team1TieBreakPoints: s.team1TieBreakPoints !== '' ? parseInt(s.team1TieBreakPoints, 10) : null,
              team2TieBreakPoints: s.team2TieBreakPoints !== '' ? parseInt(s.team2TieBreakPoints, 10) : null
            };
          });

        if (validSets.length === 0) {
          alert("You must enter the score for at least one set.");
          setSubmitting(false);
          return;
        }

        payload = {
          sets: validSets,
          walkover: false,
          walkoverWinnerId: null
        };
      } catch (error) {
        alert(error.message);
        setSubmitting(false);
        return;
      }
    }

    api.patch(`/v1/matches/${activeMatch.id}/result`, payload)
      .then(() => {
        alert("Score saved successfully.");
        onResultsSaved();
        onClose();
      })
      .catch(err => {
        alert(err.response?.data?.message || "Error updating the match score.");
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">

        <div className="p-4 bg-slate-900 text-white font-bold flex justify-between items-center shrink-0">
          <div>
            <span className="text-xs uppercase text-indigo-400 block tracking-wider font-semibold">Record Score</span>
            <span className="text-sm truncate block max-w-[260px] sm:max-w-[300px]">{activeMatch.team1.teamName} vs {activeMatch.team2.teamName}</span>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border">
            <input
              type="checkbox" id="wo-check" className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              checked={walkover}
              onChange={(e) => setWalkover(e.target.checked)}
            />
            <label htmlFor="wo-check" className="text-xs font-bold text-slate-700 uppercase cursor-pointer select-none">
              Was it a Walkover (W.O.) Victory?
            </label>
          </div>

          {walkover ? (
            <div className="relative animate-in fade-in duration-150">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Winner</label>
              <button
                type="button"
                onClick={() => setOpenWinner(!openWinner)}
                className="w-full border rounded-lg p-2.5 bg-slate-50 text-sm text-left outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium flex justify-between items-center"
              >
                <span>{walkoverWinnerName || '-- Choose the winner --'}</span>
                <svg className="h-4 w-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
              </button>

              {openWinner && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1">
                  {[activeMatch.team1, activeMatch.team2].map(team => (
                    <button
                      key={team.id}
                      type="button"
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                      onClick={() => {
                        setWalkoverWinnerId(team.id);
                        setWalkoverWinnerName(team.teamName);
                        setOpenWinner(false);
                      }}
                    >
                      {team.teamName}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 pr-1 animate-in fade-in duration-150">
              {sets.map((set, idx) => {
                const isTiebreakActive = parseInt(set.team1Games, 10) === 6 && parseInt(set.team2Games, 10) === 6;

                return (
                  <div key={`modal-set-${set.setNumber}`} className="p-3 border rounded-xl bg-slate-50/50 space-y-2">
                    <div className="text-xs font-extrabold text-indigo-600 uppercase tracking-wide">
                      Set {set.setNumber}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase truncate mb-1">{activeMatch.team1.teamName}</label>
                        <input
                          type="number" min="0" max="7" placeholder="Games"
                          className="w-full border rounded-lg p-2 text-center text-sm font-semibold bg-white outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                          value={set.team1Games}
                          onChange={(e) => handleGameChange(idx, 'team1Games', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase truncate mb-1">{activeMatch.team2.teamName}</label>
                        <input
                          type="number" min="0" max="7" placeholder="Games"
                          className="w-full border rounded-lg p-2 text-center text-sm font-semibold bg-white outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                          value={set.team2Games}
                          onChange={(e) => handleGameChange(idx, 'team2Games', e.target.value)}
                        />
                      </div>
                    </div>

                    {isTiebreakActive && (
                      <div className="pt-2 border-t border-dashed border-slate-200 grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
                        <div>
                          <label className="block text-[9px] font-extrabold text-amber-600 uppercase mb-0.5">Tiebreak Pts</label>
                          <input
                            type="number" min="0" placeholder="e.g. 7" required
                            className="w-full border border-amber-200 rounded-lg p-1.5 text-center text-xs font-mono bg-amber-50/30 text-amber-900 outline-none focus:ring-2 focus:ring-amber-500"
                            value={set.team1TieBreakPoints}
                            onChange={(e) => handleTiebreakChange(idx, 'team1TieBreakPoints', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-extrabold text-amber-600 uppercase mb-0.5">Tiebreak Pts</label>
                          <input
                            type="number" min="0" placeholder="e.g. 5" required
                            className="w-full border border-amber-200 rounded-lg p-1.5 text-center text-xs font-mono bg-amber-50/30 text-amber-900 outline-none focus:ring-2 focus:ring-amber-500"
                            value={set.team2TieBreakPoints}
                            onChange={(e) => handleTiebreakChange(idx, 'team2TieBreakPoints', e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t shrink-0">
            <button
              type="button" onClick={onClose}
              className="px-4 py-2 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={submitting}
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 min-w-[110px]"
            >
              {submitting ? 'Saving...' : 'Save Score'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}