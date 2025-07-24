import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { eventTypes } from "../src/components/utils/const/event-type";
import { notificationTypes } from "../src/components/utils/const/notifications-type";
import { USER_FUNCTIONS } from "../src/components/utils/const/user-functions";
import { authTables } from "@convex-dev/auth/server";
import {
  GROUP_MAIN_CATEGORIES,
  GroupMainCategoryType,
} from "@/src/components/utils/const/group-main-categories";
// Types d'énumération pour les valeurs prédéfinies
const UserStatus = ["active", "inactive"] as const;
export const UserRole = ["USER", "ADMIN", "SUPERADMIN"] as const;
export const UserPermission: string[] = [
  "COMMENT",
  "LIKE",
  "CREATE_GROUP",
  "CREATE_POST_IN_GROUP",
  "CREATE_EVENT",
  "CREATE_POST",
  "CREATE_USER",
  "ALL",
] as const;
/* export const UserFunction = [
  "student",
  "professor",
  "accountant",
  "HR",
] as const; */
export const GroupStatus = ["active", "suspended"] as const;
export const GroupVisibility = ["visible", "masked"] as const;
export const GroupCategory = [
  "Academique",
  "Technologique",
  "Sport",
  "Social",
  "Autre",
] as const;
export const MessageType = ["text", "image", "video"] as const;

export const EventLocationType = ["on-site", "online"] as const;
/* export const NotificationType = [
  "like",
  "comment",
  "new_event",
  "new_post",
  "new_post_in_group",
  "group_join_request", // Demande d'adhésion à un groupe(qui va gérer quand la demande d'approbation sera en attente, approuvée ou rejetée)
  "post_approval_request", // Demande d'approbation d'une publication(qui va gérer quand la notification sera en attente, approuvée ou rejetée)
] as const; */
export const PostStatus = ["pending", "approved", "rejected"] as const;

