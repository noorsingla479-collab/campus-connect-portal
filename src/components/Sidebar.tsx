import { GraduationCap, LayoutDashboard, Bell, CalendarDays, MapPin, PackageSearch, User, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CampusPage } from '../lib/pages';

const NAV: { id: CampusPage; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'timetable', label: 'Timetable', icon: CalendarDays },
  { id: 'events', label: 'Campus Events', icon: GraduationCap },
  { id: 'announcements', label: 'Announcements', icon: Bell },
  { id: 'lostfound', label: 'Lost & Found', icon: PackageSearch },
  { id: 'directory', label: 'Directory', icon: MapPin },
  { id: 'profile', label: 'Profile', icon: User },
];

export function Sidebar({
  page,
  onNavigate,
  className = '',
}: {
  page: CampusPage;
  onNavigate: (p: CampusPage) => void;
  className?: string;
}) {
  return (
    <nav className={`flex flex-col h-full ${className}`} aria-label="Main navigation">
      <div className="flex items-center gap-3 px-5 py-6">
        <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-700 to-navy-950 text-white flex items-center justify-center shadow-card">
          <GraduationCap size={20} />
        </span>
        <div>
          <p className="font-display font-bold text-navy-900 leading-tight">CampusConnect</p>
          <p className="text-[11px] text-slate-400 font-medium">Your campus, one click away</p>
        </div>
      </div>
      <div className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-thin">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = page === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              aria-current={active ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? 'bg-navy-800 text-white shadow-card'
                  : 'text-slate-500 hover:bg-navy-50 hover:text-navy-800'
              }`}
            >
              <Icon size={17} className={active ? 'text-accent-300' : ''} />
              {label}
            </button>
          );
        })}
      </div>
      <div className="p-4">
        <div className="rounded-2xl bg-gradient-to-br from-accent-600 to-accent-800 p-4 text-white relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10" />
          <p className="text-xs font-semibold text-accent-100">Sample notice</p>
          <p className="text-sm font-bold mt-1 leading-snug">TechnoVerse fest registration closes Nov 25</p>
          <button
            onClick={() => onNavigate('announcements')}
            className="mt-3 text-xs font-bold bg-white/15 hover:bg-white/25 rounded-lg px-3 py-1.5 transition-colors"
          >
            Read announcement
          </button>
        </div>
      </div>
    </nav>
  );
}

export function MobileNav({
  page,
  onNavigate,
  open,
  onClose,
}: {
  page: CampusPage;
  onNavigate: (p: CampusPage) => void;
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm" onClick={onClose} aria-label="Close menu" />
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl page-enter">
        <button
          onClick={onClose}
          className="absolute right-3 top-4 p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-navy-800"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
        <Sidebar page={page} onNavigate={(p) => { onNavigate(p); onClose(); }} />
      </div>
    </div>
  );
}
