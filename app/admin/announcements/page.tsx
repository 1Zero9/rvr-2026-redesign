import { redirect } from 'next/navigation';

// Announcements are managed in the Content admin
export default function AnnouncementsAdminPage() {
  redirect('/admin/content');
}
