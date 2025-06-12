"use client";

import React, { useState } from "react";
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
import { cn, getInitialsFromName } from "@/src/lib/utils";
import { Textarea } from "@/src/components/ui/textarea";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// Types pour les composants
export interface PostAuthorType {
  id: string;
  name: string;
  username?: string | null;
  profilePicture?: string | null;
  isAdmin?: boolean;
}

export interface PostGroupType {
  id: string;
  name: string;
  profilePicture?: string | null;
}

export interface PostCommentType {
  id: string;
  content: string;
  createdAt: number;
  author: PostAuthorType;
  likes: number;
  isLiked?: boolean;
}

export interface PostMediaType {
  url: string;
  type: "image" | "video";
}

export interface PostType {
  id: string;
  author: PostAuthorType;
  content: string;
  medias?: PostMediaType[];
  createdAt: number;
  likes: number;
  isLiked?: boolean;
  comments?: PostCommentType[];
  commentsCount: number;
  group?: PostGroupType;
  isGroupPost?: boolean;
}

interface PostCardProps {
  post: PostType;
  highlightComments?: boolean;
}

export function PostCard({ post, highlightComments = false }: PostCardProps) {
  // État pour suivre si le post est aimé
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  // État pour le nombre de likes
  const [likesCount, setLikesCount] = useState(post.likes);
  // État pour afficher/masquer les commentaires
  const [showComments, setShowComments] = useState(highlightComments);
  // État pour le texte du commentaire
  const [commentText, setCommentText] = useState("");
  // État pour les commentaires (copie locale pour l'optimisme UI)
  const [comments, setComments] = useState<PostCommentType[]>(
    post.comments || []
  );
  // État pour le nombre de commentaires
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);

  // Mutation pour aimer un post
  const likePost = useMutation(api.posts?.likePost as any);
  // Mutation pour commenter un post
  const commentPost = useMutation(api.comments?.createComment as any);

  // Vérifier si le post est créé par un administrateur de groupe
  const isGroupAdminPost =
    post.group && post.isGroupPost && post.author.isAdmin;

  // Gérer l'action "j'aime"
  const handleLike = async () => {
    try {
      // Mettre à jour l'UI immédiatement (optimiste)
      setIsLiked(!isLiked);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

      // Appeler l'API pour persister l'action
      if (likePost) {
        await likePost({
          postId: post.id,
          action: isLiked ? "unlike" : "like",
        });
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

  // Soumettre un commentaire
  const submitComment = async () => {
    if (!commentText.trim()) return;

    try {
      // Créer un commentaire temporaire pour l'UI optimiste
      const tempComment = {
        id: `temp-${Date.now()}`,
        content: commentText,
        createdAt: Date.now(),
        author: {
          id: "current-user", // À remplacer par l'ID réel de l'utilisateur
          name: "Vous", // À remplacer par le nom réel de l'utilisateur
          profilePicture: undefined, // À remplacer par l'avatar réel
        },
        likes: 0,
        isLiked: false,
      };

      // Mettre à jour l'UI immédiatement
      setComments((prev) => [tempComment, ...prev]);
      setCommentsCount((prev) => prev + 1);
      setCommentText("");

      // Appeler l'API pour persister le commentaire
      if (commentPost) {
        const result = await commentPost({
          targetId: post.id,
          targetType: "post",
          content: commentText,
        });

        // Si l'API renvoie un ID, mettre à jour le commentaire temporaire
        if (result && result.id) {
          setComments((prev) =>
            prev.map((c) =>
              c.id === tempComment.id ? { ...c, id: result.id } : c
            )
          );
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du commentaire:", error);
      // Annuler l'ajout du commentaire en cas d'erreur
      setComments((prev) => prev.filter((c) => c.id !== `temp-${Date.now()}`));
      setCommentsCount((prev) => prev - 1);
      setCommentText(commentText); // Restaurer le texte
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* En-tête de la carte avec les informations de l'auteur */}
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            {/* Avatar de l'auteur ou du groupe si c'est un post de groupe par un admin */}
            <Avatar className="size-10">
              {isGroupAdminPost ? (
                // Pour les posts de groupe par un admin, on affiche l'avatar du groupe
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

              {/* Fallback en cas d'absence d'image */}
              <AvatarFallback
                className={cn(
                  isGroupAdminPost && post.group
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {isGroupAdminPost && post.group
                  ? getInitialsFromName(post.group.name)
                  : getInitialsFromName(post.author.name)}
              </AvatarFallback>
            </Avatar>

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
                    isGroupAdminPost && post.group
                      ? `/groups/${post.group.id}`
                      : `/profile/${post.author.id}`
                  }
                  className="font-semibold hover:underline"
                >
                  {isGroupAdminPost && post.group
                    ? post.group.name
                    : post.author.name}
                </Link>

                {/* Badge pour les administrateurs */}
                {post.author.isAdmin && (
                  <Badge
                    variant="outline"
                    className="text-xs px-1 py-0 border-primary text-primary"
                  >
                    Admin
                  </Badge>
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

                {/* Afficher le nom de l'auteur si c'est un post de groupe par un admin */}
                {isGroupAdminPost && (
                  <>
                    <span>•</span>
                    <span>Publié par {post.author.name}</span>
                  </>
                )}

                {/* Afficher le groupe si ce n'est pas un post de groupe par un admin */}
                {post.group && !isGroupAdminPost && (
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
                <span className="sr-only">Plus d'options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Enregistrer</DropdownMenuItem>
              <DropdownMenuItem>Signaler</DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Supprimer
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
                {media.type === "image" ? (
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
                )}
              </div>
            ))}

            {/* Indicateur pour médias additionnels */}
            {post.medias && post.medias.length > 4 && (
              <div className="relative col-span-1 overflow-hidden rounded-lg">
                <img
                  src={post.medias[4].url}
                  alt="Media du post"
                  className="size-full object-cover brightness-50"
                />
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
            className="h-8 gap-1 px-2"
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
          <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
            <Share className="size-4" />
            <span className="sr-only">Partager</span>
          </Button>
        </div>

        {/* Bouton enregistrer */}
        <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
          <BookmarkPlus className="size-4" />
          <span className="sr-only">Enregistrer</span>
        </Button>
      </CardFooter>

      {/* Section de commentaires */}
      {showComments && (
        <div className="border-t p-4">
          {/* Formulaire de commentaire */}
          <div className="mb-4 flex gap-2">
            <Avatar className="h-8 w-8">
              {/* Remplacer par l'avatar de l'utilisateur connecté */}
              <AvatarImage src="/placeholder.svg" alt="Utilisateur connecté" />
              <AvatarFallback>
                {/* Remplacer par les initiales de l'utilisateur connecté */}
                UC
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex gap-2">
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Écrire un commentaire..."
                  className="min-h-[60px] resize-none flex-1"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="self-end h-8 w-8"
                  onClick={submitComment}
                  disabled={!commentText.trim()}
                >
                  <Send className="size-4" />
                  <span className="sr-only">Envoyer</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Liste des commentaires */}
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={comment.author.profilePicture || undefined}
                      alt={comment.author.name}
                    />
                    <AvatarFallback>
                      {getInitialsFromName(comment.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="rounded-xl bg-muted p-3">
                      {/* Affichage du nom d'utilisateur si disponible */}
                      {comment.author.username && (
                        <div className="text-xs text-muted-foreground">
                          @{comment.author.username}
                        </div>
                      )}
                      <div className="font-medium">{comment.author.name}</div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                    <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                      <button className="hover:text-foreground">J'aime</button>
                      <button className="hover:text-foreground">
                        Répondre
                      </button>
                      <span>
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              Aucun commentaire. Soyez le premier à commenter !
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
