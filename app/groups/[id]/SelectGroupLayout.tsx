import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Badge } from "@/src/components/ui/badge";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Calendar,
  Info,
  MessageSquare,
  MoreHorizontal,
  Settings,
  Share2,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { InviteMemberDialog } from "./_components/invite-member-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

// Ajouter l'import du composant PostCardWithDropdown
import { PostCardWithDropdown } from "./_components/post-card-with-dropdown";
import { GroupMembersDialog } from "./_components/group-members-dialog";
import { MessageDrawer } from "./_components/message-drawer";
import { EventCard } from "./_components/event-card";
import { DiscussionCard } from "./_components/discussion-card";
import { FileCard } from "./_components/file-card";
import { CreatePostCard } from "@/src/components/shared/create-post-card";

// Cette fonction simule la récupération des données du groupe
function getGroupData(id: string) {
  // Dans une application réelle, ces données viendraient d'une API ou d'une base de données
  const groups = {
    "computer-science-club": {
      id: "computer-science-club",
      name: "Club d'Informatique",
      description:
        "Discussions, projets et événements pour les passionnés d'informatique et de programmation. Notre club accueille des étudiants de tous niveaux, des débutants aux développeurs expérimentés.",
      longDescription:
        "Le Club d'Informatique est un espace dédié à l'exploration et à l'apprentissage des technologies informatiques. Nous organisons régulièrement des ateliers de programmation, des hackathons, des conférences avec des professionnels du secteur et des sessions de mentorat. Notre objectif est de créer une communauté dynamique où les étudiants peuvent développer leurs compétences techniques, collaborer sur des projets innovants et se préparer aux carrières dans le domaine de la technologie.",
      category: "Académique",
      members: 128,
      posts: 342,
      events: 15,
      discussions: 87,
      founded: "Septembre 2018",
      meetingSchedule: "Tous les mercredis à 18h",
      location: "Bâtiment des Sciences, Salle 305",
      logoImage:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=500&auto=format&fit=crop",
      isAdmin: false,
      isMember: true,
    },
  };

  return groups[id as keyof typeof groups];
}
export function SelectGroupLayout({ id }: { id: string }) {
  const group = getGroupData(id);
  return (
    <div className="container py-8 space-y-6">
      <Card>
        <div className="relative h-48 md:h-64 w-full">
          <Image
            src={group.logoImage || "/placeholder.svg"}
            alt={group.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-background/80 backdrop-blur-sm"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Partager
            </Button>
            {group.isAdmin && (
              <Button
                variant="outline"
                size="sm"
                className="bg-background/80 backdrop-blur-sm"
              >
                <Settings className="h-4 w-4 mr-2" />
                Gérer
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-background/80 backdrop-blur-sm"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Signaler le groupe</DropdownMenuItem>
                <DropdownMenuItem>Copier le lien</DropdownMenuItem>
                {group.isMember && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      Quitter le groupe
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{group.name}</h1>
                <Badge variant="secondary">{group.category}</Badge>
              </div>
              <p className="text-muted-foreground">{group.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {group.members} membres
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {group.posts} publications
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {group.events} événements
                </div>
              </div>
            </div>
            <div className="flex gap-2 self-start">
              {group.isMember ? (
                <Button variant="outline">Membre</Button>
              ) : (
                <Button>Rejoindre</Button>
              )}
              <InviteMemberDialog />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="posts">Publications</TabsTrigger>
              <TabsTrigger value="events">Événements</TabsTrigger>
              <TabsTrigger value="discussions">Discussions</TabsTrigger>
              <TabsTrigger value="files">Fichiers</TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="space-y-6 mt-6">
              <CreatePostCard />

              <PostCardWithDropdown
                user={{
                  name: "Alex Johnson",
                  username: "alexj",
                  avatar: "/placeholder.svg",
                }}
                timestamp="2 heures"
                content="Je viens de terminer mon projet sur les réseaux de neurones ! Qui serait intéressé par une présentation lors de notre prochaine réunion ?"
                likes={24}
                comments={8}
                shares={3}
              />

              <PostCardWithDropdown
                user={{
                  name: "Maria Rodriguez",
                  username: "mrodriguez",
                  avatar: "/placeholder.svg",
                }}
                timestamp="Hier"
                content="Rappel : notre hackathon commence ce vendredi à 18h dans le bâtiment des sciences. N'oubliez pas d'apporter vos ordinateurs portables et votre enthousiasme !"
                image="/placeholder.svg?height=300&width=600"
                likes={56}
                comments={12}
                shares={7}
              />
            </TabsContent>
            <TabsContent value="events" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EventCard
                  title="Hackathon de Printemps"
                  date="15 avril 2024"
                  time="18:00 - 22:00"
                  location="Bâtiment des Sciences, Salle 305"
                  attendees={42}
                  image="/placeholder.svg?height=100&width=200"
                />
                <EventCard
                  title="Atelier Python pour débutants"
                  date="22 avril 2024"
                  time="14:00 - 16:00"
                  location="Bibliothèque universitaire, Salle d'étude 2"
                  attendees={18}
                  image="/placeholder.svg?height=100&width=200"
                />
                <EventCard
                  title="Conférence : L'avenir de l'IA"
                  date="5 mai 2024"
                  time="17:30 - 19:00"
                  location="Amphithéâtre central"
                  attendees={87}
                  image="/placeholder.svg?height=100&width=200"
                />
                <EventCard
                  title="Session de mentorat"
                  date="12 mai 2024"
                  time="15:00 - 17:00"
                  location="Café du campus"
                  attendees={12}
                  image="/placeholder.svg?height=100&width=200"
                />
              </div>
              <div className="flex justify-center">
                <Button variant="outline">Voir tous les événements</Button>
              </div>
            </TabsContent>
            <TabsContent value="discussions" className="space-y-6 mt-6">
              <div className="space-y-4">
                <DiscussionCard
                  title="Ressources pour apprendre React"
                  author="Alex Johnson"
                  date="Il y a 3 jours"
                  replies={24}
                  lastReply="Il y a 2 heures"
                />
                <DiscussionCard
                  title="Projet collaboratif : application mobile pour le campus"
                  author="Maria Rodriguez"
                  date="Il y a 1 semaine"
                  replies={37}
                  lastReply="Il y a 4 heures"
                />
                <DiscussionCard
                  title="Préparation au concours de programmation"
                  author="David Garcia"
                  date="Il y a 2 semaines"
                  replies={18}
                  lastReply="Il y a 2 jours"
                />
                <DiscussionCard
                  title="Débat : Python vs JavaScript pour les débutants"
                  author="Emily Chen"
                  date="Il y a 3 semaines"
                  replies={52}
                  lastReply="Il y a 1 jour"
                />
              </div>
              <div className="flex justify-center">
                <Button variant="outline">Voir toutes les discussions</Button>
              </div>
            </TabsContent>
            <TabsContent value="files" className="space-y-6 mt-6">
              <div className="space-y-4">
                <FileCard
                  name="presentation_ia_healthcare.pdf"
                  type="PDF"
                  size="2.4 MB"
                  uploadedBy="Alex Johnson"
                  date="Il y a 1 semaine"
                />
                <FileCard
                  name="hackathon_guidelines.docx"
                  type="DOCX"
                  size="1.8 MB"
                  uploadedBy="Maria Rodriguez"
                  date="Il y a 2 semaines"
                />
                <FileCard
                  name="python_workshop_materials.zip"
                  type="ZIP"
                  size="15.2 MB"
                  uploadedBy="David Garcia"
                  date="Il y a 1 mois"
                />
                <FileCard
                  name="club_budget_2024.xlsx"
                  type="XLSX"
                  size="3.5 MB"
                  uploadedBy="Emily Chen"
                  date="Il y a 2 mois"
                />
              </div>
              <div className="flex justify-center">
                <Button variant="outline">Voir tous les fichiers</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="size-5 mr-2" />À propos du groupe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{group.longDescription}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fondé en</span>
                  <span>{group.founded}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Réunions</span>
                  <span>{group.meetingSchedule}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Lieu</span>
                  <span>{group.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="size-5 mr-2" />
                Membres
              </CardTitle>
              <CardDescription>128 membres au total</CardDescription>
            </CardHeader>
            {/* Remplacer le bouton "Voir tous les membres" par le composant GroupMembersDialog */}
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <MemberAvatar name="Alex Johnson" image="/placeholder.svg" />
                <MemberAvatar name="Maria Rodriguez" image="/placeholder.svg" />
                <MemberAvatar name="David Garcia" image="/placeholder.svg" />
                <MemberAvatar name="Emily Chen" image="/placeholder.svg" />
                <MemberAvatar name="James Wilson" image="/placeholder.svg" />
                <MemberAvatar name="Sophia Kim" image="/placeholder.svg" />
                <MemberAvatar name="Michael Brown" image="/placeholder.svg" />
                <MemberAvatar name="Olivia Taylor" image="/placeholder.svg" />
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-xs">
                  +120
                </div>
              </div>
              <GroupMembersDialog />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="size-5 mr-2" />
                Administrateurs
              </CardTitle>
              <CardDescription>Les administrateurs du groupe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Remplacer le bouton "Message" par le composant MessageDrawer dans la section des administrateurs */}
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarImage src="/placeholder.svg" alt="Prof. Alan Turing" />
                  <AvatarFallback>AT</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">Prof. Alan Turing</p>
                  <p className="text-xs text-muted-foreground">
                    Fondateur • Département d&apos;Informatique
                  </p>
                </div>
                <MessageDrawer
                  recipient={{
                    name: "Prof. Alan Turing",
                    avatar: "/placeholder.svg",
                  }}
                >
                  <Button variant="ghost" size="sm">
                    Message
                  </Button>
                </MessageDrawer>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarImage src="/placeholder.svg" alt="Dr. Ada Lovelace" />
                  <AvatarFallback>AL</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">Dr. Ada Lovelace</p>
                  <p className="text-xs text-muted-foreground">
                    Co-fondatrice • Département d&apos;Informatique
                  </p>
                </div>
                <MessageDrawer
                  recipient={{
                    name: "Dr. Ada Lovelace",
                    avatar: "/placeholder.svg",
                  }}
                >
                  <Button variant="ghost" size="sm">
                    Message
                  </Button>
                </MessageDrawer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Groupes similaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SimilarGroupItem
                name="Association des Étudiants en IA"
                members={64}
                image="/placeholder.svg"
              />
              <SimilarGroupItem
                name="Société de Robotique"
                members={42}
                image="/placeholder.svg"
              />
              <SimilarGroupItem
                name="Club de Développement Web"
                members={78}
                image="/placeholder.svg"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MemberAvatar({ name, image }: { name: string; image: string }) {
  return (
    <Avatar className="size-10">
      <AvatarImage src={image || "/placeholder.svg"} alt={name} />
      <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
    </Avatar>
  );
}

interface SimilarGroupItemProps {
  name: string;
  members: number;
  image: string;
}

function SimilarGroupItem({ name, members, image }: SimilarGroupItemProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-10">
        <AvatarImage src={image || "/placeholder.svg"} alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{name}</p>
        <p className="text-xs text-muted-foreground">{members} membres</p>
      </div>
      <Button variant="outline" size="sm">
        Voir
      </Button>
    </div>
  );
}