export default defineSchema({
  ...authTables,
  // Utilisateurs
  users: defineTable({
    // Informations personnelles
    profilePicture: v.optional(v.string()), // URL de l'image
    coverPhoto: v.optional(v.string()), // URL de l'image
    lastName: v.string(),
    firstName: v.string(),
    username: v.optional(v.string()),
    email: v.string(),
    emailVerificationTime: v.optional(v.number()),
    registrationNumber: v.string(),

    phoneNumber: v.optional(v.string()),
    isPhoneNumberHidden: v.optional(v.boolean()), // Indique si le numéro de téléphone est masqué ou non
    /* fonction: v.union(
      ...Object.values(USER_FUNCTIONS).map((f) => v.literal(f))
    ), */
    fonction: v.string(),

    // Informations académiques (pour les étudiants)
    fieldOfStudy: v.optional(v.string()),
    classroom: v.optional(v.string()),
    level: v.optional(v.string()),

    // Statut et rôle
    /* status: v.union(...UserStatus.map((s) => v.literal(s))), */
    role: v.union(...UserRole.map((r) => v.literal(r))),
    permissions: v.array(v.union(...UserPermission.map((p) => v.literal(p)))),

    // Informations optionnelles
    interests: v.optional(v.array(v.string())),
    socialNetworks: v.optional(
      v.array(
        v.object({
          network: v.string(),
          link: v.string(),
        })
      )
    ),
    bio: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    isOnline: v.boolean(),
    password: v.string(),
    workExperience: v.optional(
      v.array(
        v.object({
          company: v.string(),
          jobTitle: v.string(),
          location: v.string(),
          startDate: v.number(),
          endDate: v.optional(v.number()),
        })
      )
    ),
    education: v.optional(
      v.array(
        v.object({
          institution: v.string(),
          diploma: v.string(),
          startDate: v.number(),
          endDate: v.optional(v.number()),
        })
      )
    ),
    town: v.optional(v.string()),
    address: v.optional(v.string()),
    // Métadonnées
    createdAt: v.number(), // timestamp
    updatedAt: v.optional(v.number()), // timestamp
    /* tokenIdentifier: v.optional(v.string()), */
  })
    .searchIndex("search_email", {
      searchField: "email",
    })
    .searchIndex("search_firstName", {
      searchField: "firstName",
    })
    .searchIndex("search_lastName", {
      searchField: "lastName",
    })
    .index("by_email", ["email"])
    .index("by_firstName", ["firstName"])
    .index("by_lastName", ["lastName"])
    .index("by_registrationNumber", ["registrationNumber"])
    /* .index("by_status", ["status"]) */
    .index("by_role", ["role"]),
  /*  .index("by_function_and_status", ["function", "status"]) */
  // Forums
  forums: defineTable({
    members: v.array(v.id("users")),
    posts: v.array(v.id("posts")),
    authorId: v.id("users"),
    profilePicture: v.optional(v.string()),
    coverPhoto: v.optional(v.string()),
    name: v.string(),
    description: v.optional(v.string()), // max 100 mots
    about: v.optional(v.string()), // max 500 mots
    /* interests: v.array(v.union(...GroupCategory.map((c) => v.literal(c)))), */
    interests: v.array(v.string()),
    mainCategory: v.union(...GROUP_MAIN_CATEGORIES.map((c) => v.literal(c))),
    status: v.union(...GroupStatus.map((s) => v.literal(s))),
    confidentiality: v.union(v.literal("public"), v.literal("private")),
    // Pour déterminer si le groupe est visible (tout le monde sur le réseau peut le trouver et demander à le rejoindre) ou masqué (seul·es les invité·es ou les membres peuvent le trouver)
    visibility: v.union(...GroupVisibility.map((p) => v.literal(p))),
    requiresPostApproval: v.boolean(), // Indique si les publications nécessitent l'approbation d'un admin

    // Métadonnées
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["visibility", "status"],
    })
    .index("by_author", ["authorId"])
    .index("by_status", ["status"])
    .index("by_visibility", ["visibility"])
    .index("by_category", ["mainCategory"])
    .index("by_visibility_and_status", ["visibility", "status"]),

  // Salles de discussion(n'ont pas de posts, ni d'événements)
  discussionRooms: defineTable({
    participants: v.array(v.id("users")),
    authorId: v.id("users"),
    profilePicture: v.optional(v.string()),
    coverPhoto: v.optional(v.string()),
    name: v.string(),
    description: v.optional(v.string()), // max 100 mots
    about: v.optional(v.string()), // max 500 mots
    fieldOfStudy: v.string(),
    class: v.string(),
    status: v.union(...GroupStatus.map((s) => v.literal(s))),
    visibility: v.union(...GroupVisibility.map((p) => v.literal(p))),

    // Métadonnées
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_author", ["authorId"])
    .index("by_status", ["status"])
    .index("by_visibility", ["visibility"])
    .index("by_class", ["class"])
    .index("by_field_of_study", ["fieldOfStudy"])
    .index("by_visibility_status", ["visibility", "status"]),

  // Membres des groupes (forums et salles de discussion)
  groupMembers: defineTable({
    userId: v.id("users"),
    groupId: v.union(v.id("forums"), v.id("discussionRooms")),
    groupType: v.union(v.literal("forum"), v.literal("discussionRoom")),
    isAdmin: v.boolean(),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("rejected")
    ),

    // Métadonnées
    requestAt: v.optional(v.number()),
    // Quand le status est accepted
    joinedAt: v.optional(v.number()),
    leftAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_userId_isAdmin", ["userId", "isAdmin"])
    .index("by_user", ["userId"])
    .index("by_group", ["groupId", "groupType"])
    .index("by_user_and_group", ["userId", "groupId", "groupType"])
    .index("by_status", ["status"]),

  // Publications
  posts: defineTable({
    authorId: v.id("users"),
    content: v.string(),
    medias: v.array(v.string()), // URLs des médias
    groupId: v.optional(v.id("forums")),

    likes: v.array(v.id("users")),
    comments: v.array(v.id("comments")),
    status: v.optional(v.union(...PostStatus.map((s) => v.literal(s)))), // État de la publication : en attente, approuvée, rejetée
    moderatorId: v.optional(v.id("users")), // ID de l'admin qui a approuvé/rejeté la publication
    moderationComment: v.optional(v.string()), // Commentaire éventuel du modérateur

    // Métadonnées
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    moderatedAt: v.optional(v.number()), // Date de modération
  })
    .index("by_author", ["authorId"])
    .index("by_creation_date", ["createdAt"])
    .index("by_group_and_status", ["groupId", "status"])
    .index("by_status", ["status"])
    .index("by_group", ["groupId"]),

  // Événements
  events: defineTable({
    authorId: v.id("users"),
    collaborators: v.optional(v.array(v.id("users"))),
    photo: v.optional(v.string()),
    participants: v.optional(v.array(v.id("users"))),
    name: v.string(),
    description: v.string(),
    startDate: v.number(), // timestamp
    startTime: v.optional(v.string()), // HH:MM
    endTime: v.optional(v.string()), // HH:MM
    target: v.optional(v.string()), // Cible de l'événement (ex: "Étudiants en informatique")

    endDate: v.optional(v.number()), // timestamp
    locationType: v.union(...EventLocationType.map((l) => v.literal(l))),
    locationDetails: v.string(), // lieu physique ou lien en ligne
    eventType: v.union(...Object.keys(eventTypes).map((t) => v.literal(t))),
    groupId: v.optional(v.id("forums")),
    status: v.optional(v.union(...PostStatus.map((s) => v.literal(s)))), // État de l'événement : en attente, approuvé, rejeté
    likes: v.array(v.id("users")),
    comments: v.array(v.id("comments")),
    moderatorId: v.optional(v.id("users")), // ID de l'admin qui a approuvé/rejeté l'événement
    moderationComment: v.optional(v.string()), // Commentaire éventuel du modérateur
    allowsParticipants: v.boolean(), // Indique si l'événement permet les participants

    // Métadonnées
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    moderatedAt: v.optional(v.number()), // Date de modération
    // Déterminer si l'évènement est annulé
    isCancelled: v.boolean(),
  })
    .searchIndex("search_events", {
      searchField: "name",
      filterFields: ["eventType", "isCancelled", "startDate"],
    })

    .index("by_author", ["authorId"])
    .index("by_creation_date", ["createdAt"])
    .index("by_start_date", ["startDate"])
    .index("by_event_type", ["eventType"])
    .index("by_group", ["groupId"])
    .index("by_group_and_status", ["groupId", "status"])
    .index("by_status", ["status"]),

  // Participants aux événements
  eventParticipants: defineTable({
    eventId: v.id("events"),
    userId: v.id("users"),

    // Métadonnées
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_event", ["eventId"])
    .index("by_user", ["userId"])
    .index("by_event_and_user", ["eventId", "userId"]),

  // Favoris
  favorites: defineTable({
    userId: v.id("users"),
    postId: v.id("posts"),

    // Métadonnées
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_post", ["postId"])
    .index("by_user_and_post", ["userId", "postId"]),

  // Commentaires
  comments: defineTable({
    authorId: v.id("users"),
    content: v.string(),
    targetType: v.union(
      v.literal("post"),
      v.literal("event"),
      v.literal("comment")
    ),
    targetId: v.union(v.id("posts"), v.id("events"), v.id("comments")),
    likes: v.array(v.id("users")),

    // Métadonnées
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_author", ["authorId"])
    .index("by_target", ["targetType", "targetId"])
    .index("by_creation_date", ["createdAt"]),
  // Messages
  messages: defineTable({
    senderId: v.id("users"),
    recipientId: v.union(v.id("users"), v.id("discussionRooms")),
    recipientType: v.union(v.literal("user"), v.literal("discussionRoom")),
    content: v.string(),
    messageType: v.union(...MessageType.map((t) => v.literal(t))),
    isRead: v.boolean(),

    // Métadonnées
    createdAt: v.number(),
  })
    .index("by_sender", ["senderId"])
    .index("by_recipient", ["recipientType", "recipientId"])
    .index("by_conversation", ["senderId", "recipientType", "recipientId"])
    .index("by_unread", ["recipientType", "recipientId", "isRead"]),

  // Notifications
  notifications: defineTable({
    senderId: v.id("users"),
    recipientId: v.id("users"),
    title: v.string(),
    content: v.optional(v.string()),
    isRead: v.boolean(),
    notificationType: v.union(
      ...Object.keys(notificationTypes).map((t) => v.literal(t))
    ),
    //e.g: L'origine de la notif
    targetType: v.optional(
      v.union(
        v.literal("post"),
        v.literal("comment"),
        v.literal("event"),
        v.literal("forum"),
        v.literal("discussionRoom")
        /* v.literal("contentApproval") // pour les demandes de validation de publication */
      )
    ),
    postId: v.optional(v.id("posts")),
    eventId: v.optional(v.id("events")),
    commentId: v.optional(v.id("comments")),
    forumId: v.optional(v.id("forums")),
    groupMemberId: v.optional(v.id("groupMembers")),
    discussionRoomId: v.optional(v.id("discussionRooms")),
    /*  groupMemberId: v.optional(v.id("groupMembers")), */

    // Métadonnées
    createdAt: v.number(),
  })
    .index("by_recipient", ["recipientId"])
    .index("by_forumId", ["forumId", "discussionRoomId"])
    .index("by_eventId", ["eventId"])
    .index("by_groupMemberId_groupId_targetType", [
      "groupMemberId",
      "forumId",
      "targetType",
    ])
    .index("by_unread", ["recipientId", "isRead"])
    .index("by_notification_type", ["notificationType"])
    .index("by_creation_date", ["createdAt"])
    .index("by_type_post_sender", ["notificationType", "postId", "senderId"])
    .index("by_type_comment_sender", [
      "notificationType",
      "commentId",
      "senderId",
    ])
    .index("by_type_event_sender", ["notificationType", "eventId", "senderId"]),

  // Statistiques d'usage pour les administrateurs
  /* usageStats: defineTable({
    date: v.number(), // jour en timestamp
    activeUsers: v.number(),
    newUsers: v.number(),
    totalPosts: v.number(),
    totalEvents: v.number(),
    totalMessages: v.number(),
    totalForums: v.number(),
    totalDiscussionRooms: v.number(),

    // Métadonnées
    createdAt: v.number(),
  }).index("by_date", ["date"]), */
});
// https://21st.dev/danielpetho/gooey-filter/menu
