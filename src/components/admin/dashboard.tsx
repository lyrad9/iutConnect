"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  MessageSquare,
  Calendar,
  FileText,
  UserCheck,
  TrendingUp,
} from "lucide-react";
import { useState, useEffect } from "react";

const statsData = [
  { icon: Users, label: "Utilisateurs", value: "2,847", change: "+12%" },
  { icon: MessageSquare, label: "Posts", value: "1,234", change: "+8%" },
  { icon: Calendar, label: "Événements", value: "89", change: "+15%" },
  { icon: FileText, label: "Commentaires", value: "5,678", change: "+23%" },
];

const inscriptionsData = [
  { date: "01/01", inscriptions: 45 },
  { date: "05/01", inscriptions: 52 },
  { date: "10/01", inscriptions: 48 },
  { date: "15/01", inscriptions: 61 },
  { date: "20/01", inscriptions: 55 },
  { date: "25/01", inscriptions: 67 },
  { date: "30/01", inscriptions: 73 },
];

const rolesData = [
  { name: "Étudiants", value: 2156, color: "#3b82f6" },
  { name: "Professeurs", value: 456, color: "#10b981" },
  { name: "Staff", value: 189, color: "#f59e0b" },
  { name: "Admins", value: 46, color: "#ef4444" },
];

const newUsers = [
  {
    name: "Alice Martin",
    email: "alice.martin@univ.fr",
    role: "Étudiant",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    name: "Pierre Dubois",
    email: "pierre.dubois@univ.fr",
    role: "Professeur",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    name: "Marie Leroy",
    email: "marie.leroy@univ.fr",
    role: "Étudiant",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    name: "Jean Moreau",
    email: "jean.moreau@univ.fr",
    role: "Staff",
    avatar: "/placeholder.svg?height=32&width=32",
  },
];

const pendingRequests = [
  {
    name: "Sophie Bernard",
    email: "sophie.bernard@univ.fr",
    role: "Étudiant",
    date: "2024-01-15",
  },
  {
    name: "Lucas Petit",
    email: "lucas.petit@univ.fr",
    role: "Professeur",
    date: "2024-01-14",
  },
  {
    name: "Emma Roux",
    email: "emma.roux@univ.fr",
    role: "Étudiant",
    date: "2024-01-13",
  },
];

export function Dashboard() {
  const [currentStatIndex, setCurrentStatIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % statsData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de votre réseau social universitaire
        </p>
      </div>

      {/* Statistiques en carrousel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5" />
            Statistiques clés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statsData.map((stat, index) => (
              <div
                key={stat.label}
                className={`p-4 rounded-lg border transition-all duration-500 ${
                  index === currentStatIndex
                    ? "bg-primary/5 border-primary shadow-md scale-105"
                    : "bg-muted/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="mt-2">
                  <Badge variant="secondary" className="text-green-600">
                    {stat.change}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique des inscriptions */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution des inscriptions</CardTitle>
            <CardDescription>Nouveaux inscrits sur 30 jours</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={inscriptionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="inscriptions"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition des rôles */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des rôles</CardTitle>
            <CardDescription>
              Distribution des utilisateurs par rôle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={rolesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {rolesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nouveaux inscrits */}
        <Card>
          <CardHeader>
            <CardTitle>Nouveaux inscrits (7 derniers jours)</CardTitle>
            <CardDescription>Utilisateurs récemment rejoints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {newUsers.map((user, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <Badge variant="outline">{user.role}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Demandes en attente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Demandes d'inscription en attente
              <Badge variant="destructive">{pendingRequests.length}</Badge>
            </CardTitle>
            <CardDescription>Validations requises</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingRequests.map((request, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between space-x-4"
                >
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {request.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {request.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {request.date}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <UserCheck className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive">
                      Rejeter
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
