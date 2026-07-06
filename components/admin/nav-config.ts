import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  ClipboardList,
  Cog,
  Megaphone,
  MessageSquare,
  Shield,
  Shirt,
  Trophy,
  Users,
} from 'lucide-react';

export interface AdminBadges {
  ann: number;
  reg: number;
  enq: number;
}

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: keyof AdminBadges;
}

export const SITE_NAV: AdminNavItem[] = [
  { href: '/admin/noticeboard',   label: 'Noticeboard',   icon: Megaphone,     badge: 'ann' },
  { href: '/admin/registrations', label: 'Registrations', icon: ClipboardList, badge: 'reg' },
  { href: '/admin/enquiries',     label: 'Enquiries',     icon: MessageSquare, badge: 'enq' },
  { href: '/admin/moderation',    label: 'Moderation',    icon: Shield },
  { href: '/admin/boot-room',     label: 'Boot Room',     icon: Shirt },
  { href: '/competitions/admin',  label: 'Competitions',  icon: Trophy },
];

export const SUPER_NAV: AdminNavItem[] = [
  { href: '/competitions/admin/users', label: 'Users',    icon: Users },
  { href: '/admin/features',           label: 'Features', icon: Cog },
  { href: '/admin/docs',               label: 'Docs',     icon: BookOpen },
];

export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  SITE_ADMIN:  'Site Admin',
};

export const ROLE_STYLES: Record<string, string> = {
  SUPER_ADMIN: 'bg-brand-neon text-brand-charcoal',
  SITE_ADMIN:  'bg-brand-sky/20 text-brand-sky',
};
