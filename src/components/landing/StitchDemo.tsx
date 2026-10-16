// Long-capture demo: the page column drifts downward inside a clipped window
// while the dashed "stitch preview" beside it grows. Freeze-safe — any frame
// is a valid mid-stitch state.

import { motion, useReducedMotion } from 'motion/react';

const DRIFT = 14; // seconds per loop — deliberately slow, ambient

export default function StitchDemo() {
	const reduced = useReducedMotion();

	const page = reduced ? {} : { y: [0, -110, 0] };
	const stitch = reduced
		? { scaleY: 0.85 }
		: { scaleY: [0.15, 0.95, 0.15] };

	return (
		<div className="flex h-52 gap-2 sm:h-56">
			{/* the window being captured */}
			<div className="relative flex-1 overflow-hidden rounded-lg border border-line bg-surface">
				<div className="flex items-center gap-1.5 border-b border-line px-2.5 py-2">
					<i className="size-2 rounded-full bg-white/12" />
					<i className="size-2 rounded-full bg-white/12" />
					<div className="ml-1 h-3.5 flex-1 rounded-full bg-white/6" />
				</div>
				<div className="h-[calc(100%-1.7rem)] overflow-hidden">
					<motion.div
						className="space-y-2.5 p-3"
						animate={page}
						transition={{ duration: DRIFT, repeat: Infinity, ease: 'linear' }}
					>
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
			</div>

			{/* the live stitch preview */}
			<div className="flex w-9 flex-col gap-1">
				<motion.div
					className="min-h-0 flex-1 origin-top rounded-md border border-dashed border-brand-hi/50 bg-brand/8 p-1"
					animate={stitch}
					transition={{ duration: DRIFT, repeat: Infinity, ease: 'linear' }}
				>
					<div className="h-full rounded-[3px] bg-[repeating-linear-gradient(to_bottom,rgb(255_255_255/0.10)_0_6px,transparent_6px_10px)]" />
				</motion.div>
			</div>
		</div>
	);
}
