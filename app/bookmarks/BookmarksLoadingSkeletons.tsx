import { Skeleton } from "@/src/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/src/components/ui/card";

export function BookMarksLoadingSkeletons() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card
          key={index}
          className="gap-2 overflow-hidden transition-all duration-200 shadow animate-pulse"
        >
          {/* Header avec bouton fantôme */}
          <CardHeader className="flex justify-end py-0">
            <Skeleton className="h-8 w-8 rounded-full" />
          </CardHeader>

          {/* Contenu principal */}
          <CardContent className="flex flex-row gap-4">
            {/* Zone image */}
            <div className="relative h-28 flex-shrink-0 w-1/3">
              <Skeleton className="absolute inset-0 object-cover rounded-lg" />
            </div>

            {/* Contenu texte */}
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-24 rounded" />
                </div>
              </div>

              <Skeleton className="h-5 w-2/3 rounded" />
              <Skeleton className="h-4 w-1/4 rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
