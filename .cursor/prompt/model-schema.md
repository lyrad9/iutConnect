# Modèle de Données du Réseau Social Universitaire

Ce document présente les différentes entités du modèle de données avec des exemples concrets d'utilisation.

## 1. Utilisateurs (users)

Un utilisateur représente une personne inscrite sur la plateforme (étudiant, professeur, personnel administratif).

### Exemple d'utilisateur étudiant

```json
{
  "_id": "usr_01h5g8zxj2q1k1s9j7n3v5m2r4",
  "profilePicture": "https://storage.example.com/profiles/alex-photo.jpg",
  "coverPhoto": "https://storage.example.com/covers/alex-cover.jpg",
  "lastName": "Dupont",
  "firstName": "Alexandre",
  "email": "alexandre.dupont@edu.university.com",
  "registrationNumber": "STD-2023-0042",
  "phoneNumber": "+237612345678",
  "function": "student",
  "fieldOfStudy": "Software Engineering",
  "classroom": "GL3C",
  "status": "active",
  "role": "USER",
  "permissions": ["COMMENT", "LIKE", "CREATE_POST"],
  "interests": ["Programmation", "Intelligence Artificielle", "Jeux Vidéo"],
  "socialNetworks": {
    "linkedin": "https://linkedin.com/in/alex-dupont",
    "github": "https://github.com/alexdupont"
  },
  "bio": "Étudiant en 3ème année d'ingénierie logicielle, passionné par le développement web et l'IA.",
  "skills": ["JavaScript", "React", "Python", "Machine Learning"],
  "isOnline": true,
  "createdAt": 1715432789000,
  "updatedAt": 1717281989000
}
```

### Exemple d'utilisateur professeur

```json
{
  "_id": "usr_02g6h9ayj3r2l2t0k8o4w6n3s5",
  "profilePicture": "https://storage.example.com/profiles/prof-martin.jpg",
  "coverPhoto": "https://storage.example.com/covers/prof-martin-cover.jpg",
  "lastName": "Martin",
  "firstName": "Sophie",
  "email": "sophie.martin@university.com",
  "registrationNumber": "PROF-2020-0015",
  "phoneNumber": "+237687654321",
  "function": "professor",
  "status": "active",
  "role": "ADMIN",
  "permissions": [
    "COMMENT",
    "LIKE",
    "CREATE_POST",
    "CREATE_GROUP",
    "CREATE_EVENT"
  ],
  "interests": ["Data Science", "Recherche", "Enseignement"],
  "socialNetworks": {
    "linkedin": "https://linkedin.com/in/sophie-martin",
    "researchgate": "https://researchgate.net/profile/SophieMartin"
  },
  "bio": "Professeur en informatique spécialisée en analyse de données et intelligence artificielle.",
  "skills": ["Data Analysis", "Machine Learning", "Research", "Python", "R"],
  "isOnline": false,
  "createdAt": 1694563289000,
  "updatedAt": 1717281989000
}
```

## 2. Forums

Un forum est un groupe thématique où les utilisateurs peuvent publier du contenu et des événements.

### Exemple de forum

```json
{
  "_id": "forum_03i7j0bz4s3m3u1l9p5x7o4t6",
  "participants": [
    "usr_01h5g8zxj2q1k1s9j7n3v5m2r4",
    "usr_02g6h9ayj3r2l2t0k8o4w6n3s5"
  ],
  "posts": ["post_01a1b2c3d4e5f6g7h8i9j0k1l2"],
  "authorId": "usr_02g6h9ayj3r2l2t0k8o4w6n3s5",
  "profilePicture": "https://storage.example.com/forums/data-science-forum.jpg",
  "coverPhoto": "https://storage.example.com/forums/data-science-cover.jpg",
  "name": "Data Science Club",
  "description": "Forum de discussion sur l'analyse de données et l'intelligence artificielle",
  "about": "Ce forum vise à rassembler les étudiants et professeurs intéressés par la Data Science. Nous discutons des dernières tendances, partageons des ressources d'apprentissage et organisons des événements comme des ateliers et des conférences. Notre objectif est de créer une communauté active autour de l'analyse de données et l'intelligence artificielle.",
  "interests": ["Academic", "Technology"],
  "mainCategory": "Academic",
  "status": "active",
  "visibility": "public",
  "createdAt": 1705423789000,
  "updatedAt": 1717281989000
}
```

