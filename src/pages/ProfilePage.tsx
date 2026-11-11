import { useState } from 'react';
import { BookOpen, Building, CheckCircle2, GraduationCap, Mail, Pencil, Phone, Save, ShieldCheck, User } from 'lucide-react';
import type { Profile } from '../lib/types';
import { PageHeader, SampleBadge } from '../components/Misc';
import { Modal } from '../components/Modal';
import { Button, Field, Select, TextArea, TextInput } from '../components/Form';

interface Props {
  profile: Profile;
  setProfile: (updater: (prev: Profile) => Profile) => void;
  registeredCount: number;
  classCount: number;
  postCount: number;
}

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Administration',
  'Design',
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

type FormState = Profile;

export function ProfilePage({ profile, setProfile, registeredCount, classCount, postCount }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(profile);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [savedFlash, setSavedFlash] = useState(false);

  const openEdit = () => {
    setForm(profile);
    setErrors({});
    setModalOpen(true);
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    else if (form.name.trim().length < 2) e.name = 'Name looks too short';
    if (!form.studentId.trim()) e.studentId = 'Student ID is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Enter a valid email address';
    if (form.phone.trim() && form.phone.trim().replace(/\D/g, '').length < 7) e.phone = 'Enter a valid phone number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    setProfile((prev) => ({
      ...prev,
      ...form,
      name: form.name.trim(),
      studentId: form.studentId.trim().toUpperCase(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      bio: form.bio.trim(),
    }));
    setModalOpen(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2500);
  };

  const initials = profile.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="page-enter">
      <PageHeader
        title="My Profile"
        subtitle="Your student details across CampusConnect. Everything here is editable and stored on this device."
        action={
          <Button onClick={openEdit}>
            <Pencil size={15} /> Edit profile
          </Button>
        }
      />

      {savedFlash && (
        <div className="mb-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 page-enter">
          <CheckCircle2 size={17} /> Profile saved successfully.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-1">
          <div className="rounded-3xl bg-gradient-to-br from-navy-800 to-navy-950 p-6 text-white shadow-card-hover">
            <div className="flex flex-col items-center text-center">
              <span className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent-400 to-accent-700 flex items-center justify-center font-display text-2xl font-bold shadow-lg">
                {initials}
              </span>
              <h3 className="mt-4 font-display text-lg font-bold">{profile.name}</h3>
              <p className="text-sm text-navy-200 font-medium">{profile.studentId}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <span className="rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-bold">{profile.department}</span>
                <span className="rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-bold">{profile.year}</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl bg-white/10 py-3">
                <p className="font-display text-lg font-bold">{classCount}</p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-navy-200">Classes</p>
              </div>
              <div className="rounded-2xl bg-white/10 py-3">
                <p className="font-display text-lg font-bold">{registeredCount}</p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-navy-200">Events</p>
              </div>
              <div className="rounded-2xl bg-white/10 py-3">
                <p className="font-display text-lg font-bold">{postCount}</p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-navy-200">Posts</p>
              </div>
            </div>
            {profile.bio && (
              <p className="mt-5 rounded-2xl bg-white/5 border border-white/10 p-4 text-sm leading-relaxed text-navy-100">
                {profile.bio}
              </p>
            )}
          </div>
        </section>

        <section className="lg:col-span-2 rounded-3xl bg-white border border-slate-100 shadow-card p-6">
          <h3 className="font-display font-bold text-navy-900 mb-5">Student details</h3>
          <dl className="grid gap-4 sm:grid-cols-2">
            <Detail icon={User} label="Full name" value={profile.name} />
            <Detail icon={ShieldCheck} label="Student ID" value={profile.studentId} />
            <Detail icon={GraduationCap} label="Department" value={profile.department} />
            <Detail icon={BookOpen} label="Year of study" value={profile.year} />
            <Detail icon={Mail} label="Email" value={profile.email} />
            <Detail icon={Phone} label="Phone" value={profile.phone || 'Not provided'} />
          </dl>
          <div className="mt-6 flex items-start gap-3 rounded-2xl bg-amber-50 border border-amber-200 p-4">
            <Building size={17} className="mt-0.5 shrink-0 text-amber-600" />
            <p className="text-sm text-amber-800 leading-relaxed">
              CampusConnect is a demonstration build — your details never leave this device and the initial profile is
              sample content you can freely edit.
            </p>
          </div>
        </section>
      </div>

      <Modal open={modalOpen} title="Edit profile" subtitle="Update your details — saved to this device." onClose={() => setModalOpen(false)}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full name" error={errors.name}>
              <TextInput value={form.name} error={errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Student ID" error={errors.studentId}>
              <TextInput value={form.studentId} error={errors.studentId} placeholder="CC-2023-0481" onChange={(e) => setForm({ ...form, studentId: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Department" error={errors.department}>
              <Select value={form.department} error={errors.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Year" error={errors.year}>
              <Select value={form.year} error={errors.year} onChange={(e) => setForm({ ...form, year: e.target.value })}>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email" error={errors.email}>
              <TextInput type="email" value={form.email} error={errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="Phone (optional)" error={errors.phone}>
              <TextInput value={form.phone} error={errors.phone} placeholder="+91 98765 43210" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Field>
          </div>
          <Field label="Short bio (optional)">
            <TextArea value={form.bio} placeholder="A line or two about you — interests, clubs, goals..." onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </Field>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>
              <Save size={15} /> Save profile
            </Button>
          </div>
        </div>
      </Modal>

      <p className="mt-6 flex items-center gap-2 text-xs text-slate-400 font-medium">
        <SampleBadge /> The default profile is sample content — edit it to make it yours.
      </p>
    </div>
  );
}

function Detail({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
      <span className="w-9 h-9 rounded-xl bg-white border border-slate-100 text-accent-600 flex items-center justify-center shrink-0 shadow-sm">
        <Icon size={16} />
      </span>
      <div className="min-w-0">
        <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</dt>
        <dd className="mt-0.5 text-sm font-bold text-navy-900 break-words">{value}</dd>
      </div>
    </div>
  );
}
