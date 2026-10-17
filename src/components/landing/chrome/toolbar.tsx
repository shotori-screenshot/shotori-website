// The selection toolbar replica (ui/toolbar.rs + model/settings.rs):
// the factory row one — grip, 13 tool icons + clear, separator, the
// five actions (OCR / pin / long screenshot / save / copy), separator,
// settings + cancel, grip — and the annotation settings row that
// appears while a tool is active (size slider + readout | swatch board).
//
// Exact chrome from the Rust sources: bar h38 r8 bg #202028 border
// #3E3E4C px5 gap2; buttons 30×30 r5; icons 18px; separators 1×18 mx4;
// grip = 3×7 dot matrix; slider track 108×4 with a 12px thumb.

import type { ReactNode } from 'react';
import { motion, type MotionValue } from 'framer-motion';
import {
	ArrowIcon,
	CopyIcon,
	EllipseIcon,
	EraserIcon,
	HighlighterIcon,
	LineIcon,
	MosaicIcon,
	NumberIcon,
	OcrIcon,
	PencilIcon,
	PinIcon,
	PolylineIcon,
	RectIcon,
	SaveIcon,
	ScrollIcon,
	SelectIcon,
	SettingsIcon,
	TextIcon,
	TrashIcon,
	XIcon,
} from './icons';

/** Factory swatch board (settings.rs DEFAULT_ANNOTATION_COLORS). */
export const SWATCHES = [
	'#ff4545',
	'#ff8a32',
	'#ffd43b',
	'#40c878',
	'#409cff',
	'#222222',
	'#ffffff',
] as const;

/** Natural width of the factory row at the app's exact sizes (~700px) —
 *  stages scale the toolbar to fit against this basis. */
export const TOOLBAR_NATURAL_W = 700;
/** Full two-row block height: 38 + 6 gap + 38. */
export const TOOLBAR_BLOCK_H = 82;

// The matte dot matrix (toolbar.rs grip_texture()): 3 columns × 7 rows
// of 1.5px dots on a 3.25px lattice, toolbar_text at 30% alpha.
const GRIP_BACKGROUND =
	"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='21'%3E%3Cg fill='%23e8e8ee4d'%3E%3Ccircle cx='0.75' cy='0.75' r='0.75'/%3E%3Ccircle cx='0.75' cy='4' r='0.75'/%3E%3Ccircle cx='0.75' cy='7.25' r='0.75'/%3E%3Ccircle cx='0.75' cy='10.5' r='0.75'/%3E%3Ccircle cx='0.75' cy='13.75' r='0.75'/%3E%3Ccircle cx='0.75' cy='17' r='0.75'/%3E%3Ccircle cx='0.75' cy='20.25' r='0.75'/%3E%3Ccircle cx='4' cy='0.75' r='0.75'/%3E%3Ccircle cx='4' cy='4' r='0.75'/%3E%3Ccircle cx='4' cy='7.25' r='0.75'/%3E%3Ccircle cx='4' cy='10.5' r='0.75'/%3E%3Ccircle cx='4' cy='13.75' r='0.75'/%3E%3Ccircle cx='4' cy='17' r='0.75'/%3E%3Ccircle cx='4' cy='20.25' r='0.75'/%3E%3Ccircle cx='7.25' cy='0.75' r='0.75'/%3E%3Ccircle cx='7.25' cy='4' r='0.75'/%3E%3Ccircle cx='7.25' cy='7.25' r='0.75'/%3E%3Ccircle cx='7.25' cy='10.5' r='0.75'/%3E%3Ccircle cx='7.25' cy='13.75' r='0.75'/%3E%3Ccircle cx='7.25' cy='17' r='0.75'/%3E%3Ccircle cx='7.25' cy='20.25' r='0.75'/%3E%3C/g%3E%3C/svg%3E\")";

function Grip() {
	return (
		<span
			className="h-[38px] w-[12px] flex-none bg-center bg-no-repeat"
			style={{ backgroundImage: GRIP_BACKGROUND }}
		/>
	);
}

/** The 1×18 group break (toolbar.rs separator()). */
function Sep() {
	return <span className="mx-1 h-[18px] w-px flex-none bg-sh-bar-border" />;
}

/** One 30×30 icon button; `pressed` crossfades the selected-tool state,
 *  `flash` a momentary hover pulse (the copy press). */
