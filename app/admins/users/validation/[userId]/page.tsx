"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Textarea } from "@/src/components/ui/textarea";
import { Separator } from "@/src/components/ui/separator";
import { AlertCircle, CheckCircle, UserCheck, UserX } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { Label } from "@/src/components/ui/label";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/src/components/ui/skeleton";
import { generatePassword } from "@/src/lib/utils";

export default function UserValidationPage({
  params,
}: {
  params: { userId: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const action = searchParams.get("action");

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [autoProcess, setAutoProcess] = useState(false);

  const userId = params.userId as Id<"users">;

  const user = useQuery(api.users.getUserById, { userId });
  const approveUserAction = useMutation(api.auth.approveUserAction);
  const rejectUser = useMutation(api.users.rejectUser);

  useEffect(() => {
    if (action && !autoProcess && user && !isProcessing && !isSuccess) {
      setAutoProcess(true);
      if (action === "approve") {
        handleApprove();
      } else if (action === "reject") {
        handleReject();
      }
    }
  }, [action, user, autoProcess, isProcessing, isSuccess]);

  const handleApprove = async () => {
    try {
      setIsProcessing(true);
      setError("");

      const password = generatePassword(10);

      await approveUserAction({
        userId,
        password,
      });

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/admins/users");
      }, 3000);
    } catch (err) {
      setError(
        (err as Error).message ||
          "Une erreur est survenue lors de l'approbation."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsProcessing(true);
      setError("");

      await rejectUser({
        userId,
        reason: rejectionReason || undefined,
      });

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/admins/users");
      }, 3000);
    } catch (err) {
      setError(
        (err as Error).message || "Une erreur est survenue lors du rejet."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-8 w-3/4" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-5 w-1/2" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-5 w-1/4" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-1/4 mr-2" />
            <Skeleton className="h-10 w-1/4" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (user.status !== "pending") {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Validation impossible</AlertTitle>
          <AlertDescription>
            Cet utilisateur a déjà été{" "}
            {user.status === "active" ? "approuvé" : "rejeté"}.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Validation d&apos;inscription utilisateur</CardTitle>
          <CardDescription>
            Examinez les informations de l&apos;utilisateur et validez ou
            rejetez sa demande d&apos;inscription
          </CardDescription>
        </CardHeader>

        {isSuccess ? (
          <CardContent>
            <Alert variant="success" className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Succès</AlertTitle>
              <AlertDescription>
                {action === "approve"
                  ? "L'utilisateur a été approuvé avec succès. Un email contenant ses identifiants de connexion lui a été envoyé."
                  : "La demande d'inscription a été rejetée. Un email de notification a été envoyé à l'utilisateur."}
              </AlertDescription>
            </Alert>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Redirection vers la liste des utilisateurs...
            </p>
          </CardContent>
        ) : (
          <>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erreur</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nom</Label>
                    <p className="text-sm font-medium">{user.lastName}</p>
                  </div>
                  <div>
                    <Label>Prénom</Label>
                    <p className="text-sm font-medium">{user.firstName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm font-medium">{user.email}</p>
                  </div>
                  <div>
                    <Label>Matricule</Label>
                    <p className="text-sm font-medium">
                      {user.registrationNumber}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Téléphone</Label>
                    <p className="text-sm font-medium">{user.phoneNumber}</p>
                  </div>
                  <div>
                    <Label>Fonction</Label>
                    <p className="text-sm font-medium">{user.function}</p>
                  </div>
                </div>

                {user.function === "student" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Filière</Label>
                      <p className="text-sm font-medium">
                        {user.fieldOfStudy || "Non spécifié"}
                      </p>
                    </div>
                    <div>
                      <Label>Classe</Label>
                      <p className="text-sm font-medium">
                        {user.classroom || "Non spécifié"}
                      </p>
                    </div>
                  </div>
                )}

                <Separator />

                <div>
                  <Label htmlFor="rejection-reason">
                    Motif de rejet (facultatif)
                  </Label>
                  <Textarea
                    id="rejection-reason"
                    placeholder="Précisez la raison du rejet de la demande d'inscription..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="mt-2"
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isProcessing}
              >
                <UserX className="mr-2 h-4 w-4" />
                Rejeter
              </Button>
              <Button onClick={handleApprove} disabled={isProcessing}>
                <UserCheck className="mr-2 h-4 w-4" />
                Approuver
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
