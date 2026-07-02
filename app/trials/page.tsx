import { redirect } from 'next/navigation';

// Trials registration is handled within the main register flow.
// Redirect permanently so any external links still work.
export default function TrialsPage() {
  redirect('/register');
}