## 3. Salles de discussion (discussionRooms)

Une salle de discussion est un espace de communication pour une classe spécifique, similaire à un groupe WhatsApp.

### Exemple de salle de discussion

```json
{
  "_id": "room_04j8k1c0t4n4v2m0q6y8p5u7",
  "participants": [
    "usr_01h5g8zxj2q1k1s9j7n3v5m2r4",
    "usr_02g6h9ayj3r2l2t0k8o4w6n3s5"
  ],
  "authorId": "usr_02g6h9ayj3r2l2t0k8o4w6n3s5",
  "profilePicture": "https://storage.example.com/rooms/gl3c-room.jpg",
  "coverPhoto": "https://storage.example.com/rooms/gl3c-cover.jpg",
  "name": "GL3C - Groupe de Génie Logiciel",
  "description": "Groupe de discussion pour la classe GL3C",
  "about": "Salle de discussion officielle pour les étudiants de la classe GL3C. Ce groupe est destiné aux communications importantes concernant les cours, les devoirs, les examens et les annonces officielles du département. Tous les étudiants de GL3C sont automatiquement ajoutés à ce groupe.",
  "fieldOfStudy": "Software Engineering",
  "class": "GL3C",
  "status": "active",
  "visibility": "private",
  "createdAt": 1705423789000,
  "updatedAt": 1717281989000
}
```

## 4. Membres des groupes (groupMembers)

Cette table établit la relation entre les utilisateurs et les groupes (forums ou salles de discussion).

### Exemple de membre de groupe

```json
{
  "_id": "member_05k9l2d1u5o5w3n1r7z9q6v8",
  "userId": "usr_01h5g8zxj2q1k1s9j7n3v5m2r4",
  "groupId": "forum_03i7j0bz4s3m3u1l9p5x7o4t6",
  "groupType": "forum",
  "isAdmin": false,
  "status": "accepted",
  "joinedAt": 1707423789000,
  "leftAt": null,
  "createdAt": 1707423789000,
  "updatedAt": 1707423789000
}
```

## 5. Publications (posts)

Les publications sont des contenus créés par les utilisateurs dans les forums.

### Exemple de publication

```json
{
  "_id": "post_01a1b2c3d4e5f6g7h8i9j0k1l2",
  "authorId": "usr_01h5g8zxj2q1k1s9j7n3v5m2r4",
  "content": "Je viens de terminer un projet d'analyse de données sur les habitudes d'étude des étudiants. Voici quelques visualisations intéressantes que j'ai créées :",
  "media": [
    "https://storage.example.com/posts/data-viz1.jpg",
    "https://storage.example.com/posts/data-viz2.jpg"
  ],
  "groupId": "forum_03i7j0bz4s3m3u1l9p5x7o4t6",
  "likes": ["usr_02g6h9ayj3r2l2t0k8o4w6n3s5"],
  "createdAt": 1710423789000,
  "updatedAt": 1710423789000
}
```

## 6. Événements (events)

Les événements sont des activités planifiées avec une date, un lieu et des participants.

### Exemple d'événement

```json
{
  "_id": "event_06l0m3e2v6p6x4o2s8a0r7w9",
  "authorId": "usr_02g6h9ayj3r2l2t0k8o4w6n3s5",
  "collaborators": ["usr_01h5g8zxj2q1k1s9j7n3v5m2r4"],
  "photo": "https://storage.example.com/events/workshop-ia.jpg",
  "participants": ["usr_01h5g8zxj2q1k1s9j7n3v5m2r4"],
  "name": "Workshop: Introduction au Machine Learning",
  "description": "Atelier pratique sur l'introduction aux algorithmes de Machine Learning avec Python et scikit-learn.",
  "startDate": 1720423789000,
  "endDate": 1720434589000,
  "locationType": "on-site",
  "locationDetails": "Salle 302, Bâtiment des Sciences",
  "eventType": "conference",
  "groupId": "forum_03i7j0bz4s3m3u1l9p5x7o4t6",
  "groupType": "forum",
  "createdAt": 1715423789000,
  "updatedAt": 1715423789000
}
```

## 7. Participants aux événements (eventParticipants)

Cette table établit la relation entre les utilisateurs et les événements auxquels ils participent.

### Exemple de participant à un événement

