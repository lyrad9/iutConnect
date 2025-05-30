import { NextResponse } from "next/server";
import { getConvexClient } from "@/src/lib/convex";
import { api } from "@/src/convex/_generated/api";

export async function GET() {
  try {
    const client = getConvexClient();
    const tasks = await client.query(api.tasks.get);
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);
    return NextResponse.json(
      { error: "Échec de la récupération des tâches" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Le texte de la tâche est requis" },
        { status: 400 }
      );
    }

    const client = getConvexClient();
    const taskId = await client.mutation(api.tasks.add, { text });

    return NextResponse.json({ success: true, taskId });
  } catch (error) {
    console.error("Erreur lors de la création de la tâche:", error);
    return NextResponse.json(
      { error: "Échec de la création de la tâche" },
      { status: 500 }
    );
  }
}
