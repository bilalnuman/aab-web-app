import React from "react";

type SpinnerSize = "sm" | "md" | "lg";
type SpinnerColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";
type SpinnerVariant = "default" | "simple" | "gradient" | "wave" | "dots" | "spinner";

export type SpinnerProps = {
  size?: SpinnerSize;
  color?: SpinnerColor;
  variant?: SpinnerVariant;
  label?: string;
  "aria-label"?: string;
  className?: string;
};

const sizeMap: Record<SpinnerSize, { box: string; label: string; stroke: number }> = {
  sm: { box: "h-4 w-4", label: "text-xs", stroke: 3 },
  md: { box: "h-6 w-6", label: "text-sm", stroke: 3.5 },
  lg: { box: "h-8 w-8", label: "text-base", stroke: 4 },
};

const colorMap: Record<SpinnerColor, string> = {
  default: "text-zinc-600 dark:text-zinc-300",
  primary: "text-blue-600 dark:text-blue-400",
  secondary: "text-purple-600 dark:text-purple-400",
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-500 dark:text-amber-400",
  danger: "text-rose-600 dark:text-rose-400",
};

 function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function Spinner({
  size = "md",
  color = "primary",
  variant = "default",
  label,
  className,
  "aria-label": ariaLabel,
}: SpinnerProps) {
  // HeroUI sets a default "Loading" aria-label for accessibility. :contentReference[oaicite:1]{index=1}
  const a11yLabel = ariaLabel ?? label ?? "Loading";
  const s = sizeMap[size];

  return (
    <div
      className={cx("inline-flex items-center gap-2", colorMap[color], className)}
      role="status"
      aria-label={a11yLabel}
    >
      {variant === "default" && <RingDefault box={s.box} stroke={s.stroke} />}
      {variant === "simple" && <RingSimple box={s.box} />}
      {variant === "gradient" && <RingGradient box={s.box} stroke={s.stroke} />}
      {variant === "dots" && <Dots box={s.box} />}
      {variant === "wave" && <Wave box={s.box} />}
      {variant === "spinner" && <Bars box={s.box} />}

      {label ? <span className={cx("leading-none", s.label)}>{label}</span> : null}
    </div>
  );
}

function RingDefault({ box, stroke }: { box: string; stroke: number }) {
  // Two circles: faint track + animated dash ring (HeroUI-like “default” feel)
  return (
    <svg className={cx(box, "animate-spin")} viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth={stroke}
        opacity="0.25"
      />
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray="18 56"
        opacity="0.9"
      />
    </svg>
  );
}

function RingSimple({ box }: { box: string }) {
  // Classic minimal ring with a transparent segment
  return (
    <div
      className={cx(
        box,
        "rounded-full border-2 border-current border-t-transparent animate-spin"
      )}
    />
  );
}

function RingGradient({ box, stroke }: { box: string; stroke: number }) {
  // Gradient stroke + spin (HeroUI-like “gradient” variant)
  const gid = React.useId();
  return (
    <svg className={cx(box, "animate-spin")} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="24" y2="24">
          <stop stopColor="currentColor" stopOpacity="1" />
          <stop stopColor="currentColor" stopOpacity="0.1" offset="1" />
        </linearGradient>
      </defs>
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke={`url(#${gid})`}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray="28 56"
      />
    </svg>
  );
}

function Dots({ box }: { box: string }) {
  // 3 dots with staggered pulse
  const dot = "h-[0.35em] w-[0.35em] rounded-full bg-current";
  return (
    <div className={cx(box, "grid place-items-center")}>
      <div className="flex items-center gap-1">
        <span className={cx(dot, "animate-pulse")} style={{ animationDelay: "0ms" }} />
        <span className={cx(dot, "animate-pulse")} style={{ animationDelay: "150ms" }} />
        <span className={cx(dot, "animate-pulse")} style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

function Wave({ box }: { box: string }) {
  // 5 dots “wave” bounce
  const dot = "h-[0.35em] w-[0.35em] rounded-full bg-current";
  const delays = ["0ms", "80ms", "160ms", "240ms", "320ms"];
  return (
    <div className={cx(box, "grid place-items-center")}>
      <div className="flex items-end gap-1">
        {delays.map((d) => (
          <span
            key={d}
            className={cx(dot, "animate-bounce")}
            style={{ animationDelay: d, animationDuration: "700ms" }}
          />
        ))}
      </div>
    </div>
  );
}

function Bars({ box }: { box: string }) {
  // 12-bar “spinner” (like many UI libs). Uses a tiny custom keyframe via arbitrary animation.
  const bars = Array.from({ length: 12 });
  return (
    <div className={cx(box, "relative")}>
      {bars.map((_, i) => {
        const rotate = i * 30;
        const delay = -(1 - i / 12); // negative delays to start “in motion”
        return (
          <span
            key={i}
            className={cx(
              "absolute left-1/2 top-1/2 block h-[28%] w-[10%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-current",
              "[animation:heroui-bars_1s_linear_infinite]"
            )}
            style={{
              transform: `translate(-50%, -50%) rotate(${rotate}deg) translate(0, -120%)`,
              animationDelay: `${delay}s`,
              opacity: 0.15,
            }}
          />
        );
      })}
    </div>
  );
}
