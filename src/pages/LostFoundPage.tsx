import { useMemo, useState } from 'react';
import { MessageSquare, PackageOpen, PackageSearch, Pencil, Phone, Plus, Search, Trash2 } from 'lucide-react';
import type { LostCategory, LostFoundItem } from '../lib/types';
import { formatDate, makeId } from '../lib/storage';
import { PageHeader, EmptyState, SampleBadge } from '../components/Misc';
import { Modal } from '../components/Modal';
import { Button, Field, Select, TextArea, TextInput } from '../components/Form';

interface Props {
  items: LostFoundItem[];
  setItems: (updater: (prev: LostFoundItem[]) => LostFoundItem[]) => void;
}

const CATEGORIES: LostCategory[] = ['Electronics', 'Documents', 'Accessories', 'Books', 'Clothing', 'Other'];

const CATEGORY_TINTS: Record<LostCategory, string> = {
  Electronics: 'bg-blue-50 border-blue-200 text-blue-700',
  Documents: 'bg-amber-50 border-amber-200 text-amber-700',
  Accessories: 'bg-accent-50 border-accent-200 text-accent-700',
  Books: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  Clothing: 'bg-rose-50 border-rose-200 text-rose-700',
  Other: 'bg-slate-100 border-slate-200 text-slate-600',
};

interface FormState {
  type: 'Lost' | 'Found';
  name: string;
  description: string;
  location: string;
  category: LostCategory;
  contact: string;
}

const todayISO = () => new Date().toISOString().slice(0, 10);

const EMPTY_FORM: FormState = {
  type: 'Lost',
  name: '',
  description: '',
  location: '',
  category: 'Electronics',
  contact: '',
};

