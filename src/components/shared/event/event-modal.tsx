"use client";

import React, { useState, useRef, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { format, isToday, parseISO, setHours, setMinutes } from "date-fns";
import { fr } from "date-fns/locale/fr";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/src/components/ui/form";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Checkbox } from "@/src/components/ui/checkbox";
import { EventTypeSelector } from "./event-type-selector";
import { EventLocationSelector } from "./event-location-selector";
import AccordionPlusMinus from "@/src/components/ui/accordion-plus-minus";
import { AccordionWithSubheader } from "@/src/components/ui/accordion-with-subheader";
import { CalendarDisabledDate } from "@/src/components/ui/calendar-disabled-date";
import { TimeSelector } from "./time-selector";
import { Separator } from "@/src/components/ui/separator";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import {
  Image as ImageIcon,
  Trash2,
  Calendar,
  Clock,
  Link,
  Loader2,
  Target,
  HelpCircle,
  Users,
  ChevronDown,
} from "lucide-react";
import { EventFormValues, eventFormSchema } from "./event-form-schema";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { EventCollaboratorSelector } from "./event-collaborator-selector";
import { SmartAvatar } from "../smart-avatar";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/src/lib/utils";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  setIsPostOrEvent: React.Dispatch<React.SetStateAction<"post" | "event">>;
  groupId?: Id<"forums">;
}

export function EventModal({
  isOpen,
  onClose,
  onSuccess,
  setIsPostOrEvent,
  groupId,
}: EventModalProps) {
  const user = useQuery(api.users.currentUser);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mutations
  const generateUploadUrl = useMutation(api.events.generateUploadUrl);
  const createEventInHome = useMutation(api.events.createEventInHome);

  // Form setup
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
      allowsParticipants: false,
      target: "",
    },
    mode: "onChange",
  });

  // Obtenir l'heure actuelle pour limiter les plages horaires
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const roundedMinute = Math.ceil(currentMinute / 15) * 15; // Arrondir aux 15 minutes supérieures

  // Handle date selection
  const handleDateSelect = (date: Date | null) => {
    console.log("daatedebutselect", date);
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

  // Handle end date selection
  const handleEndDateSelect = (date: Date | null) => {
    setSelectedEndDate(date);
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");

      form.setValue("endDate", `${formattedDate}`, {
        shouldValidate: true,
      });
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("photo", file, { shouldValidate: true });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    form.setValue("photo", undefined, { shouldValidate: true });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Gérer la fermeture d'un accordion
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

  // Form submission
  const onSubmit = async (data: EventFormValues) => {
    console.log("dataEvent", data);
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

      // Utiliser la fonction appropriée selon le contexte (groupe ou global)
      const event = await createEventInHome({
        event: {
          ...data,
          photo: storageId as Id<"_storage"> | undefined,
          groupId: groupId,
        },
      });

      if (event && event.code === "UNAUTHORIZED") {
        return toast.error(event.error as string);
      }

      const successMessage = groupId
        ? "Événement créé dans le groupe avec succès"
        : "Événement créé";
      toast.success(successMessage);
      /*  form.reset(); */
      setImagePreview(null);
      onSuccess?.();
      /* onClose(); */
      setIsPostOrEvent("post");
    } catch (error: any) {
      console.error("Erreur lors de la soumission:", error);
      toast.error(
        "Une erreur est survenue lors de la création de l'événement."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Formatter les dates pour l'affichage
  const formatDate = (date: string | null | undefined) => {
    if (!date) return "Sélectionner une date";
    return format(new Date(date), "dd MMMM yyyy", { locale: fr });
  };

  // Accordion items pour les options avancées
  const advancedOptionsAccordionItems = [
    {
      id: "collaborators",
      icon: Users,
      title: "Coorganisateurs",
      sub: "Ajouter d'autres personnes pour organiser cet événement (optionnel)",
      content: <EventCollaboratorSelector control={form.control} />,
    },
    {
      id: "recurring",
      icon: Calendar,
      title: "Événement récurrent",
      sub: "Répéter cet événement selon un calendrier régulier",
      content: (
        <div className="py-2 text-muted-foreground text-sm">
          Cette fonctionnalité sera bientôt disponible.
        </div>
      ),
    },
  ];

  // Composant pour l'aperçu de l'image
  const ImageUploader = () => (
    <FormField
      control={form.control}
      name="photo"
      render={({ field }) => (
        <FormItem>
          <div className="flex flex-col items-center">
            <div className="w-full h-48 border-2 rounded-md flex flex-col items-center justify-center bg-muted-foreground relative overflow-hidden">
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Event preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon size={16} />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
                      onClick={handleRemoveImage}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center absolute bottom-3 right-3">
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon size={16} />
                  </Button>
                  {/* <ImageIcon size={40} className="opacity-40 mb-2" />
                  <p className="text-sm font-medium">
                    Ajouter une photo pour l&apos;événement
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pour un meilleur rendu, utilisez une image de 1200x600
                    pixels
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon size={16} className="mr-2" />
                    Choisir une image
                  </Button> */}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );

  // Composant pour les dates
  const DateTimeSection = () => (
    <>
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
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? formatDate(field.value)
                          : "Sélectionner une date"}
                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarDisabledDate
                      mode="single"
                      selected={selectedDate || undefined}
                      onSelect={(date) => handleDateSelect(date as Date)}
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

      {/* Date de fin (accordion) */}
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
                                    "w-fit pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? formatDate(field.value)
                                    : "Sélectionner une date"}
                                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <CalendarDisabledDate
                                mode="single"
                                selected={selectedEndDate || undefined}
                                onSelect={(date) =>
                                  handleEndDateSelect(date as Date)
                                }
                                disabled={[
                                  { before: selectedDate || new Date() },
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
                                isToday(selectedEndDate || new Date())
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
    </>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b sticky top-0 bg-background z-10">
          <DialogTitle className="text-xl">Créer un événement</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 overflow-hidden flex flex-col"
          >
            <ScrollArea className="h-[200px] flex-1 px-6 py-4">
              <div className="space-y-6">
                {/* Image uploader */}
                <ImageUploader />

                {/* Organisateur */}
                <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-md">
                  <SmartAvatar
                    name={`${user?.firstName} ${user?.lastName}`}
                    avatar={user?.profilePicture as string}
                    size="sm"
                  />
                  <div>
                    <div className="font-medium">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Organisateur
                    </div>
                  </div>
                </div>

                {/* Détails de base */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l&apos;événement</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Donnez un nom à votre événement"
                          {...field}
                          className="bg-background/50 border-border/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date et heure */}
                <DateTimeSection />

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

                {/* Description */}
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

                {/* Options avancées */}
                <Separator className="my-2" />
                <AccordionWithSubheader
                  items={advancedOptionsAccordionItems}
                  onChange={(value) => handleAccordionChange(value)}
                />

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
                              Activez cette option si l&apos;évènement nécessite
                              des participants.
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <FormDescription className="text-xs">
                          Les participants pourront voir la liste des autres
                          participants et recevoir des notifications concernant
                          l&apos;événement.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>

            <DialogFooter className="px-6 py-4 border-t sticky bottom-0 bg-background mt-auto">
              <Button variant="outline" type="button" onClick={onClose}>
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  !form.formState.isValid ||
                  !form.getValues("name") ||
                  !form.getValues("startDate") ||
                  /*  !form.getValues("startTime") || */
                  !form.getValues("eventType") ||
                  !form.getValues("location.value") ||
                  !form.getValues("description")
                }
                className="bg-primary text-white hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  "Créer l'évènement"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
