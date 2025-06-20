"use client";

import { useId, useState } from "react";
import { Tag, TagInput } from "emblor";

import { Label } from "@/src/components/ui/label";

export interface InputWithTagsProps {
  label: string;
  initialTags?: Tag[];
  onChange?: (tags: Tag[]) => void;
  placeholder?: string;
  maxTags?: number;
  id?: string;
  className?: string;
  description?: string;
}

export function InputWithTags({
  label,
  initialTags = [],
  onChange,
  placeholder = "Ajouter un tag",
  maxTags = 10,
  id: externalId,
  className = "",
  description,
}: InputWithTagsProps) {
  const internalId = useId();
  const id = externalId || internalId;
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const handleTagsChange = (newTags: Tag[]) => {
    // Limiter le nombre de tags
    if (newTags.length > maxTags) {
      return;
    }

    setTags(newTags);
    if (onChange) {
      onChange(newTags);
    }
  };

  return (
    <div className={`*:not-first:mt-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      <TagInput
        id={id}
        tags={tags}
        setTags={(value) => {
          if (typeof value === "function") {
            const newTags = value(tags);
            handleTagsChange(newTags);
          } else {
            handleTagsChange(value);
          }
        }}
        placeholder={placeholder}
        styleClasses={{
          tagList: {
            container: "gap-1",
          },
          input:
            "rounded-md transition-[color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:border-ring outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          tag: {
            body: "relative h-7 bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
            closeButton:
              "absolute -inset-y-px -end-px p-0 rounded-s-none rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground",
          },
        }}
        activeTagIndex={activeTagIndex}
        setActiveTagIndex={setActiveTagIndex}
        inlineTags={false}
        inputFieldPosition="top"
      />
      {description && (
        <p
          className="text-muted-foreground mt-2 text-xs"
          role="region"
          aria-live="polite"
        >
          {description}
        </p>
      )}
    </div>
  );
}

export default InputWithTags;
