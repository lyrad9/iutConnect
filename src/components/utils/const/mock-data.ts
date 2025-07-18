import { UserType, TrendType } from "../types";

export const mockUsers: UserType[] = [
  {
    id: "user1",
    name: "Jane Doe",
    avatarUrl:
      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    department: "Computer Science",
    year: 3,
    bio: "CS major with a minor in design. Coffee enthusiast and code wizard.",
    verified: true,
  },
  {
    id: "user2",
    name: "John Smith",
    avatarUrl:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    department: "Business Administration",
    year: 2,
    bio: "Future entrepreneur. I love connecting with new people!",
    verified: false,
  },
  {
    id: "user3",
    name: "Alex Johnson",
    avatarUrl:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    department: "Psychology",
    year: 4,
    bio: "Psychology student interested in human behavior. Always curious.",
    verified: false,
  },
  {
    id: "user4",
    name: "Emily Wilson",
    avatarUrl:
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    department: "Engineering",
    year: 3,
    bio: "Building a better future through engineering. Robotics enthusiast.",
    verified: true,
  },
  {
    id: "user5",
    name: "Michael Chen",
    avatarUrl:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    department: "Mathematics",
    year: 2,
    bio: "Math genius by day, gamer by night. Let's solve problems together!",
    verified: false,
  },
  {
    id: "user5",
    name: "Michael Chen",
    avatarUrl:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    department: "Mathematics",
    year: 2,
    bio: "Math genius by day, gamer by night. Let's solve problems together!",
    verified: false,
  },
  {
    id: "user5",
    name: "Michael Chen",
    avatarUrl:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    department: "Mathematics",
    year: 2,
    bio: "Math genius by day, gamer by night. Let's solve problems together!",
    verified: false,
  },
  {
    id: "user5",
    name: "Michael Chen",
    avatarUrl:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    department: "Mathematics",
    year: 2,
    bio: "Math genius by day, gamer by night. Let's solve problems together!",
    verified: false,
  },
];

export const mockSuggestedUsers: UserType[] = [
  {
    id: "user3",
    name: "Alex Johnson",
    avatarUrl:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    department: "Psychology",
    mutualConnections: 12,
  },
  {
    id: "user4",
    name: "Emily Wilson",
    avatarUrl:
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    department: "Engineering",
    mutualConnections: 8,
  },
  {
    id: "user5",
    name: "Michael Chen",
    avatarUrl:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    department: "Mathematics",
    mutualConnections: 5,
  },
];

export const mockTrends: TrendType[] = [
  {
    id: "trend1",
    title: "End of Semester Party",
    category: "Events",
    timestamp: "2023-05-11T10:00:00Z",
    engagementCount: 342,
  },
  {
    id: "trend2",
    title: "Campus Sustainability Initiative",
    category: "Campus",
    timestamp: "2023-05-10T14:20:00Z",
    engagementCount: 183,
  },
  {
    id: "trend3",
    title: "New Library Hours Announced",
    category: "Academic",
    timestamp: "2023-05-09T09:30:00Z",
    engagementCount: 256,
  },
  {
    id: "trend4",
    title: "Basketball Championship Results",
    category: "Sports",
    timestamp: "2023-05-08T22:15:00Z",
    engagementCount: 421,
  },
];
