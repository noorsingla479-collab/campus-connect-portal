import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Bell, CalendarDays, ChevronDown, GraduationCap, Info, Megaphone, Search } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Announcement, NoticeCategory, Priority } from '../lib/types';
import { formatDate } from '../lib/storage';
import { PageHeader, EmptyState, SkeletonGrid, SampleBadge } from '../components/Misc';

interface Props {
  announcements: Announcement[];
}

const CATEGORIES: (NoticeCategory | 'All')[] = ['All', 'Academic', 'Events', 'Examination', 'General'];
const PRIORITIES: (Priority | 'All')[] = ['All', 'High', 'Medium', 'Low'];

const CATEGORY_ICONS: Record<NoticeCategory, LucideIcon> = {
  Academic: GraduationCap,
  Events: Megaphone,
  Examination: AlertTriangle,
  General: Info,
};

const PRIORITY_STYLES: Record<Priority, string> = {
  High: 'bg-rose-50 border-rose-200 text-rose-700',
  Medium: 'bg-amber-50 border-amber-200 text-amber-700',
  Low: 'bg-emerald-50 border-emerald-200 text-emerald-700',
};

const CATEGORY_TINTS: Record<NoticeCategory, string> = {
  Academic: 'bg-blue-50 border-blue-200 text-blue-700',
  Events: 'bg-accent-50 border-accent-200 text-accent-700',
  Examination: 'bg-rose-50 border-rose-200 text-rose-700',
  General: 'bg-slate-100 border-slate-200 text-slate-600',
};

function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [open]);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold shadow-card transition-all ${
          value === 'All' ? 'border-slate-200 bg-white text-slate-600 hover:border-accent-300' : 'border-navy-800 bg-navy-800 text-white'
        }`}
      >
        {label}: {value}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 w-44 rounded-2xl border border-slate-100 bg-white py-1.5 shadow-2xl z-20 page-enter">
          {options.map((o) => (
            <button
              key={o}
              onClick={() => {
                onChange(o);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm font-semibold transition-colors ${
                o === value ? 'bg-navy-50 text-navy-900' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function AnnouncementsPage({ announcements }: Props) {
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<NoticeCategory | 'All'>('All');
  const [priority, setPriority] = useState<Priority | 'All'>('All');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return announcements
      .filter((a) => (category === 'All' ? true : a.category === category))
      .filter((a) => (priority === 'All' ? true : a.priority === priority))
      .filter((a) =>
        query.trim() ? `${a.title} ${a.body} ${a.author}`.toLowerCase().includes(query.trim().toLowerCase()) : true
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [announcements, category, priority, query]);

  const highCount = filtered.filter((a) => a.priority === 'High').length;

  return (
    <div className="page-enter">
      <PageHeader
        title="Announcements"
        subtitle="Official campus notices from the administration, departments and committees. Filter by category and priority to find what matters."
      />

      <div className="flex flex-col gap-3 mb-6 lg:flex-row lg:items-center">
        <div className="relative flex-1 lg:max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notices..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-card outline-none transition-all focus:border-accent-400 focus:ring-4 focus:ring-accent-200/40"
          />
        </div>
        <div className="flex flex-wrap gap-2 lg:ml-auto">
          <FilterDropdown label="Category" value={category} options={CATEGORIES} onChange={(v) => setCategory(v as NoticeCategory | 'All')} />
          <FilterDropdown label="Priority" value={priority} options={PRIORITIES} onChange={(v) => setPriority(v as Priority | 'All')} />
        </div>
      </div>

      {highCount > 0 && priority === 'High' && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
          <AlertTriangle size={18} className="shrink-0 text-rose-600" />
          <p className="text-sm font-semibold text-rose-700">
            {highCount} high-priority notice{highCount > 1 ? 's' : ''} need your attention.
          </p>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          <SkeletonGrid count={3} />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Bell size={26} />}
          title="No notices found"
          message="Nothing matches your search or filters. Try different keywords or clear the filters to see all announcements."
          action={
            <button
              onClick={() => {
                setCategory('All');
                setPriority('All');
                setQuery('');
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 transition-colors"
            >
              Clear all filters
            </button>
          }
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((a, i) => {
            const Icon = CATEGORY_ICONS[a.category];
            return (
              <article
                key={a.id}
                className={`stagger-item group rounded-3xl border bg-white p-5 sm:p-6 transition-all hover:shadow-card-hover ${
                  a.priority === 'High' ? 'border-rose-100' : 'border-slate-100 shadow-card'
                }`}
                style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${CATEGORY_TINTS[a.category]}`}>
                    <Icon size={11} /> {a.category}
                  </span>
                  <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${PRIORITY_STYLES[a.priority]}`}>
                    {a.priority} priority
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                    <CalendarDays size={12} /> {formatDate(a.date)}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-lg font-bold text-navy-900 leading-snug">{a.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{a.body}</p>
                <p className="mt-4 text-xs font-semibold text-slate-400">— {a.author}</p>
              </article>
            );
          })}
        </div>
      )}

      <p className="mt-6 flex items-center gap-2 text-xs text-slate-400 font-medium">
        <SampleBadge /> All notices are sample content for demonstration.
      </p>
    </div>
  );
}
