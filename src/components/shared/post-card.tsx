"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  MoreHorizontal,
  MessageSquare,
  Repeat2,
  Heart,
  Share,
  BookmarkPlus,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { cn } from "@/src/lib/utils";
import { Textarea } from "@/src/components/ui/textarea";
import { PostType } from "@/src/components/utils/types";

interface PostCardProps {
  post: PostType;
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(post.liked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleLike = () => {
    if (liked) {
      setLikesCount((prev) => prev - 1);
    } else {
      setLikesCount((prev) => prev + 1);
    }
    setLiked((prev) => !prev);
  };

  const handleComment = () => {
    setShowComments((prev) => !prev);
  };

  const submitComment = () => {
    if (!commentText.trim()) return;
    // In a real app, this would send the comment to an API
    setCommentText("");
  };

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/profile/${post.author.id}`}
                  className="font-semibold hover:underline"
                >
                  {post.author.name}
                </Link>
                {post.author.verified && (
                  <span className="flex size-4 items-center justify-center rounded-full bg-primary">
                    <span className="sr-only">Verified</span>
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>
                  {formatDistanceToNow(new Date(post.timestamp), {
                    addSuffix: true,
                  })}
                </span>
                {post.group && (
                  <>
                    <span>•</span>
                    <Link
                      href={`/groups/${post.group.id}`}
                      className="hover:underline"
                    >
                      {post.group.name}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full p-0"
              >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Save Post</DropdownMenuItem>
              <DropdownMenuItem>Hide Post</DropdownMenuItem>
              <DropdownMenuItem>Follow {post.author.name}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Report Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-3">
          <p className="whitespace-pre-line text-sm">{post.content}</p>

          {post.media && post.media.length > 0 && (
            <div
              className={cn(
                "mt-3 grid gap-2",
                post.media.length === 1
                  ? "grid-cols-1"
                  : post.media.length === 2
                    ? "grid-cols-2"
                    : post.media.length === 3
                      ? "grid-cols-2"
                      : "grid-cols-2"
              )}
            >
              {post.media.slice(0, 4).map((media, index) => (
                <div
                  key={index}
                  className={cn(
                    "overflow-hidden rounded-lg",
                    post.media && post.media.length === 3 && index === 0
                      ? "col-span-2"
                      : "",
                    post.media && post.media.length > 3 && index === 0
                      ? "col-span-2 row-span-2"
                      : ""
                  )}
                >
                  <img
                    src={media.url}
                    alt="Post media"
                    className="size-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              ))}
              {post.media && post.media.length > 4 && (
                <div className="relative col-span-1 overflow-hidden rounded-lg">
                  <img
                    src={post.media[4].url}
                    alt="Post media"
                    className="size-full object-cover brightness-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
                    +{post.media.length - 4}
                  </div>
                </div>
              )}
            </div>
          )}

          {post.event && (
            <div className="mt-3 rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-md border bg-background text-center">
                  <span
                    suppressHydrationWarning
                    className="text-xs uppercase text-muted-foreground"
                  >
                    {new Date(post.event.date).toLocaleString("default", {
                      month: "short",
                    })}
                  </span>
                  <span className="text-sm font-bold">
                    {new Date(post.event.date).getDate()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">{post.event.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {post.event.location}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 px-2"
              onClick={handleLike}
            >
              <Heart
                className={cn(
                  "size-4",
                  liked ? "fill-destructive text-destructive" : ""
                )}
              />
              <span className="text-xs">{likesCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 px-2"
              onClick={handleComment}
            >
              <MessageSquare className="size-4" />
              <span className="text-xs">{post.commentsCount}</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
              <Repeat2 className="size-4" />
              <span className="text-xs">{post.sharesCount}</span>
            </Button>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-full p-0"
            >
              <BookmarkPlus className="size-4" />
              <span className="sr-only">Save</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-full p-0"
            >
              <Share className="size-4" />
              <span className="sr-only">Share</span>
            </Button>
          </div>
        </div>
      </div>

      {showComments && (
        <div className="border-t p-4">
          <div className="mb-4 flex gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="User"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="min-h-[60px] resize-none"
              />
              <div className="mt-2 flex justify-end">
                <Button
                  size="sm"
                  onClick={submitComment}
                  disabled={!commentText.trim()}
                >
                  Comment
                </Button>
              </div>
            </div>
          </div>

          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-4">
              {post.comments.map((comment, index) => (
                <div key={index} className="flex gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={comment.author.avatarUrl}
                      alt={comment.author.name}
                    />
                    <AvatarFallback>
                      {comment.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="rounded-xl bg-muted p-3">
                      <div className="font-medium">{comment.author.name}</div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                    <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                      <button className="hover:text-foreground">Like</button>
                      <button className="hover:text-foreground">Reply</button>
                      <span>
                        {formatDistanceToNow(new Date(comment.timestamp), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
