"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/src/components/ui/card";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Flag,
  Bookmark,
  Trash2,
  Edit,
  Copy,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { cn } from "@/src/lib/utils";

interface PostCardWithDropdownProps {
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  timestamp: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  isOwner?: boolean;
  onLike?: () => void;
  isLiked?: boolean;
}

/**
 * Composant de carte de publication avec menu déroulant d'options
 * Affiche le contenu d'un post avec des actions comme aimer, commenter, partager
 */
export function PostCardWithDropdown({
  user,
  timestamp,
  content,
  image,
  likes,
  comments,
  shares,
  isOwner = false,
  onLike,
  isLiked = false,
}: PostCardWithDropdownProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={user.avatar || "/placeholder.svg"}
                alt={`@${user.username}`}
              />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <Link
                href={`/profile/${user.username}`}
                className="font-semibold hover:underline"
              >
                {user.name}
              </Link>
              <p className="text-xs text-muted-foreground">{timestamp}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Plus d&apos;options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Bookmark className="h-4 w-4 mr-2" />
                Enregistrer
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Copier le lien
              </DropdownMenuItem>
              {isOwner ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Flag className="h-4 w-4 mr-2" />
                    Signaler
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button
                      variant="ghost"
                      className="p-0 h-auto text-destructive"
                    >
                      Masquer
                    </Button>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="whitespace-pre-wrap">{content}</p>
        {image && (
          <div className="mt-3 rounded-md overflow-hidden">
            <Image
              src={image || "/placeholder.svg"}
              alt="Post image"
              width={600}
              height={300}
              className="w-full object-cover"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t px-6 py-3">
        <div className="flex justify-between w-full text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-1 hover:bg-red-50 dark:hover:bg-red-950/30 group",
              isLiked && "text-red-500 hover:text-red-600"
            )}
            onClick={onLike}
          >
            <Heart
              className={cn(
                "h-4 w-4 group-hover:fill-red-500",
                isLiked && "fill-red-500"
              )}
            />
            <span>{likes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 hover:bg-blue-50 dark:hover:bg-blue-950/30 group"
          >
            <MessageCircle className="h-4 w-4 group-hover:fill-blue-500" />
            <span>{comments}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 hover:bg-green-50 dark:hover:bg-green-950/30 group"
          >
            <Share2 className="h-4 w-4 group-hover:fill-green-500" />
            <span>{shares}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
