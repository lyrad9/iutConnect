"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Switch } from "@/src/components/ui/switch";
import { Badge } from "@/src/components/ui/badge";
import { toast } from "sonner";
import { Globe, Lock, Eye, EyeOff, Shield, UserPlus } from "lucide-react";

import AvatarRoundedUploader from "@/src/components/ui/avatar-rounded-uploader";
import FileUploader from "@/src/components/ui/file-uploader";
import InputWithTags from "@/src/components/ui/input-with-tags";
import MultipleSelector from "@/src/components/ui/multiselect";
import { GROUP_MAIN_CATEGORIES } from "@/src/components/utils/const/group-main-categories";
import {
  groupFormSchema,
  GroupFormValues,
  defaultGroupFormValues,
} from "./group-form-schema";
import { Id } from "@/convex/_generated/dataModel";
import { SmartAvatar } from "@/src/components/shared/smart-avatar";
import { useAuthToken } from "@convex-dev/auth/react";

// Composant pour afficher l'utilisateur actuel comme administrateur du groupe
function GroupAdminHeader() {
  const user = useQuery(api.users.currentUser);

  if (!user)
    return (
      <div className="h-16 w-full animate-pulse rounded-md bg-muted"></div>
    );

  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <div className="relative">
        <SmartAvatar
          avatar={user.profilePicture || ""}
          name={`${user.firstName} ${user.lastName}`}
          size="lg"
          className="object-center"
        />

        <Badge
          className="absolute -bottom-1 -right-1 bg-primary"
          variant="secondary"
        >
          <Shield className="mr-1 h-3 w-3" /> Admin
        </Badge>
      </div>
      <div>
        <p className="font-medium">{`${user.firstName} ${user.lastName}`}</p>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );
}

