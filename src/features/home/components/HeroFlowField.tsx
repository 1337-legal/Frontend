import React from 'react';

export const HeroFlowField: React.FC = () => (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden [mask-image:radial-gradient(circle_at_center,white,transparent_75%)]">
        <svg className="absolute -top-24 left-1/2 w-[1600px] -translate-x-1/2 rotate-2" viewBox="0 0 1600 800" fill="none">
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
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="lightBlur" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="c" />
                    <feMerge><feMergeNode in="c" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="emoji-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="5" result="eg" />
                    <feMerge><feMergeNode in="eg" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>
            {Array.from({ length: 9 }).map((_, i) => {
                const y = 80 + i * 70 + (i % 2 ? 25 : 0);
                const curvature = (i % 2 ? 180 : -180) * (1 + i * 0.05);
                const duration = 13 + (i % 3) * 3 + i * 0.4;
                return (
                    <g key={i} className="opacity-40">
                        <path
                            id={`flow-${i}`}
                            d={`M -100 ${y} C 400 ${y + curvature}, 1200 ${y - curvature}, 1700 ${y}`}
                            stroke="url(#hl-grad)"
                            strokeWidth={1.1}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`animate-dash-${(i % 3) + 1}`}
                            pathLength={1000}
                            style={{ filter: 'url(#glow)' }}
                        />
                        <circle r={4} fill="url(#light-grad)" style={{ filter: 'url(#lightBlur)' }}>
                            <animateMotion dur={`${duration}s`} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear" rotate="auto">
                                <mpath href={`#flow-${i}`} />
                            </animateMotion>
                        </circle>
                        <circle r={2} fill="#ffd3a1" fillOpacity={0.9} style={{ filter: 'url(#lightBlur)' }}>
                            <animateMotion dur={`${duration * 1.15}s`} begin={`${-(i * 1.7)}s`} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear" rotate="auto">
                                <mpath href={`#flow-${i}`} />
                            </animateMotion>
                        </circle>
                    </g>
                );
            })}
            {(() => {
                const emojis = ['🛡️', '🔐', '📧', '👾', '💾', '📧', '📡', '⚙️', '🛰️', '📧', '🧬', '🗝️', '💣', '🔎'];
                return Array.from({ length: 12 }).map((_, i) => {
                    const y = 80 + (i * 55) % 680;
                    const x = 180 + (i % 5) * 270 + (i % 2 ? 80 : 0);
                    const size = 30 + (i % 4) * 8;
                    const variant = (i % 3) + 1;
                    return (
                        <text
                            key={`emoji-${i}`}
                            x={x}
                            y={y}
                            fontSize={size}
                            fill="#ffdda8"
                            className={`motion-orb-${variant}`}
                            style={{ filter: 'url(#emoji-glow)', fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", sans-serif', textShadow: '0 0 10px rgba(251,146,60,0.95),0 0 22px rgba(251,146,60,0.55)' }}
                        >{emojis[i % emojis.length]}</text>
                    );
                });
            })()}
        </svg>
    </div>
);

export default HeroFlowField;
