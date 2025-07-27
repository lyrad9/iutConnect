import { EventDescriptionLayout } from "./_components/EventDescriptionLayout";

export default async function EventDescriptionPage({ id }: { id: string }) {
  return (
    <div className="px-4 py-6 md:py-8">
      <EventDescriptionLayout id={id} />
    </div>
  );
}
