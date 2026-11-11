import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Clock, MapPin, Search, Ticket, TicketCheck, Users } from 'lucide-react';
import type { CampusEvent, EventCategory } from '../lib/types';
import { formatDate, formatDayShort } from '../lib/storage';
import { PageHeader, EmptyState, SkeletonGrid, SampleBadge } from '../components/Misc';
import { Modal } from '../components/Modal';
import { Button } from '../components/Form';

interface Props {
  events: CampusEvent[];
  registrations: string[];
  toggleRegistration: (id: string) => void;
}

const CATEGORIES: (EventCategory | 'All')[] = ['All', 'Workshop', 'Competition', 'Cultural', 'Society'];

const CATEGORY_TINTS: Record<EventCategory, string> = {
  Workshop: 'bg-blue-50 border-blue-200 text-blue-700',
  Competition: 'bg-amber-50 border-amber-200 text-amber-700',
  Cultural: 'bg-accent-50 border-accent-200 text-accent-700',
  Society: 'bg-emerald-50 border-emerald-200 text-emerald-700',
};

export function EventsPage({ events, registrations, toggleRegistration }: Props) {
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<(EventCategory | 'All')>('All');
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'upcoming' | 'registered'>('upcoming');
  const [confirmEvent, setConfirmEvent] = useState<CampusEvent | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const todayISO = new Date().toISOString().slice(0, 10);
  const filtered = useMemo(() => {
    let list = events
      .filter((e) => e.date >= todayISO)
      .filter((e) => (category === 'All' ? true : e.category === category))
      .filter((e) =>
        query.trim()
          ? `${e.title} ${e.description} ${e.venue} ${e.organizer}`.toLowerCase().includes(query.trim().toLowerCase())
          : true
      );
    list = [...list].sort((a, b) => a.date.localeCompare(b.date));
    if (tab === 'registered') list = list.filter((e) => registrations.includes(e.id));
    return list;
  }, [events, category, query, tab, registrations, todayISO]);

  const registeredCount = events.filter((e) => registrations.includes(e.id) && e.date >= todayISO).length;

  return (
    <div className="page-enter">
      <PageHeader
        title="Campus Events"
        subtitle="Workshops, competitions, cultural nights and society activities — all open to students. Registration keeps your spot and is stored on this device."
      />

      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center">
        <div className="inline-flex rounded-2xl bg-white border border-slate-200 p-1 shadow-card self-start">
          {(['upcoming', 'registered'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                tab === t ? 'bg-navy-800 text-white shadow-sm' : 'text-slate-500 hover:text-navy-800'
              }`}
            >
              {t === 'upcoming' ? 'Upcoming' : `My registrations${registeredCount ? ` (${registeredCount})` : ''}`}
            </button>
          ))}
        </div>
        <div className="relative flex-1 lg:max-w-xs lg:ml-auto">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, venues, clubs..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-card outline-none transition-all focus:border-accent-400 focus:ring-4 focus:ring-accent-200/40"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2 mb-6">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-bold transition-all ${
              category === c
                ? 'border-navy-800 bg-navy-800 text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-500 hover:border-accent-300 hover:text-accent-700'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <SkeletonGrid count={6} />
      ) : filtered.length === 0 ? (
        tab === 'registered' ? (
          <EmptyState
            icon={<Ticket size={26} />}
            title="No registrations yet"
            message="Browse the upcoming events and hit Register on the ones you like — they will show up here."
            action={<Button onClick={() => setTab('upcoming')}>Browse upcoming events</Button>}
          />
        ) : (
          <EmptyState
            title="No events match your filters"
            message="Try a different category or clear the search to see everything that's coming up."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setCategory('All');
                  setQuery('');
                }}
              >
                Clear filters
              </Button>
            }
          />
        )
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((e, i) => {
            const registered = registrations.includes(e.id);
            return (
              <article
                key={e.id}
                className="stagger-item group flex flex-col rounded-3xl bg-white border border-slate-100 shadow-card overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all"
                style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
              >
                <div className="relative">
                  <img src={e.image} alt={e.title} loading="lazy" className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
                  <span className={`absolute top-3 left-3 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide backdrop-blur ${CATEGORY_TINTS[e.category]}`}>
                    {e.category}
                  </span>
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                    <span className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur border border-white/25 flex flex-col items-center justify-center leading-none">
                      <span className="text-sm font-display font-bold">{new Date(`${e.date}T00:00:00`).getDate()}</span>
                      <span className="text-[9px] font-bold uppercase text-white/80">
                        {new Date(`${e.date}T00:00:00`).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </span>
                    <span className="text-xs font-semibold">{formatDayShort(e.date)}</span>
                  </div>
                  {registered && (
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
                      <CheckCircle2 size={11} /> Registered
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display font-bold text-navy-900 leading-snug">{e.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-3 flex-1">{e.description}</p>
                  <div className="mt-4 space-y-1.5 text-xs text-slate-500 font-medium">
                    <p className="flex items-center gap-2">
                      <Clock size={13} className="text-accent-600" /> {e.time}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin size={13} className="text-accent-600" /> {e.venue}
                    </p>
                    <p className="flex items-center gap-2">
                      <Users size={13} className="text-accent-600" /> Organized by {e.organizer}
                    </p>
                  </div>
                  <div className="mt-5 flex gap-2">
                    {registered ? (
                      <Button variant="danger" size="sm" className="flex-1" onClick={() => toggleRegistration(e.id)}>
                        <TicketCheck size={14} /> Registered — cancel
                      </Button>
                    ) : (
                      <Button size="sm" className="flex-1" onClick={() => setConfirmEvent(e)}>
                        <Ticket size={14} /> Register
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <p className="mt-6 flex items-center gap-2 text-xs text-slate-400 font-medium">
        <SampleBadge /> All events, venues and organizers are sample content for demonstration.
      </p>

      <Modal
        open={confirmEvent !== null}
        title="Confirm registration"
        subtitle="Review the details before saving your spot."
        onClose={() => setConfirmEvent(null)}
      >
        {confirmEvent && (
          <div>
            <div className="rounded-2xl bg-navy-50 border border-navy-100 p-4">
              <h4 className="font-display font-bold text-navy-900">{confirmEvent.title}</h4>
              <div className="mt-3 space-y-1.5 text-sm text-navy-800">
                <p className="flex items-center gap-2">
                  <CalendarDays size={15} className="text-accent-700" /> {formatDate(confirmEvent.date)} · {confirmEvent.time}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={15} className="text-accent-700" /> {confirmEvent.venue}
                </p>
                <p className="flex items-center gap-2">
                  <Users size={15} className="text-accent-700" /> {confirmEvent.organizer}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-500 leading-relaxed">
              Your registration is saved on this device and can be cancelled anytime from the event card or the
              &quot;My registrations&quot; tab.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setConfirmEvent(null)}>
                Not now
              </Button>
              <Button
                onClick={() => {
                  toggleRegistration(confirmEvent.id);
                  setConfirmEvent(null);
                }}
              >
                <Ticket size={15} /> Confirm registration
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
