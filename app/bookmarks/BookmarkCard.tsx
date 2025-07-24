"use client";

import React, { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { MoreHorizontal, Eye, BookmarkMinus } from "lucide-react";
import { SmartAvatar } from "@/src/components/shared/smart-avatar";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/src/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/src/components/ui/dialog";

import { PostType } from "@/src/components/shared/post/post-card";
import { useRouter } from "next/navigation";

type BookmarkCardProps = {
  // Utilise le type PostType de PostCard sans isFavorite

  favoritePost: Omit<PostType, "isFavorite">;
};
export function BookmarkCard({ favoritePost }: BookmarkCardProps) {
  console.log("favoriteMedia", favoritePost.medias.length);
  console.log("favoritePost", favoritePost);
  const router = useRouter();
  // États
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Mutations
  const removeFromFavorites = useMutation(api.favorites.removeFromFavorites);

  // Helpers
  const formattedTime = formatDistanceToNow(new Date(favoritePost.createdAt), {
    addSuffix: true,
    locale: fr,
  });

  // Titre de la carte: première ligne du contenu ou valeur par défaut
  const title =
    favoritePost.content.split("\n")[0] ||
    `Publication de ${favoritePost.author.name}`;

  // Choisir l'image à afficher
  const mainImage =
    favoritePost.medias && favoritePost.medias.length > 0
      ? favoritePost.medias[0]
      : favoritePost.group?.profilePicture ||
        favoritePost.author.profilePicture;

  // Manipulateurs d'événements
  const handleRemoveFavorite = async () => {
    try {
      await removeFromFavorites({ postId: favoritePost.id as Id<"posts"> });
      toast.success("Publication retirée des favoris");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression du favori");
    }
  };

  return (
    <>
      <Card className="gap-2  overflow-hidden transition-all duration-200 hover:shadow-md">
        {/* Zone de la photo - cliquable pour ouvrir la preview */}
        <CardHeader className="flex justify-end py-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full p-0"
              >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsPreviewOpen(true)}>
                <Eye className="mr-2 h-4 w-4" />
                <span>Voir la publication</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleRemoveFavorite}
                className="text-destructive focus:text-destructive"
              >
                <BookmarkMinus className="mr-2 h-4 w-4" />
                <span>Retirer des favoris</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className=" flex flex-row gap-4">
          <div
            className="flex-1 relative h-28 flex-shrink-0 cursor-pointer"
            onClick={() => setIsPreviewOpen(true)}
          >
            <Image
              src={mainImage ?? "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover rounded-lg"
            />
            {/*   <img
              src={mainImage ?? "/placeholder.svg"}
              alt={title}
              width={64}
              height={32}
              className="object-cover rounded-lg"
            /> */}
          </div>

          <div className="flex-1 sm:flex-2 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <SmartAvatar
                avatar={favoritePost.author.profilePicture}
                name={favoritePost.author.name}
                size="sm"
              />
              <div>
                <h3 className="font-medium text-sm line-clamp-1">
                  {favoritePost.author.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Ajouté {formattedTime}
                </p>
              </div>
            </div>

            {/* Titre/contenu du post */}
            <h2 className="font-semibold mb-1 line-clamp-2">{title}</h2>

            {/* Nombre de photos si applicable */}
            {favoritePost.medias && favoritePost.medias.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {favoritePost.medias.length} photos
              </p>
            )}
          </div>
        </CardContent>

        {/*    <CardFooter className="p-2 pt-0 flex justify-end">
         
         
        </CardFooter> */}
      </Card>

      {/* Modal de prévisualisation */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[600px] p-0">
          <div className="p-6 text-center">
            <p className="text-muted-foreground">
              Fonctionnalité de prévisualisation non disponible pour le moment.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
