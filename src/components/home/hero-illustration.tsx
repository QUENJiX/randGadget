'use client'

import { motion } from 'framer-motion'

export function HeroIllustration() {
    return (
        <div className="relative w-full h-[500px] lg:h-[600px] hidden lg:flex items-center justify-center">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[var(--color-accent)]/20 rounded-full blur-[80px]" />

            {/* Main Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="relative w-full max-w-[500px] aspect-square"
            >
                <svg
                    viewBox="0 0 600 600"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                >
                    <defs>
                        <linearGradient id="bag-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-surface)" />
                            <stop offset="100%" stopColor="var(--color-bg)" />
                        </linearGradient>
                        <linearGradient id="accent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--color-accent)" />
                            <stop offset="100%" stopColor="var(--color-accent-hover)" />
                        </linearGradient>
                        <filter id="shadow-lg" x="-10%" y="-10%" width="120%" height="120%">
                            <feDropShadow dx="0" dy="15" stdDeviation="15" floodColor="#000" floodOpacity="0.1" />
                        </filter>
                        <filter id="shadow-sm" x="-10%" y="-10%" width="120%" height="120%">
                            <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000" floodOpacity="0.05" />
                        </filter>
                    </defs>

                    {/* Floating Headphones */}
                    <motion.g
                        animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                    >
                        {/* Headphone Arch */}
                        <path d="M150 220 C150 120, 290 120, 290 220" fill="none" stroke="currentColor" strokeWidth="24" className="text-[var(--color-border)]" filter="url(#shadow-sm)" strokeLinecap="round" />
                        <path d="M150 220 C150 120, 290 120, 290 220" fill="none" stroke="currentColor" strokeWidth="16" className="text-[var(--color-surface)]" strokeLinecap="round" />

                        {/* Left Earcup */}
                        <rect x="120" y="200" width="40" height="80" rx="20" fill="currentColor" className="text-[var(--color-border)]" filter="url(#shadow-sm)" />
                        <rect x="124" y="204" width="32" height="72" rx="16" fill="url(#accent-grad)" />
                        <path d="M156 220 L166 220 C170 220, 170 260, 166 260 L156 260" fill="currentColor" className="text-[var(--color-text-secondary)]" />

                        {/* Right Earcup */}
                        <rect x="280" y="200" width="40" height="80" rx="20" fill="currentColor" className="text-[var(--color-border)]" filter="url(#shadow-sm)" />
                        <rect x="284" y="204" width="32" height="72" rx="16" fill="url(#accent-grad)" />
                        <path d="M284 220 L274 220 C270 220, 270 260, 274 260 L284 260" fill="currentColor" className="text-[var(--color-text-secondary)]" />
                    </motion.g>

                    {/* Floating Smartphone */}
                    <motion.g
                        animate={{ y: [0, 20, 0], rotate: [15, 20, 15] }}
                        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.5 }}
                    >
                        <rect x="340" y="140" width="140" height="280" rx="24" fill="currentColor" className="text-[var(--color-border)]" filter="url(#shadow-lg)" />
                        <rect x="344" y="144" width="132" height="272" rx="20" fill="currentColor" className="text-[var(--color-surface)]" />
                        <rect x="352" y="152" width="116" height="256" rx="12" fill="url(#bag-grad)" />

                        {/* Phone Camera */}
                        <rect x="360" y="160" width="40" height="40" rx="12" fill="currentColor" className="text-[var(--color-border)]" />
                        <circle cx="372" cy="172" r="6" fill="currentColor" className="text-[var(--color-text-secondary)]" />
                        <circle cx="388" cy="188" r="6" fill="currentColor" className="text-[var(--color-text-secondary)]" />

                        {/* Flash/Sensor */}
                        <circle cx="388" cy="172" r="3" fill="url(#accent-grad)" />
                    </motion.g>

                    {/* Floating Smartwatch Element */}
                    <motion.g
                        animate={{ y: [0, -10, 0], rotate: [-10, -5, -10] }}
                        transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 1 }}
                    >
                        <circle cx="480" cy="380" r="40" fill="currentColor" className="text-[var(--color-border)]" filter="url(#shadow-lg)" />
                        <circle cx="480" cy="380" r="34" fill="currentColor" className="text-[var(--color-surface)]" />
                        <circle cx="480" cy="380" r="28" fill="currentColor" className="text-[var(--color-bg)]" />

                        {/* Watch UI */}
                        <path d="M480 360 V380 L495 395" stroke="url(#accent-grad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="480" cy="380" r="4" fill="currentColor" className="text-[var(--color-text)]" />

                        {/* Watch Bands */}
                        <rect x="460" y="325" width="40" height="20" rx="4" fill="currentColor" className="text-[var(--color-border)]" />
                        <rect x="460" y="415" width="40" height="20" rx="4" fill="currentColor" className="text-[var(--color-border)]" />
                    </motion.g>

                    {/* E-commerce Shopping Bag (Foreground Base) */}
                    <motion.g
                        animate={{ y: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.2 }}
                    >
                        {/* Bag Handles */}
                        <path d="M220 320 C220 250, 320 250, 320 320" fill="none" stroke="currentColor" strokeWidth="16" className="text-[var(--color-border)]" filter="url(#shadow-sm)" strokeLinecap="round" />

                        {/* Bag Body */}
                        <path d="M140 320 L400 320 L420 540 C420 560, 400 580, 380 580 L160 580 C140 580, 120 560, 120 540 Z" fill="currentColor" className="text-[var(--color-surface)]" filter="url(#shadow-lg)" stroke="currentColor" strokeWidth="2" />
                        <path d="M140 320 L400 320 L420 540 C420 560, 400 580, 380 580 L160 580 C140 580, 120 560, 120 540 Z" fill="url(#bag-grad)" opacity="0.8" />

                        {/* Store Branding / Logo Mark on Bag */}
                        <circle cx="270" cy="450" r="40" fill="url(#accent-grad)" filter="url(#shadow-sm)" />
                        <path d="M255 450 L265 460 L285 440" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

                        {/* Bag Crease/Fold */}
                        <path d="M140 320 L180 580" stroke="currentColor" strokeWidth="4" className="text-[var(--color-border)]" opacity="0.2" />
                        <path d="M400 320 L360 580" stroke="currentColor" strokeWidth="4" className="text-[var(--color-border)]" opacity="0.2" />
                    </motion.g>

                    {/* Floating Stars / Sparks for Premium Feel */}
                    <motion.g
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    >
                        <path d="M100 120 L105 130 L115 135 L105 140 L100 150 L95 140 L85 135 L95 130 Z" fill="url(#accent-grad)" />
                        <path d="M420 100 L423 106 L429 109 L423 112 L420 118 L417 112 L411 109 L417 106 Z" fill="url(#accent-grad)" />
                        <path d="M520 280 L524 288 L532 292 L524 296 L520 304 L516 296 L508 292 L516 288 Z" fill="url(#accent-grad)" />
                    </motion.g>
                </svg>
            </motion.div>
        </div>
    )
}

