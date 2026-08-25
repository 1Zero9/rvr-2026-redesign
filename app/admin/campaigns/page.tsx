import { redirect } from 'next/navigation';

// Campaigns are managed in the Content admin
export default function CampaignsAdminPage() {
  redirect('/admin/content');
}
