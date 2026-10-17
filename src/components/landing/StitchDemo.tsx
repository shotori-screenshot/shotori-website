// Long-capture demo, restyled as the real scroll-capture chrome
// (ui/scroll_bar.rs): four 2px solid accent strokes frame the scrolling
// region, the frame toolbar (⇕ Copy Save ✕ — 32px, accent-tinted border)
// floats below it, and the docked preview panel (#202028, white/12
// border, no rounding) streams the growing stitch with the accent
// viewport highlight riding its lower edge.
//
// The page is a real-looking document rather than grey bars: this is the
// feature people install the app for, so it should read as a page, not a
// wireframe. Freeze-safe — any frame is a valid mid-stitch state.

import { useEffect } from 'react';
import {
	animate,
	motion,
	useMotionValue,
	useReducedMotion,
	useTransform,
} from 'framer-motion';

const DRIFT = 18; // seconds per loop — deliberately slow, ambient

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

function MiniLine({ w = '100%' }: { w?: string }) {
	return <div className="h-[2px] rounded-full bg-white/16" style={{ width: w }} />;
}

export default function StitchDemo() {
	const reduced = useReducedMotion();
	const y = useMotionValue(0);
	const grow = useMotionValue(58);
	const growH = useTransform(grow, (v) => `${v}%`);

	useEffect(() => {
		if (reduced) {
			y.set(-80);
			grow.set(72);
			return;
		}
		const controls = [
			animate(y, [0, -150, 0], { duration: DRIFT, repeat: Infinity, ease: 'linear' }),
			animate(grow, [38, 92, 38], { duration: DRIFT, repeat: Infinity, ease: 'linear' }),
		];
		return () => controls.forEach((c) => c.stop());
	}, [reduced, y, grow]);

	return (
		<div
			className="flex h-[23rem] gap-2 sm:h-[27rem] sm:gap-3"
			role="img"
			aria-label="Animated demo: a documentation page scrolls inside a region framed by four orange strokes while the stitched long screenshot grows in a side preview"
		>
			{/* the window being captured */}
			<div className="relative min-w-0 flex-1 overflow-hidden rounded-lg border border-line bg-surface">
				<div className="flex h-9 items-center gap-1.5 border-b border-line bg-surface-2/70 px-3">
					<i className="size-2 rounded-full bg-[#ff5f57]" />
					<i className="size-2 rounded-full bg-[#febc2e]" />
					<i className="size-2 rounded-full bg-[#28c840]" />
					<span className="ml-2 flex-1 truncate rounded-[3px] bg-white/5 px-2 py-[3px] font-mono text-[9px] text-fg-mute">
						docs.shotori.dev/long-capture
					</span>
				</div>

				<div className="relative h-[calc(100%-2.25rem)] overflow-hidden">
					<motion.div className="px-4 py-4" style={{ y }}>
						<div className="font-display text-[15px] font-semibold tracking-tight text-fg">
							Long capture
						</div>
						<p className="mt-2 max-w-[34ch] text-[10.5px] leading-[1.6] text-fg-mute">
							Frame the part of the page that scrolls, then scroll it
							yourself. Shotori stitches every pass into one image.
						</p>
						<div className="mt-3 space-y-[6px]">
							<MiniLine w="92%" />
							<MiniLine w="86%" />
							<MiniLine w="94%" />
							<MiniLine w="64%" />
						</div>
						<div className="mt-4 rounded-md border border-white/8 bg-[#0b0d12] p-2.5 font-mono text-[9px] leading-[1.8] text-fg-mute">
							<div>
								<span className="text-[#c792ea]">let</span>{' '}
								<span className="text-fg/80">frame</span> = capture.region();
							</div>
							<div>
								<span className="text-[#c792ea]">while</span> page.scrolls
								{' {'} sheet.fold(frame); {'}'}
							</div>
						</div>
						<div className="mt-3 h-16 rounded-md bg-[linear-gradient(115deg,#2a2230,#1b2a2c_55%,#33241b)]" />
						<div className="mt-3 space-y-[6px]">
							<MiniLine w="88%" />
							<MiniLine w="90%" />
							<MiniLine w="72%" />
							<MiniLine w="84%" />
							<MiniLine w="58%" />
						</div>
						<div className="mt-4 font-display text-[13px] font-semibold text-fg/80">
							Keep what it captured
						</div>
						<div className="mt-2 space-y-[6px]">
							<MiniLine w="86%" />
							<MiniLine w="78%" />
							<MiniLine w="90%" />
							<MiniLine w="66%" />
						</div>
						<div className="mt-3 h-10 rounded-md bg-white/5" />
					</motion.div>

					{/* the region frame: four 2px solid accent strokes
					    (model/placement.rs frame_strokes) */}
					<div className="pointer-events-none absolute inset-x-3 top-[0.9rem] bottom-[3.6rem]">
						<div className="absolute inset-x-0 top-0 h-[2px] bg-sh-accent" />
						<div className="absolute inset-x-0 bottom-0 h-[2px] bg-sh-accent" />
						<div className="absolute inset-y-0 left-0 w-[2px] bg-sh-accent" />
						<div className="absolute inset-y-0 right-0 w-[2px] bg-sh-accent" />
					</div>

					{/* the frame toolbar (scroll_bar.rs hold_button row) */}
					<div className="absolute bottom-3 left-1/2 flex h-8 -translate-x-1/2 items-center gap-1 rounded-lg border border-sh-accent/60 bg-sh-bar px-1 shadow-[0_6px_18px_rgb(0_0_0/0.35)]">
						<HoldButton w={34} label="⇕" />
						<HoldButton w={52} label="Copy" />
						<HoldButton w={52} label="Save" />
						<HoldButton w={26} label="✕" />
					</div>
				</div>
			</div>

			{/* the docked preview panel: pure preview, no rounding */}
			<div className="relative w-[5rem] shrink-0 border border-white/12 bg-sh-bar p-2 sm:w-[6.5rem]">
				<div className="flex items-center justify-between pb-1.5 font-mono text-[7px] tracking-wide text-white/55">
					<span>preview</span>
					<span className="text-sh-accent">⇕</span>
				</div>
				<div className="relative h-[calc(100%-1.25rem)] overflow-hidden bg-[#0d0f14]">
					<motion.div
						className="absolute inset-x-0 top-0 overflow-hidden"
						style={{ height: growH }}
					>
						{/* the stitched page, miniature */}
						<div className="h-[34rem] space-y-[5px] p-2">
							<div className="h-[5px] w-4/5 rounded bg-white/55" />
							<div className="h-[2px] w-full rounded bg-white/16" />
							<div className="h-[2px] w-11/12 rounded bg-white/16" />
							<div className="h-[2px] w-4/5 rounded bg-white/16" />
							<div className="mt-2 h-10 rounded bg-[linear-gradient(115deg,#3a2f45,#22383a)]" />
							<div className="mt-2 h-[2px] w-full rounded bg-white/16" />
							<div className="h-[2px] w-10/12 rounded bg-white/16" />
							<div className="h-[2px] w-11/12 rounded bg-white/16" />
							<div className="h-[2px] w-3/4 rounded bg-white/16" />
							<div className="mt-2 h-8 rounded bg-white/8" />
							<div className="mt-2 h-[2px] w-full rounded bg-white/16" />
							<div className="h-[2px] w-5/6 rounded bg-white/16" />
							<div className="mt-2 h-10 rounded bg-[linear-gradient(115deg,#3b2a22,#2b3331)]" />
							<div className="mt-2 h-[2px] w-11/12 rounded bg-white/16" />
							<div className="h-[2px] w-4/5 rounded bg-white/16" />
							<div className="h-[2px] w-10/12 rounded bg-white/16" />
							<div className="mt-2 h-9 rounded bg-white/8" />
							<div className="mt-2 h-[2px] w-full rounded bg-white/16" />
							<div className="h-[2px] w-3/4 rounded bg-white/16" />
						</div>
						{/* viewport highlight — where the capture frame sits in
						    the long image (accent outline) */}
						<div className="absolute inset-x-0 bottom-0 h-[26px] rounded-[2px] border border-sh-accent bg-[rgb(255_106_0/0.06)]">
							<span className="absolute -top-2 left-1 h-px w-3 bg-sh-accent/70" />
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
