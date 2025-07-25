"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { AnimatedTabs } from "@/src/components/ui/animated-tabs";
import { PaginateStepper } from "@/src/components/ui/paginate-stepper";
import { InputWithTags } from "@/src/components/ui/input-with-tags";
import { Tag } from "emblor";
import {
  AtSign,
  Plus,
  Trash2,
  Upload,
  Loader2,
  PencilLine,
  X,
  Globe,
  Calendar,
  User,
  FilePlus2,
  Images as I,
} from "lucide-react";
import { toast } from "sonner";
import { useEditProfilUserModal } from "@/src/hooks/edit-profil.modal.store";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useIsDirty } from "@/src/hooks/use-is-dirty";
import { useAuthToken } from "@convex-dev/auth/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { cn } from "@/src/lib/utils";
import { CalendarMonthYearSelect } from "@/src/components/ui/calendar-month-year-select";
import { Switch } from "@/src/components/ui/switch";

// Type de lien social
export type SocialLink = {
  network: string;
  link: string;
};

// Type pour l'éducation
export type Education = {
  institution: string;
  diploma: string;
  startDate: Date;
  endDate?: Date | null;
  current: boolean;
};

// Type pour l'expérience professionnelle
export type WorkExperience = {
  company: string;
  jobTitle: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
};

// Le maximum de taille pour les fichiers d'images (2Mo)
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

// Schéma Zod pour le formulaire de profil
const profileFormSchema = z
  .object({
    username: z.string().optional(),
    firstName: z
      .string()
      .min(1, "Le prénom doit contenir au moins 2 caractères"),
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    phoneNumber: z.string().optional(),
    isPhoneNumberHidden: z.boolean().default(false),
    bio: z
      .string()
      .max(500, "La biographie ne doit pas dépasser 500 caractères")
      .optional(),
    town: z.string().optional(),
    address: z.string().optional(),
    profilePicture: z
      .instanceof(File)
      .refine(
        (file) => file.size <= MAX_FILE_SIZE,
        "La taille maximale est de 2Mo"
      )
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Format acceptés: .jpg, .jpeg, .png, .webp et .gif"
      )
      .optional()
      .nullable(),
    coverPhoto: z
      .instanceof(File)
      .refine(
        (file) => file.size <= MAX_FILE_SIZE,
        "La taille maximale est de 2Mo"
      )
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Format acceptés: .jpg, .jpeg, .png, .webp et .gif"
      )
      .optional()
      .nullable(),
    socialLinks: z
      .array(
        z.object({
          network: z.string().min(1, "Le nom de la plateforme est requis"),
          link: z.string().url("Doit être une URL valide"),
        })
      )
      .optional()
      .refine(
        (links) => !links || links.length <= 4,
        "Vous ne pouvez pas ajouter plus de 4 réseaux sociaux"
      ),
    skills: z
      .array(z.string())
      .optional()
      .refine(
        (skills) => !skills || skills.length <= 10,
        "Vous ne pouvez pas ajouter plus de 10 compétences"
      ),
    interests: z
      .array(z.string())
      .optional()
      .refine(
        (interests) => !interests || interests.length <= 10,
        "Vous ne pouvez pas ajouter plus de 10 centres d&apos;intérêt"
      ),
    education: z
      .array(
        z.object({
          institution: z
            .string()
            .min(1, "Le nom de l&apos;établissement est requis"),
          diploma: z.string().min(1, "Le diplôme obtenu est requis"),
          startDate: z.date({
            required_error: "La date de début est requise",
          }),
          endDate: z.date().optional().nullable(),
          current: z.boolean().default(false),
        })
      )
      .optional()
      .refine(
        (education) => !education || education.length <= 3,
        "Vous ne pouvez pas ajouter plus de 3 formations"
      ),
    workExperience: z
      .array(
        z.object({
          company: z.string().min(1, "Le nom de l&apos;entreprise est requis"),
          jobTitle: z.string().min(1, "Le poste occupé est requis"),
          location: z.string().min(1, "Le lieu est requis"),
          startDate: z.date({
            required_error: "La date de début est requise",
          }),
          endDate: z.date().optional().nullable(),
          current: z.boolean().default(false),
        })
      )
      .optional()
      .refine(
        (workExperience) => !workExperience || workExperience.length <= 3,
        "Vous ne pouvez pas ajouter plus de 3 expériences professionnelles"
      ),
  })
  .refine(
    (data) => {
      // Si la ville ou l'adresse est fournie, les deux doivent être fournies
      if ((data.town && !data.address) || (!data.town && data.address)) {
        return false;
      }
      return true;
    },
    {
      message: "La ville et l'adresse doivent être renseignées ensemble",
      path: ["address"],
    }
  );
