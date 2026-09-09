import React from 'react';

type IconProps = { className?: string };

export const CubeMark: React.FC<IconProps> = ({ className }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="square"
        strokeLinejoin="miter"
        className={className}
        aria-hidden="true"
    >
        <path d="M12 2 L21 7 V17 L12 22 L3 17 V7 Z" />
        <path d="M3 7 L12 12 L21 7" />
        <path d="M12 12 V22" />
    </svg>
);

export const OnionSquare: React.FC<IconProps> = ({ className }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="square"
        strokeLinejoin="miter"
        className={className}
        aria-hidden="true"
    >
        <path d="M3 3 H21 V21 H3 Z" />
        <path d="M7 7 H17 V17 H7 Z" />
        <path d="M11 11 H13 V13 H11 Z" fill="currentColor" />
    </svg>
);

export const CubeLock: React.FC<IconProps> = ({ className }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="square"
        strokeLinejoin="miter"
        className={className}
        aria-hidden="true"
    >
        <path d="M12 2 L21 7 V17 L12 22 L3 17 V7 Z" />
        <path d="M9 11 H15 V16 H9 Z" />
        <path d="M10 11 V9 H14 V11" />
    </svg>
);

export const Marker: React.FC<{ className?: string; size?: number }> = ({ className = 'bg-orange-500', size = 6 }) => (
    <span aria-hidden="true" className={`block shrink-0 ${className}`} style={{ width: size, height: size }} />
);

