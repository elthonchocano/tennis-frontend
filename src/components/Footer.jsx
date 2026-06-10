import React from 'react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-slate-950 border-t border-slate-900 text-slate-500 text-xs py-6 mt-auto">
            <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className="font-semibold text-slate-400">
                        © {currentYear} Tennis League Manager.
                    </span>
                    <span className="hidden sm:inline text-slate-700">|</span>
                    <span>All rights reserved.</span>
                </div>

                <div className="flex items-center gap-3 justify-center">
                    <span className="bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800/60 font-mono text-[11px] text-slate-400">
                        {import.meta.env.VITE_APP_VERSION || 'v1.0.0'}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span>
                        Powered by{' '}
                        <span className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
                            Elthon Chocano
                        </span>
                    </span>
                </div>

            </div>
        </footer>
    );
}