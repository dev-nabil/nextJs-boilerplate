import { NavItem } from '@/types';

export interface SideLink extends NavItem {
  sub?: NavItem[];
}

export const sideLinks: SideLink[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: 'dashboard',
    label: 'Dashboard',
  },
  {
    title: 'Chat',
    href: '/admin/chat',
    icon: 'mail',
    label: 'Chat',
  },
  {
    title: 'Subscription',
    href: '/admin/subscription',
    icon: 'Kanban',
    label: 'Subscription',
  },
  {
    title: 'Blog',
    href: '/admin/blog',
    icon: 'rss',
    label: 'Blog',
  },
  {
    title: 'Notifications',
    href: '/admin/notification',
    icon: 'bell',
    label: 'Notifications',
  },

  // {
  //   title: 'Users',
  //   href: '/admin/users',
  //   icon: 'users',
  //   label: 'Users',
  // },
  {
    title: 'Users',
    label: '',
    href: '',
    icon: 'users',
    sub: [
      {
        title: 'Approve',
        label: '',
        href: '/admin/users',
        icon: 'Approve',
      },
      {
        title: 'Manage ',
        label: '',
        href: '/admin/users/manage',
        icon: 'userSettings',
      },
    ],
  },
  {
    title: 'Settings',
    label: '',
    href: '',
    icon: 'settings',
    sub: [
      {
        title: 'General',
        label: '',
        href: '/admin/settings/general',
        icon: 'settings',
      },
      {
        title: 'Awkward',
        label: '',
        href: '/admin/settings/awkward',
        icon: 'settings',
      },
    ],
  },
];

export const countries: string[] = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'Nepal',
];

export const cities: Record<string, string[]> = {
  'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
  Canada: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Ottawa'],
  'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool'],
  Australia: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
  Germany: ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt'],
  France: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'],
  Japan: ['Tokyo', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka'],
  Nepal: ['Kathmandu', 'Pokhara', 'Lalitpur', 'Biratnagar', 'Bharatpur', 'Birgunj'],
};

export const CATEGORIES = [
  { value: 'photography', label: 'Photography' },
  { value: 'videography', label: 'Videography' },
  { value: 'editing', label: 'Editing' },
  { value: 'both', label: 'Photography & Videography' },
  { value: 'all', label: 'All Included' },
];

export const TOOLS = [
  { label: 'Adobe Photoshop', value: 'Adobe Photoshop' },
  { label: 'Adobe Lightroom', value: 'Adobe Lightroom' },
  { label: 'Capture One', value: 'Capture One' },
  { label: 'DxO PhotoLab', value: 'DxO PhotoLab' },
  { label: 'Skylum Luminar', value: 'Skylum Luminar' },
  { label: 'Affinity Photo', value: 'Affinity Photo' },
  { label: 'Corel PaintShop Pro', value: 'Corel PaintShop Pro' },
  { label: 'GIMP', value: 'GIMP' },
  { label: 'ON1 Photo RAW', value: 'ON1 Photo RAW' },
  { label: 'Adobe Bridge', value: 'Adobe Bridge' },
  { label: 'Adobe Premiere Pro', value: 'Adobe Premiere Pro' },
  { label: 'Adobe After Effects', value: 'Adobe After Effects' },
  { label: 'Final Cut Pro', value: 'Final Cut Pro' },
  { label: 'DaVinci Resolve', value: 'DaVinci Resolve' },
  { label: 'Avid Media Composer', value: 'Avid Media Composer' },
  { label: 'Camtasia', value: 'Camtasia' },
  { label: 'Sony Vegas Pro', value: 'Sony Vegas Pro' },
  { label: 'iMovie', value: 'iMovie' },
  { label: 'HitFilm Express', value: 'HitFilm Express' },
  { label: 'Blender', value: 'Blender' },
  { label: 'Adobe Illustrator', value: 'Adobe Illustrator' },
  { label: 'Adobe InDesign', value: 'Adobe InDesign' },
  { label: 'Adobe XD', value: 'Adobe XD' },
  { label: 'Figma', value: 'Figma' },
  { label: 'Sketch', value: 'Sketch' },
  { label: 'Canva', value: 'Canva' },
  { label: 'CorelDRAW', value: 'CorelDRAW' },
  { label: 'Inkscape', value: 'Inkscape' },
];
