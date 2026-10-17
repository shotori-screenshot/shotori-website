// The hero's frozen desktop — a live, draggable selection over a mock niri
// session. This is the one bold, interactive element on the page: landing
// visitors get the actual gesture the app is built around (drag a region,
// watch the toolbar follow) before they install anything.
//
// The desktop is authored at 1280 × 800 and scaled to cover the stage, so the
// artwork and window chrome keep their proportions at every viewport. The
// selection chrome, dimension readout and toolbar are rendered in stage
// coordinates, unscaled, so they stay crisp at phone widths too.
//
// Freeze-safety: the initial state is a complete-looking selection with its
// toolbar already visible. There are no opacity-0 entrances; every frame of a
// drag is a valid capture state. Touch devices don't start a drag (that would
// hijack scrolling) — they get the same composed still.

import { useEffect, useRef, useState } from 'react';
import wallpaper from '../../assets/shot-detail.webp';
import {
	CopyIcon,
	OcrIcon,
	PinIcon,
	SaveIcon,
	ScrollIcon,
	XIcon,
} from './chrome/icons';
import { ToolbarRow1, TOOLBAR_NATURAL_W } from './chrome/toolbar';

type Rect = { x: number; y: number; w: number; h: number };

const WIDE: Rect = { x: 0.56, y: 0.13, w: 0.4, h: 0.64 };
const NARROW: Rect = { x: 0.07, y: 0.13, w: 0.74, h: 0.54 };
const MIN_W = 0.06;
const MIN_H = 0.07;

const clamp = (v: number, lo: number, hi: number) =>
	Math.min(hi, Math.max(lo, v));

// The hero switches from an overlay (copy left, capture right) to a stacked
// layout at 72rem; keep the default crop on the right only in the overlay.
function initialRect(width: number): Rect {
	return width > 1152 ? WIDE : NARROW;
}

const CODE: Array<Array<[string, string]>> = [
	[
		['c', 'pub fn '],
		['n', 'fold'],
		['p', '(&mut self, frame: Frame) -> Fold {'],
	],
	[
		['c', '    let '],
		['p', 'row'],
		['p', ' = self.matcher.align(frame);'],
	],
	[
		['c', '    match '],
		['p', 'row'],
		['p', ' {'],
	],
	[
		['c', '        Some'],
		['p', '(row) => self.push(row),'],
	],
	[
		['c', '        None'],
		['p', ' => Fold::Refused(NoOverlap),'],
	],
	[
		['p', '    }'],
	],
	[['p', '}']],
];

const CODE_COLOR: Record<string, string> = {
	c: 'text-[#c792ea]',
	n: 'text-[#82aaff]',
	p: 'text-white/60',
};

