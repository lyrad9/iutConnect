"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  MoreHorizontal,
  MessageSquare,
  Heart,
  Share,
  BookmarkPlus,
  Send,
  BadgeCheck,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/src/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { cn, getInitials } from "@/src/lib/utils";
import { Textarea } from "@/src/components/ui/textarea";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { likePost, unlikePost } from "@/convex/posts";
import { Id } from "@/convex/_generated/dataModel";
import { CommentsList } from "../comments/commentsList";
import { SmartAvatar } from "../smart-avatar";

// Types pour les composants
export interface PostAuthorType {
  id: string;
  name: string;
  username?: string;
  profilePicture?: string;
  isAdmin: boolean;
}

export interface PostGroupType {
  id: string;
  name: string;
  profilePicture?: string;
  creator: string;
}

export interface PostCommentType {
  id: string;
  content: string;
  createdAt: number;
  author: PostAuthorType;
  likes: Id<"users">[];
  isLiked: boolean;
}

/* export interface PostMediaType {
  url: string;
  type: "image" | "video";
} */

export interface PostType {
  id: string;
  author: PostAuthorType;
  content: string;
  medias: string[];
  createdAt: number;
  //
  likes: number;
  // Indique si le post est aimé par l'utilisateur connecté
  isLiked: boolean;
  // Tableau de commentaires
  comments: PostCommentType[];
  // Nombre de commentaires
  commentsCount: number;
  group?: PostGroupType;
  // Indique si le post est un post de groupe
  isGroupPost: boolean;
}

interface PostCardProps {
  post: PostType;
  highlightComments?: boolean;
}

