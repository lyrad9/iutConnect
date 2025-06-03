import { AuthHeader } from "./auth-header";

export default function AuthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader />
      {/* <div className="h-16" /> */}
      {/* Main content */}
      <main className="flex flex-1 items-center justify-center py-4 md:py-8">
        {children}
      </main>
    </div>
  );
}
