import { GroupLayout } from "./_components/GroupLayout";

export default async function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="px-4 py-6 md:py-8">
      <GroupLayout id={id} />
    </div>
  );
}
