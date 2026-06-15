import React, { useState } from 'react';
import api from '../api/axios';

export default function AddLeagueModal({ isOpen, onClose, onLeagueAdded }) {
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        season: '',
        pointsPerWin: 3,
        pointsPerLoss: 1,
        pointsPerWalkover: 0
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            ...formData,
            pointsPerWin: formData.pointsPerWin || 0,
            pointsPerLoss: formData.pointsPerLoss || 0,
            pointsPerWalkover: formData.pointsPerWalkover || 0
        };

        api.post('/v1/leagues', payload)
            .then(() => {
                alert("League created successfully.");
                onLeagueAdded();
                setFormData({ name: '', season: '', pointsPerWin: 3, pointsPerLoss: 1, pointsPerWalkover: 0 });
                onClose();
            })
            .catch(err => {
                alert(err.response?.data?.message || "An error occurred while creating the league.");
            })
            .finally(() => setSubmitting(false));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-xl w-full max-w-md text-white border border-slate-700">
                <h2 className="text-xl font-bold mb-4">Register New League</h2>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <label className="block text-sm col-span-2">
                        League Name
                        <input
                            className="w-full p-2 mt-1 bg-slate-800 rounded border border-slate-600 focus:border-indigo-500 outline-none"
                            placeholder="e.g., South American 2026"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </label>
                    <label className="block text-sm col-span-2">
                        Season
                        <input
                            className="w-full p-2 mt-1 bg-slate-800 rounded border border-slate-600 focus:border-indigo-500 outline-none"
                            placeholder="e.g., Summer 2026"
                            value={formData.season}
                            onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                            required
                        />
                    </label>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                    <label className="text-xs text-slate-400">
                        Win Pts
                        <input type="number" className="w-full p-2 bg-slate-800 rounded mt-1 border border-slate-700" value={formData.pointsPerWin} onChange={(e) => setFormData({ ...formData, pointsPerWin: e.target.value === '' ? '' : parseInt(e.target.value) })} />
                    </label>
                    <label className="text-xs text-slate-400">
                        Loss Pts
                        <input type="number" className="w-full p-2 bg-slate-800 rounded mt-1 border border-slate-700" value={formData.pointsPerLoss} onChange={(e) => setFormData({ ...formData, pointsPerLoss: e.target.value === '' ? '' : parseInt(e.target.value) })} />
                    </label>
                    <label className="text-xs text-slate-400">
                        WO Pts
                        <input type="number" className="w-full p-2 bg-slate-800 rounded mt-1 border border-slate-700" value={formData.pointsPerWalkover} onChange={(e) => setFormData({ ...formData, pointsPerWalkover: e.target.value === '' ? '' : parseInt(e.target.value) })} />
                    </label>
                </div>

                <div className="flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded">Cancel</button>
                    <button type="submit" disabled={submitting} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded">
                        {submitting ? 'Saving...' : 'Save League'}
                    </button>
                </div>
            </form>
        </div>
    );
}