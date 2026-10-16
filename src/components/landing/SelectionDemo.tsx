// Signature hero visual: a selection rectangle that drags itself open over a
// mock desktop, shows its live size readout, pops the action toolbar, then
// closes and repeats. The screenshot-tool gesture itself, looping forever.
//
// Freeze-safety: this sits at the top of the page (in-viewport, never
// throttled) and every keyframe is a complete-looking state — a rect caught
// mid-open just reads as "capture in progress".

import { useEffect, useRef, useState } from 'react';
import {
	animate,
	motion,
	useMotionValue,
	useReducedMotion,
	useTransform,
} from 'motion/react';

const CYCLE = 7;
const W_MAX = 1280;
const H_MAX = 720;
const TIMES = [0, 0.1, 0.34, 0.9, 1];

export default function SelectionDemo() {
	const reduced = useReducedMotion();
	const stageRef = useRef<HTMLDivElement>(null);
	// On narrow stages the rect must stay shorter so the toolbar below it
	// (and the badge above it) still fit inside the clipped stage.
	const [narrow, setNarrow] = useState(false);

	const w = useMotionValue(160);
	const h = useMotionValue(90);
	const widthPct = useTransform(w, (v) => `${(v / W_MAX) * 62}%`);
	const heightPct = useTransform(h, (v) =>
		`${(v / H_MAX) * (narrow ? 46 : 58)}%`,
	);
	const label = useTransform(
		[w, h],
		([a, b]: number[]) => `${Math.round(a)} × ${Math.round(b)}`,
	);

	useEffect(() => {
		const stage = stageRef.current;
		if (!stage) return;
		const ro = new ResizeObserver(([entry]) => {
			setNarrow(entry.contentRect.width < 640);
		});
		ro.observe(stage);
		return () => ro.disconnect();
	}, []);

	useEffect(() => {
		if (reduced) {
			w.set(W_MAX);
			h.set(H_MAX);
			return;
		}
		const controls = [
			animate(w, [160, 160, W_MAX, W_MAX, 160], {
				duration: CYCLE,
				times: TIMES,
				ease: ['linear', 'circOut', 'linear', 'circIn'],
				repeat: Infinity,
			}),
			animate(h, [90, 90, H_MAX, H_MAX, 90], {
				duration: CYCLE,
				times: TIMES,
				ease: ['linear', 'circOut', 'linear', 'circIn'],
				repeat: Infinity,
			}),
		];
		return () => controls.forEach((c) => c.stop());
	}, [reduced, w, h]);

	const hold = reduced
		? { opacity: 1, y: 0 }
		: {
				opacity: [0, 0, 1, 1, 0],
				y: [4, 4, 0, 0, 4],
			};
	const holdTransition = reduced
		? undefined
		: {
				duration: CYCLE,
				times: [0, 0.35, 0.45, 0.88, 1],
				repeat: Infinity,
			};

	return (
		<div
			ref={stageRef}
			role="img"
			aria-label="Animated demo: a selection rectangle is dragged open over a desktop, its size readout counts up, and an action toolbar appears"
			className="relative mx-auto aspect-4/3 w-full max-w-4xl overflow-hidden rounded-xl border border-line bg-ink-2 shadow-[0_40px_90px_-35px_rgb(0_0_0/0.85)] sm:aspect-16/10 md:aspect-21/9"
		>
			{/* desktop wallpaper: grid + brand glow */}
			<div className="landing-grid-bg absolute inset-0 opacity-70" />
			<div className="absolute inset-0 bg-[radial-gradient(60%_120%_at_50%_0%,rgb(246_99_20/0.08),transparent)]" />

			{/* a couple of fake windows to suggest a desktop */}
			<div className="absolute top-[12%] left-[8%] hidden w-[30%] rounded-lg border border-line bg-surface/80 sm:block">
				<div className="flex gap-1 border-b border-line px-2.5 py-2">
					<i className="size-2 rounded-full bg-white/12" />
					<i className="size-2 rounded-full bg-white/12" />
				</div>
				<div className="space-y-2 p-3">
					<div className="text-line w-4/5" />
					<div className="text-line w-3/5" />
					<div className="text-line w-2/3" />
				</div>
			</div>
			<div className="absolute right-[10%] bottom-[16%] hidden w-[22%] rounded-lg border border-line bg-surface/80 md:block">
				<div className="m-2 h-12 rounded-md bg-gradient-to-br from-brand/25 to-brand-hi/10" />
			</div>

			{/* the selection */}
			<motion.div
				className="absolute top-[24%] left-[22%] rounded-[3px] border-[1.5px] border-dashed border-brand-hi/90 bg-brand/5"
				style={{ width: widthPct, height: heightPct }}
			>
				<i className="absolute -top-[3px] -left-[3px] size-3 rounded-[3px] border-2 border-brand-hi border-r-0 border-b-0" />
				<i className="absolute -top-[3px] -right-[3px] size-3 rounded-[3px] border-2 border-brand-hi border-l-0 border-b-0" />
				<i className="absolute -bottom-[3px] -left-[3px] size-3 rounded-[3px] border-2 border-brand-hi border-r-0 border-t-0" />
				<i className="absolute -right-[3px] -bottom-[3px] size-3 rounded-[3px] border-2 border-brand-hi border-l-0 border-t-0" />

				{/* crosshair rides the drag corner */}
				<svg
					className="absolute -right-[9px] -bottom-[9px] size-4 text-brand-hi"
					viewBox="0 0 16 16"
					fill="none"
					aria-hidden="true"
				>
					<path
						d="M8 1v14M1 8h14"
						stroke="currentColor"
						strokeWidth="1.4"
					/>
				</svg>

				{/* live size readout */}
				<motion.div
					className="absolute -top-9 left-1/2 -translate-x-1/2 rounded-md border border-brand-hi/40 bg-brand/15 px-2 py-0.5 font-mono text-xs whitespace-nowrap text-brand-soft"
					animate={hold}
					transition={holdTransition}
				>
					<motion.span>{label}</motion.span>
				</motion.div>

				{/* action toolbar */}
				<motion.div
					className="absolute -bottom-11 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-lg border border-line-hi bg-surface-2 px-2.5 py-2 shadow-[0_12px_30px_-10px_rgb(0_0_0/0.7)]"
					animate={hold}
					transition={holdTransition}
				>
					<i className="size-5 rounded-md bg-gradient-to-br from-brand to-brand-hi" />
					<i className="size-5 rounded-md bg-white/10" />
					<i className="size-5 rounded-md bg-white/10" />
					<i className="size-5 rounded-md bg-white/10" />
					<i className="size-5 rounded-md bg-white/10" />
				</motion.div>
			</motion.div>
		</div>
	);
}
