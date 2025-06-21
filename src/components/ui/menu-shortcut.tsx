import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  Users,
  Calendar,
  User,
  X,
  Menu,
  Bell,
  MessageSquare,
} from "lucide-react";
import { GooeyFilter } from "./gooey-filter";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { useIsMobile } from "@/src/hooks/use-mobile";

export type MenuItem = {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  href: string;
};

export type MenuShortcutProps = {
  items?: MenuItem[];
  mobileOnly?: boolean;
  visibleOnRoutes?: string[];
  strength?: number;
  animationSpeed?: number;
  spacing?: number;
  buttonSize?: number;
  iconSize?: number;
};

// Configuration par défaut
const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { icon: Home, label: "Accueil", href: "/" },
  { icon: Users, label: "Groupes", href: "/groups" },
  { icon: Calendar, label: "Événements", href: "/events" },
  { icon: User, label: "Profil", href: "/profile" },
];

export function MenuShortcut({
  items = DEFAULT_MENU_ITEMS,
  mobileOnly = false,
  visibleOnRoutes = ["all"],
  strength = 5,
  animationSpeed = 0.25, // Vitesse d'animation plus rapide
  spacing = 44,
  buttonSize = 10,
  iconSize = 5,
}: MenuShortcutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname() || "/";
  const isMobile = useIsMobile({ breakpoint: 1024 });

  // Vérifier si le menu doit être affiché sur la route actuelle
  const shouldShowOnRoute =
    visibleOnRoutes.includes("all") ||
    visibleOnRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

  // Vérifier si le composant doit être rendu
  const shouldRender = !((mobileOnly && !isMobile) || !shouldShowOnRoute);

  // Fermer le menu lors d'un clic à l'extérieur
  const handleClickOutside = (e: MouseEvent) => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  // Ajouter un gestionnaire d'événements pour les clics à l'extérieur
  useEffect(() => {
    if (typeof window !== "undefined" && shouldRender) {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
    return undefined;
  }, [isOpen, shouldRender]);

  // Ne pas afficher si les conditions ne sont pas remplies
  if (!shouldRender) {
    return null;
  }
  if (pathname === "/" && !isMobile) {
    return null;
  }
  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <GooeyFilter id="gooey-filter-menu" strength={strength} />

      <div className="relative" style={{ filter: "url(#gooey-filter-menu)" }}>
        {/* Menu Items */}
        <AnimatePresence>
          {isOpen &&
            items.map((item: MenuItem, index: number) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <TooltipProvider key={item.label} delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        className="absolute"
                        initial={{ x: 0, opacity: 0 }}
                        animate={{
                          x: (index + 1) * -spacing,
                          opacity: 1,
                        }}
                        exit={{
                          x: 0,
                          opacity: 0,
                          transition: {
                            delay: (items.length - index) * 0.03, // Plus rapide
                            duration: animationSpeed,
                            type: "spring",
                            bounce: 0,
                          },
                        }}
                        transition={{
                          delay: index * 0.03, // Plus rapide
                          duration: animationSpeed,
                          type: "spring",
                          stiffness: 300, // Plus rigide pour une animation plus rapide
                          damping: 25,
                        }}
                      >
                        <Link href={item.href}>
                          <button
                            className={`w-${buttonSize} h-${buttonSize} rounded-full flex items-center justify-center shadow-sm transition-colors ${
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 text-primary"
                            }`}
                            onClick={() => setIsOpen(false)}
                          >
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={item.label}
                                initial={{ opacity: 0, filter: "blur(5px)" }}
                                animate={{ opacity: 1, filter: "blur(0px)" }}
                                exit={{ opacity: 0, filter: "blur(5px)" }}
                                transition={{
                                  delay: index * 0.03, // Plus rapide
                                  duration: animationSpeed / 2,
                                  type: "spring",
                                  bounce: 0,
                                }}
                              >
                                <Icon
                                  className={`w-${iconSize} h-${iconSize}`}
                                />
                              </motion.div>
                            </AnimatePresence>
                          </button>
                        </Link>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
        </AnimatePresence>

        {/* Main Menu Button */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                className={`relative w-${buttonSize} h-${buttonSize} bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 rounded-full flex items-center justify-center shadow-sm transition-colors`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ opacity: 0, filter: "blur(5px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, filter: "blur(5px)" }}
                      transition={{ duration: animationSpeed / 2 }}
                    >
                      <X
                        className={`w-${iconSize} h-${iconSize} text-primary`}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ opacity: 0, filter: "blur(5px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, filter: "blur(5px)" }}
                      transition={{ duration: animationSpeed / 2 }}
                    >
                      <Menu
                        className={`w-${iconSize} h-${iconSize} text-primary`}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{isOpen ? "Fermer le menu" : "Ouvrir le menu"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
