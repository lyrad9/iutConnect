import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet";
import { NavigationItems } from "@/src/components/navigation/site/navigation-config";
import { Button } from "../ui/button";
import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

export default function SiteSheet() {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="size-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <span className="font-bold">UniConnect</span>
          </Link>
          {NavigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 text-sm ${
                pathname === item.href
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
