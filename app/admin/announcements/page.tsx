import { redirect } from 'next/navigation';

// Announcements are managed on the combined Noticeboard panel
export default function AnnouncementsAdminPage() {
  redirect('/admin/noticeboard');
}
