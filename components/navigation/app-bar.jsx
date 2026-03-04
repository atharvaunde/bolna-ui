"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { LayoutDashboard, Users, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Customers", url: "/customers", icon: Users },
];

function NavLinks({ onClick }) {
  const pathname = usePathname();

  const isActive = (url) => {
    if (url === "/") return pathname === "/" || pathname === "/";
    return pathname.startsWith(url);
  };

  return (
    <>
      {navItems.map(({ title, url, icon: Icon }) => (
        <Link
          key={url}
          href={url}
          onClick={onClick}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            isActive(url)
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
          )}
        >
          <Icon className="h-4 w-4" />
          {title}
        </Link>
      ))}
    </>
  );
}

export function AppBar() {
  const [gravatarUrl, setGravatarUrl] = useState("");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="h-14 flex items-center  px-4 gap-4">
        {/* Left: logo + mobile menu */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 pt-10">
              <div className="flex flex-col gap-1 mt-4">
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="font-semibold text-sm hidden sm:inline">
              Bolna
            </span>
          </Link>
        </div>

        {/* Center: desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLinks />
        </nav>
      </div>
    </header>
  );
}
