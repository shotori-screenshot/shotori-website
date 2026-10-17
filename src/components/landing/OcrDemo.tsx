// OCR demo, styled as the real flow: the "Recognizing…" OSD chip
// (ui/ocr_osd.rs — chip bg, accent border, 13px hint text, orbit-dot
// spinner) hangs over the frozen paragraph while a scan line travels the
// selection and the text lands on the clipboard.
//
// The source text and the output text are always rendered — only the scan
// and the "copied" confirmation animate — so the panel still reads as a
// complete OCR result when motion is reduced or a screenshot is taken
// between frames.

import { useEffect } from 'react';
import {
	motion,
	useMotionValue,
	useReducedMotion,
	useTransform,
} from 'framer-motion';
import { OsdChip, OrbitSpinner } from './chrome/osd';
import { startLoop } from './lib/loop';

const CYCLE = 8;
const SOURCE = [
	'Long captures stop early',
	'A fixed header or a playing video can break the stitch.',
	'Re-select only the part that scrolls, then start again.',
];

function Handle({ x, y }: { x: number; y: number }) {
	return (
		<i
			className="absolute size-[6px] rounded-full bg-sh-accent shadow-[0_0_0_1px_rgb(0_0_0/0.4)]"
			style={{ left: `${x * 100}%`, top: `${y * 100}%`, transform: 'translate(-50%, -50%)' }}
		/>
	);
}

export default function OcrDemo() {
	const reduced = useReducedMotion();
	const chipOp = useMotionValue(1);
	const scanTop = useMotionValue(0);
	const scanTopPct = useTransform(scanTop, (v) => `${v * 100}%`);
	const doneOp = useMotionValue(0);

	useEffect(() => {
		if (reduced) {
			chipOp.set(1);
			doneOp.set(1);
			return;
		}
		return startLoop(CYCLE, [
			// the OSD chip: appears, spins, unmaps when the result lands
			{ value: chipOp, keyframes: [1, 1, 0, 0, 1], times: [0, 0.6, 0.66, 0.96, 1] },
			// the scan line travels down the selection while recognition runs
			{ value: scanTop, keyframes: [0, 0.86, 0], times: [0, 0.58, 0.64], ease: 'linear' },
			// text → clipboard confirmation
			{ value: doneOp, keyframes: [0, 0, 1, 1, 0], times: [0, 0.64, 0.69, 0.94, 0.98] },
		]);
	}, [reduced, chipOp, scanTop, doneOp]);

	return (
		<div className="flex h-[23rem] flex-col overflow-hidden rounded-lg border border-line bg-[#0d1015] sm:h-[27rem]">
			{/* the frozen source */}
			<div className="relative min-h-0 flex-1 overflow-hidden">
				<div className="flex h-8 items-center gap-1.5 border-b border-line bg-[#11141a] px-3">
					<i className="size-1.5 rounded-full bg-[#ff5f57]" />
					<i className="size-1.5 rounded-full bg-[#febc2e]" />
					<i className="size-1.5 rounded-full bg-[#28c840]" />
					<span className="ml-2 font-mono text-[8px] text-fg-mute">
						support — shotori
					</span>
				</div>

				<div className="relative p-4">
					<div className="font-display text-[13px] font-semibold text-fg">
						{SOURCE[0]}
					</div>
					<div className="mt-3 space-y-2">
						<div className="text-[11px] leading-[1.55] text-fg">
							{SOURCE[1]}
						</div>
						<div className="text-[11px] leading-[1.55] text-fg-mute">
							{SOURCE[2]}
						</div>
					</div>
					<div className="mt-3 space-y-[5px]">
						<div className="h-[2px] w-11/12 rounded bg-white/10" />
						<div className="h-[2px] w-4/5 rounded bg-white/10" />
						<div className="h-[2px] w-3/4 rounded bg-white/10" />
					</div>
				</div>

				{/* the region selection around the paragraph */}
				<div className="pointer-events-none absolute inset-x-3 top-[3rem] bottom-5 border border-sh-accent">
					<Handle x={0} y={0} />
					<Handle x={0.5} y={0} />
					<Handle x={1} y={0} />
					<Handle x={0} y={0.5} />
					<Handle x={1} y={0.5} />
					<Handle x={0} y={1} />
					<Handle x={0.5} y={1} />
					<Handle x={1} y={1} />
					<div className="absolute top-[-26px] left-0 rounded-[3px] bg-sh-accent px-1.5 py-[2px] font-mono text-[9px] font-semibold text-black">
						3 lines
					</div>

					{/* the scan line */}
					<motion.div
						className="absolute inset-x-0 h-12 bg-[linear-gradient(180deg,transparent,rgb(255_106_0/0.2),transparent)]"
						style={{ top: scanTopPct }}
					/>
				</div>

				<OsdChip className="absolute top-3 right-3 z-10" style={{ opacity: chipOp }}>
					<OrbitSpinner />
					Recognizing…
				</OsdChip>
			</div>

			{/* the result, already on the clipboard */}
			<div className="border-t border-line bg-[#0a0c10] p-3">
				<div className="flex items-center justify-between">
					<span className="font-mono text-[8px] tracking-wide text-fg-mute">
						clipboard
					</span>
					<div className="flex items-center gap-1.5">
						<motion.span
							className="rounded border border-[rgb(255_106_0/0.4)] bg-sh-chip px-1.5 py-0.5 font-mono text-[8px] text-brand-soft"
							style={{ opacity: doneOp }}
						>
							copied
						</motion.span>
						<span className="flex items-center gap-1 font-mono text-[8px] text-fg-mute">
							<i className="size-1 rounded-full bg-teal" />
							on-device
						</span>
					</div>
				</div>
				<div className="mt-2 space-y-[3px] font-mono text-[10px] leading-[1.5] text-fg/80">
					{SOURCE.map((line, i) => (
						<div key={i} className="truncate">
							<span className="mr-2 text-white/20">{i + 1}</span>
							{line}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
