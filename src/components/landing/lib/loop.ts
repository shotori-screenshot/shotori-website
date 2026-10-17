// Loop-timeline helper for the landing demos.
//
// Every demo is a repeating multi-track keyframe animation over motion
// values (width/opacity/… each with its own normalized `times`), plus a
// static fallback for prefers-reduced-motion. This module owns that
// pattern once so the demos only declare their tracks.

import { animate, type MotionValue } from 'framer-motion';

export type LoopTrack = {
	/** The motion value to drive. */
	value: MotionValue<number>;
	/** Keyframe values; the first is also the loop's rest state. */
	keyframes: number[];
	/** Normalized keyframe positions, same length as `keyframes`. */
	times: number[];
	/** Per-segment easing (framer-motion easing name(s)). */
	ease?: string | string[];
};

/**
 * Start a repeating keyframe loop over many motion values.
 * Returns a stop handle — call it from the effect cleanup.
 */
export function startLoop(duration: number, tracks: LoopTrack[]): () => void {
	const controls = tracks.map(({ value, keyframes, times, ease }) =>
		animate(value, keyframes, {
			duration,
			times,
			repeat: Infinity,
			...(ease ? { ease: ease as never } : {}),
		}),
	);
	return () => controls.forEach((c) => c.stop());
}
