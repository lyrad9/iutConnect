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
        type: "onsite",
        value: "",
      },
      eventType: "",
      collaborators: [],
      photo: "",
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
    setIsSubmitting(true);
    try {
      console.log("Données du formulaire d'événement soumises:", data);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Événement créé",
        description: "Votre événement a été publié avec succès.",
      });

      form.reset();
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la création de l'événement.",
        variant: "destructive",
      });
    } finally {
      onSubmitSuccess();
    }
  };

  React.useImperativeHandle(formRef, () => ({
    submit: form.handleSubmit(onSubmit),
    reset: form.reset,
    isValid: (): boolean => {
      const { name, description, startDate, location } = form.getValues();
      return Boolean(
        form.formState.isValid &&
          name.trim().length > 0 &&
          description.trim().length > 0 &&
          startDate.trim().length > 0 &&
          location.value.trim().length > 0
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

        <EventPhotoUploader
          control={form.control}
          fileInputRef={fileInputRef}
        />
      </form>
    </Form>
  );
}
