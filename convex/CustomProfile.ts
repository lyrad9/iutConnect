import { Password } from "@convex-dev/auth/providers/Password";
import { DataModel } from "./_generated/dataModel";
import { MagicLinkProvider } from "./MagicLinkProvider";
import { Value } from "convex/values";
import { UserRole } from "./schema";
function makeProfile(params: Record<string, Value | undefined>) {
  return {
    email: params.email as string,
    registrationNumber: params.registrationNumber as string,
    password: params.password as string,
    firstName: params.firstName as string,
    lastName: params.lastName as string,
    fieldOfStudy: (params.fieldOfStudy as string) ?? undefined,
    classroom: (params.classroom as string) ?? undefined,
    fonction: params.fonction as string,
    phoneNumber: params.phoneNumber as string,
    role: UserRole[0],
    permissions: [],
    interests: undefined,
    socialNetworks: undefined,
    bio: undefined,
    skills: undefined,
    isOnline: false,
    createdAt: Date.now(),
  };
}

export default Password<DataModel>({
  id: "custom-profile",
  profile: makeProfile,
  verify: MagicLinkProvider,
});