```json
{
  "_id": "participant_07m1n4f3w7q7y5p3t9b1s8x0",
  "eventId": "event_06l0m3e2v6p6x4o2s8a0r7w9",
  "userId": "usr_01h5g8zxj2q1k1s9j7n3v5m2r4",
  "status": "attending",
  "createdAt": 1716423789000,
  "updatedAt": 1716423789000
}
```

## 8. Commentaires (comments)

Les commentaires peuvent être associés à des publications, des événements ou d'autres commentaires.

### Exemple de commentaire sur une publication

```json
{
  "_id": "comment_08n2o5g4x8r8z6q4u0c2t9y1",
  "authorId": "usr_02g6h9ayj3r2l2t0k8o4w6n3s5",
  "content": "Excellent travail! J'apprécie particulièrement la visualisation sur les habitudes d'étude en fonction des filières.",
  "targetType": "post",
  "targetId": "post_01a1b2c3d4e5f6g7h8i9j0k1l2",
  "likes": ["usr_01h5g8zxj2q1k1s9j7n3v5m2r4"],
  "createdAt": 1710523789000,
  "updatedAt": 1710523789000
}
```

## 9. Messages (messages)

Les messages sont des communications privées entre utilisateurs ou dans des salles de discussion.

### Exemple de message dans une salle de discussion

```json
{
  "_id": "message_09o3p6h5y9s9a7r5v1d3u0z2",
  "senderId": "usr_02g6h9ayj3r2l2t0k8o4w6n3s5",
  "recipientId": "room_04j8k1c0t4n4v2m0q6y8p5u7",
  "recipientType": "discussionRoom",
  "content": "Bonjour à tous, le TD de demain est reporté à la semaine prochaine en raison d'une conférence. Merci de votre compréhension.",
  "messageType": "text",
  "isRead": false,
  "createdAt": 1717180789000
}
```

### Exemple de message privé entre utilisateurs

```json
{
  "_id": "message_10p4q7i6z0t0b8s6w2e4v1a3",
  "senderId": "usr_01h5g8zxj2q1k1s9j7n3v5m2r4",
  "recipientId": "usr_02g6h9ayj3r2l2t0k8o4w6n3s5",
  "recipientType": "user",
  "content": "Bonjour professeur, j'ai une question concernant le projet de Machine Learning. Pourrions-nous en discuter lors de votre permanence ?",
  "messageType": "text",
  "isRead": true,
  "createdAt": 1717180789000
}
```

## 10. Notifications (notifications)

Les notifications informent les utilisateurs des activités pertinentes sur la plateforme.

### Exemple de notification de commentaire

```json
{
  "_id": "notif_11q5r8j7a1u1c9t7x3f5w2b4",
  "senderId": "usr_02g6h9ayj3r2l2t0k8o4w6n3s5",
  "recipientId": "usr_01h5g8zxj2q1k1s9j7n3v5m2r4",
  "content": "Sophie Martin a commenté votre publication sur l'analyse de données.",
  "isRead": false,
  "notificationType": "comment",
  "targetId": "comment_08n2o5g4x8r8z6q4u0c2t9y1",
  "targetType": "comment",
  "createdAt": 1710523789000
}
```

### Exemple de notification d'événement

```json
{
  "_id": "notif_12r6s9k8b2v2d0u8y4g6x3c5",
  "senderId": "usr_02g6h9ayj3r2l2t0k8o4w6n3s5",
  "recipientId": "usr_01h5g8zxj2q1k1s9j7n3v5m2r4",
  "content": "Nouvel événement: Workshop: Introduction au Machine Learning",
  "isRead": false,
  "notificationType": "new_event",
  "targetId": "event_06l0m3e2v6p6x4o2s8a0r7w9",
  "targetType": "event",
  "createdAt": 1715423789000
}
```

## 11. Statistiques d'usage (usageStats)

Cette table contient des métriques d'utilisation pour les administrateurs.

### Exemple de statistiques journalières

```json
{
  "_id": "stats_13s7t0l9c3w3e1v9z5h7y4d6",
  "date": 1717180800000, // Minuit au début de la journée
  "activeUsers": 143,
  "newUsers": 5,
  "totalPosts": 27,
  "totalEvents": 3,
  "totalMessages": 456,
  "totalForums": 12,
  "totalDiscussionRooms": 8,
  "createdAt": 1717267200000 // Calcul fait le jour suivant
}
```

