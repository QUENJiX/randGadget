'use client'

import { motion } from 'framer-motion'

export function CategoryIllustration({ type }: { type: string }) {
    switch (type) {
        case 'smartphones':
            return (
                <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-0 bottom-0 w-[300px] h-[300px] md:w-[450px] md:h-[450px] opacity-60 group-hover:opacity-100 transition-all duration-700 pointer-events-none group-hover:-translate-y-2">
                    {/* Abstract Background Orbs to fill empty space */}
                    <circle cx="350" cy="250" r="150" fill="var(--color-accent)" opacity="0.05" filter="blur(40px)" />
                    <circle cx="450" cy="400" r="100" fill="var(--color-accent)" opacity="0.1" filter="blur(30px)" />

                    {/* Dots Pattern */}
                    <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1.5" fill="var(--color-border)" opacity="0.4" />
                    </pattern>
                    <rect x="250" y="100" width="250" height="400" fill="url(#dots)" opacity="0.5" />

                    {/* Phone 1 - Background Right */}
                    <motion.g animate={{ y: [0, -10, 0], rotate: [15, 12, 15] }} transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}>
                        <rect x="300" y="120" width="120" height="240" rx="24" fill="var(--color-bg)" stroke="var(--color-border)" strokeWidth="4" />
                        <rect x="308" y="128" width="104" height="224" rx="16" fill="var(--color-surface)" />
                        {/* Camera Array */}
                        <rect x="320" y="140" width="40" height="40" rx="12" fill="var(--color-border)" opacity="0.3" />
                        <circle cx="332" cy="152" r="6" fill="var(--color-text-tertiary)" />
                        <circle cx="348" cy="168" r="6" fill="var(--color-text-tertiary)" />
                    </motion.g>

                    {/* Phone 2 - Foreground Main */}
                    <motion.g animate={{ y: [0, 10, 0], rotate: [-5, -2, -5] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.5 }}>
                        {/* Phone Body with shadow */}
                        <rect x="180" y="150" width="140" height="280" rx="30" fill="var(--color-bg)" stroke="var(--color-border)" strokeWidth="4" />
                        <rect x="188" y="158" width="124" height="264" rx="22" fill="var(--color-surface)" />

                        {/* Glowing Screen Highlight */}
                        <path d="M188 250 L312 200 L312 400 C312 412, 302 422, 290 422 L210 422 C198 422, 188 412, 188 400 Z" fill="var(--color-accent)" opacity="0.05" />

                        {/* UI Elements */}
                        <rect x="200" y="180" width="100" height="80" rx="12" fill="var(--color-bg)" stroke="var(--color-border)" strokeWidth="2" />
                        <circle cx="250" cy="220" r="16" fill="var(--color-accent)" opacity="0.8" />

                        <rect x="200" y="280" width="100" height="16" rx="8" fill="var(--color-text)" opacity="0.05" />
                        <rect x="200" y="310" width="70" height="12" rx="6" fill="var(--color-text)" opacity="0.05" />
                        <rect x="200" y="340" width="100" height="40" rx="10" fill="var(--color-accent)" opacity="0.1" />
                        <rect x="200" y="340" width="100" height="40" rx="10" stroke="var(--color-accent)" strokeWidth="2" />
                    </motion.g>

                    {/* Floating UI Badges */}
                    <motion.g animate={{ y: [0, -8, 0], x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }}>
                        <rect x="120" y="240" width="80" height="30" rx="15" fill="var(--color-bg)" stroke="var(--color-border)" strokeWidth="2" />
                        <circle cx="140" cy="255" r="5" fill="var(--color-accent)" />
                        <rect x="155" y="253" width="30" height="4" rx="2" fill="var(--color-text-secondary)" />
                    </motion.g>

                    <motion.g animate={{ y: [0, 10, 0], x: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 1.5 }}>
                        <rect x="300" y="340" width="90" height="40" rx="12" fill="var(--color-accent)" opacity="0.9" />
                        <rect x="315" y="352" width="20" height="16" rx="4" fill="var(--color-bg)" />
                        <rect x="345" y="356" width="30" height="8" rx="4" fill="var(--color-bg)" opacity="0.8" />
                    </motion.g>
                </svg>
            )
        case 'laptops':
            return (
                <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-0 bottom-0 w-[180px] h-[180px] md:w-[240px] md:h-[240px] opacity-60 group-hover:opacity-100 transition-all duration-700 pointer-events-none group-hover:-translate-y-2">
                    {/* Subtle glow */}
                    <circle cx="150" cy="150" r="100" fill="var(--color-accent)" opacity="0.05" filter="blur(30px)" />

                    <motion.g animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}>
                        {/* Flying Window 1 */}
                        <motion.rect animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }} x="40" y="70" width="80" height="60" rx="8" fill="var(--color-bg)" stroke="var(--color-border)" strokeWidth="2" opacity="0.8" />

                        {/* Flying Window 2 */}
                        <motion.rect animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.5 }} x="180" y="50" width="70" height="50" rx="8" fill="var(--color-bg)" stroke="var(--color-accent)" strokeWidth="2" opacity="0.8" />

                        {/* Main Laptop Screen */}
                        <rect x="60" y="100" width="180" height="110" rx="12" fill="var(--color-bg)" stroke="var(--color-border)" strokeWidth="4" />
                        <rect x="68" y="108" width="164" height="94" rx="6" fill="var(--color-surface)" />
                        {/* Screen Content */}
                        <rect x="80" y="120" width="140" height="50" rx="6" fill="var(--color-accent)" opacity="0.1" />
                        <rect x="80" y="180" width="60" height="10" rx="5" fill="var(--color-text)" opacity="0.1" />

                        {/* Laptop Base */}
                        <path d="M40 220 L260 220 L280 235 L20 235 Z" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="4" strokeLinejoin="round" />
                        <rect x="130" y="222" width="40" height="4" rx="2" fill="var(--color-border)" />
                    </motion.g>
                </svg>
            )
        case 'audio':
            return (
                <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-0 bottom-0 w-[160px] h-[160px] md:w-[220px] md:h-[220px] opacity-60 group-hover:opacity-100 transition-all duration-700 pointer-events-none group-hover:-translate-y-2">
                    {/* Subtle glow */}
                    <circle cx="150" cy="150" r="100" fill="var(--color-accent)" opacity="0.05" filter="blur(30px)" />

                    {/* Sound waves floating */}
                    <motion.g animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}>
                        <circle cx="150" cy="150" r="120" stroke="var(--color-accent)" strokeWidth="2" opacity="0.2" strokeDasharray="10 20" />
                        <circle cx="150" cy="150" r="140" stroke="var(--color-accent)" strokeWidth="1" opacity="0.1" strokeDasharray="5 15" />
                    </motion.g>

                    {/* Headphones */}
                    <motion.g animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}>
                        {/* Band */}
                        <path d="M70 160 C70 60, 230 60, 230 160" fill="none" stroke="var(--color-bg)" strokeWidth="30" strokeLinecap="round" />
                        <path d="M70 160 C70 60, 230 60, 230 160" fill="none" stroke="var(--color-border)" strokeWidth="4" strokeLinecap="round" />

                        {/* Left Earcup */}
                        <rect x="50" y="140" width="40" height="90" rx="20" fill="var(--color-bg)" stroke="var(--color-border)" strokeWidth="4" />
                        <rect x="40" y="150" width="10" height="70" rx="5" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="2" />
                        <line x1="70" y1="160" x2="70" y2="210" stroke="var(--color-accent)" strokeWidth="4" strokeLinecap="round" opacity="0.8" />

                        {/* Right Earcup */}
                        <rect x="210" y="140" width="40" height="90" rx="20" fill="var(--color-bg)" stroke="var(--color-border)" strokeWidth="4" />
                        <rect x="250" y="150" width="10" height="70" rx="5" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="2" />
                        <line x1="230" y1="160" x2="230" y2="210" stroke="var(--color-accent)" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
                    </motion.g>
                </svg>
            )
        case 'wearables':
            return (
                <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-0 bottom-0 w-[160px] h-[160px] md:w-[220px] md:h-[220px] opacity-60 group-hover:opacity-100 transition-all duration-700 pointer-events-none group-hover:-translate-y-2">
                    {/* Subtle glow */}
                    <circle cx="150" cy="150" r="100" fill="var(--color-accent)" opacity="0.05" filter="blur(30px)" />

                    <motion.g animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}>
                        {/* Straps */}
                        <path d="M120 40 C120 20, 180 20, 180 40 L180 260 C180 280, 120 280, 120 260 Z" fill="var(--color-bg)" stroke="var(--color-border)" strokeWidth="4" />
                        <path d="M130 50 L170 50 M130 250 L170 250" stroke="var(--color-border)" strokeWidth="4" strokeLinecap="round" />

                        {/* Watch Face */}
                        <rect x="90" y="80" width="120" height="140" rx="40" fill="var(--color-bg)" stroke="var(--color-border)" strokeWidth="6" />
                        <rect x="100" y="90" width="100" height="120" rx="30" fill="var(--color-surface)" />

                        {/* Crown */}
                        <rect x="215" y="130" width="10" height="26" rx="5" fill="var(--color-border)" />

                        {/* UI Rings */}
                        <circle cx="150" cy="150" r="40" fill="none" stroke="var(--color-border)" strokeWidth="6" />
                        <circle cx="150" cy="150" r="40" fill="none" stroke="var(--color-accent)" strokeWidth="6" strokeLinecap="round" strokeDasharray="180 300" />

                        {/* Inner Ring */}
                        <circle cx="150" cy="150" r="25" fill="none" stroke="var(--color-accent)" strokeWidth="4" strokeLinecap="round" strokeDasharray="80 200" opacity="0.5" />

                        <circle cx="150" cy="150" r="6" fill="var(--color-text)" />
                    </motion.g>

                    {/* Floating UI metric */}
                    <motion.g animate={{ y: [0, 8, 0], x: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}>
                        <rect x="50" y="100" width="60" height="30" rx="15" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="2" />
                        <path d="M60 115 L66 108 L72 118 L80 108" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.g>
                </svg>
            )
        case 'accessories':
            return (
                <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-0 bottom-0 w-[160px] h-[160px] md:w-[220px] md:h-[220px] opacity-60 group-hover:opacity-100 transition-all duration-700 pointer-events-none group-hover:-translate-y-2">
                    {/* Subtle glow */}
                    <circle cx="150" cy="150" r="100" fill="var(--color-accent)" opacity="0.05" filter="blur(30px)" />

                    <motion.g animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}>
                        {/* Charger Brick */}
                        <rect x="90" y="100" width="100" height="100" rx="24" fill="var(--color-bg)" stroke="var(--color-border)" strokeWidth="4" />
                        <rect x="100" y="110" width="80" height="80" rx="16" fill="var(--color-surface)" />

                        {/* Prongs */}
                        <rect x="120" y="70" width="12" height="30" rx="4" fill="var(--color-border)" />
                        <rect x="148" y="70" width="12" height="30" rx="4" fill="var(--color-border)" />

                        {/* Accent */}
                        <rect x="125" y="140" width="30" height="6" rx="3" fill="var(--color-accent)" />
                        <circle cx="140" cy="165" r="4" fill="var(--color-text-secondary)" />
                    </motion.g>

                    {/* Premium Cable coiling around */}
                    <motion.g animate={{ rotate: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }} transform="origin-center">
                        <path d="M50 250 C10 210, 30 110, 80 140 C130 170, 240 240, 260 160 C280 80, 190 60, 160 80" fill="none" stroke="var(--color-border)" strokeWidth="12" strokeLinecap="round" />
                        <path d="M50 250 C10 210, 30 110, 80 140 C130 170, 240 240, 260 160 C280 80, 190 60, 160 80" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeDasharray="10 20" opacity="0.5" />

                        <rect x="150" y="70" width="24" height="30" rx="6" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="4" transform="rotate(-15 150 70)" />
                    </motion.g>
                </svg>
            )
        default:
            return null
    }
}
