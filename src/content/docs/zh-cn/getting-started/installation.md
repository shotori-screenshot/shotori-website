---
title: 安装
description: 从 crates.io、AUR 或 GitHub Releases 安装 Shotori，并绑定到键位。
---

## 环境要求

- wlroots 系 Wayland 合成器（niri、sway、Hyprland……）
- 保存对话框依赖 `xdg-desktop-portal`（绝大多数桌面发行版默认就有）
- 通知 daemon（dunst、mako、swaync……）可选

## 安装

```bash
cargo install shotori        # crates.io
paru -S shotori              # AUR（预编译二进制）
```

也可以从 [GitHub Releases](https://github.com/shotori-screenshot/shotori/releases)
直接下载二进制。

### 启动器入口与桌面图标

需要应用启动器入口和桌面图标时，先确保桌面环境的 PATH 中能找到
`shotori`，再在源码目录或解压后的发行包目录执行：

```bash
sh scripts/install-desktop.sh   # 安装到 ~/.local/share，无需 root
```

打包者可用 `DESTDIR="$pkgdir" sh scripts/install-desktop.sh /usr`。
托盘和通知图标已内嵌，不依赖这一步安装；AUR 包会自动安装桌面资源。

## 绑定到键位

比如在 niri 中：

```kdl
Mod+Shift+S { spawn "shotori"; }
```

`shotori tray` 常驻系统托盘（StatusNotifierItem；waybar、KDE Plasma、
GNOME appindicator 扩展均可用）。

## 使用

运行 `shotori`（或 `shotori gui`）：所有屏幕冻结，拖框选出区域，从选区
下方出现的工具栏里选择操作——复制、保存、OCR、贴图或长截图。