## Relations entre les entités

Voici un aperçu des principales relations entre les entités :

1. **Utilisateur → Forum/Salle de discussion** : Un utilisateur peut être l'auteur de plusieurs forums et salles de discussion.
2. **Utilisateur ↔ Groupe** : La relation entre utilisateurs et groupes est établie via la table `groupMembers`.
3. **Utilisateur → Post/Événement/Commentaire** : Un utilisateur peut créer plusieurs publications, événements et commentaires.
4. **Utilisateur ↔ Événement** : La relation entre utilisateurs et événements auxquels ils participent est établie via la table `eventParticipants`.
5. **Post/Événement/Commentaire ← Commentaire** : Les commentaires peuvent cibler des publications, événements ou d'autres commentaires.
6. **Forum → Post/Événement** : Les forums peuvent contenir plusieurs publications et événements.
7. **Utilisateur ↔ Message ↔ Utilisateur/Salle** : Les messages relient un expéditeur (utilisateur) à un destinataire (utilisateur ou salle de discussion).
8. **Utilisateur ↔ Notification ↔ Utilisateur** : Les notifications connectent un expéditeur à un destinataire, avec une référence à l'objet concerné.

## Exemples d'utilisation avec Convex

### 1. Création d'un utilisateur

```typescript
export const registerUser = mutation({
  args: {
    lastName: v.string(),
    firstName: v.string(),
    email: v.string(),
    registrationNumber: v.string(),
    phoneNumber: v.string(),
    function: v.union(
      v.literal("student"),
      v.literal("professor"),
      v.literal("accountant"),
      v.literal("HR")
    ),
    fieldOfStudy: v.optional(v.string()),
    classroom: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Vérifier si l'email existe déjà
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error("Cet email est déjà utilisé");
    }

    // Créer le nouvel utilisateur
    const userId = await ctx.db.insert("users", {
      lastName: args.lastName,
      firstName: args.firstName,
      email: args.email,
      registrationNumber: args.registrationNumber,
      phoneNumber: args.phoneNumber,
      function: args.function,
      fieldOfStudy: args.fieldOfStudy,
      classroom: args.classroom,
      status: "pending",
      role: "USER",
      permissions: ["COMMENT", "LIKE"],
      isOnline: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return userId;
  },
});
```

### 2. Récupération des forums publics actifs

```typescript
export const getPublicForums = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("forums")
      .withIndex("by_visibility_and_status", (q) =>
        q.eq("visibility", "public").eq("status", "active")
      )
      .collect();
  },
});
```

### 3. Création d'une publication simple (dans le fil global)

```typescript
export const createGlobalPost = mutation({
  args: {
    content: v.string(),
    media: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Vous devez être connecté pour publier");
    }

    const userId = identity.subject;

    // Vérifier que l'utilisateur a la permission de créer des posts
    const user = await ctx.db.get(userId);

    if (
      !user ||
      !user.permissions.includes("CREATE_POST") ||
      !user.permissions.includes("ALL")
    ) {
      throw new Error(
        "Vous n'avez pas la permission de créer des publications"
      );
    }

    // Créer la publication
    const postId = await ctx.db.insert("posts", {
      authorId: userId,
      content: args.content,
      media: args.media,
      groupId: null, // Post dans le fil global, pas dans un groupe
      likes: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return postId;
  },
});
```

### 4. Création d'une publication dans un forum avec notification aux membres

