import {
  Calendar,
  LinkIcon,
  MapPin,
  MailIcon,
  BadgeCheck,
  CheckIcon,
  Loader2,
} from "lucide-react";
import { EditProfileBtn } from "./edit-profile-btn";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SmartAvatar } from "@/src/components/shared/smart-avatar";
import Image from "next/image";
import { AdminBadgeCheck } from "@/src/svg/Icons";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Skeleton } from "@/src/components/ui/skeleton";

export default function UserInfo() {
  const user = useQuery(api.users.currentUser);
  console.log(user);

  return (
    <>
      <Authenticated>
        <div className="relative rounded-xl bg-muted">
          <div className="h-48 overflow-hidden rounded-t-xl md:h-64">
            <img
              src={user?.coverPhoto || "/placeholder.svg"}
              alt="Cover"
              className="size-full object-cover aspect-square"
            />
          </div>

          <div className="p-4">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div className="flex items-end">
                <div className="relative -mt-20 mr-4">
                  <SmartAvatar
                    avatar={user?.profilePicture as string}
                    name={user?.firstName + " " + user?.lastName}
                    size="xl"
                    className="size-32 border-4 border-background object-cover aspect-square "
                    fallbackClassName="text-4xl"
                  />

                  {/*   <svg
                    width="10"
                    height="10"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 3L4.5 8.5L2 6"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                              
                  </svg> */}
                  {/*   <BadgeCheck
                style={{ color: "currentColor" }}
                className="size-4 text-blue-800 absolute bottom-1 right-1 bg-clip-border bg-blue-500"
              /> */}
                  {/*     {user?.role === "ADMIN" ||
                    (user?.role === "SUPERADMIN" && (
                      <div className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <CheckIcon className="size-4 bg-primary text-primary" />
                      </div>
                    ))} */}
                </div>

                <div>
                  <h1 className="text-2xl font-bold">
                    {user?.firstName} {user?.lastName}
                  </h1>
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
                    {/* Vérifier si l'utilisateur a renseigné son diplôme et sa classe */}
                    {user?.fieldOfStudy && user?.classroom && (
                      <div className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        <span>
                          {user?.fieldOfStudy}, {user?.classroom}
                        </span>
                      </div>
                    )}
                    {/* Afficher son email */}

                    <div className="flex items-center gap-1">
                      <MailIcon className="size-4" />
                      <span className="text-ellipsis overflow-hidden whitespace-nowrap">
                        {user?.email}
                      </span>
                    </div>

                    {/* Vérifier si l'utilisateur a renseigné son portfolio avec comme network "Site personnel" */}
                    {user?.socialNetworks &&
                      user?.socialNetworks.length > 0 &&
                      user?.socialNetworks.some(
                        (network) => network.network === "Site personnel"
                      ) && (
                        // Si il y'a un site personnel, afficher le lien
                        <div className="flex items-center gap-1">
                          <LinkIcon className="size-4" />
                          <a
                            href={
                              user?.socialNetworks.find(
                                (network) =>
                                  network.network === "Site personnel"
                              )?.link
                            }
                            className="text-primary hover:underline"
                          >
                            {
                              user?.socialNetworks.find(
                                (network) =>
                                  network.network === "Site personnel"
                              )?.link
                            }
                          </a>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              <EditProfileBtn />
            </div>

            <div className="mt-4">
              <p className="text-sm font-bold">Ma bio ⏬</p>
              <p className="text-sm">{user?.bio}</p>
            </div>
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
      <div className="h-48 overflow-hidden rounded-t-xl md:h-64">
        <Skeleton className="h-full w-full object-cover rounded-b-none" />
      </div>

      <div className="p-4">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="flex items-end">
            <div className="relative -mt-20 mr-4">
              {/* Avatar */}
              <div className="bg-accent h-32 w-32 rounded-full border-4 border-background" />
            </div>

            <div className="space-y-2">
              {/* Name */}
              <Skeleton className="h-6 w-48" />

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

        {/* Bio */}
        <div className="mt-4">
          <p className="text-sm font-bold mb-3">Ma bio ⏬</p>
          <Skeleton className="h-4 w-3/4 " />
          <Skeleton className="h-4 w-2/4 mt-2" />
        </div>
      </div>
    </div>
  );
}
