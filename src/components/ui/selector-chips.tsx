"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

export type SelectorChipsProps = {
  /**
   * Liste des options disponibles pour la sélection
   */
  options: string[];

  /**
   * Fonction appelée lorsque la sélection change
   */
  onChange?: (selected: string[]) => void;

  /**
   * Options déjà sélectionnées par défaut
   */
  defaultSelected?: string[];

  /**
   * Valeur contrôlée des options sélectionnées
   */
  value?: string[];

  /**
   * Couleur principale utilisée pour les chips sélectionnées
   */
  primaryColor?: string;

  /**
   * Couleur du texte des chips sélectionnées
   */
  selectedTextColor?: string;

  /**
   * Taille des chips (sm, md, lg)
   */
  size?: "sm" | "md" | "lg";

  /**
   * Classe CSS additionnelle pour le conteneur
   */
  className?: string;

  /**
   * Mode de sélection (multiple ou unique)
   */
  selectionMode?: "multiple" | "single";

  /**
   * Désactiver le composant
   */
  disabled?: boolean;
};

/**
 * Composant de sélection par chips/étiquettes interactives
 * Permet de sélectionner une ou plusieurs options parmi une liste
 */
const SelectorChips = React.forwardRef<HTMLDivElement, SelectorChipsProps>(
  (
    {
      options,
      onChange,
      defaultSelected = [],
      value,
      primaryColor = "#FC5212",
      selectedTextColor = "#ffffff",
      size = "md",
      className,
      selectionMode = "multiple",
      disabled = false,
    },
    ref
  ) => {
    // Gestion d'état local ou contrôlé
    const [selected, setSelected] = useState<string[]>(defaultSelected || []);
    const isControlled = value !== undefined;
    const currentSelected = isControlled ? value : selected;

    // Synchroniser avec la valeur externe si contrôlé
    useEffect(() => {
      if (isControlled && value) {
        setSelected(value);
      }
    }, [isControlled, value]);

    // Styles en fonction de la taille
    const sizeStyles = {
      sm: {
        paddingX: "px-3",
        paddingY: "py-1",
        fontSize: "text-xs",
        minWidth: 80,
        selectedWidth: 95,
      },
      md: {
        paddingX: "px-4",
        paddingY: "py-2",
        fontSize: "text-sm",
        minWidth: 100,
        selectedWidth: 120,
      },
      lg: {
        paddingX: "px-5",
        paddingY: "py-3",
        fontSize: "text-base",
        minWidth: 120,
        selectedWidth: 140,
      },
    };

    const toggleChip = (option: string) => {
      if (disabled) return;

      let updatedSelection: string[];

      if (selectionMode === "single") {
        // Mode sélection unique
        updatedSelection = currentSelected.includes(option) ? [] : [option];
      } else {
        // Mode sélection multiple
        updatedSelection = currentSelected.includes(option)
          ? currentSelected.filter((o) => o !== option)
          : [...currentSelected, option];
      }

      if (!isControlled) {
        setSelected(updatedSelection);
      }

      onChange?.(updatedSelection);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap gap-2 w-full bg-background border border-primary/10 p-3 rounded-2xl shadow-sm",
          {
            "opacity-60 cursor-not-allowed": disabled,
          },
          className
        )}
      >
        {options.map((option) => {
          const isSelectedOption = currentSelected.includes(option);
          return (
            <motion.button
              key={option}
              onClick={() => toggleChip(option)}
              initial={false}
              disabled={disabled}
              animate={{
                backgroundColor: isSelectedOption ? primaryColor : "#ffffff",
                borderColor: isSelectedOption ? primaryColor : "#d1d5db",
                color: isSelectedOption ? selectedTextColor : "#1f2937",
                width: isSelectedOption
                  ? sizeStyles[size].selectedWidth
                  : sizeStyles[size].minWidth,
                transition: {
                  backgroundColor: { duration: 0.15 },
                  color: { duration: 0.15 },
                  borderColor: { duration: 0.15 },
                  width: { type: "spring", stiffness: 400, damping: 20 },
                },
              }}
              className={cn(
                "flex items-center justify-center rounded-full font-medium border transition overflow-hidden grow cursor-pointer",
                sizeStyles[size].paddingX,
                sizeStyles[size].paddingY,
                sizeStyles[size].fontSize,
                { "cursor-not-allowed": disabled }
              )}
              style={{ minWidth: sizeStyles[size].minWidth }}
            >
              <div className="flex items-center w-full justify-center relative">
                <span className="mx-auto">{option}</span>
                <motion.span
                  animate={{
                    width: isSelectedOption ? 18 : 0,
                    marginLeft: isSelectedOption ? 8 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                >
                  <AnimatePresence>
                    {isSelectedOption && (
                      <motion.span
                        key="tick"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 20,
                        }}
                        style={{ pointerEvents: "none" }}
                      >
                        {/* Tickmark SVG */}
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <motion.path
                            d="M5 10.5L9 14.5L15 7.5"
                            stroke={selectedTextColor}
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.25 }}
                          />
                        </svg>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.span>
              </div>
            </motion.button>
          );
        })}
      </div>
    );
  }
);

SelectorChips.displayName = "SelectorChips";

export { SelectorChips };
