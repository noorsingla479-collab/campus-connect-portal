import { useCallback, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { DashboardPage } from './pages/DashboardPage';
import { TimetablePage } from './pages/TimetablePage';
import { EventsPage } from './pages/EventsPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { LostFoundPage } from './pages/LostFoundPage';
import { DirectoryPage } from './pages/DirectoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { usePersistentState } from './lib/storage';
import {
  SAMPLE_ANNOUNCEMENTS,
  SAMPLE_CLASSES,
  SAMPLE_EVENTS,
  SAMPLE_FACILITIES,
  SAMPLE_LOST_FOUND,
  SAMPLE_PROFILE,
} from './lib/sampleData';
import type { ClassEntry, LostFoundItem, Profile } from './lib/types';
import type { CampusPage } from './lib/pages';

export default function App() {
  const [page, setPage] = useState<CampusPage>('dashboard');
  const [profile, setProfile] = usePersistentState<Profile>('cc.profile', SAMPLE_PROFILE);
  const [classes, setClasses] = usePersistentState<ClassEntry[]>('cc.classes', SAMPLE_CLASSES);
  const [registrations, setRegistrations] = usePersistentState<string[]>('cc.registrations', ['ev-2']);
  const [lostFound, setLostFound] = usePersistentState<LostFoundItem[]>('cc.lostfound', SAMPLE_LOST_FOUND);

  const toggleRegistration = useCallback(
    (id: string) => {
      setRegistrations((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
    },
    [setRegistrations]
  );

  const registeredCount = registrations.length;
  const myPostCount = lostFound.filter((i) => !i.id.startsWith('lf-')).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1440px] flex">
        <aside className="hidden lg:block w-64 shrink-0 border-r border-slate-200/70 bg-white/70 backdrop-blur sticky top-0 h-screen">
          <Sidebar page={page} onNavigate={setPage} />
        </aside>

        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar page={page} onNavigate={setPage} />
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {page === 'dashboard' && (
              <DashboardPage
                profile={profile}
                classes={classes}
                announcements={SAMPLE_ANNOUNCEMENTS}
                events={SAMPLE_EVENTS}
                registrations={registrations}
                onNavigate={setPage}
              />
            )}
            {page === 'timetable' && <TimetablePage classes={classes} setClasses={setClasses} />}
            {page === 'events' && (
              <EventsPage events={SAMPLE_EVENTS} registrations={registrations} toggleRegistration={toggleRegistration} />
            )}
            {page === 'announcements' && <AnnouncementsPage announcements={SAMPLE_ANNOUNCEMENTS} />}
            {page === 'lostfound' && <LostFoundPage items={lostFound} setItems={setLostFound} />}
            {page === 'directory' && <DirectoryPage facilities={SAMPLE_FACILITIES} />}
            {page === 'profile' && (
              <ProfilePage
                profile={profile}
                setProfile={setProfile}
                registeredCount={registeredCount}
                classCount={classes.length}
                postCount={myPostCount}
              />
            )}
          </main>
          <footer className="border-t border-slate-200/70 px-4 sm:px-6 lg:px-8 py-5">
            <p className="text-xs text-slate-400 font-medium">
              CampusConnect — demonstration build with sample campus data. Your timetable, registrations, posts and
              profile are stored on this device.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