export function PostCard({ post, highlightComments = false }: PostCardProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((tick) => tick + 1); // Force le re-render
    }, 60_000); // Toutes les minutes
    return () => clearInterval(interval);
  }, []);
  console.log("post", post);
  const [showComments, setShowComments] = useState(false);
  // État pour le nombre de commentaires
  const [commentsCount, setCommentsCount] = useState<number>(
    post.commentsCount
  );
  console.log("commentsCount", commentsCount);
  // État pour suivre si le post est aimé
  const [isLiked, setIsLiked] = useState(post.isLiked);
  // État pour le nombre de likes
  const [likesCount, setLikesCount] = useState(post.likes);
  // État pour afficher/masquer les commentaires

  // Mutation pour aimer un post
  const likePost = useMutation(api.posts?.likePost as any);
  // Mutation pour ne plus aimer un post
  const unlikePost = useMutation(api.posts?.unlikePost as any);
  // Mutation pour commenter un post

  // Vérifier si le post est créé par le créateur du groupe
  const isGroupAdminPost = post.group && post.isGroupPost && post.group.creator;

  // Gérer l'action "j'aime"
  const handleLike = async () => {
    try {
      // Mettre à jour l'UI immédiatement (optimiste)
      setIsLiked(!isLiked);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

      // Appeler l'API pour persister l'action
      if (isLiked) {
        await unlikePost({ postId: post.id as Id<"posts"> });
      } else {
        await likePost({ postId: post.id as Id<"posts"> });
      }
    } catch (error) {
      // En cas d'erreur, revenir à l'état précédent
      console.error("Erreur lors du like:", error);
      setIsLiked(isLiked);
      setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
    }
  };
  // Gérer l'affichage des commentaires
  const handleComment = () => {
    setShowComments((prev) => !prev);
  };

  return (
    <Card className="overflow-hidden">
      {/* En-tête de la carte avec les informations de l'auteur */}
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            {/* Avatar de l'auteur ou du groupe si c'est un post de groupe par le créateur du groupe */}
            {/*   <SmartAvatar
              avatar={user?.profilePicture}
              name={user?.firstName + " " + user?.lastName}
              size="xl"
              className="size-32 border-4 border-background"
              fallbackClassName="text-4xl"
            /> */}
            {isGroupAdminPost && (
              <SmartAvatar avatar={post.group?.profilePicture} size="md" />
            )}

            {!isGroupAdminPost && (
              <SmartAvatar
                avatar={post.author.profilePicture}
                name={post.author.name}
                size="md"
              />
            )}

            {/* 
            <Avatar className="size-10">
              {isGroupAdminPost ? (
                // Pour les posts de groupe par le créateur du groupe, on affiche l'avatar du groupe
                <AvatarImage
                  src={post.group?.profilePicture || "/placeholder.svg"}
                  alt={post.group?.name}
                />
              ) : (
                // Pour les posts normaux, on affiche l'avatar de l'utilisateur
                <AvatarImage
                  src={post.author.profilePicture || undefined}
                  alt={post.author.name}
                />
              )}
               Fallback en cas d'absence d'image chez le user 
              {!isGroupAdminPost && (
                <AvatarFallback className="bg-primary dark:bg-white text-white dark:text-primary font-bold">
                  {getInitials(post.author.name)}
                </AvatarFallback>
              )}
            </Avatar> 
            
            */}

            <div>
              {/* Affichage du nom d'utilisateur si disponible (pour Strategy A) */}
              {post.author.username && !isGroupAdminPost && (
                <div className="text-sm text-muted-foreground">
                  @{post.author.username}
                </div>
              )}

              <div className="flex items-center gap-2">
                {/* Nom principal (groupe pour admin posts, auteur pour le reste) */}
                <Link
                  href={
                    isGroupAdminPost
                      ? `/groups/${post.group?.id}`
                      : `/profile/${post.author.id}`
                  }
                  className="font-semibold hover:underline"
                >
                  {isGroupAdminPost ? post.group?.name : post.author.name}
                </Link>

                {/* Badge pour les administrateurs */}
                {post.author.isAdmin && (
                  <BadgeCheck className="size-4 text-green-500 stroke-2" />
                  /*   <Badge
                    variant="outline"
                    className="text-xs px-1 py-0 border-primary text-primary"
                  >
                    Admin
                  </Badge> */
                )}
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {/* Date relative */}
                <span>
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </span>

                {/* Afficher le groupe si c'est un post de groupe */}
                {post.isGroupPost && post.group && (
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

          {/* Menu d'actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full p-0"
              >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Plus d&apos;options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/*    <DropdownMenuItem>Enregistrer</DropdownMenuItem>
              <DropdownMenuItem>Signaler</DropdownMenuItem>
 */}
              {/*     <DropdownMenuSeparator /> */}
              <DropdownMenuItem className="text-destructive">
                Supprimer le post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {/* Contenu du post */}
      <CardContent className="pt-3">
        {/* Texte du post */}
        <p className="whitespace-pre-line text-sm">{post.content}</p>

        {/* Médias (images ou vidéos) */}
        {post.medias && post.medias.length > 0 && (
          <div
            className={cn(
              "mt-3 grid gap-2",
              post.medias.length === 1
                ? "grid-cols-1"
                : post.medias.length === 2
                  ? "grid-cols-2"
                  : post.medias.length === 3
                    ? "grid-cols-2"
                    : "grid-cols-2"
            )}
          >
            {/* Afficher jusqu'à 4 médias */}
            {post.medias.slice(0, 4).map((media, index) => (
              <div
                key={index}
                className={cn(
                  "overflow-hidden rounded-lg",
                  post.medias && post.medias.length === 3 && index === 0
                    ? "col-span-2"
                    : "",
                  post.medias && post.medias.length > 3 && index === 0
                    ? "col-span-2 row-span-2"
                    : ""
                )}
              >
                <img
                  src={media}
                  alt="Media du post"
                  className="size-full object-cover transition-transform hover:scale-105"
                  loading="lazy" // Chargement paresseux pour les images
                />
                {/*  {media.type === "image" ? (
                  <img
                    src={media.url}
                    alt="Media du post"
                    className="size-full object-cover transition-transform hover:scale-105"
                    loading="lazy" // Chargement paresseux pour les images
                  />
                ) : (
                  <video
                    src={media.url}
                    controls
                    className="size-full"
                    preload="metadata" // Précharger uniquement les métadonnées
                  />
                )} */}
              </div>
            ))}

            {/* Indicateur pour médias additionnels */}
            {post.medias && post.medias.length > 4 && (
              <div className="relative col-span-1 overflow-hidden rounded-lg">
                <img
                  src={post.medias[4]}
                  alt="Media du post"
                  className="size-full object-cover brightness-50"
                />
                {/*    <img
                  src={post.medias[4].url}
                  alt="Media du post"
                  className="size-full object-cover brightness-50"
                /> */}
                <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
                  +{post.medias.length - 4}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>

      {/* Pied de carte avec actions sociales */}
      <CardFooter className="flex items-center justify-between border-t py-2 px-4">
        <div className="flex items-center gap-1">
          {/* Bouton "J'aime" */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 px-2 "
            onClick={handleLike}
          >
            <Heart
              className={cn(
                "size-4",
                isLiked ? "fill-destructive text-destructive" : ""
              )}
            />
            <span className="text-xs">{likesCount}</span>
          </Button>

          {/* Bouton commentaires */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 px-2"
            onClick={handleComment}
          >
            <MessageSquare className="size-4" />
            <span className="text-xs">{commentsCount}</span>
          </Button>

          {/* Bouton partage */}
          {/*   <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
            <Share className="size-4" />
            <span className="sr-only">Partager</span>
          </Button> */}
        </div>

        {/* Bouton enregistrer */}
        <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
          <BookmarkPlus className="size-4" />
          <span className="sr-only">Enregistrer</span>
        </Button>
      </CardFooter>

      {/* Section de commentaires */}
      <CommentsList
        /*  post={post} */
        postId={post.id}
        showComments={showComments}
        setCommentsCount={setCommentsCount}
      />
    </Card>
  );
}