export function LostFoundPage({ items, setItems }: Props) {
  const [tab, setTab] = useState<'all' | 'Lost' | 'Found'>('all');
  const [category, setCategory] = useState<LostCategory | 'All'>('All');
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const sampleIds = useMemo(() => new Set(['lf-1', 'lf-2', 'lf-3', 'lf-4', 'lf-5', 'lf-6']), []);

  const filtered = useMemo(() => {
    return items
      .filter((it) => (tab === 'all' ? true : it.type === tab))
      .filter((it) => (category === 'All' ? true : it.category === category))
      .filter((it) =>
        query.trim()
          ? `${it.name} ${it.description} ${it.location} ${it.contact}`.toLowerCase().includes(query.trim().toLowerCase())
          : true
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [items, tab, category, query]);

  const openAdd = (type: 'Lost' | 'Found') => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, type });
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (item: LostFoundItem) => {
    setEditingId(item.id);
    setForm({
      type: item.type,
      name: item.name,
      description: item.description,
      location: item.location,
      category: item.category,
      contact: item.contact,
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = 'Item name is required';
    if (!form.description.trim()) e.description = 'Please add a short description';
    if (!form.location.trim()) e.location = 'Location is required';
    if (!form.contact.trim()) e.contact = 'Contact information is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    if (editingId) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === editingId
            ? {
                ...it,
                ...form,
                name: form.name.trim(),
                description: form.description.trim(),
                location: form.location.trim(),
                contact: form.contact.trim(),
              }
            : it
        )
      );
    } else {
      setItems((prev) => [
        {
          id: makeId('lf'),
          ...form,
          name: form.name.trim(),
          description: form.description.trim(),
          location: form.location.trim(),
          contact: form.contact.trim(),
          date: todayISO(),
        },
        ...prev,
      ]);
    }
    setModalOpen(false);
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const lostCount = items.filter((i) => i.type === 'Lost').length;
  const foundCount = items.filter((i) => i.type === 'Found').length;

  return (
    <div className="page-enter">
      <PageHeader
        title="Lost & Found"
        subtitle="Lost something on campus, or found an item someone else left behind? Post it here so it can get back to its owner. Posts you create can be edited or deleted."
        action={
          <div className="flex gap-2">
            <Button onClick={() => openAdd('Lost')}>
              <Plus size={16} /> Post lost item
            </Button>
            <Button variant="secondary" onClick={() => openAdd('Found')}>
              <Plus size={16} /> Post found item
            </Button>
          </div>
        }
      />

      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center">
        <div className="inline-flex rounded-2xl bg-white border border-slate-200 p-1 shadow-card self-start">
          {(['all', 'Lost', 'Found'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                tab === t ? 'bg-navy-800 text-white shadow-sm' : 'text-slate-500 hover:text-navy-800'
              }`}
            >
              {t === 'all' ? `All (${items.length})` : `${t} (${t === 'Lost' ? lostCount : foundCount})`}
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 lg:ml-auto">
          <div className="relative lg:max-w-xs">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search items, locations..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-card outline-none transition-all focus:border-accent-400 focus:ring-4 focus:ring-accent-200/40"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as LostCategory | 'All')}
            className="rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-9 text-sm font-semibold text-slate-600 shadow-card outline-none transition-all focus:border-accent-400 focus:ring-4 focus:ring-accent-200/40"
          >
            <option value="All">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        items.length === 0 ? (
          <EmptyState
            icon={<PackageSearch size={26} />}
            title="No posts yet"
            message="Be the first to help a fellow student — post a lost or found item and get it back to its owner."
            action={
              <Button onClick={() => openAdd('Lost')}>
                <Plus size={16} /> Create the first post
              </Button>
            }
          />
        ) : (
          <EmptyState
            title="No items match your filters"
            message="Try a different keyword or category, or clear the filters to browse all posts."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery('');
                  setCategory('All');
                  setTab('all');
                }}
              >
                Clear filters
              </Button>
            }
          />
        )
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item, i) => {
            const isSample = sampleIds.has(item.id);
            const mine = !isSample;
            return (
              <article
                key={item.id}
                className={`stagger-item flex flex-col rounded-3xl border p-5 transition-all hover:shadow-card-hover ${
                  item.type === 'Found' ? 'bg-emerald-50/40 border-emerald-100' : 'bg-rose-50/40 border-rose-100'
                }`}
                style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                      item.type === 'Found' ? 'border-emerald-300 bg-emerald-100 text-emerald-800' : 'border-rose-300 bg-rose-100 text-rose-800'
                    }`}
                  >
                    <PackageOpen size={11} /> {item.type}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">{formatDate(item.date)}</span>
                </div>
                <h3 className="mt-3 font-display font-bold text-navy-900 leading-snug">{item.name}</h3>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed flex-1">{item.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${CATEGORY_TINTS[item.category]}`}>
                    {item.category}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                    <PackageOpen size={10} /> {item.location}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-200/70 pt-3">
                  <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-800 min-w-0">
                    <Phone size={12} className="shrink-0 text-accent-600" />
                    <span className="truncate">{item.contact}</span>
                  </p>
                  {mine && (
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => openEdit(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-navy-50 hover:text-navy-800 transition-colors"
                        aria-label={`Edit ${item.name}`}
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => remove(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        aria-label={`Delete ${item.name}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <p className="mt-6 flex items-center gap-2 text-xs text-slate-400 font-medium">
        <SampleBadge /> Pre-listed posts are sample content. Posts you create are saved on this device.
      </p>

      <Modal
        open={modalOpen}
        title={editingId ? 'Edit post' : 'New lost & found post'}
        subtitle="Clear details help items find their way home faster."
        onClose={() => setModalOpen(false)}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {(['Lost', 'Found'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm({ ...form, type: t })}
                className={`rounded-xl border px-4 py-3 text-sm font-bold transition-all ${
                  form.type === t
                    ? t === 'Lost'
                      ? 'border-rose-400 bg-rose-50 text-rose-700 ring-4 ring-rose-100'
                      : 'border-emerald-400 bg-emerald-50 text-emerald-700 ring-4 ring-emerald-100'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                }`}
              >
                I {t === 'Lost' ? 'lost' : 'found'} something
              </button>
            ))}
          </div>
          <Field label="Item name" error={errors.name}>
            <TextInput value={form.name} error={errors.name} placeholder="e.g. Blue water bottle" onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category" error={errors.category}>
              <Select value={form.category} error={errors.category} onChange={(e) => setForm({ ...form, category: e.target.value as LostCategory })}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Location" error={errors.location}>
              <TextInput value={form.location} error={errors.location} placeholder="e.g. Central Library, Floor 2" onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </Field>
          </div>
          <Field label="Description" error={errors.description}>
            <TextArea value={form.description} error={errors.description} placeholder="Any identifying details — colour, stickers, contents, when and where it was last seen..." onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <Field label="Contact information" error={errors.contact}>
            <TextInput value={form.contact} error={errors.contact} placeholder="Name and phone, email or room number" onChange={(e) => setForm({ ...form, contact: e.target.value })} />
          </Field>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>
              <MessageSquare size={15} /> {editingId ? 'Save changes' : 'Publish post'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
