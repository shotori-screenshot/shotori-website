// The toolbar's icon set, verbatim from the app (ui/toolbar.rs BUTTONS):
// the bundled Lucide glyphs at their exact 24×24 paths, plus shotori's own
// icons (assets/icons/*.svg — select, pin, scroll, mosaic) copied as-is.
// All render at 18px with the toolbar-text color, like `ButtonIcon::svg()`.

import type { ReactNode } from 'react';

type IconProps = {
	className?: string;
	size?: number;
};

function Svg({ className, size = 18, children }: IconProps & { children: ReactNode }) {
	return (
		<svg
			className={className}
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			{children}
		</svg>
	);
}

// shotori's own select.svg — Lucide "mouse-pointer" verbatim.
export const SelectIcon = (p: IconProps) => (
	<Svg {...p}>
		<path d="M12.586 12.586 19 19" />
		<path d="M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z" />
	</Svg>
);

export const RectIcon = (p: IconProps) => (
	<Svg {...p}>
		<rect width="18" height="18" x="3" y="3" rx="2" />
	</Svg>
);

export const EllipseIcon = (p: IconProps) => (
	<Svg {...p}>
		<circle cx="12" cy="12" r="10" />
	</Svg>
);

export const LineIcon = (p: IconProps) => (
	<Svg {...p}>
		<path d="M22 2 2 22" />
	</Svg>
);

export const PolylineIcon = (p: IconProps) => (
	<Svg {...p}>
		<circle cx="12" cy="4.5" r="2.5" />
		<path d="m10.2 6.3-3.9 3.9" />
		<circle cx="4.5" cy="12" r="2.5" />
		<path d="M7 12h10" />
		<circle cx="19.5" cy="12" r="2.5" />
		<path d="m13.8 17.7 3.9-3.9" />
		<circle cx="12" cy="19.5" r="2.5" />
	</Svg>
);

export const ArrowIcon = (p: IconProps) => (
	<Svg {...p}>
		<path d="M7 7h10v10" />
		<path d="M7 17 17 7" />
	</Svg>
);

export const NumberIcon = (p: IconProps) => (
	<Svg {...p}>
		<path d="M11 5h10" />
		<path d="M11 12h10" />
		<path d="M11 19h10" />
		<path d="M4 4h1v5" />
		<path d="M4 9h2" />
		<path d="M6.5 20H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02" />
	</Svg>
);

export const PencilIcon = (p: IconProps) => (
	<Svg {...p}>
		<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
		<path d="m15 5 4 4" />
	</Svg>
);

export const HighlighterIcon = (p: IconProps) => (
	<Svg {...p}>
		<path d="m9 11-6 6v3h9l3-3" />
		<path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" />
	</Svg>
);

// shotori's own mosaic.svg — filled quincunx cells, not a stroke glyph.
export const MosaicIcon = ({ className, size = 18 }: IconProps) => (
	<svg
		className={className}
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="currentColor"
		aria-hidden="true"
	>
		<rect x="3" y="3" width="5" height="5" rx="1" />
		<rect x="16" y="3" width="5" height="5" rx="1" />
		<rect x="9.5" y="9.5" width="5" height="5" rx="1" />
		<rect x="3" y="16" width="5" height="5" rx="1" />
		<rect x="16" y="16" width="5" height="5" rx="1" />
	</svg>
);

export const EraserIcon = (p: IconProps) => (
	<Svg {...p}>
		<path d="M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21" />
		<path d="m5.082 11.09 8.828 8.828" />
	</Svg>
);

export const TextIcon = (p: IconProps) => (
	<Svg {...p}>
		<path d="M12 4v16" />
		<path d="M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2" />
		<path d="M9 20h6" />
	</Svg>
);

export const TrashIcon = (p: IconProps) => (
	<Svg {...p}>
		<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
		<path d="M3 6h18" />
		<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
	</Svg>
);

export const OcrIcon = (p: IconProps) => (
	<Svg {...p}>
		<path d="M3 7V5a2 2 0 0 1 2-2h2" />
		<path d="M17 3h2a2 2 0 0 1 2 2v2" />
		<path d="M21 17v2a2 2 0 0 1-2 2h-2" />
		<path d="M7 21H5a2 2 0 0 1-2-2v-2" />
		<path d="M7 8h8" />
		<path d="M7 12h10" />
		<path d="M7 16h6" />
	</Svg>
);

// shotori's own pin.svg.
export const PinIcon = (p: IconProps) => (
	<Svg {...p}>
		<path d="M12 17v5" />
		<path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
	</Svg>
);

// shotori's own scroll.svg.
export const ScrollIcon = (p: IconProps) => (
	<Svg {...p}>
		<path d="M7 3h10a2 2 0 0 1 2 2v2H5V5a2 2 0 0 1 2-2z" />
		<path d="M5 13v-2M19 13v-2" />
		<path d="M12 9v9" />
		<path d="m9 15 3 3 3-3" />
	</Svg>
);

export const SaveIcon = (p: IconProps) => (
	<Svg {...p}>
		<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
		<path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
		<path d="M7 3v4a1 1 0 0 0 1 1h7" />
	</Svg>
);

export const CopyIcon = (p: IconProps) => (
	<Svg {...p}>
		<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
		<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
	</Svg>
);

export const SettingsIcon = (p: IconProps) => (
	<Svg {...p}>
		<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
		<circle cx="12" cy="12" r="3" />
	</Svg>
);

export const XIcon = (p: IconProps) => (
	<Svg {...p}>
		<path d="M18 6 6 18" />
		<path d="m6 6 12 12" />
	</Svg>
);
