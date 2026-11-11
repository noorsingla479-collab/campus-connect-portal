import { useMemo, useState } from 'react';
import { CalendarDays, Clock, DoorOpen, Pencil, Plus, Trash2, UserRound } from 'lucide-react';
import { DAYS } from '../lib/types';
import type { ClassEntry, Day } from '../lib/types';
import { makeId } from '../lib/storage';
import { PageHeader, EmptyState, SampleBadge } from '../components/Misc';
import { Modal } from '../components/Modal';
import { Button, Field, Select, TextInput } from '../components/Form';

interface Props {
  classes: ClassEntry[];
  setClasses: (updater: (prev: ClassEntry[]) => ClassEntry[]) => void;
}

interface FormState {
  day: Day;
  startTime: string;
  endTime: string;
  subject: string;
  code: string;
  room: string;
  faculty: string;
}

const EMPTY_FORM: FormState = {
  day: 'Monday',
  startTime: '09:00',
  endTime: '10:00',
  subject: '',
  code: '',
  room: '',
  faculty: '',
};

const todayName = DAYS[(new Date().getDay() + 6) % 7];

export function TimetablePage({ classes, setClasses }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const byDay = useMemo(() => {
    const map = new Map<Day, ClassEntry[]>();
    for (const day of DAYS) {
      map.set(
        day,
        classes
          .filter((c) => c.day === day)
          .sort((a, b) => a.startTime.localeCompare(b.startTime))
      );
    }
    return map;
  }, [classes]);

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, day: todayName });
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (entry: ClassEntry) => {
    setEditingId(entry.id);
    setForm({
      day: entry.day,
      startTime: entry.startTime,
      endTime: entry.endTime,
      subject: entry.subject,
      code: entry.code,
      room: entry.room,
      faculty: entry.faculty,
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.subject.trim()) e.subject = 'Subject name is required';
    if (!form.code.trim()) e.code = 'Course code is required';
    if (!form.room.trim()) e.room = 'Room is required';
    if (!form.faculty.trim()) e.faculty = 'Faculty name is required';
    if (!form.startTime) e.startTime = 'Start time is required';
    if (!form.endTime) e.endTime = 'End time is required';
    if (form.startTime && form.endTime && form.endTime <= form.startTime) {
      e.endTime = 'End time must be after the start time';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    const cleaned: FormState = {
      ...form,
      subject: form.subject.trim(),
      code: form.code.trim().toUpperCase(),
      room: form.room.trim(),
      faculty: form.faculty.trim(),
    };
    if (editingId) {
      setClasses((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...cleaned } : c)));
    } else {
      setClasses((prev) => [...prev, { id: makeId('cl'), ...cleaned }]);
    }
    setModalOpen(false);
  };

  const remove = (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="page-enter">
      <PageHeader
        title="Weekly Timetable"
        subtitle="Your Monday to Saturday class schedule. Add, edit or remove entries — changes are saved on this device automatically."
        action={
          <Button onClick={openAdd}>
            <Plus size={16} /> Add class
          </Button>
        }
      />

      {classes.length === 0 ? (
        <EmptyState
          icon={<CalendarDays size={26} />}
          title="Your timetable is empty"
          message="Add your first class to start building your weekly schedule. You can add as many entries per day as you need."
          action={
            <Button onClick={openAdd}>
              <Plus size={16} /> Add your first class
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {DAYS.map((day) => {
            const dayClasses = byDay.get(day) ?? [];
            const isToday = day === todayName;
            return (
              <section
                key={day}
                className={`rounded-3xl border p-5 transition-all ${
                  isToday
                    ? 'border-navy-700 bg-navy-800 text-white shadow-card-hover ring-2 ring-accent-400/50'
                    : 'border-slate-100 bg-white shadow-card'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-display font-bold ${isToday ? 'text-white' : 'text-navy-900'}`}>{day}</h3>
                    {isToday && (
                      <span className="rounded-full bg-accent-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        Today
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setForm({ ...EMPTY_FORM, day });
                      setErrors({});
                      setModalOpen(true);
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isToday ? 'text-navy-200 hover:bg-white/10 hover:text-white' : 'text-slate-400 hover:bg-navy-50 hover:text-navy-800'
                    }`}
                    aria-label={`Add class on ${day}`}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {dayClasses.length === 0 ? (
                  <p className={`rounded-xl border border-dashed px-4 py-6 text-center text-xs ${isToday ? 'border-white/20 text-navy-200' : 'border-slate-200 text-slate-400'}`}>
                    No classes scheduled
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {dayClasses.map((c) => (
                      <li
                        key={c.id}
                        className={`group rounded-2xl border p-4 transition-all ${
                          isToday
                            ? 'border-white/15 bg-white/10 hover:bg-white/15'
                            : 'border-slate-100 bg-slate-50/60 hover:border-accent-200 hover:bg-white hover:shadow-card'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 text-xs font-bold">
                            <Clock size={13} className={isToday ? 'text-accent-300' : 'text-accent-600'} />
                            <span className={isToday ? 'text-accent-100' : 'text-accent-700'}>
                              {c.startTime} – {c.endTime}
                            </span>
                          </div>
                          <div className={`flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${isToday ? '' : 'opacity-100 sm:opacity-0'}`}>
                            <button
                              onClick={() => openEdit(c)}
                              className={`p-1.5 rounded-lg transition-colors ${isToday ? 'text-navy-200 hover:bg-white/10 hover:text-white' : 'text-slate-400 hover:bg-navy-50 hover:text-navy-800'}`}
                              aria-label={`Edit ${c.subject}`}
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => remove(c.id)}
                              className={`p-1.5 rounded-lg transition-colors ${isToday ? 'text-navy-200 hover:bg-white/10 hover:text-rose-300' : 'text-slate-400 hover:bg-rose-50 hover:text-rose-600'}`}
                              aria-label={`Delete ${c.subject}`}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                        <p className={`mt-2 text-sm font-bold leading-snug ${isToday ? 'text-white' : 'text-navy-900'}`}>{c.subject}</p>
                        <p className={`text-xs mt-0.5 font-semibold ${isToday ? 'text-navy-200' : 'text-slate-400'}`}>{c.code}</p>
                        <div className={`mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs ${isToday ? 'text-navy-100' : 'text-slate-500'}`}>
                          <span className="inline-flex items-center gap-1.5">
                            <DoorOpen size={12} /> {c.room}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <UserRound size={12} /> {c.faculty}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}

      <p className="mt-6 flex items-center gap-2 text-xs text-slate-400 font-medium">
        <SampleBadge /> The default timetable entries are sample content for demonstration.
      </p>

      <Modal
        open={modalOpen}
        title={editingId ? 'Edit class' : 'Add a class'}
        subtitle="Fill in the class details — it will appear on the selected day."
        onClose={() => setModalOpen(false)}
      >
        <div className="space-y-4">
          <Field label="Day" error={errors.day}>
            <Select value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value as Day })}>
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Start time" error={errors.startTime}>
              <TextInput type="time" value={form.startTime} error={errors.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
            </Field>
            <Field label="End time" error={errors.endTime}>
              <TextInput type="time" value={form.endTime} error={errors.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
            </Field>
          </div>
          <Field label="Subject" error={errors.subject}>
            <TextInput value={form.subject} error={errors.subject} placeholder="e.g. Data Structures" onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Course code" error={errors.code}>
              <TextInput value={form.code} error={errors.code} placeholder="CS-201" onChange={(e) => setForm({ ...form, code: e.target.value })} />
            </Field>
            <Field label="Room" error={errors.room}>
              <TextInput value={form.room} error={errors.room} placeholder="AB-I 204" onChange={(e) => setForm({ ...form, room: e.target.value })} />
            </Field>
          </div>
          <Field label="Faculty" error={errors.faculty}>
            <TextInput value={form.faculty} error={errors.faculty} placeholder="Dr. Meera Krishnan" onChange={(e) => setForm({ ...form, faculty: e.target.value })} />
          </Field>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>{editingId ? 'Save changes' : 'Add class'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
