"use client";

import { CircleUserRoundIcon, XIcon } from "lucide-react";

import { useFileUpload } from "@/src/hooks/use-file-upload";
import { Button } from "@/src/components/ui/button";

export interface AvatarRoundedUploaderProps {
  /** Taille de l'avatar en pixels (size-xx) */
  size?: number;
  /** Taille maximale du fichier en MB */
  maxSizeMB?: number;
  /** Fonction appelée lorsque le fichier change */
  onChange?: (file: File | null) => void;
  /** URL de l'image par défaut */
  defaultImage?: File | null;
  /** Texte affiché sous l'avatar */
  helperText?: string;
  /** Désactive l'uploader */
  disabled?: boolean;
  /** ID pour le champ de formulaire */
  id?: string;
  /** Nom pour le champ de formulaire */
  name?: string;
}

export default function AvatarRoundedUploader({
  size = 16,
  maxSizeMB = 2,
  onChange,
  defaultImage = null,
  helperText = "Photo de profil",
  disabled = false,
  id,
  name,
}: AvatarRoundedUploaderProps) {
  const maxSize = maxSizeMB * 1024 * 1024;

  const [
    { files, isDragging, errors },
    {
      removeFile,
      openFileDialog,
      getInputProps,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
    },
  ] = useFileUpload({
    accept: "image/*",
    maxSize,
  });

  // Utiliser l'image par défaut ou le fichier uploadé
  const previewUrl =
    files[0]?.preview ||
    (defaultImage ? URL.createObjectURL(defaultImage) : null);

  // Appeler onChange lorsque le fichier change
  const handleFileChange = (file: File | null) => {
    if (onChange) {
      onChange(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative inline-flex">
        {/* Zone de drop */}
        <button
          type="button"
          className={`border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 relative flex size-${size} items-center justify-center overflow-hidden rounded-full border border-dashed transition-colors outline-none focus-visible:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none`}
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          aria-label={previewUrl ? "Changer l'image" : "Télécharger une image"}
          disabled={disabled}
        >
          {previewUrl ? (
            <img
              className="size-full object-cover"
              src={previewUrl}
              alt="Image téléchargée"
              width={size * 4}
              height={size * 4}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div aria-hidden="true">
              <CircleUserRoundIcon className="size-6 opacity-60" />
            </div>
          )}
        </button>
        {previewUrl && !disabled && (
          <Button
            onClick={() => {
              removeFile(files[0]?.id);
              handleFileChange(null);
            }}
            size="icon"
            className="border-background focus-visible:border-background absolute -top-1 -right-1 size-6 rounded-full border-2 shadow-none"
            aria-label="Supprimer l'image"
          >
            <XIcon className="size-3.5" />
          </Button>
        )}
        <input
          {...getInputProps()}
          id={id}
          name={name}
          className="sr-only"
          aria-label="Télécharger une image"
          tabIndex={-1}
          onChange={(e) => {
            // Gérer le changement de fichier
            if (e.target.files && e.target.files[0]) {
              handleFileChange(e.target.files[0]);
            }
          }}
        />
      </div>
      {errors.length > 0 ? (
        <p className="text-destructive text-xs">{errors[0]}</p>
      ) : (
        <p className="text-muted-foreground text-xs">{helperText}</p>
      )}
    </div>
  );
}
