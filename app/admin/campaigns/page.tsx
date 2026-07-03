import { redirect } from 'next/navigation';

// Campaigns are managed on the combined Noticeboard panel
export default function CampaignsAdminPage() {
  redirect('/admin/noticeboard');
}