export const IsoShellStack: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        viewBox="0 0 480 680"
        fill="none"
        className={className}
        role="img"
        aria-label="A message is wrapped in four layers: your identity, an alias shell, the Blindflare envelope, then the zero-log relay."
    >
        <line
            x1="100"
            y1="0"
            x2="100"
            y2="680"
            stroke="#f5f5f5"
            strokeOpacity="0.07"
            strokeWidth="1"
            strokeDasharray="3 6"
        />
        <defs>
            <pattern
                id="lattice-hatch"
                width="8"
                height="8"
                patternTransform="rotate(45)"
                patternUnits="userSpaceOnUse"
            >
                <line x1="0" y1="0" x2="0" y2="8" stroke="#f97316" strokeOpacity="0.35" strokeWidth="2" />
            </pattern>
        </defs>

        <g className="lattice-shell">
            <g
                className="lattice-float"
                style={{ animationDuration: '6.4s', animationDelay: '0s' }}
                stroke="#525252"
                strokeWidth="1.25"
                strokeLinejoin="miter"
            >
                <path d="M100 18 L172 60 L100 102 L28 60 Z" fill="#151515" />
                <path d="M28 60 L100 102 L100 160 L28 118 Z" fill="#101010" />
                <path d="M172 60 L100 102 L100 160 L172 118 Z" fill="#0d0d0d" />
            </g>
            <line x1="176" y1="92" x2="204" y2="92" stroke="#404040" strokeWidth="1" />
            <text
                x="212"
                y="88"
                fill="#f5f5f5"
                fontFamily="'IBM Plex Mono', monospace"
                fontSize="12"
                fontWeight="600"
                letterSpacing="1.4"
            >
                01 YOUR IDENTITY
            </text>
            <text x="212" y="107" fill="#737373" fontFamily="'IBM Plex Sans', sans-serif" fontSize="12">
                Real inbox. Never exposed.
            </text>
        </g>

        <g className="lattice-shell" style={{ animationDelay: '140ms' }}>
            <g
                className="lattice-float"
                style={{ animationDuration: '7.6s', animationDelay: '-1.9s' }}
                stroke="#737373"
                strokeWidth="1.25"
                strokeLinejoin="miter"
            >
                <path d="M100 180 L172 222 L100 264 L28 222 Z" fill="#181818" />
                <path d="M28 222 L100 264 L100 322 L28 280 Z" fill="#121212" />
                <path d="M172 222 L100 264 L100 322 L172 280 Z" fill="#0e0e0e" />
            </g>
            <line x1="176" y1="254" x2="204" y2="254" stroke="#404040" strokeWidth="1" />
            <text
                x="212"
                y="250"
                fill="#f5f5f5"
                fontFamily="'IBM Plex Mono', monospace"
                fontSize="12"
                fontWeight="600"
                letterSpacing="1.4"
            >
                02 ALIAS SHELL
            </text>
            <text x="212" y="269" fill="#737373" fontFamily="'IBM Plex Sans', sans-serif" fontSize="12">
                Pronounceable. Disposable.
            </text>
        </g>

        <g className="lattice-shell" style={{ animationDelay: '280ms' }}>
            <g
                className="lattice-float"
                style={{ animationDuration: '6.9s', animationDelay: '-3.4s' }}
                stroke="#f97316"
                strokeWidth="1.5"
                strokeLinejoin="miter"
            >
                <path d="M100 342 L172 384 L100 426 L28 384 Z" fill="url(#lattice-hatch)" />
                <path d="M28 384 L100 426 L100 484 L28 442 Z" fill="#f97316" fillOpacity="0.12" />
                <path d="M172 384 L100 426 L100 484 L172 442 Z" fill="#f97316" fillOpacity="0.06" />
            </g>
            <line x1="176" y1="416" x2="204" y2="416" stroke="#f97316" strokeWidth="1" />
            <text
                x="212"
                y="412"
                fill="#fdba74"
                fontFamily="'IBM Plex Mono', monospace"
                fontSize="12"
                fontWeight="600"
                letterSpacing="1.4"
            >
                03 BLINDFLARE ENVELOPE
            </text>
            <text x="212" y="431" fill="#a3a3a3" fontFamily="'IBM Plex Sans', sans-serif" fontSize="12">
                Sealed before it leaves you.
            </text>
        </g>

        <g className="lattice-shell" style={{ animationDelay: '420ms' }}>
            <g
                className="lattice-float"
                style={{ animationDuration: '8.1s', animationDelay: '-0.8s' }}
                stroke="#525252"
                strokeWidth="1.25"
                strokeLinejoin="miter"
            >
                <path d="M100 504 L172 546 L100 588 L28 546 Z" fill="#151515" />
                <path d="M28 546 L100 588 L100 646 L28 604 Z" fill="#101010" />
                <path d="M172 546 L100 588 L100 646 L172 604 Z" fill="#0d0d0d" />
            </g>
            <line x1="176" y1="578" x2="204" y2="578" stroke="#404040" strokeWidth="1" />
            <text
                x="212"
                y="574"
                fill="#f5f5f5"
                fontFamily="'IBM Plex Mono', monospace"
                fontSize="12"
                fontWeight="600"
                letterSpacing="1.4"
            >
                04 RELAY
            </text>
            <text x="212" y="593" fill="#737373" fontFamily="'IBM Plex Sans', sans-serif" fontSize="12">
                In-memory. Zero logs.
            </text>
        </g>
    </svg>
);

export const PowerSquare: React.FC<IconProps> = ({ className }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="square"
        strokeLinejoin="miter"
        className={className}
        aria-hidden="true"
    >
        <path d="M12 3 V11" />
        <path d="M7 6 H4 V20 H20 V6 H17" />
    </svg>
);

export const ReloadSquare: React.FC<IconProps> = ({ className }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="square"
        strokeLinejoin="miter"
        className={className}
        aria-hidden="true"
    >
        <path d="M4 4 V9 H9" />
        <path d="M20 20 V15 H15" />
        <path d="M4 9 H15 V15" />
        <path d="M20 15 H9 V9" />
    </svg>
);

export const LockSquare: React.FC<IconProps> = ({ className }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="square"
        strokeLinejoin="miter"
        className={className}
        aria-hidden="true"
    >
        <path d="M5 11 H19 V20 H5 Z" />
        <path d="M9 11 V8 L10.5 6.5 H13.5 L15 8 V11" />
    </svg>
);

export const TrashSquare: React.FC<IconProps> = ({ className }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="square"
        strokeLinejoin="miter"
        className={className}
        aria-hidden="true"
    >
        <path d="M4 6 H20" />
        <path d="M7 6 V20 H17 V6" />
        <path d="M10 3 H14" />
        <path d="M10 10 V16 M14 10 V16" />
    </svg>
);