/** The wallpaper, windows and status bits — the "screen" being captured. */
function DesktopScene({ w, h }: { w: number; h: number }) {
	const scale = w && h ? Math.max(w / 1280, h / 800) : 1;
	return (
		<div className="absolute inset-0 overflow-hidden bg-[#07090c]">
			<div
				className="absolute top-1/2 left-1/2"
				style={{
					width: 1280,
					height: 800,
					transform: `translate(-50%, -50%) scale(${scale})`,
				}}
			>
				<img
					src={wallpaper.src}
					alt=""
					draggable={false}
					className="absolute inset-0 h-full w-full -scale-x-100 object-cover saturate-[1.06]"
					loading="eager"
					decoding="async"
				/>
				{/* keep the windows legible over a busy illustration */}
				<div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(6_8_11/0.34),rgb(6_8_11/0.06)_42%,rgb(6_8_11/0.52))]" />
				<div className="landing-grid-bg absolute inset-0 opacity-20" />

				{/* terminal */}
				<div className="absolute top-[16%] left-[3.5%] w-[33%] overflow-hidden rounded-[10px] border border-white/14 bg-[#0a0c11]/93 shadow-[0_18px_50px_rgb(0_0_0/0.55)] backdrop-blur-[2px]">
					<div className="flex h-8 items-center gap-1.5 border-b border-white/8 px-3">
						<i className="size-2 rounded-full bg-[#ff5f57]" />
						<i className="size-2 rounded-full bg-[#febc2e]" />
						<i className="size-2 rounded-full bg-[#28c840]" />
						<span className="ml-2 font-mono text-[10px] text-white/45">
							~/src/shotori
						</span>
					</div>
					<div className="space-y-[3px] p-3 font-mono text-[11px] leading-[1.55]">
						<div>
							<span className="text-[#6fd6c9]">➜</span>{' '}
							<span className="text-[#ffb98d]">~/src/shotori</span>{' '}
							<span className="text-white/35">main*</span>
						</div>
						<div className="text-white/80">$ cargo run --release</div>
						<div className="text-white/38">Compiling shotori v0.4.0</div>
						<div className="text-white/38">Finished release in 12.4s</div>
						<div className="text-white/80">$ shotori</div>
						<div className="text-[#6fd6c9]">frozen · 2880×1620</div>
					</div>
				</div>

				{/* editor */}
				<div className="absolute top-[11%] right-[5%] w-[34%] overflow-hidden rounded-[10px] border border-white/18 bg-[#0a0c11]/72 shadow-[0_18px_50px_rgb(0_0_0/0.55)] backdrop-blur-md">
					<div className="flex h-8 items-center gap-1 border-b border-white/8 bg-white/3 px-2">
						<span className="rounded-[4px] bg-white/8 px-2 py-[3px] font-mono text-[10px] text-white/72">
							scroll_sheet.rs
						</span>
						<span className="px-2 font-mono text-[10px] text-white/30">
							selection.rs
						</span>
					</div>
					<div className="space-y-[1px] p-3 font-mono text-[10.5px] leading-[1.7]">
						{CODE.map((line, i) => (
							<div key={i} className="whitespace-pre">
								<span className="mr-3 inline-block w-4 text-right text-white/20">
									{118 + i}
								</span>
								{line.map(([kind, text], j) => (
									<span key={j} className={CODE_COLOR[kind]}>
										{text}
									</span>
								))}
							</div>
						))}
					</div>
				</div>

				{/* a bright page under the editor — the crop gets a colour jolt */}
				<div className="absolute right-[5%] bottom-[30%] w-[36%] overflow-hidden rounded-[9px] border border-white/16 bg-[#efe9df] shadow-[0_18px_50px_rgb(0_0_0/0.5)]">
					<div className="flex h-7 items-center gap-1.5 border-b border-black/10 bg-[#e3ddd2] px-2.5">
						<i className="size-1.5 rounded-full bg-black/20" />
						<i className="size-1.5 rounded-full bg-black/20" />
						<span className="ml-2 flex-1 rounded-[3px] bg-white/65 px-2 py-[2px] font-mono text-[8px] text-black/40">
							docs.shotori.dev/long-capture
						</span>
					</div>
					<div className="p-3">
						<div className="font-display text-[15px] leading-none font-semibold text-[#241f18]">
							Long capture
						</div>
						<p className="mt-1.5 text-[9px] leading-[1.55] text-black/55">
							Frame the part that scrolls, then scroll it yourself. The
							long image grows beside the page.
						</p>
						<div className="mt-2 rounded-[4px] bg-[#17181d] p-2 font-mono text-[8px] leading-[1.7] text-[#d8d4cc]">
							<div>
								<span className="text-[#ffb98d]">let</span> frame =
								capture.region();
							</div>
							<div>
								<span className="text-[#ffb98d]">while</span> scrolls{' '}
								{'{'} sheet.fold(frame); {'}'}
							</div>
						</div>
					</div>
				</div>

				{/* desktop furniture, only visible outside the crop */}
				<div className="absolute bottom-[6%] left-[5%] flex items-center gap-2 rounded-lg border border-white/12 bg-[#0a0c11]/70 px-2.5 py-1.5 font-mono text-[10px] text-white/45 backdrop-blur-sm">
					<i className="size-1.5 rounded-full bg-[#6fd6c9]" />
					<span>shotori tray</span>
					<span className="text-white/20">·</span>
					<span>4 workspaces</span>
				</div>
			</div>
		</div>
	);
}

/** Compact toolbar for phone-width stages: only the five actions + close,
 *  at their native 30px button size. */
function CompactToolbar() {
	const item =
		'flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[5px] text-sh-bar-text';
	return (
		<div className="flex h-[38px] items-center gap-[2px] rounded-lg border border-sh-bar-border bg-sh-bar px-[5px] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.2)]">
			<span className={item}><OcrIcon /></span>
			<span className={item}><PinIcon /></span>
			<span className={item}><ScrollIcon /></span>
			<span className={item}><SaveIcon /></span>
			<span className={item}><CopyIcon /></span>
			<span className="mx-1 h-[18px] w-px flex-none bg-sh-bar-border" />
			<span className={item}><XIcon /></span>
		</div>
	);
}

