import { Link } from "react-router-dom";
import { Container } from "./Container";
import { StoreBadges } from "./StoreBadges";
import { CONTACT_EMAIL, FACEBOOK_URL } from "@/lib/site";

const LINKS = [
  { to: "/about", label: "About" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/transporters", label: "Transporters" },
  { to: "/contact", label: "Contact" },
  { to: "/support", label: "Support" },
  { to: "/privacy", label: "Privacy" },
  { to: "/terms", label: "Terms" },
];

export function SiteFooter() {
  return (
    <footer className="bg-black text-white">
      <Container className="py-12">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <img src="/brand/logo-white.png" alt="HOZGO" className="h-9 w-auto" />
            <p className="mt-4 text-sm font-medium">HOZGO. Safe. Compliant. Trusted.</p>
            <p className="mt-4 text-sm text-white">
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline-offset-4 hover:underline">
                {CONTACT_EMAIL}
              </a>
              <span className="mx-2" aria-hidden="true">
                ·
              </span>
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                Facebook
              </a>
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white">
              {LINKS.map((l) => (
                <Link key={l.to} to={l.to} className="underline-offset-4 hover:text-white hover:underline">
                  {l.label}
                </Link>
              ))}
            </nav>
            <StoreBadges />
          </div>
        </div>
        <p className="mt-10 border-t border-white/15 pt-6 text-xs text-white">
          © {new Date().getFullYear()} HOZGO. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
