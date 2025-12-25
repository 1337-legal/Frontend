import React from 'react';

export const HeroFlowField: React.FC = () => (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden mask-[radial-gradient(circle_at_center,white,transparent_75%)]">
        <svg
            className="absolute -top-24 left-1/2 w-[1600px]"
            viewBox="0 0 1600 800"
            fill="none"
            style={{ transform: 'translateX(-50%) rotate(2deg) translateZ(0)' }}
        >
            <defs>
                <linearGradient id="hl-grad" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#fb923c" stopOpacity="0.0" />
                    <stop offset="35%" stopColor="#fb923c" stopOpacity="0.45" />
                    <stop offset="70%" stopColor="#f97316" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
                </linearGradient>
                <radialGradient id="light-grad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffe8cc" />
                    <stop offset="45%" stopColor="#ffb267" />
                    <stop offset="85%" stopColor="#fb923c" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
                </radialGradient>
            </defs>
            {/* 7 flow lines with optimized rendering (no blur filters) */}
            {Array.from({ length: 7 }).map((_, i) => {
                const y = 80 + i * 90 + (i % 2 ? 25 : 0);
                const curvature = (i % 2 ? 180 : -180) * (1 + i * 0.05);
                const duration = 15 + (i % 3) * 4;
                return (
                    <g key={i} className="opacity-35">
                        <path
                            id={`flow-${i}`}
                            d={`M -100 ${y} C 400 ${y + curvature}, 1200 ${y - curvature}, 1700 ${y}`}
                            stroke="url(#hl-grad)"
                            strokeWidth={1.2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`animate-dash-${(i % 3) + 1}`}
                            pathLength={1000}
                        />
                        {/* Single orb per path instead of two */}
                        <circle r={5} fill="url(#light-grad)" opacity={0.9}>
                            <animateMotion
                                dur={`${duration}s`}
                                repeatCount="indefinite"
                                keyPoints="0;1"
                                keyTimes="0;1"
                                calcMode="linear"
                            >
                                <mpath href={`#flow-${i}`} />
                            </animateMotion>
                        </circle>
                    </g>
                );
            })}
            {/* 8 emojis with optimized rendering (no blur filters) */}
            {(() => {
                const emojis = ['🛡️', '🔐', '📧', '👾', '💾', '📡', '🗝️', '🔎'];
                return Array.from({ length: 8 }).map((_, i) => {
                    const y = 80 + (i * 75) % 640;
                    const x = 150 + (i % 5) * 280 + (i % 2 ? 80 : 0);
                    const size = 28 + (i % 3) * 6;
                    const variant = (i % 3) + 1;
                    const negDelay = -((i * 947) % 3500) / 1000;
                    return (
                        <text
                            key={`emoji-${i}`}
                            x={x}
                            y={y}
                            fontSize={size}
                            fill="#ffdda8"
                            opacity={0.8}
                            className={`motion-orb-${variant}`}
                            style={{
                                fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", sans-serif',
                                animationDelay: `${negDelay}s`,
                            }}
                        >{emojis[i % emojis.length]}</text>
                    );
                });
            })()}
        </svg>
    </div>
);

export default HeroFlowField;
