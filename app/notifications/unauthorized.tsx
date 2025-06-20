import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

export default function Unauthorized() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vous n&apos;avez pas accès à cette page</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Veuillez vous connecter pour accéder à cette page.</p>
      </CardContent>
    </Card>
  );
}