function ToolButton({
	icon,
	pressed,
	flash,
}: {
	icon: ReactNode;
	pressed?: MotionValue<number>;
	flash?: MotionValue<number>;
}) {
	return (
		<span className="relative flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[5px] text-sh-bar-text hover:bg-sh-bar-hover">
			{icon}
			{pressed && (
				<>
					<motion.span
						className="absolute inset-0 rounded-[5px] bg-sh-bar-selected shadow-[inset_0_0_0_1px_var(--color-sh-accent)]"
						style={{ opacity: pressed }}
					/>
					<motion.span
						className="absolute inset-0 flex items-center justify-center text-sh-accent"
						style={{ opacity: pressed }}
					>
						{icon}
					</motion.span>
				</>
			)}
			{flash && (
				<motion.span
					className="absolute inset-0 rounded-[5px] bg-sh-bar-hover"
					style={{ opacity: flash }}
				/>
			)}
		</span>
	);
}

/** The factory row one, in order (settings.rs DEFAULT_ROW). */
export function ToolbarRow1({
	pressed,
	flash,
}: {
	/** Selected-tool crossfade for the rectangle slot. */
	pressed?: MotionValue<number>;
	/** Copy-button press flash. */
	flash?: MotionValue<number>;
}) {
	return (
		<div className="flex h-[38px] items-center gap-[2px] rounded-lg border border-sh-bar-border bg-sh-bar px-[5px] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.2),0_2px_4px_-2px_rgb(0_0_0/0.15)]">
			<Grip />
			<ToolButton icon={<SelectIcon />} />
			<ToolButton icon={<RectIcon />} pressed={pressed} />
			<ToolButton icon={<EllipseIcon />} />
			<ToolButton icon={<LineIcon />} />
			<ToolButton icon={<PolylineIcon />} />
			<ToolButton icon={<ArrowIcon />} />
			<ToolButton icon={<NumberIcon />} />
			<ToolButton icon={<PencilIcon />} />
			<ToolButton icon={<HighlighterIcon />} />
			<ToolButton icon={<MosaicIcon />} />
			<ToolButton icon={<EraserIcon />} />
			<ToolButton icon={<TextIcon />} />
			<ToolButton icon={<TrashIcon />} />
			<Sep />
			<ToolButton icon={<OcrIcon />} />
			<ToolButton icon={<PinIcon />} />
			<ToolButton icon={<ScrollIcon />} />
			<ToolButton icon={<SaveIcon />} />
			<ToolButton icon={<CopyIcon />} flash={flash} />
			<Sep />
			<ToolButton icon={<SettingsIcon />} />
			<ToolButton icon={<XIcon />} />
			<Grip />
		</div>
	);
}

/** The annotation settings row (toolbar.rs options row): size slider +
 *  live readout | the factory swatch board, first swatch selected. */
export function ToolbarRow2({
	size = 3,
	sizeMin = 1,
	sizeMax = 20,
	selectedSwatch = 0,
}: {
	size?: number;
	sizeMin?: number;
	sizeMax?: number;
	selectedSwatch?: number;
}) {
	const pct = ((size - sizeMin) / (sizeMax - sizeMin)) * 100;
	return (
		<div className="flex h-[38px] items-center gap-[2px] rounded-lg border border-sh-bar-border bg-sh-bar px-[5px] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.2),0_2px_4px_-2px_rgb(0_0_0/0.15)]">
			{/* size_control(): 108px track, 4px, 12px thumb */}
			<span className="relative h-5 w-[108px] flex-none">
				<span className="absolute inset-y-2 inset-x-1.5 overflow-hidden rounded-full bg-sh-bar-border" />
				<span
					className="absolute inset-y-2 left-1.5 rounded-full bg-sh-accent"
					style={{ width: `calc((100% - 12px) * ${pct / 100})` }}
				/>
				<span
					className="absolute top-1 size-3 rounded-full border border-sh-bar bg-sh-bar-text"
					style={{ left: `calc(${pct}% - 6px)` }}
				/>
			</span>
			<span className="w-[26px] text-center text-xs text-sh-bar-text">{size}</span>
			<Sep />
			<span className="min-w-6 flex-1" />
			{SWATCHES.map((color, i) => (
				<span
					key={color}
					className="relative flex h-[30px] w-[28px] flex-none items-center justify-center rounded-[5px]"
					style={
						i === selectedSwatch
							? {
									background: 'var(--color-sh-bar-selected)',
									boxShadow: 'inset 0 0 0 1px var(--color-sh-accent)',
								}
							: undefined
					}
				>
					<span
						className="size-5 rounded-[4px] border border-white/22"
						style={{ background: color }}
					/>
				</span>
			))}
		</div>
	);
}
