import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type UniversityUser = {
  registrationNumber: string;
  password: string;
  firstName: string;
  lastName: string;
  fonction?: string;
  fieldOfStudy?: string;
  level?: string;
  classroom?: string;
  phoneNumber?: string;
};

type UniversityDB = {
  students: UniversityUser[];
  staff: UniversityUser[];
};

export async function POST(request: NextRequest) {
  try {
    const { registrationNumber, password } = await request.json();

    if (!registrationNumber || !password) {
      return NextResponse.json(
        { success: false, message: "Matricule et mot de passe requis" },
        { status: 400 }
      );
    }

    const dbPath = path.join(process.cwd(), "src/data/university-db.json");
    const dbData = await fs.promises.readFile(dbPath, "utf8");
    const db = JSON.parse(dbData) as UniversityDB;

    const student = db.students.find(
      (user) => user.registrationNumber === registrationNumber
    );
    const staffMember = db.staff.find(
      (user) => user.registrationNumber === registrationNumber
    );
    const user = student || staffMember;

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Matricule non trouvé" },
        { status: 404 }
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        { success: false, message: "Mot de passe incorrect" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          registrationNumber: user.registrationNumber,
          firstName: user.firstName,
          lastName: user.lastName,
          password: user.password,
          fonction: user.fonction ?? "Etudiant",
          ...(student && {
            fieldOfStudy: student.fieldOfStudy,
            level: student.level,
            classroom: student.classroom,
            phoneNumber: student.phoneNumber,
          }),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erreur lors de la vérification des identifiants:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur interne du serveur",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
