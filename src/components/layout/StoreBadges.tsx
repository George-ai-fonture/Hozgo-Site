import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M16.37 12.6c-.03-2.7 2.2-4 2.3-4.06-1.25-1.83-3.2-2.08-3.9-2.11-1.66-.17-3.24.98-4.08.98-.85 0-2.15-.96-3.53-.93-1.82.03-3.5 1.06-4.43 2.69-1.89 3.28-.48 8.13 1.36 10.79.9 1.3 1.97 2.76 3.37 2.71 1.36-.05 1.87-.87 3.51-.87 1.64 0 2.1.87 3.53.84 1.46-.03 2.38-1.32 3.27-2.63 1.03-1.51 1.46-2.97 1.48-3.04-.03-.01-2.84-1.09-2.87-4.33ZM13.7 4.65c.74-.9 1.25-2.15 1.11-3.4-1.07.04-2.37.71-3.14 1.61-.69.8-1.29 2.07-1.13 3.29 1.19.09 2.42-.61 3.16-1.5Z" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M4.2 2.4c-.3.3-.4.8-.4 1.4v16.4c0 .6.1 1.1.4 1.4l.1.1 9.2-9.2v-.2L4.3 2.3l-.1.1Zm12.3 12.4-3.1-3.1v-.2l3.1-3.1.1.1 3.7 2.1c1 .6 1 1.5 0 2.1l-3.7 2.1h-.1Zm.1-.1-3.2-3.2L4.2 21.6c.4.4.9.4 1.6.1l10.8-6.9Zm0-6.8L5.8 1c-.7-.4-1.2-.3-1.6.1l9.2 9.2 3.2-3.4Z" />
    </svg>
  );
}

const badgeClass =
  "inline-flex items-center gap-3 rounded-lg border border-white/30 bg-black px-4 py-2 text-white transition-colors hover:bg-gunmetal-800 focus-ring";

export function StoreBadges({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className={badgeClass} aria-label="Download on the App Store">
        <AppleIcon className="h-6 w-6" />
        <span className="flex flex-col text-left leading-tight">
          <span className="text-[10px] font-medium">Download on the</span>
          <span className="text-sm font-semibold">App Store</span>
        </span>
      </a>
      <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className={badgeClass} aria-label="Get it on Google Play">
        <PlayIcon className="h-6 w-6" />
        <span className="flex flex-col text-left leading-tight">
          <span className="text-[10px] font-medium">Get it on</span>
          <span className="text-sm font-semibold">Google Play</span>
        </span>
      </a>
    </div>
  );
}
