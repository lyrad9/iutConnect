import { EventDescriptionLayout } from "./_components/EventDescriptionLayout";
import type { PageParams } from "@/src/types/next";

export default async function EventDescriptionPage(
  props: PageParams<{ id: string }>
) {
  const params = await props.params;
  const { id } = params;

  return (
    <div className="px-4 py-6 md:py-8">
      <EventDescriptionLayout eventId={id} />
    </div>
  );
}