// Composant principal pour la création de groupe
export default function GroupCreateLayout() {
  const token = useAuthToken();
  const apiUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
  console.log("apiUrl", apiUrl);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createForum = useMutation(api.forums.createForum);

  // Initialiser le formulaire avec react-hook-form et zod
  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: defaultGroupFormValues,
    mode: "onChange",
  });

  // Gérer la recherche de membres pour le multiselect
  const [searchQuery, setSearchQuery] = useState("");
  const searchMembers = useQuery(api.users.getMembersForAddGroup, {
    searchQuery,
  });

  // Gérer la soumission du formulaire
  const onSubmit = async (data: GroupFormValues) => {
    try {
      setIsSubmitting(true);

      // Uploader les images
      // Defini un objet de base pour la photo et la couverture
      const updateData = {
        profilePicture: null as Id<"_storage"> | null,
        coverPhoto: null as Id<"_storage"> | null,
      };
      // Créer des formdata pour les images
      const formData = new FormData();
      if (data.profilePicture) {
        formData.append("profilePicture", data.profilePicture);
      }

      if (data.coverPhoto) {
        formData.append("coverPhoto", data.coverPhoto);
      }
      // Uploader les images via HTTP actions
      const response = await fetch(`${apiUrl}/uploadGroupImages`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Erreur lors de l'upload des images");
      }
      const result = await response.json();
      console.log(result);
      if (result.success) {
        // Ajouter les IDs des images aux données à mettre à jour
        if (result.profilePictureId) {
          updateData.profilePicture = result.profilePictureId as Id<"_storage">;
        }

        if (result.coverPhotoId) {
          updateData.coverPhoto = result.coverPhotoId as Id<"_storage">;
        }
      }
      // Extraire uniquement les IDs des membres sélectionnés
      const memberIds = data.members.map((member) => member.value);

      // Créer le forum via l'API Convex
      await createForum({
        name: data.name,
        description: data.description,
        about: data.about || "",
        interests: data.interests,
        mainCategory: data.mainCategory,
        confidentiality: data.confidentiality,
        visibility: data.visibility,
        requiresPostApproval: data.requiresPostApproval,
        profilePicture: updateData.profilePicture?.toString() || "",
        coverPhoto: updateData.coverPhoto?.toString() || "",
        members: memberIds as Id<"users">[],
      });

      toast.success("Groupe créé avec succès !");
      // Réinitialiser l'état du formulaire
      form.reset({
        ...defaultGroupFormValues,
        profilePicture: null,
        coverPhoto: null,
      });

      // Rediriger vers la page du nouveau groupe
      /* router.push(`/groups/${result.forumId}`); */
    } catch (error: any) {
      console.log(error.message);
      console.error("Erreur lors de la création du groupe:", error);
      toast.error("Erreur lors de la création du groupe");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl py-8 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Créer un nouveau groupe</h1>
        <p className="text-muted-foreground">
          Créez un espace pour connecter des personnes partageant les mêmes
          centres d&apos;intérêt
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Administrateur du groupe</CardTitle>
            </CardHeader>
            <CardContent>
              <GroupAdminHeader />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nom du groupe */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du groupe</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez le nom du groupe" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choisissez un nom clair et descriptif pour votre groupe
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description brève */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description brève</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez brièvement l'objectif de votre groupe"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum 100 mots - Cette description apparaîtra dans les
                      résultats de recherche
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description détaillée */}
              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>À propos du groupe (optionnel)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez en détail l'objectif, les règles et le fonctionnement de votre groupe"
                        className="min-h-32 resize-none"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum 500 mots - Cette description apparaîtra sur la
                      page du groupe
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Paramètres du groupe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Catégorie principale */}
              <FormField
                control={form.control}
                name="mainCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie principale</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {GROUP_MAIN_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choisissez la catégorie qui correspond le mieux à votre
                      groupe
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Centres d'intérêt */}
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Centres d&apos;intérêt</FormLabel>
                    <FormControl>
                      <InputWithTags
                        label=""
                        initialTags={field.value.map((interest) => ({
                          id: interest,
                          text: interest,
                        }))}
                        onChange={(tags) => {
                          field.onChange(tags.map((tag) => tag.text));
                        }}
                        placeholder="Ajouter un centre d'intérêt"
                        maxTags={5}
                        description="Entre 1 et 5 centres d'intérêt"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confidentialité */}
              <FormField
                control={form.control}
                name="confidentiality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confidentialité</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex items-center">
                            <Globe className="mr-2 h-4 w-4" />
                            <span>Public - Tout le monde peut rejoindre</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center">
                            <Lock className="mr-2 h-4 w-4" />
                            <span>
                              Privé - Approbation requise pour rejoindre
                            </span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Définit qui peut rejoindre votre groupe
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Visibilité */}
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibilité</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="visible">
                          <div className="flex items-center">
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Visible - Apparaît dans les recherches</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="masked">
                          <div className="flex items-center">
                            <EyeOff className="mr-2 h-4 w-4" />
                            <span>Masqué - Uniquement via invitation</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Définit si votre groupe apparaît dans les résultats de
                      recherche
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Approbation des publications */}
              <FormField
                control={form.control}
                name="requiresPostApproval"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Approbation des publications
                      </FormLabel>
                      <FormDescription>
                        Les publications des membres doivent être approuvées par
                        un administrateur
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Médias</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Photo de profil */}
              <FormField
                control={form.control}
                name="profilePicture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo de profil</FormLabel>
                    <FormControl>
                      <div className="flex justify-center">
                        <AvatarRoundedUploader
                          size={16}
                          maxSizeMB={2}
                          onChange={field.onChange}
                          defaultImage={field.value}
                          helperText="Taille recommandée: 400x400px (max 2Mo)"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Photo de couverture */}
              <FormField
                control={form.control}
                name="coverPhoto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo de couverture</FormLabel>
                    <FormControl>
                      <FileUploader
                        maxSizeMB={2}
                        onChange={field.onChange}
                        defaultImage={field.value}
                        helperText="Taille recommandée: 1200x300px (max 2Mo)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Ajouter des membres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="members"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MultipleSelector
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Rechercher des utilisateurs..."
                        onSearch={async (query) => {
                          setSearchQuery(query);
                          return searchMembers || [];
                        }}
                        options={searchMembers}
                        delay={500}
                        triggerSearchOnFocus={true}
                        loadingIndicator={
                          <div className="flex items-center justify-center p-4">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                          </div>
                        }
                        emptyIndicator={
                          <p className="p-2 text-center text-sm text-muted-foreground">
                            Aucun utilisateur trouvé
                          </p>
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Recherchez et ajoutez des membres à votre groupe
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/groups")}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création en cours..." : "Créer le groupe"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
