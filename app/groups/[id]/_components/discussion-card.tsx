import { Card, CardContent } from "@/src/components/ui/card";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

interface DiscussionCardProps {
  title: string;
  author: string;
  date: string;
  replies: number;
  lastReply: string;
}

export function DiscussionCard({
  title,
  author,
  date,
  replies,
  lastReply,
}: DiscussionCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <Link href="#" className="font-medium text-lg hover:underline">
            {title}
          </Link>
          <div className="flex justify-between text-sm text-muted-foreground">
            <div>
              Créé par <span className="font-medium">{author}</span> • {date}
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              {replies} réponses • Dernière réponse {lastReply}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
