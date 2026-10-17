// Signature hero visual: the real shotori capture flow, looping forever —
// the frozen desktop dims outside the drag, the selection sees through
// with a solid accent border + live size label, eight round handles pop
// on release, the factory toolbar appears below, the rectangle tool
// lights up and draws a red annotation which then shows its dashed
// selection frame, and Copy flashes before the overlay quits and the
// cycle restarts.
//
// The chrome itself lives in ./chrome (selection.tsx, toolbar.tsx) —
// pixel-faithful replicas of the app's UI. This file owns the stage,
// the mock desktop and the timeline.
//
// Freeze-safety: the hero sits at the top of the page (in-viewport) and
// every keyframe is a complete-looking state — a rect caught mid-open
// just reads as "capture in progress".

import { useEffect, useRef, useState } from 'react';
import {
	motion,
	useMotionValue,
	useReducedMotion,
	useTransform,
} from 'framer-motion';
import {
	AnnotationShape,
	SelectionChrome,
} from './chrome/selection';
import { ToolbarRow1, ToolbarRow2, TOOLBAR_BLOCK_H, TOOLBAR_NATURAL_W } from './chrome/toolbar';
import { startLoop } from './lib/loop';

const CYCLE = 12;
const W_MAX = 1280;
const H_MAX = 720;

/** The fake desktop behind the overlay: grid wallpaper, brand glow and
 *  a couple of windows — enough to read as "your screen, frozen". */
function DesktopMock() {
	return (
		<>
			<div className="landing-grid-bg absolute inset-0 opacity-70" />
			<div className="absolute inset-0 bg-[radial-gradient(60%_120%_at_50%_0%,rgb(255_106_0/0.08),transparent)]" />
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
		</>
	);
}

