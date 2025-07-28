import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Query pour obtenir les statistiques principales du dashboard admin :
 * - Nombre d'étudiants (fonction === "Etudiant")
 * - Nombre de staff (fonction existe et != "Etudiant")
 * - Nombre d'admins (role === "ADMIN" ou "SUPERADMIN")
 */
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    let students = 0;
    let staff = 0;
    let admins = 0;
    for (const user of users) {
      if (user.role === "ADMIN" || user.role === "SUPERADMIN") {
        admins++;
      } else if (user.fonction === "Etudiant") {
        students++;
      } else if (user.fonction && user.fonction !== "Etudiant") {
        staff++;
      }
    }
    return {
      students,
      staff,
      admins,
    };
  },
});
