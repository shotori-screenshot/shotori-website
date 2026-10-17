// Pin demo: the real thing's chrome — a cropped image in a 1px accent
// border with the neon halo (ui/pin.rs), no title bar. Drag it around
// (spring physics like the pin window), nudge with arrow keys, scroll to
// zoom, and right-click for the app's context menu (Copy / Reset zoom /
// Close) — Close really closes the pin, which respawns a beat later.
//
// The backdrop is a working editor, not a grey box: the pin is supposed to
// read as a reference image you keep beside your code.

import { useEffect, useRef, useState } from 'react';
import {
	animate,
	motion,
	useMotionValue,
	useMotionValueEvent,
	useReducedMotion,
} from 'framer-motion';
import pinImage from '../../assets/shot-detail.webp';

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
			className="absolute top-1/2 left-[calc(100%+6px)] z-10 hidden min-w-[7rem] -translate-y-1/2 flex-col gap-1 rounded-md border border-sh-bar-border bg-sh-bar p-1 text-left shadow-[0_8px_24px_rgb(0_0_0/0.45)] sm:flex"
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

/** A static editor scene behind the pin. */
function EditorBackdrop() {
	const rows: Array<[string, string, string]> = [
		['c', 'pub fn', ' pin(&mut self, crop: Crop) -> Window {'],
		['p', '    let', ' bounds = crop.pixels();'],
		['p', '    self.spawn', '(bounds, PinOptions {'],
		['p', '        always_on_top:', ' true,'],
		['p', '        zoom:', ' 1.0,'],
		['p', '    })'],
		['p', '}'],
	];
	return (
		<div aria-hidden="true" className="absolute inset-0 overflow-hidden">
			<div className="landing-grid-bg absolute inset-0 opacity-50" />
			<div className="absolute inset-0 bg-[radial-gradient(70%_90%_at_20%_10%,rgb(255_106_0/0.08),transparent_65%)]" />
			<div className="absolute inset-x-0 top-0 flex h-8 items-center gap-1.5 border-b border-line bg-[#0b0d12] px-3">
				<i className="size-2 rounded-full bg-[#ff5f57]" />
				<i className="size-2 rounded-full bg-[#febc2e]" />
				<i className="size-2 rounded-full bg-[#28c840]" />
				<span className="ml-2 rounded-[3px] bg-white/6 px-2 py-[3px] font-mono text-[9px] text-fg-mute">
					pin.rs
				</span>
			</div>
			<div className="absolute inset-x-0 top-8 bottom-0 p-3 font-mono text-[10px] leading-[1.85]">
				{rows.map(([kind, a, b], i) => (
					<div key={i} className="whitespace-pre">
						<span className="mr-3 inline-block w-4 text-right text-white/18">
							{i + 1}
						</span>
						<span className={kind === 'c' ? 'text-[#c792ea]' : 'text-fg/75'}>
							{a}
						</span>
						<span className="text-[#6fd6c9]">{b}</span>
					</div>
				))}
			</div>
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
			className="relative h-[23rem] overflow-hidden rounded-lg border border-line bg-[#0a0c11] sm:h-[27rem]"
		>
			<EditorBackdrop />

			{/* positioned by left/top so x/y stay pure pixel offsets for
			    drag+nudge. overflow-hidden lives on the inner image box so the
			    context menu can hang outside the pin without being clipped */}
			<motion.div
				ref={pinRef}
				className="absolute top-[23%] left-[12%] aspect-4/3 w-[52%] max-w-[270px] cursor-grab border border-sh-accent shadow-[0_0_7px_rgb(255_106_0/0.6),0_0_28px_rgb(255_106_0/0.3)] active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6a00]"
				style={{ x, y }}
				role="group"
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
						: { boxShadow: '0 0 12px rgb(255 106 0 / 0.85), 0 0 40px rgb(255 106 0 / 0.45)' }
				}
				animate={gone ? { opacity: 0, scale: 0.92 } : { opacity: 1, scale: 1 }}
				transition={{ duration: 0.25 }}
			>
				<div className="h-full w-full overflow-hidden">
					<motion.img
						src={pinImage.src}
						alt=""
						width="900"
						height="682"
						draggable={false}
						className="h-full w-full object-cover object-[26%_34%] select-none"
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
				<div className="absolute top-3 right-3 z-10 flex items-center gap-2 rounded-lg border border-sh-accent bg-sh-chip px-3 py-1.5 text-xs text-sh-hint">
					Copied
				</div>
			)}

			<span className="pointer-events-none absolute top-10 left-4 font-mono text-[9px] text-fg-mute/60">
				pin · drag, scroll to zoom
			</span>
			<span className="pointer-events-none absolute right-4 bottom-3 font-mono text-[9px] text-fg-mute/60">
				{zoomLabel}
			</span>
		</div>
	);
}
