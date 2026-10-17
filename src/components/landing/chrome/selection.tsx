// The selection chrome replica (ui/hud.rs + model/selection.rs):
// a solid 1px accent border, the live size label above the top-left
// corner (accent bg, black text — theme accent_text() for #FF6A00),
// eight 7px solid-accent circular handles on the border (HANDLE_VIS = 7,
// 4 corners + 4 edge midpoints), and the annotation selection chrome —
// a 1px dashed accent frame with white-cored handles (the ink-readable
// sibling of the region's solid dots).
//
// Presentational only: the demo owns the timeline and passes motion
// values down (width/height/opacity ride the drag, handleOpacity/
// handleScale pop on release).

import { motion, type MotionValue } from 'framer-motion';

/** 4 corners + 4 edge midpoints, as [x, y] fractions of the rect. */
export const HANDLE_ANCHORS: ReadonlyArray<readonly [number, number]> = [
	[0, 0],
	[0.5, 0],
	[1, 0],
	[0, 0.5],
	[1, 0.5],
	[0, 1],
	[0.5, 1],
	[1, 1],
];

type ChromeProps = {
	/** Selection size + chrome visibility as motion values. */
	width: MotionValue<string>;
	height: MotionValue<string>;
	opacity: MotionValue<number>;
	/** Live "W × H" readout. */
	label: MotionValue<string>;
	handleOpacity: MotionValue<number>;
	handleScale: MotionValue<number>;
	/** Crosshair riding the drag corner (opacity 0 once the drag ends). */
	crossOpacity: MotionValue<number>;
	children?: React.ReactNode;
};

/** The selection: border + size label + handles + drag crosshair. */
export function SelectionChrome({
	width,
	height,
	opacity,
	label,
	handleOpacity,
	handleScale,
	crossOpacity,
	children,
}: ChromeProps) {
	return (
		<motion.div
			className="absolute top-[20%] left-[22%] border border-sh-accent"
			style={{ width, height, opacity }}
		>
			{/* live size readout (hud.rs selection_label proportions) */}
			<motion.div className="absolute top-[-30px] left-0 rounded-[4px] bg-sh-accent px-2 py-[2px] text-xs leading-[1.2] whitespace-nowrap text-black">
				<motion.span>{label}</motion.span>
			</motion.div>

			{/* crosshair rides the drag corner */}
			<motion.svg
				className="absolute top-full left-full size-[15px] -translate-x-1/2 -translate-y-1/2 text-sh-accent"
				style={{ opacity: crossOpacity }}
				viewBox="0 0 16 16"
				fill="none"
				aria-hidden="true"
			>
				<path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.4" />
			</motion.svg>

			{/* resize handles: 4 corners + 4 edge midpoints */}
			{HANDLE_ANCHORS.map(([hx, hy]) => (
				<motion.i
					key={`${hx}-${hy}`}
					className="absolute size-[7px] rounded-full bg-sh-accent"
					style={{
						left: `${hx * 100}%`,
						top: `${hy * 100}%`,
						x: '-50%',
						y: '-50%',
						scale: handleScale,
						opacity: handleOpacity,
					}}
				/>
			))}

			{children}
		</motion.div>
	);
}

/** The annotation story inside the selection: the rectangle being drawn
 *  AND its selection chrome (hud.rs annotation_chrome — a 1px dashed
 *  accent frame around the ink bbox with white-cored corner handles).
 *  Both are positioned inside ONE wrapper whose size is the animated
 *  rect size, so the frame hugs the ink at any point of the draw —
 *  the dashed frame offset is pure -inset, never a second percentage
 *  layout that could drift out of sync. */
export function AnnotationShape({
	width,
	height,
	rectOpacity,
	chromeOpacity,
	color = '#ff4545',
}: {
	width: MotionValue<string>;
	height: MotionValue<string>;
	/** The drawn rect (hidden until the pen lands). */
	rectOpacity: MotionValue<number>;
	/** The dashed selection chrome (appears once the draw completes). */
	chromeOpacity: MotionValue<number>;
	color?: string;
}) {
	return (
		<motion.div
			className="absolute top-[15%] left-[15%]"
			style={{ width, height }}
		>
			{/* the ink: 3px stroke, factory default Red */}
			<motion.div
				className="absolute inset-0 border-[3px]"
				style={{ borderColor: color, opacity: rectOpacity }}
			/>
			{/* the selected-shape chrome: dashed frame just outside the ink */}
			<motion.div
				className="absolute -inset-[7px] border border-dashed border-sh-accent"
				style={{ opacity: chromeOpacity }}
			>
				{(
					[
						[0, 0],
						[1, 0],
						[0, 1],
						[1, 1],
					] as const
				).map(([hx, hy]) => (
					<i
						key={`ink-${hx}-${hy}`}
						className="absolute size-[7px] rounded-full border-[1.5px] border-sh-accent bg-white"
						style={{
							left: `${hx * 100}%`,
							top: `${hy * 100}%`,
							transform: 'translate(-50%, -50%)',
						}}
					/>
				))}
			</motion.div>
		</motion.div>
	);
}
