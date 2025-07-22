import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  /* allowedDevOrigins: [
    "local-origin.dev",
    "*.local-origin.dev",
    "*",
    "dashboard.convex.dev",
  ],
 */
  experimental: {
    authInterrupts: true,
  },
  /* output: "export", */
  /*  eslint: {
    ignoreDuringBuilds: true,
  },
<<<<<<< HEAD
  images: { unoptimized: true }, */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
=======
  images: { unoptimized: true },
>>>>>>> 647d777 (Revert "Refactorisation de la gestion des groupes et des publications, ajout de la fonctionnalité de favoris pour les publications, et amélioration de la validation des formulaires d'événements. Mise à jour des composants pour une meilleure expérience utilisateur et nettoyage du code.")
};

export default nextConfig;
