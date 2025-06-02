import { SuggestEvents, YoursEvents } from "./navigation-content";

export function ItemsEvents() {
  return (
    <>
      {/* Vos évènements */}
      <YoursEvents />
      {/* Suggestions d'évènements */}
      <SuggestEvents />
    </>
  );
}
