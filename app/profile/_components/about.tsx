import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  CalendarIcon,
  GraduationCap,
  Briefcase,
  Lightbulb,
  Heart,
} from "lucide-react";
import { formatDate } from "@/src/lib/utils";
import { Skeleton } from "@/src/components/ui/skeleton";

export function About() {
  const user = useQuery(api.users.currentUser);

  if (!user) {
    return <AboutSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Section Éducation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Formation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user.education && user.education.length > 0 ? (
            user.education.map((edu, index) => (
              <div
                key={index}
                className="border-l-2 border-primary/30 pl-4 py-1"
              >
                <h4 className="font-semibold">{edu.diploma}</h4>
                <p className="text-sm text-muted-foreground flex items-center">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  {edu.institution} • {new Date(edu.startDate).getFullYear()} -{" "}
                  {edu.endDate
                    ? new Date(edu.endDate).getFullYear()
                    : "Présent"}
                </p>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <GraduationCap className="h-12 w-12 text-muted-foreground/50 mb-2" />
              <p className="text-muted-foreground">
                Aucune formation renseignée
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section Expérience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Expérience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user.workExperience && user.workExperience.length > 0 ? (
            user.workExperience.map((exp, index) => (
              <div
                key={index}
                className="border-l-2 border-primary/30 pl-4 py-1"
              >
                <h4 className="font-semibold">{exp.jobTitle}</h4>
                <p className="text-sm text-muted-foreground flex items-center">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  {exp.company} • {new Date(exp.startDate).getFullYear()} -{" "}
                  {exp.endDate
                    ? new Date(exp.endDate).getFullYear()
                    : "Présent"}
                </p>
                {exp.location && (
                  <p className="text-sm mt-1 text-muted-foreground/80">
                    {exp.location}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground/50 mb-2" />
              <p className="text-muted-foreground">
                Aucune expérience renseignée
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section Compétences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Compétences
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user.skills && user.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="rounded-full bg-primary/5 hover:bg-primary/10 transition-colors"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Lightbulb className="h-12 w-12 text-muted-foreground/50 mb-2" />
              <p className="text-muted-foreground">
                Aucune compétence renseignée
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section Intérêts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Centres d&apos;intérêt
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user.interests && user.interests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="rounded-full bg-accent/50 hover:bg-accent/80 transition-colors"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Heart className="h-12 w-12 text-muted-foreground/50 mb-2" />
              <p className="text-muted-foreground">
                Aucun centre d&apos;intérêt renseigné
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AboutSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-56" />
              <Skeleton className="h-4 w-36" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
