import { redirect } from 'next/navigation';

// Competitions login is now unified — all admin auth goes through /admin/login
export default function CompetitionsLoginPage() {
  redirect('/admin/login');
}
