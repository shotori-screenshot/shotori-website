// OCR demo, styled as the real flow: the "Recognizing…" OSD chip
// (ui/ocr_osd.rs — chip bg, accent border, 13px hint text, orbit-dot
// spinner) hangs over the frozen paragraph while lines recognize one by
// one, then the text lands on the clipboard. Freeze-safe — the chip
// parked anywhere still reads as "scanning".

import { useEffect, useMemo } from 'react';
import {
	motion,
	motionValue,
	useMotionValue,
	useReducedMotion,
	type MotionValue,
} from 'framer-motion';
import { OsdChip, OrbitSpinner } from './chrome/osd';
import { startLoop } from './lib/loop';

const CYCLE = 6.5;
const LINES = [
	{ w: 'w-11/12', real: false },
	{ w: 'w-4/5', real: false },
	{ w: 'w-4/5', real: true }, // the recognized line — real text
	{ w: 'w-3/4', real: false },
	{ w: 'w-5/6', real: false },
];

export default function OcrDemo() {
	const reduced = useReducedMotion();
	const chipOp = useMotionValue(0);
	const doneOp = useMotionValue(0);
	const lineOps = useMemo(() => LINES.map(() => motionValue(0)), []);

	useEffect(() => {
		if (reduced) {
			chipOp.set(1);
			doneOp.set(1);
			lineOps.slice(0, 3).forEach((op) => op.set(1));
			return;
		}
		return startLoop(CYCLE, [
			// the OSD chip: appears, spins, unmaps when the result lands,
			// returns right at the loop seam
			{ value: chipOp, keyframes: [0, 1, 1, 0, 0, 1], times: [0, 0.04, 0.38, 0.42, 0.965, 1] },
			// lines recognize one after another
			...lineOps.map((op, i): { value: MotionValue<number>; keyframes: number[]; times: number[] } => {
				const a = 0.42 + i * 0.05;
				return { value: op, keyframes: [0, 0, 1, 1, 0, 0], times: [0, a, a + 0.04, 0.9, 0.95, 1] };
			}),
			// text → clipboard
			{ value: doneOp, keyframes: [0, 0, 1, 1, 0], times: [0, 0.72, 0.76, 0.92, 0.96] },
		]);
	}, [reduced, chipOp, doneOp, lineOps]);

	return (
		<div className="relative overflow-hidden rounded-lg border border-line bg-surface p-4">
			<div className="space-y-2.5">
				{LINES.map((line, i) => (
					<div key={i} className="relative">
						{line.real ? (
							<code className="px-1.5 py-1 font-mono text-xs whitespace-nowrap text-fg">
								Total: $1,284.00 — paid
							</code>
						) : (
							<div className={`text-line h-2.5 ${line.w}`} />
						)}
						{/* recognition highlight sweeping line by line */}
						<motion.div
							className="pointer-events-none absolute inset-y-0 -inset-x-1 rounded-[3px] bg-[rgb(255_106_0/0.12)] ring-1 ring-[rgb(255_106_0/0.35)] ring-inset"
							style={{ opacity: lineOps[i] }}
						/>
					</div>
				))}
			</div>

			{/* the OSD chip, top-center like the volume slot */}
			<OsdChip className="absolute top-2 left-1/2 z-10 -translate-x-1/2" style={{ opacity: chipOp }}>
				<OrbitSpinner />
				Recognizing…
			</OsdChip>

			<div className="mt-4 flex items-center gap-2 font-mono text-[10px] text-fg-mute">
				<motion.span
					className="rounded border border-[rgb(255_106_0/0.4)] bg-sh-chip px-1.5 py-0.5"
					style={{ opacity: doneOp }}
				>
					text → clipboard
				</motion.span>
				<span>on-device</span>
			</div>
		</div>
	);
}
