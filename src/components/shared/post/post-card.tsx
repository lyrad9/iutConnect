"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  MoreHorizontal,
  MessageSquare,
  Heart,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

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
import { api } from "@/convex/_generated/api";
import { likePost, unlikePost } from "@/convex/posts";
import { Id } from "@/convex/_generated/dataModel";
import { CommentsList } from "../comments/commentsList";
import { SmartAvatar } from "../smart-avatar";
import { useRouter } from "next/navigation";
import { AdminBadgeCheck } from "@/src/svg/Icons";
import { DeletePostModal } from "../post/delete-post-modal";
import { CommentsModal } from "../comments/comments-modal";
import { toast } from "sonner";
import { BookmarkIconButton } from "@/src/components/ui/bookmark-icon-button";
import { Dialog, DialogContent } from "@/src/components/ui/dialog";
import { motion, AnimatePresence } from "motion/react";
import { useMutation, useQuery } from "convex/react";

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
  isFavorite: boolean;
}

interface PostCardProps {
  post: PostType;
  highlightComments?: boolean;
}

// Composant pour afficher une image en plein écran avec zoom
const ImageViewer = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious,
}: {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-screen-lg h-[90vh] max-h-[90vh] p-0 bg-black/90 border-none overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Image actuelle */}
          <div className="w-full h-full flex items-center justify-center">
            <motion.img
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={images[currentIndex]}
              alt="Image agrandie"
              className="h-full max-w-full object-cover"
              /* style={
                viewerImgMaxHeight
                  ? { maxHeight: viewerImgMaxHeight }
                  : undefined
              }
              onLoad={(e) => {
                const width = e.currentTarget.naturalWidth;
                if (width > 500) setViewerImgMaxHeight("500px");
                else setViewerImgMaxHeight(undefined);
              }} */
            />
          </div>

          {/* Bouton de fermeture */}
          {/* <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white z-50 rounded-full"
            onClick={onClose}
          >
            <X size={20} />
          </Button> */}

          {/* Navigation entre images */}
          {images.length > 1 && (
            <>
              {currentIndex > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 bg-black/40 hover:bg-black/60 text-white z-50 rounded-full"
                  onClick={onPrevious}
                >
                  <ChevronLeft size={24} />
                </Button>
              )}
              {currentIndex < images.length - 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 bg-black/40 hover:bg-black/60 text-white z-50 rounded-full"
                  onClick={onNext}
                >
                  <ChevronRight size={24} />
                </Button>
              )}

              {/* Indicateur de position */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "h-2 w-2 rounded-full transition-all",
                      index === currentIndex
                        ? "bg-white scale-125"
                        : "bg-white/50"
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export function PostCard({ post, highlightComments = false }: PostCardProps) {
  // Ajout d'un état local pour la hauteur max
  const [imgMaxHeight, setImgMaxHeight] = React.useState<string | undefined>(
    undefined
  );
  const [, setTick] = useState(0);
  const router = useRouter();
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((tick) => tick + 1); // Force le re-render
    }, 60_000); // Toutes les minutes
    return () => clearInterval(interval);
  }, []);
  /*   console.log("post", post); */
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);

  // États pour la visionneuse d'images
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mutation pour aimer un post
  const likePost = useMutation(api.posts?.likePost);
  // Mutation pour ne plus aimer un post
  const unlikePost = useMutation(api.posts?.unlikePost);
  // Mutations et requêtes pour les favoris
  const addToFavorites = useMutation(api.favorites.addToFavorites);
  const removeFromFavorites = useMutation(api.favorites.removeFromFavorites);

  // Mutation pour commenter un post

  // Vérifier si le post est créé par le créateur du groupe
  const isGroupAdminPost = post.group && post.isGroupPost && post.group.creator;

  // Gérer l'action "j'aime"
  const handleLike = async () => {
    try {
      // Appeler l'API pour persister l'action
      if (post.isLiked) {
        await unlikePost({ postId: post.id as Id<"posts"> });
      } else {
        await likePost({ postId: post.id as Id<"posts"> });
      }
    } catch (error) {
      // En cas d'erreur, revenir à l'état précédent
      console.error("Erreur lors du like:", error);
    }
  };
  // Gérer l'ouverture de la modal de commentaires
  const handleOpenCommentsModal = () => {
    setIsCommentsModalOpen(true);
  };

  // Gérer l'ajout/suppression des favoris
  const handleFavorite = async () => {
    try {
      if (post.isFavorite) {
        await removeFromFavorites({ postId: post.id as Id<"posts"> });

        toast.success("Publication retirée des favoris");
      } else {
        await addToFavorites({ postId: post.id as Id<"posts"> });

        toast.success("Publication ajoutée aux favoris");
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la gestion des favoris");
    }
  };

  // Gérer le clic sur une image
  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsImageViewerOpen(true);
  };

  // Navigation dans la visionneuse d'images
  const goToNextImage = () => {
    if (currentImageIndex < post.medias.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const goToPreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  // État pour l'ouverture de la modal de suppression
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const currentUser = useQuery(api.users?.currentUser);

  return (
    <Card className="overflow-hidden gap-4">
      {/* En-tête de la carte avec les informations de l'auteur */}
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            {/* Avatar de l'auteur ou du groupe si c'est un post de groupe par le créateur du groupe */}

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

            <div>
              {/* Affichage du nom d'utilisateur si disponible (pour Strategy A) */}
              {post.author.username && !isGroupAdminPost && (
                <div className="text-sm text-muted-foreground">
                  @{post.author.username}
                </div>
              )}

              <div className="flex items-center gap-1">
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
                  <AdminBadgeCheck className="size-4  text-blue-500 stroke-2" />
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
                      {`Groupe (${post.group?.name})`}
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
              <DropdownMenuItem
                disabled={currentUser?._id !== post.author.id}
                className="text-destructive"
                onClick={() => setIsDeleteModalOpen(true)}
              >
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
            {post.medias.slice(0, 4).map((media, index) => {
              //verifier si  c'est le dernier post parmi les quatre
              if (index === post.medias.slice(0, 4).length - 1) {
                return (
                  <div
                    key={index}
                    className={cn(
                      "overflow-hidden rounded-lg cursor-pointer relative group"
                      /*  post.medias && post.medias.length >= 3 && index === 0
                        ? "col-span-2"
                        : "", */
                    )}
                    onClick={() => handleImageClick(index)}
                  >
                    <img
                      src={media}
                      alt="Media du post"
                      className="size-full object-cover transition-transform group-hover:scale-105 duration-300"
                      loading="lazy" // Chargement paresseux pour les images
                      style={
                        imgMaxHeight ? { maxHeight: imgMaxHeight } : undefined
                      }
                      onLoad={(e) => {
                        const width = e.currentTarget.naturalWidth;
                        if (width > 400) setImgMaxHeight("400px");
                      }}
                    />

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      {post.medias && post.medias.length <= 4 && (
                        <div className="transform scale-75 group-hover:scale-100 transition-all p-2 rounded-full bg-black/40 text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            <line x1="11" y1="8" x2="11" y2="14"></line>
                            <line x1="8" y1="11" x2="14" y2="11"></line>
                          </svg>
                        </div>
                      )}
                    </div>
                    {/* Indicateur pour médias additionnels */}
                    {post.medias && post.medias.length > 4 && (
                      <div className="bg-black/30 absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
                        +{post.medias.length - 4}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <div
                  key={index}
                  className={cn(
                    "overflow-hidden rounded-lg cursor-pointer relative group",

                    /*   index !== 0 && "h-36", */
                    post.medias && post.medias.length === 3 && index === 0
                      ? "col-span-2"
                      : "",
                    post.medias && post.medias.length > 3 && index === 0
                      ? "col-span-2"
                      : ""
                  )}
                  onClick={() => handleImageClick(index)}
                >
                  <img
                    src={media}
                    alt="Media du post"
                    className="size-full object-cover transition-transform group-hover:scale-105 duration-300"
                    loading="lazy" // Chargement paresseux pour les images
                    style={
                      imgMaxHeight
                        ? { maxHeight: imgMaxHeight }
                        : { maxHeight: "200px" }
                    }
                    onLoad={(e) => {
                      const width = e.currentTarget.naturalWidth;
                      if (width > 400) setImgMaxHeight("400px");
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="transform scale-75 group-hover:scale-100 transition-all p-2 rounded-full bg-black/40 text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="11" y1="8" x2="11" y2="14"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {/* Pied de carte avec actions sociales */}
      <CardFooter className="flex items-center justify-between">
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
                post.isLiked ? "fill-destructive text-destructive" : ""
              )}
            />
            {post.likes > 0 && <span className="text-xs">{post.likes}</span>}
          </Button>

          {/* Bouton commentaires */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 px-2"
            onClick={handleOpenCommentsModal}
          >
            <MessageSquare className="size-4" />
            {post.commentsCount > 0 && (
              <span className="text-xs">{post.commentsCount}</span>
            )}
          </Button>

          {/* Bouton partage */}
          {/*   <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
            <Share className="size-4" />
            <span className="sr-only">Partager</span>
          </Button> */}
        </div>

        {/* Bouton favoris */}
        <BookmarkIconButton
          isSaved={post.isFavorite}
          onClick={handleFavorite}
          className="h-8 w-8 rounded-full p-0"
          size={20}
        />
      </CardFooter>

      {/* Visionneuse d'images */}
      <ImageViewer
        images={post.medias}
        currentIndex={currentImageIndex}
        isOpen={isImageViewerOpen}
        onClose={() => setIsImageViewerOpen(false)}
        onNext={goToNextImage}
        onPrevious={goToPreviousImage}
      />

      {/* Modal de commentaires */}
      <CommentsModal
        postId={post.id}
        isOpen={isCommentsModalOpen}
        onClose={() => setIsCommentsModalOpen(false)}
      />

      {/* Modal de confirmation de suppression */}
      <DeletePostModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        postId={post.id}
      />
    </Card>
  );
}
