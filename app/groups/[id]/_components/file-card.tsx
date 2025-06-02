import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import Link from "next/link";

interface FileCardProps {
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  date: string;
}

export function FileCard({
  name,
  type,
  size,
  uploadedBy,
  date,
}: FileCardProps) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="bg-muted size-10 flex items-center justify-center rounded">
          <span className="text-xs font-medium">{type}</span>
        </div>
        <div className="flex-1 min-w-0">
          <Link href="#" className="font-medium truncate block hover:underline">
            {name}
          </Link>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{size}</span>
            <span>
              Ajouté par {uploadedBy} • {date}
            </span>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          Télécharger
        </Button>
      </CardContent>
    </Card>
  );
}
