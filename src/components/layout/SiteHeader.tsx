import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "./Container";
import { APP_AUTH_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/quote", label: "Get a quote" },
  { to: "/transporters", label: "Transporters" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link to="/" aria-label="HOZGO home" className="shrink-0">
          <img src="/brand/hozgo-logo-crop.png" alt="HOZGO" width={769} height={214} className="h-9 w-auto" />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn("text-sm font-medium text-muted-foreground transition-colors hover:text-foreground", isActive && "text-foreground")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="outline" size="sm">
            <a href={APP_AUTH_URL}>Get the app</a>
          </Button>
          <Button asChild size="sm">
            <Link to="/quote">Get a quote</Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md lg:hidden focus-ring"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      {open && (
        <div id="mobile-menu" className="border-t border-border bg-background lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn("rounded-md px-2 py-3 text-base font-medium text-muted-foreground", isActive && "text-foreground")
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <Button asChild>
                <Link to="/quote">Get a quote</Link>
              </Button>
              <Button asChild variant="outline">
                <a href={APP_AUTH_URL}>Get the app</a>
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