```typescript
export const createForumPost = mutation({
  args: {
    content: v.string(),
    media: v.optional(v.array(v.string())),
    forumId: v.id("forums"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Vous devez être connecté pour publier");
    }

    const userId = identity.subject;
    const user = await ctx.db.get(userId);

    // Vérifier que l'utilisateur est membre du forum
    const membership = await ctx.db
      .query("groupMembers")
      .withIndex("by_user_and_group", (q) =>
        q
          .eq("userId", userId)
          .eq("groupId", args.forumId)
          .eq("groupType", "forum")
      )
      .first();

    if (!membership || membership.status !== "accepted") {
      throw new Error("Vous n'êtes pas membre de ce forum");
    }

    // Récupérer les informations du forum
    const forum = await ctx.db.get(args.forumId);
    if (!forum) {
      throw new Error("Forum introuvable");
    }
    // Verifier si tu as la permission  de publier par l'admin
    if (!user.permissios.includes("CREATE_POST_IN_GROUP")) {
      throw new Error(
        "Vous n'avez pas la permission de publier dans un groupe"
      );
    }

    // Créer la publication avec un status en attente d'approbation(pending)
    const postId = await ctx.db.insert("posts", {
      authorId: userId,
      content: args.content,
      media: args.media,
      groupId: args.forumId,
      status: "pending",
      likes: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Mettre à jour la liste des posts du forum
    await ctx.db.patch(args.forumId, {
      posts: [...(forum.posts || []), postId],
      updatedAt: Date.now(),
    });

    // Récupérer tous les membres du forum pour les notifications
    const members = await ctx.db
      .query("groupMembers")
      .withIndex("by_group", (q) =>
        q.eq("groupId", args.forumId).eq("groupType", "forum")
      )
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    // Envoyer une notification à tous les membres du forum (sauf l'auteur)
    const notificationPromises = members
      .filter((member) => member.userId !== userId)
      .map(async (member) => {
        return ctx.db.insert("notifications", {
          senderId: userId,
          recipientId: member.userId,
          content: `${user.firstName} ${user.lastName} a publié dans le forum "${forum.name}"`,
          isRead: false,
          notificationType: "new_post",
          targetId: postId,
          targetType: "post",
          createdAt: Date.now(),
        });
      });

    await Promise.all(notificationPromises);

    return postId;
  },
});
```

### 5. Like d'une publication avec notification à l'auteur

```typescript
export const likePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Vous devez être connecté pour aimer une publication");
    }

    const userId = identity.subject;
    const user = await ctx.db.get(userId);

    // Récupérer le post
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Publication introuvable");
    }

    // Vérifier si l'utilisateur a déjà liké ce post
    if (post.likes.includes(userId)) {
      // Retirer le like
      await ctx.db.patch(args.postId, {
        likes: post.likes.filter((id) => id !== userId),
        updatedAt: Date.now(),
      });
      return { action: "unliked" };
    }

    // Ajouter le like
    await ctx.db.patch(args.postId, {
      likes: [...post.likes, userId],
      updatedAt: Date.now(),
    });

    // Ne pas envoyer de notification si l'utilisateur like son propre post
    if (post.authorId !== userId) {
      // Envoyer une notification à l'auteur du post
      await ctx.db.insert("notifications", {
        senderId: userId,
        recipientId: post.authorId,
        content: `${user.firstName} ${user.lastName} a aimé votre publication`,
        isRead: false,
        notificationType: "like",
        targetId: args.postId,
        targetType: "post",
        createdAt: Date.now(),
      });
    }

    return { action: "liked" };
  },
});
```

### 6. Demande pour rejoindre un groupe

```typescript
export const requestToJoinGroup = mutation({
  args: {
    groupId: v.union(v.id("forums"), v.id("discussionRooms")),
    groupType: v.union(v.literal("forum"), v.literal("discussionRoom")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Vous devez être connecté pour rejoindre un groupe");
    }

    const userId = identity.subject;
    const user = await ctx.db.get(userId);

    // Vérifier si le groupe existe
    const group = await ctx.db.get(args.groupId);
    if (!group) {
      throw new Error("Groupe introuvable");
    }

    // Vérifier si le groupe est public ou privé
    if (group.visibility === "public") {
      // Si le groupe est public, accepter directement
      const membershipId = await ctx.db.insert("groupMembers", {
        userId: userId,
        groupId: args.groupId,
        groupType: args.groupType,
        isAdmin: false,
        status: "accepted",
        joinedAt: Date.now(),
        leftAt: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Mettre à jour la liste des participants du groupe
      await ctx.db.patch(args.groupId, {
        participants: [...(group.participants || []), userId],
        updatedAt: Date.now(),
      });

      return { membershipId, status: "accepted" };
    } else {
      // Si le groupe est privé, créer une demande en attente
      // Vérifier si l'utilisateur a déjà une demande en cours
      const existingRequest = await ctx.db
        .query("groupMembers")
        .withIndex("by_user_and_group", (q) =>
          q
            .eq("userId", userId)
            .eq("groupId", args.groupId)
            .eq("groupType", args.groupType)
        )
        .first();

      if (existingRequest) {
        if (existingRequest.status === "accepted") {
          throw new Error("Vous êtes déjà membre de ce groupe");
        } else if (existingRequest.status === "pending") {
          throw new Error("Votre demande est déjà en attente d'approbation");
        } else if (existingRequest.status === "rejected") {
          throw new Error("Votre demande a été rejetée précédemment");
        }
      }

      // Créer la demande d'adhésion
      const membershipId = await ctx.db.insert("groupMembers", {
        userId: userId,
        groupId: args.groupId,
        groupType: args.groupType,
        isAdmin: false,
        status: "pending",
        joinedAt: null,
        leftAt: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Trouver les administrateurs du groupe pour envoyer des notifications
      const admins = await ctx.db
        .query("groupMembers")
        .withIndex("by_group", (q) =>
          q.eq("groupId", args.groupId).eq("groupType", args.groupType)
        )
        .filter((q) => q.eq(q.field("isAdmin"), true))
        .collect();

      // Envoyer des notifications aux administrateurs
      const notificationPromises = admins.map(async (admin) => {
        return ctx.db.insert("notifications", {
          senderId: userId,
          recipientId: admin.userId,
          content: `${user.firstName} ${user.lastName} souhaite rejoindre ${args.groupType === "forum" ? "le forum" : "la salle"} "${group.name}"`,
          isRead: false,
          notificationType: "group_join_request",
          targetId: membershipId,
          targetType: "groupMember",
          createdAt: Date.now(),
        });
      });

      await Promise.all(notificationPromises);

      return { membershipId, status: "pending" };
    }
  },
});
```

