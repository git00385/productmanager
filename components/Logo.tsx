interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 40, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="glowGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="url(#bgGrad)" />

      {/* Glow overlay */}
      <circle cx="50" cy="50" r="48" fill="url(#glowGrad)" />

      {/* Brain / neural network icon */}
      {/* Central node */}
      <circle cx="50" cy="50" r="7" fill="white" />

      {/* Outer nodes */}
      <circle cx="50" cy="22" r="5" fill="white" fillOpacity="0.9" />
      <circle cx="74" cy="35" r="5" fill="white" fillOpacity="0.9" />
      <circle cx="74" cy="65" r="5" fill="white" fillOpacity="0.9" />
      <circle cx="50" cy="78" r="5" fill="white" fillOpacity="0.9" />
      <circle cx="26" cy="65" r="5" fill="white" fillOpacity="0.9" />
      <circle cx="26" cy="35" r="5" fill="white" fillOpacity="0.9" />

      {/* Connection lines from center to outer nodes */}
      <line x1="50" y1="43" x2="50" y2="27" stroke="white" strokeWidth="2" strokeOpacity="0.7" />
      <line x1="56" y1="45" x2="70" y2="38" stroke="white" strokeWidth="2" strokeOpacity="0.7" />
      <line x1="56" y1="55" x2="70" y2="62" stroke="white" strokeWidth="2" strokeOpacity="0.7" />
      <line x1="50" y1="57" x2="50" y2="73" stroke="white" strokeWidth="2" strokeOpacity="0.7" />
      <line x1="44" y1="55" x2="30" y2="62" stroke="white" strokeWidth="2" strokeOpacity="0.7" />
      <line x1="44" y1="45" x2="30" y2="38" stroke="white" strokeWidth="2" strokeOpacity="0.7" />

      {/* Cross-connections (ring) */}
      <line x1="50" y1="22" x2="74" y2="35" stroke="white" strokeWidth="1.5" strokeOpacity="0.35" />
      <line x1="74" y1="35" x2="74" y2="65" stroke="white" strokeWidth="1.5" strokeOpacity="0.35" />
      <line x1="74" y1="65" x2="50" y2="78" stroke="white" strokeWidth="1.5" strokeOpacity="0.35" />
      <line x1="50" y1="78" x2="26" y2="65" stroke="white" strokeWidth="1.5" strokeOpacity="0.35" />
      <line x1="26" y1="65" x2="26" y2="35" stroke="white" strokeWidth="1.5" strokeOpacity="0.35" />
      <line x1="26" y1="35" x2="50" y2="22" stroke="white" strokeWidth="1.5" strokeOpacity="0.35" />

      {/* Border ring */}
      <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="1" strokeOpacity="0.15" fill="none" />
    </svg>
  );
}
