"use client"

import React, { useState } from 'react'
import { Image, Smile, MapPin, Calendar, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export function CreatePostCard() {
  const [content, setContent] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [attachments, setAttachments] = useState<string[]>([])
  const { toast } = useToast()

  const handleFocus = () => {
    setIsExpanded(true)
  }

  const handleCancel = () => {
    setIsExpanded(false)
    setContent('')
    setAttachments([])
  }

  const handlePost = () => {
    if (!content.trim()) return

    toast({
      title: "Post created",
      description: "Your post has been published successfully.",
    })
    
    setContent('')
    setIsExpanded(false)
    setAttachments([])
  }

  const addAttachment = () => {
    // In a real app, this would open a file picker
    const mockImageUrl = "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    setAttachments(prev => [...prev, mockImageUrl])
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="mb-6 overflow-hidden rounded-xl border bg-card shadow-sm transition-all">
      <div className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={handleFocus}
              placeholder="What's on your mind?"
              className={cn(
                "min-h-[60px] w-full resize-none border-0 bg-transparent p-2 focus-visible:ring-0",
                isExpanded ? "min-h-[120px]" : ""
              )}
            />
            
            {attachments.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {attachments.map((url, index) => (
                  <div key={index} className="relative h-20 w-20 overflow-hidden rounded-md">
                    <img src={url} alt="Attachment" className="h-full w-full object-cover" />
                    <button 
                      onClick={() => removeAttachment(index)}
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-background/80 text-foreground hover:bg-background"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="border-t p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" size="sm" onClick={addAttachment}>
                <Image className="mr-1 h-4 w-4" />
                Photo
              </Button>
              <Button variant="ghost" size="sm">
                <Smile className="mr-1 h-4 w-4" />
                Feeling
              </Button>
              <Button variant="ghost" size="sm">
                <MapPin className="mr-1 h-4 w-4" />
                Location
              </Button>
              <Button variant="ghost" size="sm">
                <Calendar className="mr-1 h-4 w-4" />
                Event
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handlePost}
                disabled={!content.trim()}
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}