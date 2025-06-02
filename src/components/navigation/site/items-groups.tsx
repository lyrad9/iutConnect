import { SuggestGroups, YoursGroups } from "./navigation-content";

export function ItemsGroups() {
  return (
    <div>
      {/* Vos groupes */}
      <YoursGroups />
      {/* Groupes suggérés */}
      <SuggestGroups />
    </div>
  );
}
