# Gestion d'État URL avec nuqs dans IUTSocial

Ce guide explique comment nous utilisons nuqs pour gérer l'état des filtres et de la recherche dans l'URL au sein de notre application IUTSocial.

## Introduction

[nuqs](https://github.com/47ng/nuqs) est une bibliothèque qui permet de stocker l'état des composants React dans l'URL, de manière typée et sécurisée. C'est particulièrement utile pour :

- Rendre les recherches et les filtres partageables via URL
- Conserver l'état lors de la navigation (retour/avant du navigateur)
- Améliorer l'expérience utilisateur en permettant de bookmarker des recherches
- Faciliter le SEO et l'indexation des pages de recherche

## Architecture

Dans notre application, nous avons adopté une architecture où :

1. Les hooks personnalisés dans `src/hooks/` gèrent l'état de l'URL
2. Les composants Layout dans `app/*/` utilisent ces hooks et passent les filtres aux composants enfants
3. Les composants de liste consomment ces filtres sans gérer leur état

Cela permet une meilleure séparation des responsabilités et facilite la maintenance.

## Hooks disponibles

### useGroupFilters

Ce hook gère les filtres pour la découverte de groupes :

```tsx
const {
  filters, // État actuel des filtres
  updateSearchTerm, // Fonction pour mettre à jour le terme de recherche
  updateCategories, // Fonction pour mettre à jour les catégories sélectionnées
  resetFilters, // Fonction pour réinitialiser tous les filtres
  availableCategories, // Liste des catégories disponibles
} = useGroupFilters();
```

Il stocke dans l'URL :

- `searchTerm` : Le terme de recherche saisi par l'utilisateur
- `categories` : Les catégories sélectionnées pour filtrer les groupes

### useJoinedGroupsFilters

Ce hook gère les filtres pour la page des groupes rejoints :

```tsx
const {
  filters, // État actuel des filtres
  updateSearchTerm, // Fonction pour mettre à jour le terme de recherche
  updateFilterType, // Fonction pour mettre à jour le type de filtre (all, admin, member)
  resetFilters, // Fonction pour réinitialiser tous les filtres
} = useJoinedGroupsFilters();
```

Il stocke dans l'URL :

- `searchTerm` : Le terme de recherche saisi par l'utilisateur
- `filterType` : Le type de filtre sélectionné (all, admin, member)

### Utilisation dans un Layout

```tsx
// app/groups/joins/JoinGroupsLayout.tsx
"use client";
import { useJoinedGroupsFilters } from "@/src/hooks/useJoinedGroupsFilters";

export default function JoinGroupsLayout() {
  // Récupérer les filtres depuis l'URL
  const { filters, updateSearchTerm, updateFilterType } =
    useJoinedGroupsFilters();

  return (
    <div className="container">
      {/* Passer les filtres au composant enfant */}
      <JoinedGroupsList
        searchTerm={filters.searchTerm || ""}
        filterType={(filters.filterType as "all" | "admin" | "member") || "all"}
        onSearchChange={updateSearchTerm}
        onFilterChange={updateFilterType}
      />
    </div>
  );
}
```

### Utilisation dans les composants enfants

Les composants enfants reçoivent les filtres sous forme de props et n'ont pas besoin de connaître la façon dont ils sont stockés :

```tsx
interface JoinedGroupsListProps {
  searchTerm: string;
  filterType: "all" | "admin" | "member";
  onSearchChange: (term: string) => void;
  onFilterChange: (type: "all" | "admin" | "member") => void;
}

export default function JoinedGroupsList({
  searchTerm,
  filterType,
  onSearchChange,
  onFilterChange,
}: JoinedGroupsListProps) {
  // Utiliser les filtres pour récupérer les données
  const { results } = usePaginatedQuery(api.forums.getUserGroups, {
    searchTerm,
    filterType,
  });

  // Interface utilisateur pour modifier les filtres
  return (
    <div>
      <Input
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Select
        value={filterType}
        onValueChange={(value) =>
          onFilterChange(value as "all" | "admin" | "member")
        }
      >
        {/* Options... */}
      </Select>

      {/* Affichage des résultats... */}
    </div>
  );
}
```

## Implémentation de nouveaux filtres

Pour ajouter un nouveau filtre à un hook existant ou créer un nouveau hook, suivez ces étapes :

1. Identifiez le type de données à stocker (string, number, boolean, array, etc.)
2. Utilisez le parser approprié de nuqs :

   - `parseAsString` : pour les chaînes
   - `parseAsInteger` : pour les nombres entiers
   - `parseAsFloat` : pour les nombres décimaux
   - `parseAsBoolean` : pour les booléens
   - `parseAsArrayOf` : pour les tableaux

3. Ajoutez le filtre au hook avec la valeur par défaut si nécessaire :

```tsx
const [filters, setFilters] = useQueryStates({
  // Ajout d'un nouveau filtre
  sortBy: parseAsString.withDefault("date"),
});
```

4. Créez une fonction pour mettre à jour ce filtre :

```tsx
const updateSortBy = (sort: string) => {
  setFilters({ ...filters, sortBy: sort });
};
```

5. Exposez le filtre et sa fonction de mise à jour dans le retour du hook.

## Bonnes pratiques

- Toujours traiter les valeurs nulles pour éviter les erreurs : `filters.searchTerm || ""`
- Utiliser `throttleMs` pour éviter les mises à jour trop fréquentes de l'URL pendant la frappe
- Préférer les valeurs `null` plutôt que des chaînes vides ou des tableaux vides pour les filtres non appliqués
- Regrouper les filtres liés à une même fonctionnalité dans un seul hook

## Ressources

- [Documentation officielle de nuqs](https://nuqs.47ng.com/)
- [Hooks personnalisés du projet](/src/hooks/)
