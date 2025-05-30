import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Dot } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { mockTrends } from "@/src/components/utils/const/mock-data";

export function WhatsHappening() {
  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="font-semibold">What&apos;s Happening</h3>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/trends">See all</Link>
        </Button>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          {mockTrends.map((trend) => (
            <div key={trend.id} className="space-y-1">
              <div className="flex items-center text-xs text-muted-foreground">
                <span>{trend.category}</span>
                <Dot className="size-4" />
                <span>
                  {formatDistanceToNow(new Date(trend.timestamp), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <Link
                href={`/trends/${trend.id}`}
                className="block font-semibold hover:underline"
              >
                {trend.title}
              </Link>
              <p className="text-xs text-muted-foreground">
                {trend.engagementCount} people engaged
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
