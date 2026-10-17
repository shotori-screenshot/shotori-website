// Pin demo: the real thing's chrome — a cropped image in a 1px accent
// border with the neon halo (ui/pin.rs), no title bar. Drag it around
// (spring physics like the pin window), nudge with arrow keys, scroll to
// zoom, and right-click for the app's context menu (Copy / Reset zoom /
// Close) — Close really closes the pin, which respawns a beat later.

import { useEffect, useRef, useState } from 'react';
import {
	animate,
	motion,
	useMotionValue,
	useMotionValueEvent,
	useReducedMotion,
} from 'framer-motion';

const STEP = 14;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3;

/** The app's context menu (ui/pin.rs): toolbar surface, 32px items. */
function PinMenu({
	onCopy,
	onResetZoom,
	onClose,
}: {
	onCopy: () => void;
	onResetZoom: () => void;
	onClose: () => void;
}) {
	const item =
		'flex h-8 items-center rounded-[2px] px-2 text-sm text-sh-bar-text hover:bg-sh-bar-hover';
	return (
		<div
			className="absolute top-1/2 left-[calc(100%+2px)] z-10 flex -translate-y-1/2 flex-col gap-1 rounded-md border border-sh-bar-border bg-sh-bar p-1 min-w-[7rem] text-left shadow-[0_8px_24px_rgb(0_0_0/0.45)]"
			onPointerDown={(e) => e.stopPropagation()}
			onContextMenu={(e) => e.preventDefault()}
		>
			<button type="button" className={item} onClick={onCopy}>
				Copy
			</button>
			<button type="button" className={item} onClick={onResetZoom}>
				Reset zoom
			</button>
			<button type="button" className={item} onClick={onClose}>
				Close
			</button>
		</div>
	);
}

export default function PinDemo() {
	const bounds = useRef<HTMLDivElement>(null);
	const pinRef = useRef<HTMLDivElement>(null);
	const reduced = useReducedMotion();
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const zoom = useMotionValue(1);
	const [zoomLabel, setZoomLabel] = useState('1.0×');
	const [menu, setMenu] = useState(true);
	const [gone, setGone] = useState(false);
	const [toast, setToast] = useState(false);

	useMotionValueEvent(zoom, 'change', (v) =>
		setZoomLabel(`${v.toFixed(1)}×`),
	);

	// Keyboard alternative to the drag gesture (arrow keys nudge the pin).
	const nudge = (e: React.KeyboardEvent) => {
		const map: Record<string, [number, number]> = {
			ArrowLeft: [-STEP, 0],
			ArrowRight: [STEP, 0],
			ArrowUp: [0, -STEP],
			ArrowDown: [0, STEP],
		};
		const d = map[e.key];
		if (!d) return;
		e.preventDefault();
		const spring = { type: 'spring', stiffness: 500, damping: 35 } as const;
		animate(x, x.get() + d[0], spring);
		animate(y, y.get() + d[1], spring);
	};

	// Scroll to zoom (the pin's real gesture) — non-passive so the page
	// doesn't scroll along.
	useEffect(() => {
		const pin = pinRef.current;
		if (!pin || reduced) return;
		const onWheel = (e: WheelEvent) => {
			e.preventDefault();
			zoom.set(
				Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom.get() * Math.pow(1.0015, -e.deltaY))),
			);
		};
		pin.addEventListener('wheel', onWheel, { passive: false });
		return () => pin.removeEventListener('wheel', onWheel);
	}, [reduced, zoom]);

	const copy = () => {
		setMenu(false);
		setToast(true);
		window.setTimeout(() => setToast(false), 1400);
	};
	const resetZoom = () => {
		setMenu(false);
		animate(zoom, 1, { type: 'spring', stiffness: 300, damping: 30 });
	};
	const close = () => {
		setMenu(false);
		setGone(true);
		window.setTimeout(() => {
			x.set(0);
			y.set(0);
			zoom.set(1);
			setGone(false);
		}, 1100);
	};

	return (
		<div
			ref={bounds}
			className="relative h-44 overflow-hidden rounded-lg border border-line bg-ink-2"
		>
			<div className="landing-grid-bg absolute inset-0 opacity-60" />
			<div className="absolute inset-0 bg-[radial-gradient(70%_100%_at_30%_20%,rgb(255_106_0/0.07),transparent)]" />

			{/* centered by left/top so x/y stay pure pixel offsets for drag+nudge.
			    overflow-hidden lives on the inner image box so the context
			    menu can hang outside the pin without being clipped */}
			<motion.div
				ref={pinRef}
				className="absolute top-[calc(50%-3.25rem)] left-[calc(42%-3.5rem)] h-26 w-28 cursor-grab border border-sh-accent shadow-[0_0_6px_rgb(255_106_0/0.55),0_0_24px_rgb(255_106_0/0.28)] active:cursor-grabbing focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#ff6a00]"
				style={{ x, y }}
				role="img"
				aria-label="Pinned floating screenshot — drag it, scroll to zoom, focus and use arrow keys, right-click for its menu"
				tabIndex={0}
				onKeyDown={nudge}
				onContextMenu={(e) => {
					e.preventDefault();
					setMenu((m) => !m);
				}}
				drag
				dragConstraints={bounds}
				dragElastic={0.18}
				dragMomentum={false}
				whileDrag={
					reduced
						? undefined
						: { boxShadow: '0 0 10px rgb(255 106 0 / 0.8), 0 0 34px rgb(255 106 0 / 0.4)' }
				}
				animate={gone ? { opacity: 0, scale: 0.92 } : { opacity: 1, scale: 1 }}
				transition={{ duration: 0.25 }}
			>
				<div className="h-full w-full overflow-hidden">
					<motion.img
						src="/selection-and-pins.png"
						alt=""
						width="1401"
						height="702"
						draggable={false}
						className="h-full w-full object-cover object-[38%_30%] select-none"
						style={{ scale: zoom }}
					/>
				</div>

				{/* the app's context menu (right-click) — opened by default so
				    the feature is discoverable */}
				{menu && !gone && (
					<PinMenu onCopy={copy} onResetZoom={resetZoom} onClose={close} />
				)}
			</motion.div>

			{/* OSD-style toast for Copy */}
			{toast && (
				<div className="absolute top-2 right-2 z-10 flex items-center gap-2 rounded-lg border border-sh-accent bg-sh-chip px-3 py-1.5 text-xs text-sh-hint">
					Copied
				</div>
			)}

			<span className="absolute bottom-2.5 left-3 font-mono text-[10px] text-fg-mute/70">
				drag · right-click
			</span>
			<span className="absolute right-3 bottom-2.5 font-mono text-[10px] text-fg-mute/70">
				{zoomLabel}
			</span>
		</div>
	);
}
