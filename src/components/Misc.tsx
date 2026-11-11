import { ArrowRight, SearchX } from 'lucide-react';
import type { ReactNode } from 'react';

export function EmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon?: ReactNode;
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-slate-200 bg-white/60 px-6 py-14 page-enter">
      <div className="w-14 h-14 rounded-2xl bg-navy-50 text-navy-500 flex items-center justify-center mb-4">
        {icon ?? <SearchX size={26} />}
      </div>
      <h3 className="font-display font-bold text-navy-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500 leading-relaxed">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-card p-5 animate-pulse">
      <div className="h-4 w-24 bg-slate-100 rounded-full mb-4" />
      <div className="h-5 w-3/4 bg-slate-100 rounded-lg mb-2" />
      <div className="h-5 w-1/2 bg-slate-100 rounded-lg mb-4" />
      <div className="h-3 w-full bg-slate-100 rounded mb-2" />
      <div className="h-3 w-5/6 bg-slate-100 rounded" />
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SampleBadge() {
  return (
    <span
      title="This is sample content to demonstrate the app"
      className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700"
    >
      Sample
    </span>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-slate-500 max-w-2xl leading-relaxed">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

export function LinkArrow() {
  return <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />;
}
