"use client";

import { AlertCircleIcon, ImageUpIcon, XIcon } from "lucide-react";

import { useFileUpload } from "@/src/hooks/use-file-upload";

export interface FileUploaderProps {
  /** Taille maximale du fichier en MB */
  maxSizeMB?: number;
  /** Fonction appelée lorsque le fichier change */
  onChange?: (file: File | null) => void;
  /** URL de l'image par défaut */
  defaultImage?: File | null;
  /** Hauteur minimale de la zone de dépôt */
  minHeight?: string;
  /** Texte affiché dans la zone de dépôt */
  placeholder?: string;
  /** Texte d'aide affiché sous la zone de dépôt */
  helperText?: string;
  /** Désactive l'uploader */
  disabled?: boolean;
  /** ID pour le champ de formulaire */
  id?: string;
  /** Nom pour le champ de formulaire */
  name?: string;
}

export default function FileUploader({
  maxSizeMB = 2,
  onChange,
  defaultImage = null,
  minHeight = "min-h-52",
  placeholder = "Déposez votre image ici ou cliquez pour parcourir",
  helperText,
  disabled = false,
  id,
  name,
}: FileUploaderProps) {
  const maxSize = maxSizeMB * 1024 * 1024;

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
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
    <div className="flex flex-col gap-2">
      <div className="relative">
        {/* Zone de drop */}
        <div
          role="button"
          onClick={disabled ? undefined : openFileDialog}
          onDragEnter={disabled ? undefined : handleDragEnter}
          onDragLeave={disabled ? undefined : handleDragLeave}
          onDragOver={disabled ? undefined : handleDragOver}
          onDrop={disabled ? undefined : handleDrop}
          data-dragging={isDragging || undefined}
          className={`border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex ${minHeight} flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors ${disabled ? "opacity-50 cursor-not-allowed" : ""} has-[img]:border-none has-[input:focus]:ring-[3px]`}
        >
          <input
            {...getInputProps()}
            id={id}
            name={name}
            className="sr-only"
            aria-label="Télécharger un fichier"
            disabled={disabled}
            onChange={(e) => {
              // Gérer le changement de fichier
              if (e.target.files && e.target.files[0]) {
                handleFileChange(e.target.files[0]);
              }
            }}
          />
          {previewUrl ? (
            <div className="absolute inset-0">
              <img
                src={previewUrl}
                alt="image"
                className="size-full object-cover"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div
                className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <ImageUpIcon className="size-4 opacity-60" />
              </div>
              <p className="mb-1.5 text-sm font-medium">{placeholder}</p>
              <p className="text-muted-foreground text-xs">
                Taille max: {maxSizeMB} Mo
              </p>
            </div>
          )}
        </div>
        {previewUrl && !disabled && (
          <div className="absolute top-4 right-4">
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
              onClick={() => {
                removeFile(files[0]?.id);
                handleFileChange(null);
              }}
              aria-label="Supprimer l'image"
            >
              <XIcon className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      {helperText && (
        <p
          aria-live="polite"
          role="region"
          className="text-muted-foreground text-center text-xs"
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
