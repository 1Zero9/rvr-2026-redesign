import { redirect } from 'next/navigation';

// The noticeboard hub moved to /admin/content
export default function NoticeboardAdminPage() {
  redirect('/admin/content');
}
