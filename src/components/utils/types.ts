import { eventTypes } from "./const/event-type";

export interface UserType {
  id: string;
  name: string;
  avatarUrl: string;
  department?: string;
  year?: number;
  bio?: string;
  verified?: boolean;
  mutualConnections?: number;
}

export interface GroupType {
  id: string;
  name: string;
  description?: string;
  membersCount?: number;
  type?: "public" | "private";
}

export interface CommentType {
  id: string;
  author: UserType;
  content: string;
  timestamp: string;
  likesCount?: number;
}

export interface MediaType {
  id: string;
  url: string;
  type: "image" | "video";
}

export interface EventType {
  id: number;
  title: string;
  date: string;
  endDate: string;
  location: string;
  description?: string;
  organizerId?: string;
  attendeesCount?: number;
  category?: string;
  image?: string;
  attending?: boolean;
}

export interface SideEventLinkProps {
  id: string;
  name: string;
  date: string;
  location: string;
  type: keyof typeof eventTypes;
}

export interface PostType {
  id: string;
  author: UserType;
  content: string;
  timestamp: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  liked?: boolean;
  media?: MediaType[];
  group?: GroupType;
  event?: EventType;
  comments?: CommentType[];
}

export interface TrendType {
  id: string;
  title: string;
  category: string;
  timestamp: string;
  engagementCount: number;
}
