"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ArrowLeft, FileImage } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Switch } from "@/src/components/ui/switch";
import { EventTypeSelector } from "@/src/components/shared/event/event-type-selector";
import { EventLocationSelector } from "@/src/components/shared/event/event-location-selector";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Calendar } from "@/src/components/ui/calendar";
import { TimeSelector } from "@/src/components/shared/event/time-selector";
import AccordionPlusMinus from "@/src/components/ui/accordion-plus-minus";
import { EventCollaboratorSelector } from "@/src/components/shared/event/event-collaborator-selector";
import { format, isToday } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { CalendarDisabledDate } from "@/src/components/ui/calendar-disabled-date";
import { cn } from "@/src/lib/utils";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { Separator } from "@/src/components/ui/separator";
import {
  Link,
  Calendar as CalendarIcon,
  Clock,
  Target,
  HelpCircle,
  Users,
} from "lucide-react";
import {
  EventFormValues,
  eventFormSchema,
} from "@/src/components/shared/event/event-form-schema";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { SmartAvatar } from "@/src/components/shared/smart-avatar";
import { Id } from "@/convex/_generated/dataModel";
import { useAuthToken } from "@convex-dev/auth/react";

// Composant pour afficher l'organisateur de l'événement
function EventOrganizerHeader() {
  const user = useQuery(api.users.currentUser);
  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <div className="relative">
        <SmartAvatar
          avatar={user?.profilePicture || ""}
          name={`${user?.firstName} ${user?.lastName}`}
          size="lg"
          className="object-center"
        />
      </div>
      <div>
        <p className="font-medium flex items-center space-x-1">
          <span className="flex items-center gap-2">
            {`${user?.firstName} ${user?.lastName}`}
          </span>
        </p>
        <p className="text-xs text-muted-foreground">{user?.email}</p>
      </div>
    </div>
  );
}

