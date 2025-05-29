import React from 'react'
import { PostCard } from '@/components/feed/post-card'
import { mockPosts } from '@/lib/mock-data'

export function NewsFeed() {
  return (
    <div className="space-y-4">
      {mockPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}