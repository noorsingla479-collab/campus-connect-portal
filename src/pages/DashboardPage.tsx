import { useEffect, useMemo, useState } from 'react';
import { formatDate, formatDayShort } from '../lib/storage';
import { DAYS } from '../lib/types';
import type { Announcement, CampusEvent, ClassEntry, Profile } from '../lib/types';
import type { CampusPage } from '../lib/pages';
import { PageHeader, LinkArrow } from '../components/Misc';
import { CalendarDays, Bell, CalendarPlus, MapPin, PackageSearch, Sparkles, Trophy, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Props {
  profile: Profile;
  classes: ClassEntry[];
  announcements: Announcement[];
  events: CampusEvent[];
  registrations: string[];
  onNavigate: (p: CampusPage) => void;
}

const QUICK_LINKS: { page: CampusPage; label: string; icon: LucideIcon; tint: string }[] = [
  { page: 'timetable', label: 'Timetable', icon: CalendarDays, tint: 'bg-blue-50 text-blue-600' },
  { page: 'events', label: 'Campus Events', icon: Trophy, tint: 'bg-accent-50 text-accent-600' },
  { page: 'announcements', label: 'Announcements', icon: Bell, tint: 'bg-amber-50 text-amber-600' },
  { page: 'lostfound', label: 'Lost & Found', icon: PackageSearch, tint: 'bg-rose-50 text-rose-600' },
  { page: 'directory', label: 'Directory', icon: MapPin, tint: 'bg-emerald-50 text-emerald-600' },
  { page: 'profile', label: 'Profile', icon: User, tint: 'bg-navy-50 text-navy-600' },
];

function greetingFor(hour: number): string {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function DashboardPage({ profile, classes, announcements, events, registrations, onNavigate }: Props) {
  const [booting, setBooting] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 500);
    return () => clearTimeout(t);
  }, []);

  const today = useMemo(() => new Date(), []);
  const todayName = DAYS[(today.getDay() + 6) % 7] ?? 'Monday';
  const isSaturday = today.getDay() === 6;

  const todayClasses = useMemo(() => {
    const list = classes.filter((c) => c.day === todayName);
    return [...list].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [classes, todayName]);

  const upcomingEvents = useMemo(
    () =>
      [...events]
        .filter((e) => new Date(`${e.date}T00:00:00`) >= new Date(today.toDateString()))
        .sort((a, b) => a.date.localeCompare(b.date)),
    [events, today]
  );
  const latestNotices = useMemo(
    () => [...announcements].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3),
    [announcements]
  );
  const nextClass = todayClasses.find((c) => c.startTime >= formatNow()) ?? todayClasses[0];

  if (booting) {
    return (
      <div className="space-y-6">
        <div className="h-40 rounded-3xl bg-white animate-pulse" />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white animate-pulse" />
          ))}
        </div>
        <div className="h-72 rounded-3xl bg-white animate-pulse" />
      </div>
    );
  }

  return (
    <div className="page-enter">
      <PageHeader title="Dashboard" subtitle={`Your campus at a glance — ${formatDate(toISO(today))}`} />

      {/* Welcome hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 p-6 sm:p-8 text-white shadow-card-hover">
        <div className="absolute -right-10 -top-16 w-64 h-64 rounded-full bg-accent-500/20 blur-2xl" />
        <div className="absolute right-24 bottom-0 w-32 h-32 rounded-full bg-blue-400/10 blur-xl" />
        <div className="relative">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-accent-100">
            <Sparkles size={13} /> {greetingFor(today.getHours())}
          </p>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {profile.name.split(' ')[0]}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-navy-100/90 leading-relaxed">
            {todayClasses.length > 0
              ? `You have ${todayClasses.length} class${todayClasses.length > 1 ? 'es' : ''} today${nextClass ? ` — next up ${nextClass.subject} at ${prettyTime(nextClass.startTime)}` : ''}.`
              : 'No classes scheduled today — a perfect day to explore campus events.'}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('timetable')}
              className="inline-flex items-center gap-2 rounded-xl bg-white text-navy-900 px-4 py-2 text-sm font-bold hover:bg-navy-50 transition-colors active:scale-[0.98]"
            >
              <CalendarPlus size={15} /> View timetable
            </button>
            <button
              onClick={() => onNavigate('events')}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-sm font-bold hover:bg-white/20 transition-colors active:scale-[0.98]"
            >
              Browse events <LinkArrow />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={CalendarPlus} label="Classes today" value={todayClasses.length} hint={todayName} tint="bg-blue-50 text-blue-600" onClick={() => onNavigate('timetable')} />
        <StatCard icon={Trophy} label="Upcoming events" value={upcomingEvents.length} hint="Open for registration" tint="bg-accent-50 text-accent-600" onClick={() => onNavigate('events')} />
        <StatCard icon={Bell} label="New announcements" value={latestNotices.length} hint="Latest notices" tint="bg-amber-50 text-amber-600" onClick={() => onNavigate('announcements')} />
        <StatCard icon={PackageSearch} label="Registered events" value={registrations.length} hint="Your sign-ups" tint="bg-emerald-50 text-emerald-600" onClick={() => onNavigate('events')} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        {/* Today's classes */}
        <section className="xl:col-span-3 bg-white rounded-3xl border border-slate-100 shadow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-bold text-navy-900">Today&apos;s classes</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{todayName}{isSaturday ? ' · weekend schedule' : ''} (sample timetable)</p>
            </div>
            <button onClick={() => onNavigate('timetable')} className="group inline-flex items-center gap-1 text-sm font-bold text-accent-700 hover:text-accent-800">
              Full week <LinkArrow />
            </button>
          </div>
          {todayClasses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 px-6 py-10 text-center">
              <CalendarDays size={26} className="mx-auto text-slate-300" />
              <p className="mt-3 text-sm font-semibold text-navy-800">No classes today</p>
              <p className="mt-1 text-xs text-slate-500">Enjoy the free day, or check the full week for what&apos;s coming.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {todayClasses.slice(0, 4).map((c, i) => (
                <li key={c.id} className="stagger-item flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 hover:border-accent-200 hover:bg-white hover:shadow-card transition-all" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="w-14 shrink-0 text-center rounded-xl bg-navy-800 text-white py-2">
                    <p className="text-sm font-bold leading-none">{c.startTime}</p>
                    <p className="text-[10px] text-navy-200 mt-0.5">{c.endTime}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-navy-900 truncate">{c.subject}</p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{c.code} · {c.room} · {c.faculty}</p>
                  </div>
                  {c === nextClass && (
                    <span className="hidden sm:inline-flex rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">Up next</span>
                  )}
                </li>
              ))}
              {todayClasses.length > 4 && (
                <li>
                  <button onClick={() => onNavigate('timetable')} className="text-xs font-bold text-accent-700 hover:underline">
                    and {todayClasses.length - 4} more — see full timetable
                  </button>
                </li>
              )}
            </ul>
          )}
        </section>

        {/* Upcoming events */}
        <section className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-navy-900">Upcoming events</h3>
            <button onClick={() => onNavigate('events')} className="group inline-flex items-center gap-1 text-sm font-bold text-accent-700 hover:text-accent-800">
              All events <LinkArrow />
            </button>
          </div>
          <ul className="space-y-3">
            {upcomingEvents.slice(0, 4).map((e, i) => (
              <li key={e.id} className="stagger-item" style={{ animationDelay: `${i * 60}ms` }}>
                <button onClick={() => onNavigate('events')} className="w-full text-left flex gap-3 rounded-2xl border border-slate-100 p-3 hover:border-accent-200 hover:shadow-card transition-all">
                  <img src={e.image} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" loading="lazy" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-navy-900 truncate">{e.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{formatDayShort(e.date)} · {e.venue}</p>
                    <span className="mt-1.5 inline-flex rounded-full bg-accent-50 border border-accent-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-700">{e.category}</span>
                  </div>
                </button>
              </li>
            ))}
            {upcomingEvents.length === 0 && (
              <li className="rounded-2xl border border-dashed border-slate-200 px-6 py-10 text-center text-sm text-slate-500">
                No upcoming events right now — check back soon.
              </li>
            )}
          </ul>
        </section>
      </div>

      {/* Quick access + notices */}
      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        <section className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-card p-6">
          <h3 className="font-display font-bold text-navy-900 mb-5">Quick access</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-2">
            {QUICK_LINKS.map(({ page, label, icon: Icon, tint }) => (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                className="group flex flex-col items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-left hover:border-accent-200 hover:bg-white hover:shadow-card transition-all active:scale-[0.98]"
              >
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${tint}`}>
                  <Icon size={18} />
                </span>
                <span className="text-sm font-bold text-navy-900 group-hover:text-accent-700 transition-colors">{label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="xl:col-span-3 bg-white rounded-3xl border border-slate-100 shadow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-navy-900">Latest announcements</h3>
            <button onClick={() => onNavigate('announcements')} className="group inline-flex items-center gap-1 text-sm font-bold text-accent-700 hover:text-accent-800">
              View all <LinkArrow />
            </button>
          </div>
          <ul className="space-y-3">
            {latestNotices.map((n, i) => (
              <li key={n.id} className="stagger-item rounded-2xl border border-slate-100 p-4 hover:border-accent-200 hover:shadow-card transition-all" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="rounded-full bg-navy-50 border border-navy-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy-700">{n.category}</span>
                  {n.priority === 'High' && (
                    <span className="rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-600">{n.priority} priority</span>
                  )}
                  <span className="text-[11px] text-slate-400 font-medium">{formatDayShort(n.date)}</span>
                </div>
                <p className="mt-2 text-sm font-bold text-navy-900">{n.title}</p>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">{n.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tint,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  hint: string;
  tint: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="group flex items-center gap-4 rounded-2xl bg-white border border-slate-100 shadow-card p-5 text-left hover:shadow-card-hover hover:-translate-y-0.5 transition-all active:scale-[0.99]">
      <span className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${tint}`}>
        <Icon size={20} />
      </span>
      <div className="min-w-0">
        <p className="text-2xl font-display font-bold text-navy-900 leading-none">{value}</p>
        <p className="mt-1.5 text-sm font-bold text-navy-800">{label}</p>
        <p className="text-xs text-slate-400 font-medium">{hint}</p>
      </div>
    </button>
  );
}

function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function prettyTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const hour = h ?? 0;
  const mins = m ?? 0;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${String(mins).padStart(2, '0')} ${ampm}`;
}

function formatNow(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}
