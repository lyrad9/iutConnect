export function HeaderGroupsEvents({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  );
}
