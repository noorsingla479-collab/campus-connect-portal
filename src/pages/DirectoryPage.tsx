import { useMemo, useState } from 'react';
import { BookOpen, Building2, Coffee, HeartPulse, Mail, MapPin, Search, Trophy } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Facility } from '../lib/types';
import { PageHeader, EmptyState, SampleBadge } from '../components/Misc';

interface Props {
  facilities: Facility[];
}

const CATEGORIES: (Facility['category'] | 'All')[] = [
  'All',
  'Library',
  'Academic Block',
  'Hostel',
  'Cafeteria',
  'Medical Centre',
  'Sports',
];

const CATEGORY_META: Record<Facility['category'], { icon: LucideIcon; tint: string }> = {
  Library: { icon: BookOpen, tint: 'bg-amber-50 text-amber-600' },
  'Academic Block': { icon: Building2, tint: 'bg-blue-50 text-blue-600' },
  Hostel: { icon: Building2, tint: 'bg-accent-50 text-accent-600' },
  Cafeteria: { icon: Coffee, tint: 'bg-orange-50 text-orange-600' },
  'Medical Centre': { icon: HeartPulse, tint: 'bg-rose-50 text-rose-600' },
  Sports: { icon: Trophy, tint: 'bg-emerald-50 text-emerald-600' },
};

export function DirectoryPage({ facilities }: Props) {
  const [category, setCategory] = useState<Facility['category'] | 'All'>('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return facilities
      .filter((f) => (category === 'All' ? true : f.category === category))
      .filter((f) =>
        query.trim() ? `${f.name} ${f.description} ${f.building}`.toLowerCase().includes(query.trim().toLowerCase()) : true
      );
  }, [facilities, category, query]);

  return (
    <div className="page-enter">
      <PageHeader
        title="Campus Directory"
        subtitle="Every key place on campus with its location and opening hours. All listings are clearly labelled sample information for demonstration."
      />

      <div className="flex flex-col gap-3 mb-6 lg:flex-row lg:items-center">
        <div className="relative flex-1 lg:max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search facilities, buildings..."
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

      {filtered.length === 0 ? (
        <EmptyState
          icon={<MapPin size={26} />}
          title="No facilities found"
          message={'Nothing matches that search. Try a different keyword — like "library", "gym" or "hostel" — or clear the filters.'}
          action={
            <button
              onClick={() => {
                setQuery('');
                setCategory('All');
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 transition-colors"
            >
              Clear filters
            </button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((f, i) => {
            const { icon: Icon, tint } = CATEGORY_META[f.category];
            return (
              <article
                key={f.id}
                className="stagger-item group flex flex-col rounded-3xl bg-white border border-slate-100 shadow-card p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
                style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${tint}`}>
                    <Icon size={19} />
                  </span>
                  <span className="rounded-full bg-navy-50 border border-navy-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-navy-700">
                    {f.category}
                  </span>
                </div>
                <h3 className="mt-4 font-display font-bold text-navy-900 leading-snug">{f.name}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed flex-1">{f.description}</p>
                <div className="mt-4 space-y-2 rounded-2xl bg-slate-50 border border-slate-100 p-3.5 text-xs">
                  <p className="flex items-start gap-2 text-slate-600">
                    <MapPin size={13} className="mt-0.5 shrink-0 text-accent-600" />
                    <span className="font-semibold">{f.building}</span>
                  </p>
                  <p className="flex items-start gap-2 text-slate-600">
                    <span className="mt-0.5 shrink-0 text-[10px] font-black uppercase tracking-wide text-emerald-600 w-10">Hours</span>
                    <span className="font-semibold">{f.hours}</span>
                  </p>
                  <p className="flex items-start gap-2 text-slate-600">
                    <Mail size={13} className="mt-0.5 shrink-0 text-accent-600" />
                    <span className="font-semibold">{f.contact}</span>
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <p className="mt-6 flex items-center gap-2 text-xs text-slate-400 font-medium">
        <SampleBadge /> All directory listings, hours and contacts are sample content.
      </p>
    </div>
  );
}
