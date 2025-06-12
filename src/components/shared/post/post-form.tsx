"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm, UseFormReset } from "react-hook-form";
import { EmojiClickData } from "emoji-picker-react";
import { useToast } from "@/src/hooks/use-toast";
import { Form } from "@/src/components/ui/form";
import { PostFormValues, postFormSchema } from "./post-form-schema";
import { Smile, ImagePlus, X } from "lucide-react";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { cn } from "@/src/lib/utils";
import EmojiPicker from "emoji-picker-react";
import { BaseSyntheticEvent } from "react";
import { error } from "console";
import { useAuthToken } from "@convex-dev/auth/react";

export type PostFormRef = {
  submit: (e?: BaseSyntheticEvent | undefined) => Promise<void>;
  reset: UseFormReset<PostFormValues>;
  isValid: () => boolean;
};

export type PostFormProps = {
  /* onCancel: () => void; */
  onSubmitSuccess: () => void;
  isExpanded: boolean;
  /* isSubmitting: boolean; */
  handleFocus: () => void;
  formRef: React.RefObject<PostFormRef | null>;
  onFormChange?: () => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
};

export function PostForm({
  onSubmitSuccess,
  isExpanded,
  /* isSubmitting, */
  handleFocus,
  formRef,
  onFormChange,
  setIsSubmitting,
}: PostFormProps) {
  const url = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
  /*   console.log("url", url); */
  const token = useAuthToken();
  const [previewAttachments, setPreviewAttachments] = React.useState<string[]>(
    []
  );
  /*   console.log("previewAttachments", previewAttachments); */
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      content: "",
      attachments: [],
    },
    mode: "onChange",
  });
  //
  React.useEffect(() => {
    const subscription = form.watch(() => {
      if (onFormChange) onFormChange();
    });

    return () => subscription.unsubscribe();
  }, [form, onFormChange]);

  // Gestion des émojis
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji;
    const currentContent = form.getValues("content") || "";

    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart || 0;
      const end = textareaRef.current.selectionEnd || 0;
      const textBeforeCursor = currentContent.substring(0, start);
      const textAfterCursor = currentContent.substring(end);

      form.setValue("content", textBeforeCursor + emoji + textAfterCursor, {
        shouldValidate: true,
      });

      // Repositionner le curseur après l'emoji
      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = start + emoji.length;
          textareaRef.current.selectionStart = newPosition;
          textareaRef.current.selectionEnd = newPosition;
          textareaRef.current.focus();
        }
      }, 0);
    } else {
      form.setValue("content", currentContent + emoji, {
        shouldValidate: true,
      });
    }
  };

  // Gestion des pièces jointes
  const handleAddAttachment = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const currentAttachments = form.getValues("attachments") || [];

      Array.from(files).forEach((file) => {
        const url = URL.createObjectURL(file);
        currentAttachments.push(file);
      });
      setPreviewAttachments(
        Array.from(files).map((file) => URL.createObjectURL(file))
      );

      form.setValue("attachments", currentAttachments, {
        shouldValidate: true,
      });

      // Réinitialiser l'input pour permettre la sélection du même fichier
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeAttachment = (index: number) => {
    const currentAttachments = form.getValues("attachments") || [];
    const updatedAttachments = currentAttachments.filter((_, i) => i !== index);
    form.setValue("attachments", updatedAttachments, { shouldValidate: true });
    setPreviewAttachments(previewAttachments.filter((_, i) => i !== index));
  };

  // Soumission du formulaire
  const onSubmit = async (data: PostFormValues) => {
    console.log(data);
    setIsSubmitting(true);
    try {
      // Envoyer directement à l'HTTP Action
      const formData = new FormData();
      formData.append("content", data.content as string);
      for (const file of data.attachments as File[]) {
        formData.append("attachments", file);
      }
      const response = await fetch(`${url}/uploadPostImagesInHome`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          /* "Content-Type": "multipart/form-data", */
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const result = await response.json();
      console.log("result", result);
      if (result.success) {
        toast({
          title: "Publication créée",
          description: "Votre publication a été publiée avec succès.",
        });
      }

      form.reset();
      setPreviewAttachments([]);
      onSubmitSuccess();
    } catch (error: any) {
      console.error("Erreur lors de la soumission:", error);
      if (error.message) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  /* console.log("formulaire", form.getValues()); */
  // Exposer les méthodes et états du formulaire
  React.useImperativeHandle(formRef, () => ({
    submit: form.handleSubmit(onSubmit),
    reset: form.reset,
    isValid: (): boolean => {
      const content = form.getValues("content") || "";
      const attachments = form.getValues("attachments") || [];
      return Boolean(content.trim().length > 0 || attachments.length > 0);
    },
  }));

  const content = form.watch("content") || "";
  const attachments = form.watch("attachments") || [];
  /* console.log("formRefe", formRef.current?.isValid()); */
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) =>
              form.setValue("content", e.target.value, { shouldValidate: true })
            }
            onFocus={handleFocus}
            placeholder="Qu'est-ce que tu as en tête?"
            className={cn(
              "min-h-[60px] w-full resize-none border-0 bg-transparent p-2 focus-visible:ring-0",
              isExpanded ? "min-h-[120px]" : ""
            )}
          />

          {isExpanded && (
            <div className="absolute bottom-2 right-2 flex items-center gap-2">
              <Button
                onClick={handleAddAttachment}
                size="sm"
                variant="ghost"
                type="button"
              >
                <ImagePlus className="size-4" />
              </Button>
              <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="ghost" type="button">
                    <Smile className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full border-none p-0" align="end">
                  <EmojiPicker onEmojiClick={handleEmojiClick} width="100%" />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* Affichage des pièces jointes */}
        {previewAttachments.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {previewAttachments.map((url, index) => (
              <div
                key={index}
                className="relative h-20 w-20 overflow-hidden rounded-md"
              >
                <img
                  src={url}
                  alt="Attachment"
                  className="size-full object-cover"
                />
                <button
                  onClick={() => removeAttachment(index)}
                  className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-background/80 text-foreground hover:bg-background"
                  type="button"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          multiple
        />
      </form>
    </Form>
  );
}
