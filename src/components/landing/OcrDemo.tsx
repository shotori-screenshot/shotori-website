// OCR demo: a scan line sweeps the paragraph; the highlighted line is the
// recognized text, already copied as plain text. Freeze-safe — the scan line
// parked anywhere still reads as "scanning".

import { motion, useReducedMotion } from 'motion/react';

export default function OcrDemo() {
	const reduced = useReducedMotion();

	return (
		<div className="relative overflow-hidden rounded-lg border border-line bg-surface p-4">
			<div className="space-y-2.5">
				<div className="text-line w-11/12" />
				<div className="text-line w-4/5" />
				{/* the recognized line — real text, not a placeholder */}
				<div className="sel-corners relative rounded-[3px] bg-brand/12 px-1.5 py-1">
					<code className="font-mono text-xs text-brand-soft">
						Total: $1,284.00 — paid
					</code>
				</div>
				<div className="text-line w-3/4" />
				<div className="text-line w-5/6" />
			</div>

			{/* scan line */}
			<motion.div
				className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-brand-hi/70 to-transparent"
				animate={reduced ? { top: '62%' } : { top: ['10%', '88%', '10%'] }}
				transition={
					reduced
						? undefined
						: { duration: 5, repeat: Infinity, ease: 'easeInOut' }
				}
			/>

			<div className="mt-4 flex items-center gap-2 font-mono text-[10px] text-fg-mute">
				<span className="rounded border border-line-hi bg-white/4 px-1.5 py-0.5">
					text → clipboard
				</span>
				<span>on-device</span>
			</div>
		</div>
	);
}
