"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  StudentFormData,
  studentSchema,
} from "@/src/lib/validations/register.schema";
import {
  DEPARTMENTS,
  STUDY_LEVELS,
  StudyLevelType,
  DepartmentCode,
  getClassesByLevel,
  USER_FUNCTIONS,
} from "@/src/components/utils/const/user-functions";

export function StudentRegistrationForm() {
  // État pour gérer les classes disponibles en fonction du niveau et de la filière
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);

  // Initialisation du formulaire avec React Hook Form et validation Zod
  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      registrationNumber: "",
      function: USER_FUNCTIONS.STUDENT,
      level: STUDY_LEVELS.LEVEL_I,
      department: "GL",
      classroom: "",
    },
  });

  // Mise à jour des classes disponibles lorsque le niveau ou la filière change
  const selectedLevel = form.watch("level") as StudyLevelType;
  const selectedDepartment = form.watch("department") as DepartmentCode;

  useEffect(() => {
    if (selectedLevel && selectedDepartment) {
      // Récupération des classes correspondant au niveau et à la filière sélectionnés

      const classes = DEPARTMENTS[selectedDepartment].classes[selectedLevel];
      // Conversion du tableau readonly en tableau standard
      setAvailableClasses([...classes]);

      // Réinitialisation de la classe si elle n'est plus disponible dans la nouvelle liste
      const currentClass = form.getValues("classroom");
      if (currentClass && !classes.includes(currentClass as never)) {
        form.setValue("classroom", "");
      }
    }
  }, [selectedLevel, selectedDepartment, form]);

  // Gestion de la soumission du formulaire
  const onSubmit = (data: StudentFormData) => {
    // Ici, vous devrez implémenter la logique d'envoi des données au backend
    console.log("Données de l'étudiant à envoyer:", data);
    // TODO: Intégrer avec Convex ou autre backend
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-8">
        {/* Nom et prénom (sur la même ligne) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Dupont" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Jean" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="jean.dupont@email.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Numéro de téléphone et matricule (sur la même ligne) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de téléphone</FormLabel>
                <FormControl>
                  <Input placeholder="691234567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="registrationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Matricule</FormLabel>
                <FormControl>
                  <Input placeholder="20E1234" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Niveau d'étude et filière (sur la même ligne) */}
        <div className="flex gap-2 flex-wrap">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Niveau</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionnez votre niveau" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(STUDY_LEVELS).map((level) => (
                        <SelectItem key={level} value={level}>
                          Niveau {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filière</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionnez votre filière" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(DEPARTMENTS).map(([code, dept]) => (
                        <SelectItem key={code} value={code}>
                          {dept.name} ({code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            {/* Classe */}
            <FormField
              control={form.control}
              name="classroom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classe</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionnez votre classe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="">
                      {availableClasses.map((className) => (
                        <SelectItem key={className} value={className}>
                          {className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          S&apos;inscrire
        </Button>
      </form>
    </Form>
  );
}
