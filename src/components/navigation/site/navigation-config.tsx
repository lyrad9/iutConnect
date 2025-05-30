import React from 'react'
import { Home, Users, Calendar, BookOpen, MessageSquare, Bell, Settings, User, Search } from 'lucide-react'

export const NavigationItems = [
  {
    href: '/',
    icon: <Home className="h-5 w-5" />,
    label: 'Feed',
    notifications: 0
  },
  {
    href: '/groups',
    icon: <Users className="h-5 w-5" />,
    label: 'Groups',
    notifications: 2
  },
  {
    href: '/events',
    icon: <Calendar className="h-5 w-5" />,
    label: 'Events',
    notifications: 0
  },
  {
    href: '/courses',
    icon: <BookOpen className="h-5 w-5" />,
    label: 'Courses',
    notifications: 3
  },
  {
    href: '/messages',
    icon: <MessageSquare className="h-5 w-5" />,
    label: 'Messages',
    notifications: 5
  },
  {
    href: '/notifications',
    icon: <Bell className="h-5 w-5" />,
    label: 'Notifications',
    notifications: 3
  },
  {
    href: '/profile',
    icon: <User className="h-5 w-5" />,
    label: 'Profile',
    notifications: 0
  },
  {
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
    label: 'Settings',
    notifications: 0
  }
]