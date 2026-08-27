import { Heart } from "lucide-react";

type StatusCardProps = {
  totalHours?: number;
};

export function StatusCard({ totalHours = 0 }: StatusCardProps) {
  return (
    <section
      data-ocid="status_card"
      className="stat-grid"
      aria-label="Total hours"
    >
      <div className="relative overflow-hidden rounded-[28px] bg-primary p-6 text-primary-foreground shadow-elevated">
        <div className="relative z-10">
          <p className="text-sm font-medium tracking-wide text-primary-foreground/85">
            Total Hours
          </p>
          <div className="mt-1 flex items-end gap-2">
            <span className="font-display text-6xl font-bold leading-none tracking-tight">
              {totalHours}
            </span>
            <span className="mb-1 text-lg font-medium text-primary-foreground/90">
              hrs
            </span>
            <Heart
              className="mb-1 ml-1 h-6 w-6 text-primary-foreground"
              strokeWidth={2}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Hands holding a heart with keys — white line-art illustration */}
        <svg
          viewBox="0 0 120 120"
          className="pointer-events-none absolute -right-4 -bottom-6 h-40 w-40 text-primary-foreground/90"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* left hand */}
          <path d="M18 88c6-14 16-20 26-22" />
          <path d="M14 78c8-4 16-4 22 0" />
          <path d="M20 96c4-8 10-12 16-14" />
          {/* right hand */}
          <path d="M102 88c-6-14-16-20-26-22" />
          <path d="M106 78c-8-4-16-4-22 0" />
          <path d="M100 96c-4-8-10-12-16-14" />
          {/* heart */}
          <path d="M60 62c-2-4-8-6-12-3-4 3-4 9 0 13l12 12 12-12c4-4 4-10 0-13-4-3-10-1-12 3z" />
          {/* keys */}
          <path d="M60 88v14" />
          <circle cx="60" cy="106" r="4" />
          <path d="M60 92h10" />
          <path d="M70 92v6" />
        </svg>
      </div>
    </section>
  );
}