export default function CaptureStage() {
	const stageRef = useRef<HTMLDivElement>(null);
	const touchedRef = useRef(false);
	const dragRef = useRef<{ sx: number; sy: number } | null>(null);

	const [size, setSize] = useState({ w: 1440, h: 800 });
	const [rect, setRect] = useState<Rect>(WIDE);
	const [dragging, setDragging] = useState(false);
	const [touched, setTouched] = useState(false);

	const W = size.w;
	const H = size.h;

	useEffect(() => {
		const el = stageRef.current;
		if (!el) return;
		const ro = new ResizeObserver(([entry]) => {
			const { width, height } = entry.contentRect;
			setSize({ w: width, h: height });
			if (!touchedRef.current) setRect(initialRect(width));
		});
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	const toLocal = (e: React.PointerEvent) => {
		const b = e.currentTarget.getBoundingClientRect();
		return {
			x: clamp((e.clientX - b.left) / b.width, 0, 1),
			y: clamp((e.clientY - b.top) / b.height, 0, 1),
		};
	};

	const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		if (e.pointerType !== 'mouse' || e.button !== 0) return;
		const p = toLocal(e);
		dragRef.current = { sx: p.x, sy: p.y };
		touchedRef.current = true;
		setTouched(true);
		setDragging(true);
		e.currentTarget.setPointerCapture(e.pointerId);
		setRect({ x: p.x, y: p.y, w: 0.001, h: 0.001 });
		e.preventDefault();
	};

	const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		const d = dragRef.current;
		if (!d) return;
		const p = toLocal(e);
		setRect({
			x: Math.min(d.sx, p.x),
			y: Math.min(d.sy, p.y),
			w: Math.abs(p.x - d.sx),
			h: Math.abs(p.y - d.sy),
		});
	};

	const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!dragRef.current) return;
		dragRef.current = null;
		setDragging(false);
		setRect((r) =>
			r.w < MIN_W || r.h < MIN_H
				? initialRect(stageRef.current?.clientWidth ?? 0)
				: r,
		);
		if (e.currentTarget.hasPointerCapture(e.pointerId)) {
			e.currentTarget.releasePointerCapture(e.pointerId);
		}
	};

	// geometry in stage pixels
	const sel = {
		left: rect.x * W,
		top: rect.y * H,
		width: rect.w * W,
		height: rect.h * H,
	};
	const dims = `${Math.max(1, Math.round(sel.width))} × ${Math.max(1, Math.round(sel.height))}`;

	const tbScale = W >= 640 ? clamp(W * 0.00061, 0.62, 0.88) : 1;
	const tbW = (W >= 640 ? TOOLBAR_NATURAL_W : 214) * tbScale;
	const tbH = 38 * tbScale;
	const below = sel.top + sel.height + 10;
	const tbTop =
		below + tbH + 10 <= H ? below : Math.max(10, sel.top - tbH - 10);
	const tbLeft = clamp(
		sel.left + sel.width / 2 - tbW / 2,
		10,
		Math.max(10, W - tbW - 10),
	);

	const handles: ReadonlyArray<readonly [number, number]> = [
		[0, 0],
		[0.5, 0],
		[1, 0],
		[0, 0.5],
		[1, 0.5],
		[0, 1],
		[0.5, 1],
		[1, 1],
	];

	return (
		<div
			ref={stageRef}
			aria-hidden="true"
			className="relative h-full w-full cursor-crosshair overflow-hidden select-none"
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={endDrag}
			onPointerCancel={endDrag}
			onContextMenu={(e) => e.preventDefault()}
		>
			<DesktopScene w={W} h={H} />

			{/* the crop: a transparent rectangle casting a 9999px dim over
			    everything outside it, so there are no seams */}
			<div
				className="absolute z-20"
				style={{
					left: sel.left,
					top: sel.top,
					width: sel.width,
					height: sel.height,
					boxShadow: '0 0 0 9999px rgb(0 0 0 / 0.55)',
				}}
			>
				<div className="pointer-events-none absolute inset-0 border border-sh-accent shadow-[0_0_24px_rgb(255_106_0/0.28)]" />

				{/* live size readout */}
				<div className="pointer-events-none absolute top-[-30px] left-0 rounded-[4px] bg-sh-accent px-2 py-[3px] font-mono text-[11px] leading-[1.25] font-semibold whitespace-nowrap text-black">
					{dims}
				</div>

				{/* resize handles */}
				{handles.map(([hx, hy]) => (
					<i
						key={`${hx}-${hy}`}
						className="pointer-events-none absolute size-[7px] rounded-full bg-sh-accent shadow-[0_0_0_1px_rgb(0_0_0/0.35)]"
						style={{
							left: `${hx * 100}%`,
							top: `${hy * 100}%`,
							transform: 'translate(-50%, -50%)',
						}}
					/>
				))}

				{/* the cursor corner while dragging */}
				{dragging && (
					<svg
						className="pointer-events-none absolute top-full left-full size-[15px] -translate-x-1/2 -translate-y-1/2 text-sh-accent"
						viewBox="0 0 16 16"
						fill="none"
					>
						<path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.4" />
					</svg>
				)}
			</div>

			{/* the toolbar, anchored below the crop and clamped to the stage */}
			<div
				className="pointer-events-none absolute z-30 origin-top-left"
				style={{ left: tbLeft, top: tbTop, transform: `scale(${tbScale})` }}
			>
				{W >= 640 ? <ToolbarRow1 /> : <CompactToolbar />}
			</div>

			{/* invitation — pointer users only; touch doesn't drag */}
			{!touched && (
				<div className="pointer-events-none absolute top-4 right-4 z-40 hidden items-center gap-2 rounded-full border border-white/18 bg-black/45 px-3 py-1.5 font-mono text-[11px] text-white/80 backdrop-blur-md md:flex">
					<svg
						viewBox="0 0 16 16"
						fill="none"
						className="size-3.5 text-sh-accent"
						aria-hidden="true"
					>
						<path
							d="M8 1v4M8 11v4M1 8h4M11 8h4"
							stroke="currentColor"
							strokeWidth="1.5"
						/>
						<circle cx="8" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.2" />
					</svg>
					Drag to select
				</div>
			)}
		</div>
	);
}
