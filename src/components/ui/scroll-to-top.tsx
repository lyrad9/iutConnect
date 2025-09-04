"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { motion, AnimatePresence } from "motion/react";

interface ScrollToTopProps {
  /**
   * Seuil de défilement (en pixels) à partir duquel le bouton apparaît
   * @default 500
   */
  threshold?: number;

  /**
   * Position du bouton sur l'axe X
   * @default "right"
   */
  position?: "left" | "right" | "center";

  /**
   * Marge depuis le bas de l'écran (en px)
   * @default 20
   */
  bottomMargin?: number;

  /**
   * Classes additionnelles pour le bouton
   */
  className?: string;
}

/**
 * Composant qui affiche un bouton de retour en haut de page lorsque
 * l'utilisateur défile en dessous du seuil défini
 */
export function ScrollToTop({
  threshold = 500,
  position = "right",
  bottomMargin = 20,
  className,
}: ScrollToTopProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Gérer l'affichage du bouton de retour en haut
  useEffect(() => {
    const handleScroll = () => {
      // Afficher le bouton quand on descend de plus du seuil défini
      if (window.scrollY > threshold) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  // Fonction pour revenir en haut de la page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Déterminer la position horizontale du bouton
  const getPositionStyle = () => {
    switch (position) {
      case "left":
        return { left: "20px", right: "auto" };
      case "center":
        return { left: "50%", right: "auto", transform: "translateX(-50%)" };
      case "right":
      default:
        return { right: "20px", left: "auto" };
    }
  };

  return (
    <AnimatePresence>
      {showScrollTop && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed z-60"
          style={{
            ...getPositionStyle(),
            bottom: `${bottomMargin}px`,
          }}
        >
          <Button
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg"
            onClick={scrollToTop}
            aria-label="Retour en haut"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