### 7. Traitement d'une demande d'adhésion à un groupe

```typescript
export const processGroupJoinRequest = mutation({
  args: {
    membershipId: v.id("groupMembers"),
    approve: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Vous devez être connecté pour traiter cette demande");
    }

    const adminId = identity.subject;

    // Récupérer la demande d'adhésion
    const membership = await ctx.db.get(args.membershipId);
    if (!membership) {
      throw new Error("Demande d'adhésion introuvable");
    }

    // Vérifier que la demande est en attente
    if (membership.status !== "pending") {
      throw new Error("Cette demande a déjà été traitée");
    }

    // Vérifier que l'utilisateur est administrateur du groupe
    const adminMembership = await ctx.db
      .query("groupMembers")
      .withIndex("by_user_and_group", (q) =>
        q
          .eq("userId", adminId)
          .eq("groupId", membership.groupId)
          .eq("groupType", membership.groupType)
      )
      .filter((q) => q.eq(q.field("isAdmin"), true))
      .first();

    if (!adminMembership) {
      throw new Error("Vous n'êtes pas administrateur de ce groupe");
    }

    // Récupérer les informations de l'utilisateur et du groupe
    const user = await ctx.db.get(membership.userId);
    const group = await ctx.db.get(membership.groupId);

    if (args.approve) {
      // Approuver la demande
      await ctx.db.patch(args.membershipId, {
        status: "accepted",
        joinedAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Ajouter l'utilisateur aux participants du groupe
      await ctx.db.patch(membership.groupId, {
        participants: [...(group.participants || []), membership.userId],
        updatedAt: Date.now(),
      });

      // Envoyer une notification à l'utilisateur
      await ctx.db.insert("notifications", {
        senderId: adminId,
        recipientId: membership.userId,
        content: `Votre demande pour rejoindre ${membership.groupType === "forum" ? "le forum" : "la salle"} "${group.name}" a été acceptée`,
        isRead: false,
        notificationType: "group_join_request",
        targetId: membership.groupId,
        targetType:
          membership.groupType === "forum" ? "forum" : "discussionRoom",
        createdAt: Date.now(),
      });

      return { status: "accepted" };
    } else {
      // Rejeter la demande
      await ctx.db.patch(args.membershipId, {
        status: "rejected",
        updatedAt: Date.now(),
      });

      // Envoyer une notification à l'utilisateur
      await ctx.db.insert("notifications", {
        senderId: adminId,
        recipientId: membership.userId,
        content: `Votre demande pour rejoindre ${membership.groupType === "forum" ? "le forum" : "la salle"} "${group.name}" a été rejetée`,
        isRead: false,
        notificationType: "group_join_request",
        targetId: membership.groupId,
        targetType:
          membership.groupType === "forum" ? "forum" : "discussionRoom",
        createdAt: Date.now(),
      });

      return { status: "rejected" };
    }
  },
});
```
