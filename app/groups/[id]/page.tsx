import { SelectGroupLayout } from "./SelectGroupLayout";

export default async function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="container px-4 py-6 md:py-8">
      <SelectGroupLayout id={id} />
    </div>
  );
}