export default function SelectionDemo() {
	const reduced = useReducedMotion();
	const stageRef = useRef<HTMLDivElement>(null);
	// On narrow stages the rect stays shorter so the toolbar below it (and
	// the badge above it) still fit inside the clipped stage.
	const [narrow, setNarrow] = useState(false);
	const [stageW, setStageW] = useState(0);
	const [stageH, setStageH] = useState(0);

	// ── the drag ──────────────────────────────────────────────────────────
	const w = useMotionValue(160);
	const h = useMotionValue(90);
	const widthPct = useTransform(w, (v) => `${(v / W_MAX) * 62}%`);
	const heightPct = useTransform(h, (v) =>
		`${(v / H_MAX) * (narrow ? 46 : 56)}%`,
	);
	const label = useTransform(
		[w, h],
		([a, b]: number[]) => `${Math.round(a)} × ${Math.round(b)}`,
	);

	// ── the timeline, as keyframed motion values ──────────────────────────
	const cutOp = useMotionValue(0); // the dim layer (fades when the app "quits")
	const chromeOp = useMotionValue(0); // border + label + handles + annotation
	const handleOp = useMotionValue(0);
	const handleScale = useMotionValue(0.4);
	const crossOp = useMotionValue(0); // crosshair riding the drag corner
	const tbOp = useMotionValue(0);
	const tbY = useMotionValue(12);
	const pressedOp = useMotionValue(0); // rectangle tool selected
	const row2H = useMotionValue(0); // annotation settings row
	const row2Op = useMotionValue(0);
	const annW = useMotionValue(0); // the drawn rectangle, % of selection
	const annH = useMotionValue(0);
	const annRectOp = useMotionValue(0); // the rect itself (hidden until the pen lands)
	const annOp = useMotionValue(0); // its dashed selection chrome
	const flashOp = useMotionValue(0); // copy press

	const annWPct = useTransform(annW, (v) => `${v}%`);
	const annHPct = useTransform(annH, (v) => `${v}%`);

	useEffect(() => {
		const stage = stageRef.current;
		if (!stage) return;
		const ro = new ResizeObserver(([entry]) => {
			setNarrow(entry.contentRect.width < 640);
			setStageW(entry.contentRect.width);
			setStageH(entry.contentRect.height);
		});
		ro.observe(stage);
		return () => ro.disconnect();
	}, []);

	useEffect(() => {
		if (reduced) {
			w.set(W_MAX);
			h.set(H_MAX);
			cutOp.set(1);
			chromeOp.set(1);
			handleOp.set(1);
			handleScale.set(1);
			tbOp.set(1);
			tbY.set(0);
			return;
		}
		return startLoop(CYCLE, [
			// drag open / close
			{
				value: w,
				keyframes: [160, 160, W_MAX, W_MAX, 160, 160],
				times: [0, 0.05, 0.3, 0.8, 0.82, 1],
				ease: ['linear', 'circOut', 'linear', 'circIn', 'linear'],
			},
			{
				value: h,
				keyframes: [90, 90, H_MAX, H_MAX, 90, 90],
				times: [0, 0.05, 0.3, 0.8, 0.82, 1],
				ease: ['linear', 'circOut', 'linear', 'circIn', 'linear'],
			},
			// the dim fades only when the overlay "quits", back before the loop
			{ value: cutOp, keyframes: [1, 1, 0, 0, 1, 1], times: [0, 0.78, 0.84, 0.93, 0.96, 1] },
			{ value: chromeOp, keyframes: [0, 0, 1, 1, 0, 0], times: [0, 0.03, 0.05, 0.8, 0.82, 1] },
			{ value: handleOp, keyframes: [0, 0, 1, 1, 0, 0], times: [0, 0.3, 0.325, 0.8, 0.81, 1] },
			{ value: handleScale, keyframes: [0.4, 0.4, 1.12, 1, 1], times: [0, 0.3, 0.315, 0.335, 1] },
			{ value: crossOp, keyframes: [0, 0, 1, 1, 0, 0], times: [0, 0.04, 0.06, 0.29, 0.31, 1] },
			{ value: tbOp, keyframes: [0, 0, 1, 1, 0, 0], times: [0, 0.34, 0.38, 0.8, 0.82, 1] },
			{ value: tbY, keyframes: [12, 12, 0, 0, 12, 12], times: [0, 0.34, 0.38, 0.8, 0.82, 1] },
			{ value: pressedOp, keyframes: [0, 0, 1, 1, 0, 0], times: [0, 0.4, 0.42, 0.66, 0.68, 1] },
			{ value: row2H, keyframes: [0, 0, 38, 38, 0, 0], times: [0, 0.4, 0.44, 0.66, 0.69, 1] },
			{ value: row2Op, keyframes: [0, 0, 1, 1, 0, 0], times: [0, 0.4, 0.43, 0.66, 0.68, 1] },
			{ value: annW, keyframes: [0, 0, 72, 72, 0, 0], times: [0, 0.46, 0.56, 0.7, 0.71, 1] },
			{ value: annH, keyframes: [0, 0, 56, 56, 0, 0], times: [0, 0.46, 0.56, 0.7, 0.71, 1] },
			// the rect appears exactly when the pen lands, fades with the overlay
			{ value: annRectOp, keyframes: [0, 0, 1, 1, 0, 0], times: [0, 0.455, 0.475, 0.79, 0.81, 1] },
			{ value: annOp, keyframes: [0, 0, 1, 1, 0, 0], times: [0, 0.56, 0.58, 0.66, 0.68, 1] },
			{ value: flashOp, keyframes: [0, 0, 1, 1, 0, 0], times: [0, 0.7, 0.72, 0.75, 0.77, 1] },
		]);
	}, [reduced, w, h, cutOp, chromeOp, handleOp, handleScale, crossOp, tbOp, tbY, pressedOp, row2H, row2Op, annW, annH, annRectOp, annOp, flashOp]);

	// The toolbar clamps like toolbar_anchor(): never past the stage's
	// right edge, and the full two-row block must stay inside the stage
	// vertically too (tbTop = stageH·frac + 8).
	const tbScale = stageW
		? Math.max(
				0.32,
				Math.min(
					1,
					(stageW * 0.78 - 16) / TOOLBAR_NATURAL_W,
					(stageH * (narrow ? 0.34 : 0.25) - 12) / TOOLBAR_BLOCK_H,
				),
			)
		: 1;

	return (
		<div
			ref={stageRef}
			role="img"
			aria-label="Animated demo: a selection is dragged open over a dimmed desktop, its size readout counts up, round handles appear, the shotori toolbar pops in below, a red rectangle annotation draws itself and is selected, then copy flashes"
			className="relative mx-auto aspect-4/3 w-full max-w-4xl overflow-hidden rounded-xl border border-line bg-ink-2 shadow-[0_40px_90px_-35px_rgb(0_0_0/0.85)] sm:aspect-16/10 md:aspect-21/9"
		>
			<DesktopMock />

			{/* the dim layer: everything outside the selection dims to 55%
			    black (one huge box-shadow = the four strips, no seams) */}
			<motion.div
				className="absolute top-[20%] left-[22%]"
				style={{
					width: widthPct,
					height: heightPct,
					opacity: cutOp,
					boxShadow: '0 0 0 9999px rgb(0 0 0 / 0.55)',
				}}
			/>

			{/* the selection chrome + the annotation story inside it */}
			<SelectionChrome
				width={widthPct}
				height={heightPct}
				opacity={chromeOp}
				label={label}
				handleOpacity={handleOp}
				handleScale={handleScale}
				crossOpacity={crossOp}
			>
				<AnnotationShape
					width={annWPct}
					height={annHPct}
					rectOpacity={annRectOp}
					chromeOpacity={annOp}
				/>
			</SelectionChrome>

			{/* the toolbar: factory row one + the annotation settings row,
			    scaled to fit the stage, anchored like toolbar_anchor() */}
			<motion.div
				className="absolute"
				style={{
					top: narrow ? 'calc(66% + 8px)' : 'calc(75% + 8px)',
					left: 'max(22%, 8px)',
					opacity: tbOp,
					y: tbY,
				}}
			>
				<div
					className="flex flex-col gap-1.5"
					style={{ transform: `scale(${tbScale})`, transformOrigin: 'left top' }}
				>
					<ToolbarRow1 pressed={pressedOp} flash={flashOp} />
					<motion.div
						className="overflow-hidden"
						style={{ height: row2H, opacity: row2Op }}
					>
						<ToolbarRow2 selectedSwatch={0} size={3} />
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
}
