import { EventDescriptionLayout } from "./_components/EventDescriptionLayout";

export default async function EventDescriptionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="px-4 py-6 md:py-8">
      <EventDescriptionLayout id={id} />
    </div>
  );
}
