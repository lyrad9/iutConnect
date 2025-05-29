import { PostType, UserType, TrendType } from './types'

export const mockUsers: UserType[] = [
  {
    id: 'user1',
    name: 'Jane Doe',
    avatarUrl: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    department: 'Computer Science',
    year: 3,
    bio: 'CS major with a minor in design. Coffee enthusiast and code wizard.',
    verified: true
  },
  {
    id: 'user2',
    name: 'John Smith',
    avatarUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    department: 'Business Administration',
    year: 2,
    bio: 'Future entrepreneur. I love connecting with new people!',
    verified: false
  },
  {
    id: 'user3',
    name: 'Alex Johnson',
    avatarUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    department: 'Psychology',
    year: 4,
    bio: 'Psychology student interested in human behavior. Always curious.',
    verified: false
  },
  {
    id: 'user4',
    name: 'Emily Wilson',
    avatarUrl: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    department: 'Engineering',
    year: 3,
    bio: 'Building a better future through engineering. Robotics enthusiast.',
    verified: true
  },
  {
    id: 'user5',
    name: 'Michael Chen',
    avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    department: 'Mathematics',
    year: 2,
    bio: 'Math genius by day, gamer by night. Let\'s solve problems together!',
    verified: false
  }
]

export const mockSuggestedUsers: UserType[] = [
  {
    id: 'user3',
    name: 'Alex Johnson',
    avatarUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    department: 'Psychology',
    mutualConnections: 12
  },
  {
    id: 'user4',
    name: 'Emily Wilson',
    avatarUrl: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    department: 'Engineering',
    mutualConnections: 8
  },
  {
    id: 'user5',
    name: 'Michael Chen',
    avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    department: 'Mathematics',
    mutualConnections: 5
  }
]

export const mockPosts: PostType[] = [
  {
    id: 'post1',
    author: mockUsers[0],
    content: 'Just finished my final project for the semester! 🎉 So excited to present it tomorrow. Anyone else finishing up their projects?',
    timestamp: '2023-05-11T14:30:00Z',
    likesCount: 45,
    commentsCount: 12,
    sharesCount: 3,
    liked: true,
    media: [
      {
        id: 'media1',
        url: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        type: 'image'
      }
    ],
    comments: [
      {
        id: 'comment1',
        author: mockUsers[1],
        content: 'Congrats! What was your project about?',
        timestamp: '2023-05-11T15:00:00Z',
        likesCount: 3
      },
      {
        id: 'comment2',
        author: mockUsers[2],
        content: 'Good luck with your presentation! 👍',
        timestamp: '2023-05-11T15:30:00Z',
        likesCount: 2
      }
    ]
  },
  {
    id: 'post2',
    author: mockUsers[1],
    content: 'Our business club is hosting a networking event next week! Don\'t miss the opportunity to connect with industry professionals and fellow students.',
    timestamp: '2023-05-10T09:15:00Z',
    likesCount: 32,
    commentsCount: 7,
    sharesCount: 15,
    liked: false,
    event: {
      id: 'event1',
      title: 'Business Networking Event',
      date: '2023-05-20T18:00:00Z',
      location: 'Business School, Room 302',
      description: 'Connect with industry professionals and fellow students',
      attendeesCount: 45
    },
    group: {
      id: 'group1',
      name: 'Business Club',
      membersCount: 120,
      type: 'public'
    }
  },
  {
    id: 'post3',
    author: mockUsers[3],
    content: 'Check out these photos from our engineering lab! We\'re working on some exciting new robotics projects. 🤖',
    timestamp: '2023-05-09T16:45:00Z',
    likesCount: 76,
    commentsCount: 23,
    sharesCount: 8,
    liked: false,
    media: [
      {
        id: 'media2',
        url: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        type: 'image'
      },
      {
        id: 'media3',
        url: 'https://images.pexels.com/photos/8566408/pexels-photo-8566408.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        type: 'image'
      },
      {
        id: 'media4',
        url: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        type: 'image'
      },
      {
        id: 'media5',
        url: 'https://images.pexels.com/photos/2599245/pexels-photo-2599245.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        type: 'image'
      }
    ],
    group: {
      id: 'group2',
      name: 'Robotics Team',
      membersCount: 35,
      type: 'public'
    },
    comments: [
      {
        id: 'comment3',
        author: mockUsers[4],
        content: 'This looks amazing! Can\'t wait to see the final product.',
        timestamp: '2023-05-09T17:30:00Z',
        likesCount: 5
      }
    ]
  }
]

export const mockTrends: TrendType[] = [
  {
    id: 'trend1',
    title: 'End of Semester Party',
    category: 'Events',
    timestamp: '2023-05-11T10:00:00Z',
    engagementCount: 342
  },
  {
    id: 'trend2',
    title: 'Campus Sustainability Initiative',
    category: 'Campus',
    timestamp: '2023-05-10T14:20:00Z',
    engagementCount: 183
  },
  {
    id: 'trend3',
    title: 'New Library Hours Announced',
    category: 'Academic',
    timestamp: '2023-05-09T09:30:00Z',
    engagementCount: 256
  },
  {
    id: 'trend4',
    title: 'Basketball Championship Results',
    category: 'Sports',
    timestamp: '2023-05-08T22:15:00Z',
    engagementCount: 421
  }
]