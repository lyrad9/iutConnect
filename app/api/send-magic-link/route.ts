import { NextRequest, NextResponse } from "next/server";
import { transporter } from "@/src/lib/nodemailer";
import { render } from "@react-email/components";
import MagicLinkEmail from "@/emails/MagicLink";

export async function POST(req: NextRequest) {
  try {
    const { email, url, token } = await req.json();

    if (!email || !url) {
      return NextResponse.json(
        { success: false, message: "Email et URL requis" },
        { status: 400 }
      );
    }
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : (process.env.NEXT_PUBLIC_APP_URL as string);

    // Extraction du nom d'hôte pour affichage dans l'email
    const host = new URL(url).host;
    const customUrl = `${baseUrl}/verify-email?token=${token}&email=${email}`;
    // Génération du contenu HTML de l'email
    const emailHtml = render(
      MagicLinkEmail({
        url: customUrl,
        host,
      })
    );

    // Envoi de l'email
    await transporter.sendMail({
      from: `"IUT social" <mbakopngako@gmail.com>`,
      to: email,
      subject: "Lien de connexion - Réseau Social IUT",
      html: await emailHtml,
      text: `Cliquez sur ce lien pour vous connecter: ${customUrl}. Si vous n'avez pas demandé ce lien, vous pouvez l'ignorer.`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de l'envoi de l'email",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
