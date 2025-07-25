import {
  Calendar,
  LinkIcon,
  MapPin,
  MailIcon,
  AtSign,
  Shield,
  Phone,
} from "lucide-react";
import { AdminBadgeCheck } from "@/src/svg/Icons";
import { EditProfileBtn } from "./edit-profile-btn";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SmartAvatar } from "@/src/components/shared/smart-avatar";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Badge } from "@/src/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

export default function UserInfo() {
  const user = useQuery(api.users.currentUser);
  console.log("userInfoCoverPhoto", user?.coverPhoto);
  // Déterminer si on doit afficher le numéro de téléphone
  const showPhoneNumber = user?.phoneNumber && !user?.isPhoneNumberHidden;

  return (
    <>
      <Authenticated>
        <div className="relative rounded-xl bg-muted overflow-hidden">
          <div className="h-48 overflow-hidden md:h-72">
            <Image
              src={
                (user?.coverPhoto as string | undefined) ?? "/placeholder.svg"
              }
              alt="Cover"
              className="size-full object-cover aspect-square"
              width={100}
              height={100}
              priority
            />
          </div>

          <div className="p-4 md:p-6">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div className="flex flex-col items-start">
                <div className="relative -mt-20 mr-4">
                  <SmartAvatar
                    avatar={user?.profilePicture as string}
                    name={user?.firstName + " " + user?.lastName}
                    size="xl"
                    className="size-32 border-4 border-background shadow-md"
                    fallbackClassName="text-4xl"
                  />
                </div>

                <div>
                  {/* Username */}
                  {user?.username && (
                    <div className="flex items-center text-sm text-primary mb-1">
                      <AtSign className="h-3 w-3 mr-1" />
                      <span className="font-medium">{user.username}</span>
                    </div>
                  )}

                  {/* Nom complet */}
                  <div className="flex items-center gap-2">
                    <h1 className="inline text-2xl md:text-3xl font-bold tracking-tight">
                      {user?.firstName} {user?.lastName}
                    </h1>
                    {(user?.role === "ADMIN" ||
                      user?.role === "SUPERADMIN") && (
                      <AdminBadgeCheck className="size-6 text-blue-500 stroke-2" />
                    )}
                  </div>

                  {/* Fonction de l'utilisateur */}
                  {user?.fonction && (
                    <div className="mt-1 mb-2">
                      <Badge variant="outline" className="bg-primary/5">
                        {user.fonction}
                      </Badge>
                    </div>
                  )}

                  {/* Informations de contact et autres */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    {/* Vérifier si l'utilisateur a renseigné son adresse et sa ville */}
                    {user?.town && user?.address && (
                      <div className="flex items-center gap-1">
                        <MapPin className="size-4" />
                        <span>
                          {user?.town}, {user?.address}
                        </span>
                      </div>
                    )}

                    {/* Vérifier si l'utilisateur a renseigné sa filière et sa classe */}
                    {user?.fieldOfStudy && user?.classroom && (
                      <div className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        <span>
                          {user?.fieldOfStudy}, {user?.classroom}
                        </span>
                      </div>
                    )}

                    {/* Afficher le numéro de téléphone s'il existe et n'est pas masqué */}
                    {showPhoneNumber && (
                      <div className="flex items-center gap-1">
                        <Phone className="size-4" />
                        <span>{user.phoneNumber}</span>
                      </div>
                    )}
                    {/* Afficher son email */}
                    <div className="flex items-center gap-1">
                      <MailIcon className="size-4" />
                      <span className="text-ellipsis overflow-hidden whitespace-nowrap">
                        {user?.email}
                      </span>
                    </div>

                    {/* Afficher le site personnel de l'utilisateur où le network est égale à Site personnel*/}
                    {user?.socialNetworks &&
                      user.socialNetworks.map(
                        (network) =>
                          network.network === "Site personnel" && (
                            <Link
                              key={network.network}
                              href={network.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline flex items-center gap-1"
                            >
                              <LinkIcon className="size-4" />
                              <span className="text-ellipsis overflow-hidden whitespace-nowrap">
                                {network.link}
                              </span>
                            </Link>
                          )
                      )}
                  </div>
                </div>
              </div>

              <EditProfileBtn />
            </div>

            {/* Réseaux sociaux - version simplifiée */}
            {user?.socialNetworks && user.socialNetworks.length > 0 && (
              <div className="mt-4 border-t pt-4 border-muted">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Mes Réseaux sociaux
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.socialNetworks
                    .filter((network) => network.network !== "Site personnel")
                    .map((network, index) => (
                      <a
                        key={index}
                        href={network.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1 bg-primary/5 px-3 py-1 rounded-full"
                      >
                        {network.network}
                      </a>
                    ))}
                </div>
              </div>
            )}

            {/* Bio avec un design amélioré */}
            {user?.bio ? (
              <div className="mt-6 p-4 bg-accent/30 rounded-lg border border-accent">
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <span className="size-1 rounded-full bg-primary"></span>À
                  propos de moi
                </h3>
                <p className="text-sm leading-relaxed">{user?.bio}</p>
              </div>
            ) : (
              <div className="mt-6 p-4 bg-accent/30 rounded-lg border border-accent text-center">
                <p className="text-sm text-muted-foreground">
                  Aucune biographie renseignée
                </p>
              </div>
            )}
          </div>
        </div>
      </Authenticated>
      <AuthLoading>
        <LoadingUserInfo />
      </AuthLoading>
    </>
  );
}

export function LoadingUserInfo() {
  return (
    <div className="relative rounded-xl bg-muted">
      {/* Cover photo */}
      <div className="h-48 overflow-hidden rounded-t-xl md:h-72">
        <Skeleton className="h-full w-full object-cover rounded-b-none" />
      </div>

      <div className="p-4 md:p-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="flex items-end">
            <div className="relative -mt-20 mr-4">
              {/* Avatar */}
              <Skeleton className="h-32 w-32 rounded-full border-4 border-background" />
            </div>

            <div className="space-y-2">
              {/* Username */}
              <Skeleton className="h-4 w-24 mb-1" />

              {/* Name */}
              <Skeleton className="h-8 w-64" />

              {/* Function */}
              <Skeleton className="h-6 w-20 mt-1 mb-2" />

              {/* Meta infos (town/address, study/class, email, link) */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>

          {/* Bouton Éditer (statique) */}
          <EditProfileBtn />
        </div>

        {/* Social networks skeleton */}
        <div className="mt-4 border-t pt-4 border-muted">
          <Skeleton className="h-4 w-32 mb-2" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6">
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
