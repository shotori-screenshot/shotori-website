// Pin demo: an always-on-top floating image you can drag around (with spring
// physics, like the real thing) or nudge with arrow keys. Motion answers the
// user's action here — nothing animates until they interact.

import { useRef } from 'react';
import { animate, motion, useMotionValue, useReducedMotion } from 'motion/react';

const STEP = 14;

export default function PinDemo() {
	const bounds = useRef<HTMLDivElement>(null);
	const reduced = useReducedMotion();
	const x = useMotionValue(0);
	const y = useMotionValue(0);

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

	return (
		<div
			ref={bounds}
			className="relative h-44 overflow-hidden rounded-lg border border-line bg-ink-2"
		>
			<div className="landing-grid-bg absolute inset-0 opacity-60" />
			<div className="absolute inset-0 bg-[radial-gradient(70%_100%_at_30%_20%,rgb(246_99_20/0.07),transparent)]" />

			{/* centered by left/top so x/y stay pure pixel offsets for drag+nudge */}
			<motion.div
				className="absolute top-[calc(50%-3.25rem)] left-[calc(50%-3.5rem)] w-28 cursor-grab overflow-hidden rounded-md border border-line-hi shadow-[0_16px_40px_-12px_rgb(0_0_0/0.8)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-hi active:cursor-grabbing"
				style={{ x, y }}
				role="img"
				aria-label="Pinned floating screenshot — drag it, or focus and use arrow keys"
				tabIndex={0}
				onKeyDown={nudge}
				drag
				dragConstraints={bounds}
				dragElastic={0.18}
				dragMomentum={false}
				whileDrag={
					reduced
						? undefined
						: { scale: 1.05, boxShadow: '0 24px 50px -12px rgb(0 0 0 / 0.85)' }
				}
			>
				<img
					src="/selection-and-pins.png"
					alt=""
					width="1401"
					height="702"
					draggable={false}
					className="h-20 w-full object-cover object-[38%_30%] select-none"
				/>
				<div className="flex items-center justify-between border-t border-line bg-surface px-2 py-1 font-mono text-[10px] text-fg-mute">
					<span>pin</span>
					<span className="text-brand-soft">2.0×</span>
				</div>
			</motion.div>

			<span className="absolute right-3 bottom-2.5 font-mono text-[10px] text-fg-mute/70">
				drag me
			</span>
		</div>
	);
}