//
// Définition des onglets
const tabs = [
  // On va ajouter des icones pour les afficher en version mobile
  { id: "personal", label: "Infos personnelles", icon: <User /> },
  { id: "photos", label: "Photos", icon: <I /> },
  { id: "other", label: "Autres informations", icon: <FilePlus2 /> },
];

// Variantes d'animation pour le contenu des onglets
const contentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function EditProfilModal() {
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
  console.log(url);
  const { open, setOpen } = useEditProfilUserModal();
  const formRef = useRef<HTMLFormElement>(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // État pour la pagination dans l'onglet "Autres"
  const [otherStep, setOtherStep] = useState(1);
  const otherSteps = [1, 2, 3, 4]; // 1: Liens sociaux, 2: Skills & Intérêts, 3: Éducation, 4: Expérience

  // États pour les images
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  console.log("profileImageFile", profileImageFile);
  console.log("coverImageFile", coverImageFile);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );

  // États pour les skills et intérêts
  const [skills, setSkills] = useState<Tag[]>([]);
  const [interests, setInterests] = useState<Tag[]>([]);

  // États pour l'éducation et l'expérience professionnelle
  const [education, setEducation] = useState<Education[]>([]);
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);

  const token = useAuthToken();
  // Récupérer les données utilisateur
  const userInfo = useQuery(api.users.getUserPersonalInformation);
  const userImages = useQuery(api.users.getUserImages);

  // Récupérer les fonctions de mutation
  const updateUserInfo = useMutation(api.users.updateUserPersonalInfo);

  // Configurer le formulaire
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      isPhoneNumberHidden: false,
      bio: "",
      town: "",
      address: "",
      profilePicture: null,
      coverPhoto: null,
      socialLinks: [],
      skills: [],
      interests: [],
      education: [],
      workExperience: [],
    },
  });

  // Suivre si le formulaire a des modifications
  const isDirty =
    useIsDirty(form) || profileImageFile !== null || coverImageFile !== null;
  console.log("isDirty", isDirty);
  // Initialiser le formulaire avec les données utilisateur lorsqu'elles sont chargées
  useEffect(() => {
    if (userInfo && form) {
      form.reset({
        username: userInfo.username || "",
        firstName: userInfo.firstName || "",
        lastName: userInfo.lastName || "",
        phoneNumber: userInfo.phoneNumber || "",
        isPhoneNumberHidden: userInfo.isPhoneNumberHidden || false,
        bio: userInfo.bio || "",
        town: userInfo.town || "",
        address: userInfo.address || "",
        profilePicture: null,
        coverPhoto: null,
        socialLinks: userInfo.socialNetworks || [],
        skills: userInfo.skills || [],
        interests: userInfo.interests || [],
        education: userInfo.education.map((education) => ({
          institution: education.institution,
          diploma: education.diploma,
          startDate: new Date(education.startDate),
          endDate: education.endDate ? new Date(education.endDate) : undefined,
          current: false,
        })),
        workExperience: userInfo.workExperience?.map((workExperience: any) => ({
          company: workExperience.company,
          location: workExperience.location,
          jobTitle: workExperience.jobTitle,
          startDate: new Date(workExperience.startDate),
          endDate: workExperience.endDate
            ? new Date(workExperience.endDate)
            : undefined,
          current: false,
        })),
      });

      // Convertir les compétences et intérêts en format Tag pour InputWithTags
      setSkills(
        (userInfo.skills || []).map((skill, index) => ({
          id: `skill-${index}`,
          text: skill,
        }))
      );

      setInterests(
        (userInfo.interests || []).map((interest, index) => ({
          id: `interest-${index}`,
          text: interest,
        }))
      );

      // Initialiser les états pour l'éducation et l'expérience professionnelle
      setEducation(
        userInfo.education.map((education) => ({
          institution: education.institution,
          diploma: education.diploma,
          startDate: new Date(education.startDate),
          endDate: education.endDate ? new Date(education.endDate) : null,
          current: false,
        })) || []
      );
    }
  }, [userInfo, form]);

  // Initialiser les états d'image lorsque les images utilisateur sont chargées
  useEffect(() => {
    if (userImages) {
      setProfileImagePreview(userImages.profilePicture);
      setCoverImagePreview(userImages.coverPhoto);
    }
  }, [userImages]);

  // Gérer la soumission du formulaire
  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    console.log("values", values);
    try {
      setIsSubmitting(true);

      const updateData: any = {
        username: values.username,
        phoneNumber: values.phoneNumber,
        isPhoneNumberHidden: values.isPhoneNumberHidden,
        town: values.town,
        address: values.address,
        bio: values.bio,
        socialNetworks: values.socialLinks,

        // Convertir les tags en chaînes simples pour les compétences et intérêts
        skills: skills.map((tag) => tag.text),
        interests: interests.map((tag) => tag.text),

        // Ajouter les données d'éducation et d'expérience professionnelle
        // convertir chaque date en timeStamp pour conformité avec le backend
        education: values.education?.map((edu) => {
          const { current, ...rest } = edu;
          return {
            ...rest,
            startDate: edu.startDate.getTime(),
            endDate: edu.endDate ? edu.endDate.getTime() : undefined,
          };
        }),
        workExperience: values.workExperience?.map((exp) => {
          const { current, ...rest } = exp;
          return {
            ...rest,
            startDate: exp.startDate.getTime(),
            endDate: exp.endDate ? exp.endDate.getTime() : undefined,
          };
        }),
      };

      // Si nous avons de nouvelles images, les télécharger
      if (profileImageFile || coverImageFile) {
        const formData = new FormData();

        if (profileImageFile) {
          formData.append("profilePicture", profileImageFile);
          // Ajouter l'ancien ID s'il existe
          /*  if (userImages?.profilePicture) {
            formData.append("oldProfileId", userImages.profilePicture);
          } */
        }

        if (coverImageFile) {
          formData.append("coverPhoto", coverImageFile);
          // Ajouter l'ancien ID s'il existe
          /*    if (userImages?.coverPhoto) {
            formData.append("oldCoverId", userImages.coverPhoto);
          } */
        }

        // Uploader les images
        const response = await fetch("http://127.0.0.1:3211/uploadUserImages", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(
            error.message || "Échec du téléchargement des images"
          );
        }

        const result = await response.json();

        if (result.success) {
          // Ajouter les IDs des images aux données à mettre à jour0
          if (result.profilePictureId) {
            updateData.profilePicture = result.profilePictureId;
          }

          if (result.coverPhotoId) {
            updateData.coverPhoto = result.coverPhotoId;
          }
        }
      }

      // Mettre à jour les informations de l'utilisateur
      await updateUserInfo(updateData);

      toast.success("Profil mis à jour avec succès !");
      router.refresh();
      // Réinitialiser l'état du fichier d'image
      setProfileImageFile(null);
      setCoverImageFile(null);

      // Réinitialiser l'état du formulaire
      form.reset({
        ...values,
        profilePicture: null,
        coverPhoto: null,
      });
    } catch (error: any) {
      console.log(error.message);
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gérer les actions de lien social
  const addSocialLink = () => {
    const currentLinks = form.getValues("socialLinks") || [];
    form.setValue("socialLinks", [...currentLinks, { network: "", link: "" }], {
      shouldDirty: true,
    });
  };

  const addPersonalSite = (network: string) => {
    const currentLinks = form.getValues("socialLinks") || [];
    form.setValue(
      "socialLinks",
      [{ network: network, link: "" }, ...currentLinks],
      {
        shouldDirty: true,
      }
    );
  };

  const removeSocialLink = (index: number) => {
    const currentLinks = form.getValues("socialLinks") || [];
    form.setValue(
      "socialLinks",
      currentLinks.filter((_, i) => i !== index)
    );
  };

  // Gérer le téléchargement d'image
  const handleImageSelection = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "cover"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Vérifier le type de fichier
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error(
          "Format d'image invalide. Formats autorisés : JPEG, PNG, WebP, GIF"
        );
        return;
      }

      // Vérifier la taille du fichier (2Mo max)
      if (file.size > MAX_FILE_SIZE) {
        toast.error("Image trop volumineuse. Taille maximale : 2Mo");
        return;
      }

      // Créer une URL pour l'aperçu
      const previewUrl = URL.createObjectURL(file);

      if (type === "profile") {
        setProfileImageFile(file);
        setProfileImagePreview(previewUrl);
      } else {
        setCoverImageFile(file);
        setCoverImagePreview(previewUrl);
      }
    } catch (error) {
      console.error("Erreur lors de la sélection de l'image:", error);
      toast.error("Erreur lors de la sélection de l'image");
    }
  };

  // Supprimer l'aperçu d'image
  const removeImagePreview = (type: "profile" | "cover") => {
    if (type === "profile") {
      setProfileImageFile(null);
      setProfileImagePreview(userImages?.profilePicture || null);
    } else {
      setCoverImageFile(null);
      setCoverImagePreview(userImages?.coverPhoto || null);
    }
  };

  // Gérer les changements de compétences
  const handleSkillsChange = (newSkills: Tag[]) => {
    setSkills(newSkills);
    form.setValue(
      "skills",
      newSkills.map((tag) => tag.text),
      { shouldDirty: true }
    );
  };

  // Gérer les changements de centres d'intérêt
  const handleInterestsChange = (newInterests: Tag[]) => {
    setInterests(newInterests);
    form.setValue(
      "interests",
      newInterests.map((tag) => tag.text),
      { shouldDirty: true }
    );
  };

  // Gérer l'ajout d'une formation
  const addEducation = () => {
    // Vérifier si on a déjà atteint la limite de 3 formations
    if (education.length >= 3) {
      toast.error("Vous ne pouvez pas ajouter plus de 3 formations");
      return;
    }

    const currentEducation = form.getValues("education") || [];
    const newEducation = {
      institution: "",
      diploma: "",
      startDate: new Date(),
      endDate: undefined,
      current: false,
    };

    form.setValue("education", [...currentEducation, newEducation], {
      shouldDirty: true,
    });

    setEducation([...education, newEducation]);
  };

  // Gérer la modification d'une formation
  const updateEducation = (
    index: number,
    field: keyof Education,
    value: string | boolean | Date
  ) => {
    const updatedEducation = [...education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };

    // Si "current" est coché, effacer l'année de fin
    if (field === "current" && value === true) {
      updatedEducation[index].endDate = undefined;
    }
    // Verifier si la date de fin est après la date de début
    if (
      updatedEducation[index].endDate &&
      updatedEducation[index].startDate > updatedEducation[index].endDate
    ) {
      toast.error("La date de fin ne peut pas être avant la date de début");
      return;
    }

    form.setValue("education", updatedEducation, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setEducation(updatedEducation);
  };

  // Gérer la suppression d'une formation
  const removeEducation = (index: number) => {
    const updatedEducation = education.filter((_, i) => i !== index);
    setEducation(updatedEducation);
    form.setValue("education", updatedEducation, { shouldDirty: true });
  };

  // Gérer l'ajout d'une expérience professionnelle
  const addWorkExperience = () => {
    // Vérifier si on a déjà atteint la limite de 3 expériences
    if (workExperience.length >= 3) {
      toast.error(
        "Vous ne pouvez pas ajouter plus de 3 expériences professionnelles"
      );
      return;
    }

    const currentExperience = form.getValues("workExperience") || [];
    const newExperience = {
      company: "",
      jobTitle: "",
      location: "",
      startDate: new Date(),
      endDate: undefined,
      current: false,
    };

    form.setValue("workExperience", [...currentExperience, newExperience], {
      shouldDirty: true,
    });

    setWorkExperience([...workExperience, newExperience]);
  };

  // Gérer la modification d'une expérience professionnelle
  const updateWorkExperience = (
    index: number,
    field: keyof WorkExperience,
    value: string | boolean | Date
  ) => {
    const updatedExperience = [...workExperience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    };

    // Si "current" est coché, effacer l'année de fin
    if (field === "current" && value === true) {
      updatedExperience[index].endDate = undefined;
    }

    // Vérfiie si la date de fin est après la date de début
    if (
      updatedExperience[index].endDate &&
      updatedExperience[index].startDate > updatedExperience[index].endDate
    ) {
      toast.error("La date de fin ne peut pas être avant la date de début");
      return;
    }

    setWorkExperience(updatedExperience);
    form.setValue("workExperience", updatedExperience, { shouldDirty: true });
  };

  // Gérer la suppression d'une expérience professionnelle
  const removeWorkExperience = (index: number) => {
    const updatedExperience = workExperience.filter((_, i) => i !== index);
    setWorkExperience(updatedExperience);
    form.setValue("workExperience", updatedExperience, { shouldDirty: true });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[750px] h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-2xl font-bold">
            Modifier votre profil
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1">
          <div className="px-6 py-2">
            <AnimatedTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              className="w-full max-w-md mx-auto mb-0"
            />
          </div>

          <div className="flex-1 px-6 h-[50vh] overflow-y-auto">
            <Form {...form}>
              <form
                ref={formRef}
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col h-full"
              >
                {activeTab === "personal" && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={contentVariants}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 h-full"
                  >
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom d&apos;utilisateur</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <AtSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input {...field} className="pl-8" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Prénom</FormLabel>
                              <FormControl>
                                <Input {...field} disabled />
                              </FormControl>
                              <FormDescription>
                                Le prénom ne peut pas être modifié
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom</FormLabel>
                              <FormControl>
                                <Input {...field} disabled />
                              </FormControl>
                              <FormDescription>
                                Le nom ne peut pas être modifié
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Numéro de téléphone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isPhoneNumberHidden"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>
                                Masquer le numéro de téléphone
                              </FormLabel>
                              <FormDescription>
                                Si activé, votre numéro de téléphone ne sera
                                visible que par vous et les administrateurs
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4 items-start">
                        <FormField
                          control={form.control}
                          name="town"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ville</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormDescription>
                                La ville et l&apos;adresse sont requises
                                ensemble
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Adresse</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Biographie</FormLabel>
                            <FormControl>
                              <Textarea
                                rows={4}
                                className="resize-none"
                                placeholder="Écrivez quelques phrases à propos de vous"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Maximum 500 caractères
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </motion.div>
                )}

                {activeTab === "photos" && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={contentVariants}
                    transition={{ duration: 0.3 }}
                    className="space-y-8 h-full"
                  >
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Photo de profil</h3>
                      <div className="relative h-48 w-48 mx-auto overflow-hidden rounded-full border border-slate-200 bg-slate-50">
                        {profileImagePreview ? (
                          <>
                            <img
                              src={profileImagePreview}
                              alt="Profil"
                              className="w-full h-full object-cover"
                            />
                            {/* Bouton de suppression si c'est un aperçu temporaire */}
                            {/*  {profileImageFile && ( */}
                            <button
                              type="button"
                              onClick={() => removeImagePreview("profile")}
                              className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full"
                            >
                              <X size={16} />
                            </button>
                            {/*  )} */}
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <PencilLine className="h-8 w-8 text-muted-foreground opacity-50" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Label
                            htmlFor="profilePhotoUpload"
                            className="bg-white text-slate-900 px-3 py-2 rounded-md cursor-pointer flex items-center gap-2 text-sm font-medium"
                          >
                            <Upload className="h-4 w-4" />
                            Changer la photo
                          </Label>
                          <Input
                            id="profilePhotoUpload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageSelection(e, "profile")}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Photo de couverture
                      </h3>
                      <div className="relative h-48 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                        {coverImagePreview ? (
                          <>
                            <img
                              src={coverImagePreview}
                              alt="Couverture"
                              className="w-full h-full object-cover"
                            />
                            {/* Bouton de suppression si c'est un aperçu temporaire */}
                            {/*  {coverImageFile && ( */}
                            <button
                              type="button"
                              onClick={() => removeImagePreview("cover")}
                              className="z-60 absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full"
                            >
                              <X size={16} />
                            </button>
                            {/*   )} */}
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <PencilLine className="h-10 w-10 text-muted-foreground opacity-50" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Label
                            htmlFor="coverPhotoUpload"
                            className="bg-white text-slate-900 px-3 py-2 rounded-md cursor-pointer flex items-center gap-2 text-sm font-medium"
                          >
                            <Upload className="h-4 w-4" />
                            Changer la couverture
                          </Label>
                          <Input
                            id="coverPhotoUpload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageSelection(e, "cover")}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "other" && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={contentVariants}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 h-full"
                  >
                    {/* Section 1: Liens sociaux */}
                    {otherStep === 1 && (
                      <div className="mt-8 flex-grow">
                        <h3 className="text-lg font-semibold mb-4">
                          Liens sociaux
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Ajoutez jusqu&apos;à 4 liens vers vos réseaux sociaux
                          ou sites web personnels.
                        </p>

                        {form.watch("socialLinks")?.map((link, index) => (
                          <div
                            key={index}
                            className="flex items-start g
                            ap-2 mb-2"
                          >
                            <FormField
                              control={form.control}
                              name={`socialLinks.${index}.network`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <div className="relative">
                                      {link.network === "Site personnel" && (
                                        <Globe className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                      )}
                                      <Input
                                        {...field}
                                        className={
                                          link.network === "Site personnel"
                                            ? "pl-8"
                                            : ""
                                        }
                                        placeholder={
                                          link.network === "Site personnel"
                                            ? "Site personnel"
                                            : "Plateforme (ex: LinkedIn)"
                                        }
                                        disabled={
                                          link.network === "Site personnel"
                                        } // Le premier lien est toujours "Site personnel"
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`socialLinks.${index}.link`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder={
                                        link.network === "Site personnel"
                                          ? "https://monsite.com"
                                          : "URL (ex: https://linkedin.com/in/...)"
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeSocialLink(index)}
                              className="flex-shrink-0"
                              /*  disabled={index === 0} */ // Ne pas permettre la suppression du site personnel
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}

                        {(form.watch("socialLinks")?.length || 0) < 4 && (
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addSocialLink}
                              className="mt-2 flex items-center gap-1"
                            >
                              <Plus className="h-4 w-4" />
                              Ajouter un réseau social
                            </Button>
                            {/*Ajouter un site personnelle quand elle n'est plus dans la liste*/}
                            {/*Afficher le bouton s'il ya pas le site personnel dans la liste*/}
                            {form
                              .watch("socialLinks")
                              ?.every(
                                (link) => link.network !== "Site personnel"
                              ) && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2 flex items-center gap-1"
                                /*Ajouter le site personnel*/
                                onClick={() =>
                                  addPersonalSite("Site personnel")
                                }
                              >
                                <Globe className="h-4 w-4 text-destructive" />
                                Ajouter un site personnel
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Section 2: Compétences et centres d'intérêt */}
                    {otherStep === 2 && (
                      <div className="space-y-6 mt-8 flex-grow">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Compétences</h3>
                          <p className="text-sm text-muted-foreground">
                            Ajoutez jusqu&apos;à 10 compétences professionnelles
                            ou techniques.
                          </p>
                          <InputWithTags
                            label="Vos compétences"
                            initialTags={skills}
                            onChange={handleSkillsChange}
                            placeholder="Ajouter une compétence"
                            maxTags={10}
                            description="Appuyez sur Entrée pour ajouter une compétence"
                          />
                        </div>

                        <div className="space-y-4 mt-8">
                          <h3 className="text-lg font-semibold">
                            Centres d&apos;intérêt
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Ajoutez jusqu&apos;à 10 centres d&apos;intérêt
                            personnels.
                          </p>
                          <InputWithTags
                            label="Vos centres d'intérêt"
                            initialTags={interests}
                            onChange={handleInterestsChange}
                            placeholder="Ajouter un centre d'intérêt"
                            maxTags={10}
                            description="Appuyez sur Entrée pour ajouter un centre d'intérêt"
                          />
                        </div>
                      </div>
                    )}

                    {/* Section 3: Éducation*/}
                    {otherStep === 3 && (
                      <div className="mt-8 flex-grow">
                        <h3 className="text-lg font-semibold mb-2">
                          Formation et éducation
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Ajoutez vos diplômes et formations académiques.
                        </p>
                        <div className="flex flex-col gap-4">
                          {education.map((edu, index) => (
                            <div
                              key={index}
                              className="bg-muted/50 p-4 rounded-lg space-y-4 relative"
                            >
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={() => removeEducation(index)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>

                              <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`education.${index}.institution`}
                                  >
                                    Établissement / Institut
                                  </Label>
                                  <Input
                                    id={`education.${index}.institution`}
                                    value={edu.institution}
                                    onChange={(e) =>
                                      updateEducation(
                                        index,
                                        "institution",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Nom de l'établissement"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`education.${index}.diploma`}>
                                    Diplôme obtenu
                                  </Label>
                                  <Input
                                    id={`education.${index}.diploma`}
                                    value={edu.diploma}
                                    onChange={(e) =>
                                      updateEducation(
                                        index,
                                        "diploma",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Ex: Licence en informatique"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 items-end">
                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`education.${index}.startDate`}
                                  >
                                    Date de début
                                  </Label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        id={`education.${index}.startDate`}
                                        variant={"outline"}
                                        className={cn(
                                          "w-full justify-start text-left font-normal",
                                          !edu.startDate &&
                                            "text-muted-foreground"
                                        )}
                                      >
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {edu.startDate ? (
                                          format(
                                            edu.startDate,
                                            "dd MMMM yyyy",
                                            {
                                              locale: fr,
                                            }
                                          )
                                        ) : (
                                          <span>Sélectionner une date</span>
                                        )}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-auto p-0"
                                      align="start"
                                    >
                                      <CalendarMonthYearSelect
                                        value={edu.startDate as Date}
                                        onChange={(date) =>
                                          updateEducation(
                                            index,
                                            "startDate",
                                            date as Date
                                          )
                                        }
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>

                                <div className="space-y-2">
                                  {!edu.current && (
                                    <>
                                      <Label
                                        htmlFor={`education.${index}.endDate`}
                                      >
                                        Date de fin
                                      </Label>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                            id={`education.${index}.endDate`}
                                            variant={"outline"}
                                            className={cn(
                                              "w-full justify-start text-left font-normal",
                                              !edu.endDate &&
                                                "text-muted-foreground"
                                            )}
                                          >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {edu.endDate ? (
                                              format(
                                                edu.endDate,
                                                "dd MMMM yyyy",
                                                {
                                                  locale: fr,
                                                }
                                              )
                                            ) : (
                                              <span>Sélectionner une date</span>
                                            )}
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                          className="w-auto p-0"
                                          align="start"
                                        >
                                          <CalendarMonthYearSelect
                                            value={edu.endDate as Date}
                                            onChange={(date) =>
                                              updateEducation(
                                                index,
                                                "endDate",
                                                date as Date
                                              )
                                            }
                                          />
                                        </PopoverContent>
                                      </Popover>
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`education.${index}.current`}
                                  checked={edu.current}
                                  onChange={(e) =>
                                    updateEducation(
                                      index,
                                      "current",
                                      e.target.checked
                                    )
                                  }
                                  className="rounded border-gray-300"
                                />
                                <Label htmlFor={`education.${index}.current`}>
                                  En cours actuellement
                                </Label>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/*Afficher le bouton uniquement car il y'a déjà trois*/}
                        {form.watch("education") &&
                          form.watch("education")!.length < 3 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addEducation}
                              className="mt-2 flex items-center gap-1"
                            >
                              <Plus className="h-4 w-4" />
                              Ajouter une formation
                            </Button>
                          )}
                      </div>
                    )}
                    {/* Section 4: Expérience professionnelle*/}
                    {otherStep === 4 && (
                      <div className="mt-8 flex-grow">
                        <h3 className="text-lg font-semibold mb-2">
                          Expérience professionnelle
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Ajoutez vos expériences professionnelles.
                        </p>
                        <div className="flex flex-col gap-4">
                          {workExperience.map((exp, index) => (
                            <div
                              key={index}
                              className="bg-muted/50 p-4 rounded-lg space-y-4 relative"
                            >
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={() => removeWorkExperience(index)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>

                              <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`workExperience.${index}.company`}
                                  >
                                    Entreprise / Organisation
                                  </Label>
                                  <Input
                                    id={`workExperience.${index}.company`}
                                    value={exp.company}
                                    onChange={(e) =>
                                      updateWorkExperience(
                                        index,
                                        "company",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Nom de l'entreprise"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`workExperience.${index}.jobTitle`}
                                  >
                                    Poste occupé
                                  </Label>
                                  <Input
                                    id={`workExperience.${index}.jobTitle`}
                                    value={exp.jobTitle}
                                    onChange={(e) =>
                                      updateWorkExperience(
                                        index,
                                        "jobTitle",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Ex: Développeur web"
                                  />
                                </div>
                              </div>

                              <div className="space-y-2 mb-4">
                                <Label
                                  htmlFor={`workExperience.${index}.location`}
                                >
                                  Lieu
                                </Label>
                                <Input
                                  id={`workExperience.${index}.location`}
                                  value={exp.location}
                                  onChange={(e) =>
                                    updateWorkExperience(
                                      index,
                                      "location",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Ex: Douala, Cameroun"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4 items-end">
                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`workExperience.${index}.startDate`}
                                  >
                                    Date de début
                                  </Label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        id={`workExperience.${index}.startDate`}
                                        variant={"outline"}
                                        className={cn(
                                          "w-full justify-start text-left font-normal",
                                          !exp.startDate &&
                                            "text-muted-foreground"
                                        )}
                                      >
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {exp.startDate ? (
                                          format(
                                            exp.startDate,
                                            "dd MMMM yyyy",
                                            {
                                              locale: fr,
                                            }
                                          )
                                        ) : (
                                          <span>Sélectionner une date</span>
                                        )}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-auto p-0"
                                      align="start"
                                    >
                                      <CalendarMonthYearSelect
                                        value={exp.endDate as Date}
                                        onChange={(date) =>
                                          updateWorkExperience(
                                            index,
                                            "endDate",
                                            date as Date
                                          )
                                        }
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>

                                <div className="space-y-2">
                                  {!exp.current && (
                                    <>
                                      <Label
                                        htmlFor={`workExperience.${index}.endDate`}
                                      >
                                        Date de fin
                                      </Label>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                            id={`workExperience.${index}.endDate`}
                                            variant={"outline"}
                                            className={cn(
                                              "w-full justify-start text-left font-normal",
                                              !exp.endDate &&
                                                "text-muted-foreground"
                                            )}
                                          >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {exp.endDate ? (
                                              format(
                                                exp.endDate,
                                                "dd MMMM yyyy",
                                                {
                                                  locale: fr,
                                                }
                                              )
                                            ) : (
                                              <span>Sélectionner une date</span>
                                            )}
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                          className="w-auto p-0"
                                          align="start"
                                        >
                                          <CalendarMonthYearSelect
                                            value={exp.endDate as Date}
                                            onChange={(date) =>
                                              updateWorkExperience(
                                                index,
                                                "endDate",
                                                date as Date
                                              )
                                            }
                                          />
                                        </PopoverContent>
                                      </Popover>
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`workExperience.${index}.current`}
                                  checked={exp.current}
                                  onChange={(e) =>
                                    updateWorkExperience(
                                      index,
                                      "current",
                                      e.target.checked
                                    )
                                  }
                                  className="rounded border-gray-300"
                                />
                                <Label
                                  htmlFor={`workExperience.${index}.current`}
                                >
                                  Poste actuel
                                </Label>
                              </div>
                            </div>
                          ))}
                        </div>
                        {form.watch("workExperience") &&
                          form.watch("workExperience")!.length < 3 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addWorkExperience}
                              className="mt-2 flex items-center gap-1"
                            >
                              <Plus className="h-4 w-4" />
                              Ajouter une expérience
                            </Button>
                          )}
                      </div>
                    )}
                    {/* Stepper pour naviguer entre les sections */}
                    <div className=" bg-background sticky w-full bottom-0 mt-24 ">
                      <PaginateStepper
                        steps={otherSteps}
                        initialStep={otherStep}
                        onStepChange={setOtherStep}
                        /*   label={`Étape ${otherStep} sur ${otherSteps.length}`} */
                      />
                    </div>
                  </motion.div>
                )}
              </form>
            </Form>
          </div>
        </div>
        <DialogFooter className="px-6 py-4 border-t">
          <div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={() => form.handleSubmit(onSubmit)()}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
