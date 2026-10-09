import type React from "react";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export default function Logo({
  size = 40,
  className = "",
  width,
  height,
  ...props
}: LogoProps) {
  const actualWidth = width ?? size;
  const actualHeight = height ?? size;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      width={actualWidth}
      height={actualHeight}
      fill="none"
      className={className}
      aria-label="CivicFlow Logo"
      {...props}
    >
      <defs>
        <linearGradient
          id="cf-civic-anchor"
          x1="6"
          y1="4"
          x2="34"
          y2="36"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#0072E5" />
          <stop offset="52%" stopColor="#0D9488" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>

        <linearGradient
          id="cf-flow-stream"
          x1="12"
          y1="28"
          x2="36"
          y2="12"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="55%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#75D8FC" />
        </linearGradient>

        <filter
          id="cf-telemetry-glow"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <circle
        cx="20"
        cy="20"
        r="17"
        fill="#0072E5"
        fillOpacity="0.04"
        stroke="#38BDF8"
        strokeOpacity="0.12"
        strokeWidth="1"
      />

      <path
        d="M 28 6.5 C 16.5 6.5 7.5 14.5 7.5 24 C 7.5 31 12.5 35 18 35 C 23.5 35 27.5 32 29.5 28"
        stroke="url(#cf-civic-anchor)"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M 13.5 22.5 C 13.5 17 18 13.5 23.5 13.5 C 29 13.5 33 16.8 33 21 C 33 25.2 29 28 23.5 28 C 17.5 28 14.5 23.5 19 18.5 L 30 18.5"
        stroke="url(#cf-flow-stream)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <g filter="url(#cf-telemetry-glow)">
        <circle cx="33.5" cy="18.5" r="3.2" fill="#0072E5" />
        <circle cx="33.5" cy="18.5" r="1.8" fill="#75D8FC" />
      </g>
    </svg>
  );
}
