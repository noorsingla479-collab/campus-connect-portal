import { AlertCircle, Loader2 } from 'lucide-react';
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-navy-800 mb-1.5">{label}</span>
      {children}
      {error && (
        <span className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600">
          <AlertCircle size={13} />
          {error}
        </span>
      )}
    </label>
  );
}

const inputBase =
  'w-full rounded-xl border bg-slate-50/60 px-3.5 py-2.5 text-sm text-navy-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-accent-200/40';

function borderClass(error?: string) {
  return error ? 'border-rose-300 focus:border-rose-400' : 'border-slate-200 focus:border-accent-400';
}

export function TextInput({
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return <input {...props} className={`${inputBase} ${borderClass(error)}`} />;
}

export function Select({
  error,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { error?: string }) {
  return (
    <select {...props} className={`${inputBase} ${borderClass(error)} appearance-none bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")] bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat pr-9`}>
      {children}
    </select>
  );
}

export function TextArea({
  error,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
  return <textarea {...props} className={`${inputBase} ${borderClass(error)} min-h-[96px] resize-y`} />;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  children,
  ...props
}: {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants: Record<string, string> = {
    primary:
      'bg-navy-800 text-white hover:bg-navy-700 shadow-sm active:scale-[0.98] disabled:opacity-60',
    secondary:
      'bg-white text-navy-800 border border-slate-200 hover:border-accent-300 hover:text-accent-700 shadow-sm active:scale-[0.98]',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-navy-800',
    danger: 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100',
  };
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  };
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={`inline-flex items-center justify-center font-semibold transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-accent-200/50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && <Loader2 size={size === 'sm' ? 13 : 15} className="animate-spin" />}
      {children}
    </button>
  );
}
