import Link from "next/link";
import { UpcomingEvents, YoursEvents, YoursGroups } from "./navigation-content";

export default function ItemsSite() {
  return (
    <>
      <YoursGroups />
      <YoursEvents />
      <UpcomingEvents />
    </>
  );
}
