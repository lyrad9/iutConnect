"use client";

import React, { useRef, useState } from "react";
import { Control, useController } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Button } from "@/src/components/ui/button";
import { Image, X } from "lucide-react";
import { EventFormValues } from "./event-form-schema";

type EventPhotoUploaderProps = {
  control: Control<EventFormValues>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
};

export function EventPhotoUploader({
  control,
  fileInputRef,
}: EventPhotoUploaderProps) {
  const [previewEventImage, setPreviewEventImage] = useState<string | null>(
    null
  );
  const { field } = useController({
    name: "photo",
    control,
  });

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setPreviewEventImage(url);
      field.onChange(file);
    }
  };

  const removePhoto = () => {
    field.onChange("");
    setPreviewEventImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <FormField
      control={control}
      name="photo"
      render={() => (
        <FormItem>
          <FormLabel>Photo de l&apos;événement (optionnel)</FormLabel>
          <div className="mt-2">
            {field.value ? (
              <div className="relative h-40 w-full overflow-hidden rounded-md">
                <img
                  src={previewEventImage || ""}
                  alt="Event"
                  className="h-full w-full object-cover"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  className="absolute right-2 top-2"
                  onClick={removePhoto}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                type="button"
                className="h-40 w-full bg-background/50"
                onClick={handleFileSelect}
              >
                <Image className="mr-2 size-4" />
                Ajouter une photo
              </Button>
            )}
            <input
              type="file"
              ref={fileInputRef as React.RefObject<HTMLInputElement>}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
