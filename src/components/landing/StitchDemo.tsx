// Long-capture demo, restyled as the real scroll-capture chrome
// (ui/scroll_bar.rs): four 2px solid accent strokes frame the scrolling
// region, the frame toolbar (⇕ Copy Save ✕ — 32px, accent-tinted border)
// floats below it, and the docked preview panel (#202028, white/12
// border, no rounding) streams the growing stitch with the accent
// viewport highlight riding its lower edge. Freeze-safe — any frame is a
// valid mid-stitch state.

import { useEffect } from 'react';
import {
	animate,
	motion,
	useMotionValue,
	useReducedMotion,
	useTransform,
} from 'framer-motion';

const DRIFT = 14; // seconds per loop — deliberately slow, ambient

/** One frame-toolbar text button (scroll_bar.rs hold_button()). */
function HoldButton({ w, label }: { w: number; label: string }) {
	return (
		<span
			className="flex h-full cursor-default items-center justify-center rounded-md px-1.5 text-xs text-sh-btn-text hover:bg-white/15"
			style={{ width: w }}
		>
			{label}
		</span>
	);
}

export default function StitchDemo() {
	const reduced = useReducedMotion();
	const y = useMotionValue(0);
	const grow = useMotionValue(12);
	const growH = useTransform(grow, (v) => `${v}%`);

	useEffect(() => {
		if (reduced) {
			y.set(0);
			grow.set(60);
			return;
		}
		const controls = [
			animate(y, [0, -120, 0], { duration: DRIFT, repeat: Infinity, ease: 'linear' }),
			animate(grow, [12, 92, 12], { duration: DRIFT, repeat: Infinity, ease: 'linear' }),
		];
		return () => controls.forEach((c) => c.stop());
	}, [reduced, y, grow]);

	return (
		<div
			className="flex h-full min-h-52 gap-2 sm:min-h-56"
			role="img"
			aria-label="Animated demo: a page scrolls inside a region framed by four orange strokes while a side preview of the stitched long screenshot grows"
		>
			{/* the window being captured */}
			<div className="relative flex-1 overflow-hidden rounded-lg border border-line bg-surface">
				<div className="flex items-center gap-1.5 border-b border-line px-2.5 py-2">
					<i className="size-2 rounded-full bg-white/12" />
					<i className="size-2 rounded-full bg-white/12" />
					<div className="ml-1 h-3.5 flex-1 rounded-full bg-white/6" />
				</div>
				<div className="h-[calc(100%-1.7rem)] overflow-hidden">
					<motion.div className="space-y-2.5 p-3" style={{ y }}>
						{[...Array(9)].map((_, i) => (
							<div key={i} className="space-y-1.5">
								<div className="text-line w-5/6" />
								<div className="text-line w-4/6" />
								{i % 3 === 2 && (
									<div className="h-8 rounded-md bg-gradient-to-r from-brand/15 to-transparent" />
								)}
							</div>
						))}
					</motion.div>
				</div>
				{/* fixed header bar — the thing that would stop the stitch */}
				<div className="absolute inset-x-0 top-[1.7rem] h-4 bg-surface-2/90" />

				{/* the region frame: four 2px solid accent strokes
				    (model/placement.rs frame_strokes) */}
				<div className="absolute inset-x-2 top-[2.1rem] h-[2px] bg-sh-accent" />
				<div className="absolute inset-x-2 bottom-[2.9rem] h-[2px] bg-sh-accent" />
				<div className="absolute top-[2.1rem] bottom-[2.9rem] left-2 w-[2px] bg-sh-accent" />
				<div className="absolute top-[2.1rem] bottom-[2.9rem] right-2 w-[2px] bg-sh-accent" />

				{/* the frame toolbar (scroll_bar.rs hold_button row) */}
				<div className="absolute bottom-[9px] left-1/2 flex h-8 -translate-x-1/2 items-center gap-1 rounded-lg border border-sh-accent/60 bg-sh-bar px-1">
					<HoldButton w={34} label="⇕" />
					<HoldButton w={52} label="Copy" />
					<HoldButton w={52} label="Save" />
					<HoldButton w={26} label="✕" />
				</div>
			</div>

			{/* the docked preview panel: pure preview, no rounding */}
			<div className="w-12 shrink-0 border border-white/12 bg-sh-bar p-2">
				<div className="relative h-full overflow-hidden">
					{/* the growing stitch, top-anchored */}
					<motion.div
						className="absolute inset-x-0 top-0 bg-[repeating-linear-gradient(to_bottom,rgb(255_255_255/0.12)_0_5px,transparent_5px_9px)]"
						style={{ height: growH }}
					>
						{/* viewport highlight — where the capture frame sits in
						    the long image (accent outline) */}
						<div className="absolute inset-x-0 bottom-0 h-[18px] rounded-[2px] border border-sh-accent" />
					</motion.div>
				</div>
			</div>
		</div>
	);
}
