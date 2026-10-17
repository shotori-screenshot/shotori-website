// The OCR OSD chip replica (ui/ocr_osd.rs): chip bg rgb(22 22 29/.9),
// 1px accent border, 13px hint text, and the spinner — a faint accent
// ring with one 4px accent dot orbiting at radius 7 inside a 19px box,
// 900ms per turn (framer-motion driven, so it honors the page's
// reduced-motion posture via useReducedMotion).

import type { CSSProperties, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function OrbitSpinner() {
	const reduced = useReducedMotion();
	return (
		<span className="relative block h-[19px] w-[19px] flex-none">
			<span className="absolute inset-0 rounded-full border border-sh-accent/60" />
			<motion.span
				className="absolute top-[0.5px] left-[calc(50%-2px)] block size-1 rounded-full bg-sh-accent"
				style={{ transformOrigin: '2px 9px' }}
				animate={reduced ? undefined : { rotate: 360 }}
				transition={{ duration: 0.9, ease: 'linear', repeat: Infinity }}
			/>
		</span>
	);
}

/** The chip; pass motion values (e.g. opacity) through `style`. */
export function OsdChip({
	children,
	className = '',
	style,
}: {
	children: ReactNode;
	className?: string;
	style?: CSSProperties;
}) {
	return (
		<motion.div
			className={`flex items-center gap-2 rounded-lg border border-sh-accent bg-sh-chip px-4 py-2 text-[13px] text-sh-hint shadow-[0_4px_16px_rgb(0_0_0/0.35)] ${className}`}
			style={style}
		>
			{children}
		</motion.div>
	);
}
