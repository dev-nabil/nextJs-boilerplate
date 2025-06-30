'use client'

import { Command, FolderKanban, Frame, GalleryVerticalEnd, LayoutDashboard, Mail, Map, PieChart, Settings, User } from 'lucide-react'
import * as React from 'react'

import { NavMain } from '@/components/nav-main'
import { NavProjects } from '@/components/nav-projects'
import { TeamSwitcher } from '@/components/team-switcher'
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'

const data = {
  teams: [
    {
      name: 'YahaCcha',
      logo: GalleryVerticalEnd,
      plan: 'Admin'
    },
    {
      name: 'YahaCcha',
      logo: Command,
      plan: 'Manager'
    }
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '/admin/dashboard',
      icon: LayoutDashboard,
      isActive: true
    },
    {
      title: 'Content',
      url: '#',
      icon: FolderKanban,
      items: [
        {
          title: 'Category',
          url: '/admin/categories'
        },
        {
          title: 'Banners',
          url: '/admin/banners'
        },
        {
          title: 'Blog',
          url: '/admin/blog'
        },
        {
          title: 'Subscriptions',
          url: '/admin/subscription'
        }
      ]
    },
    {
      title: 'User Management',
      url: '#',
      icon: User,
      items: [
        {
          title: 'Users',
          url: '/admin/users'
        },
        {
          title: 'Admins',
          url: '/admin/admins'
        }
      ]
    },
    {
      title: 'Communication',
      url: '#',
      icon: Mail,
      items: [
        {
          title: 'Contacts',
          url: '/admin/contacts'
        },
        {
          title: 'Disputes',
          url: '/admin/disputes'
        }
      ]
    },
    {
      title: 'Settings',
      url: '/admin/settings',
      icon: Settings
    }
  ],
  projects: [
    {
      name: 'Payments',
      url: '#',
      icon: Frame
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart
    },
    {
      name: 'Analytics',
      url: '#',
      icon: Map
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="mr-0">
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