// Composant principal pour la création d'événement
export default function EventCreatePage() {
  const user = useQuery(api.users.currentUser);
  const token = useAuthToken();
  const apiUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Mutation pour créer un événement
  const createEventInHome = useMutation(api.events.createEventInHome);
  const generateUploadUrl = useMutation(api.events.generateUploadUrl);

  // Initialiser le formulaire avec react-hook-form et zod
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: undefined,
      startTime: "",
      endTime: undefined,
      location: {
        type: "on-site",
        value: "",
      },
      eventType: "",
      collaborators: [],
      photo: undefined,
      allowsParticipants: true,
      target: "",
    },
  });

  // Obtenir l'heure actuelle pour limiter les plages horaires
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const roundedMinute = Math.ceil(currentMinute / 15) * 15; // Arrondir aux 15 minutes supérieures

  // Gérer la sélection de la date de début
  const handleDateSelect = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      form.setValue("startDate", `${formattedDate}T00:00`, {
        shouldValidate: true,
      });

      // Si la date de fin n'est pas définie ou est antérieure à la date de début, on la met à jour
      const endDate = form.getValues("endDate");
      if (endDate && new Date(endDate) < date) {
        form.setValue("endDate", `${formattedDate}`, {
          shouldValidate: true,
        });
        setSelectedEndDate(date);
      }
    }
  };

  // Gérer la sélection de la date de fin
  const handleEndDateSelect = (date: Date | null) => {
    setSelectedEndDate(date);
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");

      form.setValue("endDate", `${formattedDate}`, {
        shouldValidate: true,
      });
    }
  };

  // Gérer la sélection de l'image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("photo", file, { shouldValidate: true });

      // Créer l'aperçu de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Gérer l'ouverture/fermeture des accordions
  const handleAccordionChange = (value: string) => {
    // Si on ferme l'accordion des dates de fin, on réinitialise les valeurs
    if (activeAccordion === "endDate" && value !== "endDate") {
      form.setValue("endDate", undefined, { shouldValidate: true });
      form.setValue("endTime", undefined, { shouldValidate: true });
      setSelectedEndDate(null);
    }

    // Si on ferme l'accordion des collaborateurs, on réinitialise les valeurs
    if (activeAccordion === "collaborators" && value !== "collaborators") {
      form.setValue("collaborators", [], { shouldValidate: true });
    }

    setActiveAccordion(value);
  };

  // Gérer la soumission du formulaire
  const onSubmit = async (data: EventFormValues) => {
    setIsSubmitting(true);
    try {
      const eventInHomeUrl = await generateUploadUrl();
      let storageId: string | undefined;
      if (data.photo && data.photo !== undefined) {
        const result = await fetch(eventInHomeUrl, {
          method: "POST",
          headers: {
            "Content-Type": data.photo.type,
          },
          body: data.photo,
        }).then((res) => res.json());

        storageId = result.storageId;
      }

      const event = await createEventInHome({
        event: {
          ...data,
          photo: storageId as Id<"_storage"> | undefined,
        },
      });

      if (event && event.code === "UNAUTHORIZED") {
        return toast.error(event.error as string);
      }

      toast.success("Événement créé avec succès");
      router.push("/events");
    } catch (error) {
      console.error("Erreur lors de la création de l'événement:", error);
      toast.error("Une erreur est survenue lors de la création de l'événement");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Formatter les dates pour l'affichage
  const formatDate = (date: string | null | undefined) => {
    if (!date) return "Sélectionner une date";
    return format(new Date(date), "dd MMMM yyyy", { locale: fr });
  };

  // Composant pour l'aperçu de l'image
  const ImageUploader = () => (
    <FormField
      control={form.control}
      name="photo"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Image de l&apos;événement</FormLabel>
          <FormDescription className="mb-2">
            Pour un meilleur rendu, utilisez une image au format 16:9
            (recommandé 1200x675px)
          </FormDescription>
          <div className="flex flex-col items-center">
            <div className="w-full h-48 border-2 border-dashed rounded-md flex flex-col items-center justify-center bg-muted/30 relative overflow-hidden">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Event preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <FileImage className="h-10 w-10 mb-2" />
                  <p className="text-sm font-medium">
                    Cliquez pour ajouter une image
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de découverte d'événements
  if (!user) redirect("/events");

  return (
    <div className="max-w-7xl py-8 mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2 gap-1"
            onClick={() => router.push("/events")}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour aux événements</span>
          </Button>
          <h1 className="text-3xl font-bold">Créer un nouvel événement</h1>
          <p className="text-muted-foreground">
            Organisez un événement et partagez-le avec votre communauté
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Colonne de gauche - 8/12 sur grand écran */}
            <div className="col-span-1 space-y-6 lg:col-span-8">
              <Card>
                <CardHeader>
                  <CardTitle>Informations générales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Nom de l'événement */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de l&apos;événement</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Entrez le nom de l'événement"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Choisissez un nom clair et descriptif pour votre
                          événement
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date et heure de début */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-0">
                    <div className="w-full sm:w-1/2">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date de début</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full pl-3 text-left font-normal flex justify-between items-center",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value
                                      ? formatDate(field.value)
                                      : "Sélectionner une date"}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <CalendarDisabledDate
                                  mode="single"
                                  selected={selectedDate || undefined}
                                  onSelect={(date) =>
                                    handleDateSelect(date as Date)
                                  }
                                  showFooterText={true}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Heure de début</FormLabel>
                            <FormControl>
                              <TimeSelector
                                value={field.value}
                                onChange={field.onChange}
                                minTime={
                                  isToday(selectedDate || new Date())
                                    ? `${currentHour}:${roundedMinute}`
                                    : undefined
                                }
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Date et heure de fin (accordion) */}
                  <AccordionPlusMinus
                    accordionItemClassName="py-0"
                    className="w-fit"
                    items={[
                      {
                        id: "endDate",
                        title: "Ajouter une date et heure de fin",
                        content: (
                          <div className="flex flex-col space-y-4 pt-2">
                            <div className="flex flex-col sm:flex-row gap-4">
                              <div className="w-full flex-1">
                                <FormField
                                  control={form.control}
                                  name="endDate"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                      <FormLabel>Date de fin</FormLabel>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <FormControl>
                                            <Button
                                              variant="outline"
                                              className={cn(
                                                "w-full pl-3 text-left font-normal flex justify-between items-center",
                                                !field.value &&
                                                  "text-muted-foreground"
                                              )}
                                            >
                                              {field.value
                                                ? formatDate(field.value)
                                                : "Sélectionner une date"}
                                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                          </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent
                                          className="w-auto p-0"
                                          align="start"
                                        >
                                          <CalendarDisabledDate
                                            mode="single"
                                            selected={
                                              selectedEndDate || undefined
                                            }
                                            onSelect={(date) =>
                                              handleEndDateSelect(date as Date)
                                            }
                                            disabled={[
                                              {
                                                before:
                                                  selectedDate || new Date(),
                                              },
                                            ]}
                                            showFooterText={false}
                                          />
                                        </PopoverContent>
                                      </Popover>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <div className="w-full flex-1">
                                <FormField
                                  control={form.control}
                                  name="endTime"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Heure de fin</FormLabel>
                                      <FormControl>
                                        <TimeSelector
                                          value={field.value}
                                          onChange={field.onChange}
                                          minTime={
                                            isToday(
                                              selectedEndDate || new Date()
                                            )
                                              ? form.watch("startTime") ||
                                                `${currentHour}:${roundedMinute}`
                                              : form.watch("startTime")
                                          }
                                          className="w-full"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        ),
                      },
                    ]}
                    defaultValue={activeAccordion || undefined}
                    onChange={(value) => handleAccordionChange(value)}
                  />

                  {/* Type d'événement */}
                  <EventTypeSelector control={form.control} />

                  {/* Lieu */}
                  <EventLocationSelector
                    control={form.control}
                    linkIcon={
                      form.watch("location.type") === "online" ? (
                        <Link className="h-4 w-4 opacity-70" />
                      ) : undefined
                    }
                  />

                  {/* Description détaillée */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Détails de l&apos;événement</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Décrivez votre événement, son programme, etc."
                            {...field}
                            className="min-h-[100px] bg-background/50 border-border/50"
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
                  <CardTitle>Paramètres additionnels</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Public cible */}
                  <FormField
                    control={form.control}
                    name="target"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Public cible{" "}
                          <span className="text-muted-foreground">
                            (optionnel)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 opacity-70" />
                            <Input
                              placeholder="Qui devrait participer à cet événement ?"
                              {...field}
                              value={field.value || ""}
                              className="bg-background/50 border-border/50"
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Ex: Étudiants en informatique, Tous les étudiants,
                          Personnel administratif...
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Co-organisateurs */}
                  <div>
                    <FormLabel className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Co-organisateurs
                    </FormLabel>
                    <FormDescription className="mb-2">
                      Ajouter d&apos;autres personnes pour organiser cet
                      événement (optionnel)
                    </FormDescription>
                    <EventCollaboratorSelector control={form.control} />
                  </div>

                  {/* Participants */}
                  <FormField
                    control={form.control}
                    name="allowsParticipants"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="allowsParticipants"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <div className="flex items-center">
                            <FormLabel
                              htmlFor="allowsParticipants"
                              className="mr-2"
                            >
                              Permettre aux utilisateurs de participer
                            </FormLabel>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs">
                                Activez cette option si l&apos;évènement
                                nécessite des participants.
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <FormDescription className="text-xs">
                            Les participants pourront voir la liste des autres
                            participants et recevoir des notifications
                            concernant l&apos;événement.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Colonne de droite - 4/12 sur grand écran */}
            <div className="col-span-1 space-y-6 lg:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>Organisateur</CardTitle>
                </CardHeader>
                <CardContent>
                  <EventOrganizerHeader />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Image de couverture</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUploader />
                </CardContent>
              </Card>

              <Card className="px-0 py-0">
                <CardFooter className="flex justify-end gap-4 p-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/events")}
                    disabled={isSubmitting}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Création en cours..."
                      : "Créer l'événement"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
