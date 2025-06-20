"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReset } from "react-hook-form";
import { useToast } from "@/src/hooks/use-toast";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/src/components/ui/form";
import { EventFormValues, eventFormSchema } from "./event-form-schema";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { EventLocationSelector } from "./event-location-selector";
import { EventTypeSelector } from "./event-type-selector";
import { EventPhotoUploader } from "./event-photo-uploader";
import { EventCollaboratorSelector } from "./event-collaborator-selector";
import { Collaborator } from "../types";
import { BaseSyntheticEvent } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

export type EventFormRef = {
  submit: (e?: BaseSyntheticEvent | undefined) => Promise<void>;
  reset: UseFormReset<EventFormValues>;
  isValid: () => boolean;
};

type EventFormProps = {
  /* onCancel: () => void; */
  onSubmitSuccess: () => void;
  isCollaboratorModalOpen: boolean;
  setIsCollaboratorModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formRef: React.RefObject<EventFormRef | null>;
  onFormChange?: () => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
};

export function EventForm({
  /* onCancel, */
  onSubmitSuccess,
  isCollaboratorModalOpen,
  setIsCollaboratorModalOpen,
  formRef,
  onFormChange,
  setIsSubmitting,
}: EventFormProps) {
  const generateUploadUrl = useMutation(api.events.generateUploadUrl);
  const createEventInHome = useMutation(api.events.createEventInHome);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      location: {
        type: "on-site",
        value: "",
      },
      eventType: "",
      collaborators: [],
      photo: undefined,
      allowsParticipants: false,
    },
    mode: "onChange",
  });

  React.useEffect(() => {
    const subscription = form.watch(() => {
      if (onFormChange) onFormChange();
    });

    return () => subscription.unsubscribe();
  }, [form, onFormChange]);

  const onSubmit = async (data: EventFormValues) => {
    console.log("data", data);
    setIsSubmitting(true);
    try {
      const eventInHomeUrl = await generateUploadUrl();
      const result = await fetch(eventInHomeUrl, {
        method: "POST",
        headers: {
          "Content-Type": data.photo!.type,
        },
        body: data.photo,
      })
        .then((res) => res.json())
        .then(async (storage) => {
          const { storageId } = storage;
          await createEventInHome({
            event: {
              ...data,
              photo: storageId,
            },
          });
        })
        .catch((error) => {
          throw new Error(error.message);
        });
      /* const { storageId } = await result.json(); */

      toast({
        title: "Événement créé",
        description: "Votre événement a été publié avec succès.",
      });
      form.reset();
      onSubmitSuccess();
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la création de l'événement.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  React.useImperativeHandle(formRef, () => ({
    submit: form.handleSubmit(onSubmit),
    reset: form.reset,
    isValid: (): boolean => {
      const { name, description, startDate, location, photo } =
        form.getValues();
      return Boolean(
        name && description && startDate && location.value.trim() && photo
      );
    },
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de l&apos;événement</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nom de l'événement"
                  {...field}
                  className="bg-background/50 border-border/50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description de l'événement"
                  {...field}
                  className="min-h-[100px] bg-background/50 border-border/50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-start flex-col md:flex-row gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Date de début</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    className="bg-background/50 border-border/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Date de fin (optionnel)</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    className="bg-background/50 border-border/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <EventTypeSelector control={form.control} />

        <EventLocationSelector control={form.control} />

        <EventCollaboratorSelector
          control={form.control}
          isModalOpen={isCollaboratorModalOpen}
          setIsModalOpen={setIsCollaboratorModalOpen}
        />

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
                  <FormLabel htmlFor="allowsParticipants" className="mr-2">
                    Permettre aux utilisateurs de participer
                  </FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      Activez cette option pour permettre aux utilisateurs de
                      s&apos;inscrire comme participants à cet événement. Ils
                      pourront indiquer s&apos;ils participent, sont peut-être
                      intéressés ou déclinent l&apos;invitation.
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

        <EventPhotoUploader
          control={form.control}
          fileInputRef={fileInputRef}
        />
      </form>
    </Form>
  );
}
