import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  ClipboardList,
  Cog,
  Megaphone,
  MessageSquare,
  Shield,
  Trophy,
  Users,
} from 'lucide-react';

export interface AdminBadges {
  ann: number;
  reg: number;
  enq: number;
  appr: number;
}

export interface AdminNavItem {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  badge?: keyof AdminBadges;
}

export const SITE_NAV: AdminNavItem[] = [
  { href: '/admin/noticeboard',   label: 'Noticeboard',   icon: Megaphone,     badge: 'ann', description: 'News and campaigns together, plus the homepage spotlight.' },
  { href: '/admin/registrations', label: 'Registrations', icon: ClipboardList, badge: 'reg', description: 'Review and process player registration submissions.' },
  { href: '/admin/enquiries',     label: 'Enquiries',     icon: MessageSquare, badge: 'enq', description: 'Public contact and callback requests from the website.' },
  { href: '/admin/approvals',     label: 'Approvals',     icon: Shield,        badge: 'appr', description: 'Shirt designs and Boot Room listings awaiting a yes or no.' },
  { href: '/competitions/admin',  label: 'Competitions',  icon: Trophy,                      description: 'Fixtures, results, pitches, and competition settings.' },
];

export const SUPER_NAV: AdminNavItem[] = [
  { href: '/competitions/admin/users', label: 'Users',    icon: Users,    description: 'Admin accounts and role assignments.' },
  { href: '/admin/features',           label: 'Features', icon: Cog,      description: 'Toggle site features and platform configuration.' },
  { href: '/admin/docs',               label: 'Docs',     icon: BookOpen, description: 'Changelog, setup guide, and reference material.' },
];

export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  SITE_ADMIN:  'Site Admin',
};

export const ROLE_STYLES: Record<string, string> = {
  SUPER_ADMIN: 'bg-brand-neon text-brand-charcoal',
  SITE_ADMIN:  'bg-brand-sky/20 text-brand-sky',
};
