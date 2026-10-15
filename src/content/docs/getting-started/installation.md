---
title: Installation
description: Install Shotori from crates.io, the AUR, or GitHub Releases, and bind it to a key.
---

## Requirements

- A wlroots-adjacent Wayland compositor (niri, sway, Hyprland, …)
- `xdg-desktop-portal` for the save dialog (installed by default on most
  desktops)
- A notification daemon (dunst, mako, swaync, …) is optional

## Install

```bash
cargo install shotori        # crates.io
paru -S shotori              # AUR (prebuilt binary)
```

Or grab a binary from
[GitHub Releases](https://github.com/shotori-screenshot/shotori/releases).

### Desktop entry and icon

For a launcher entry and desktop icon, run the following from the source tree
or an extracted release archive, after putting `shotori` on your desktop's
PATH:

```bash
sh scripts/install-desktop.sh   # installs to ~/.local/share; no root needed
```

Packagers can use `DESTDIR="$pkgdir" sh scripts/install-desktop.sh /usr`.
Tray and notification icons are embedded and work without this installation;
AUR packages install the desktop resources automatically.

## Bind it to a key

For example, in niri:

```kdl
Mod+Shift+S { spawn "shotori"; }
```

`shotori tray` stays resident with a tray icon (StatusNotifierItem; works with
waybar, KDE Plasma, and the GNOME appindicator extension).

## Usage

Run `shotori` (or `shotori gui`): every screen freezes, drag out a selection,
and pick an action from the toolbar that appears below it — copy, save, OCR,
pin, or long screenshot.
