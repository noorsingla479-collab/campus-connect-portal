import { GraduationCap, Menu, Search } from 'lucide-react';
import { useState } from 'react';
import { MobileNav } from './Sidebar';
import type { CampusPage } from '../lib/pages';

export function Topbar({
  page,
  onNavigate,
}: {
  page: CampusPage;
  onNavigate: (p: CampusPage) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');

  const go = (target: CampusPage) => {
    onNavigate(target);
    setQuery('');
  };

  const suggestions: { label: string; page: CampusPage; match: string }[] = [
    { label: 'Timetable', page: 'timetable', match: 'timetable class schedule' },
    { label: 'Campus Events', page: 'events', match: 'events festival workshop' },
    { label: 'Announcements', page: 'announcements', match: 'announcements notices exam' },
    { label: 'Lost & Found', page: 'lostfound', match: 'lost found item' },
    { label: 'Directory', page: 'directory', match: 'directory library cafeteria hours' },
    { label: 'Profile', page: 'profile', match: 'profile account' },
  ];
  const results = query.trim()
    ? suggestions.filter((s) => `${s.match} ${s.label}`.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-lg border-b border-slate-200/70">
        <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-8 h-16">
          <button
            className="lg:hidden p-2 -ml-2 rounded-xl text-navy-800 hover:bg-slate-100"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="lg:hidden flex items-center gap-2 text-navy-900">
            <span className="w-8 h-8 rounded-lg bg-navy-800 text-white flex items-center justify-center">
              <GraduationCap size={16} />
            </span>
            <span className="font-display font-bold">CampusConnect</span>
          </div>

          <div className="relative hidden md:block w-full max-w-md ml-auto lg:ml-0">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the campus..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:bg-white focus:border-accent-400 focus:ring-4 focus:ring-accent-200/40"
            />
            {results.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 page-enter">
                {results.map((r) => (
                  <button
                    key={r.page}
                    onClick={() => go(r.page)}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-navy-800 hover:bg-navy-50 transition-colors"
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}
            {query.trim() && results.length === 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 px-4 text-sm text-slate-500 z-50">
                No matches. Try "events" or "library".
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden lg:inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-700">
              Sample data — demo build
            </span>
            <button
              onClick={() => onNavigate('profile')}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-500 to-accent-700 text-white text-sm font-bold flex items-center justify-center shadow-card hover:shadow-card-hover transition-shadow"
              aria-label="Open profile"
            >
              AS
            </button>
          </div>
        </div>
      </header>
      <MobileNav page={page} onNavigate={onNavigate} open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
