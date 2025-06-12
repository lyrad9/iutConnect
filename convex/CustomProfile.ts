import { Password } from "@convex-dev/auth/providers/Password";
import { DataModel } from "./_generated/dataModel";
import { MagicLinkProvider } from "./MagicLinkProvider";
export default Password<DataModel>({
  id: "custom-profile",

  profile(params) {
    return {
      email: params.email as string,
      registrationNumber: params.registrationNumber as string,
      password: params.password as string,
      firstName: params.firstName as string,
      lastName: params.lastName as string,
      fieldOfStudy: (params.fieldOfStudy as string) ?? undefined,
      classroom: (params.classroom as string) ?? undefined,
      fonction: params.fonction as string,
    };
  },
  verify: MagicLinkProvider,
});
