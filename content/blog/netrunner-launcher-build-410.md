---
title: "Netrunner-Launcher Build 410: Storage Gauge + Battery Monitor"
description: "Build 410 refines the red terminal Home dashboard with a circular storage-usage gauge and a live phone battery meter."
date: "2026-09-23"
category: "Release Notes"
tags:
  - Netrunner-Launcher
  - Android
  - Kotlin
  - Re:TUI
  - Cyberpunk UI
coverImage: "/projects/netrunner-launcher-banner-v1.png"
coverAlt: "Red and black Netrunner-Launcher cyberpunk terminal banner"
featured: false
published: true
---

**Netrunner-Launcher Build 410** is a small release with a very visible purpose: use the Home dashboard's space better and put two everyday device readings where they are actually useful.

The release keeps the red terminal layout introduced in Build 409, but moves storage out of the text stack and turns it into a circular meter in the open right side of the system monitor. The line that previously carried the storage numbers now reports the phone's battery level instead.

## Storage finally gets its own instrument

The Home dashboard already knew the phone's available and total internal storage through Android's `StatFs` API. Build 410 keeps that same underlying source but changes the presentation.

A new circular gauge now shows the percentage of internal storage currently used. The active portion of the ring uses the dashboard's existing system-monitor accent color, while the unused portion stays dimmer. The center of the gauge identifies the reading as storage and shows the used percentage at a glance.

The gauge is not pinned to an arbitrary screen coordinate. It looks for the live system-monitor text and aligns itself with the memory section, which helps it stay in the intended area if the rows above it move.

## The old storage row becomes the battery row

The former `STORAGE` text line is now a live `BATTERY` row. It shows the current phone battery percentage beside the same terminal-style activity meter already used for CPU, GPU, and RAM.

Battery percentage comes from Android's `ACTION_BATTERY_CHANGED` state rather than an estimated value, so the dashboard is showing the phone's reported power level.

The system monitor now reads more naturally as a quick status block: network, IP address, free memory, battery, CPU, GPU, RAM, and hardware identity on the left, with storage represented visually on the right.

## Everything else stays where it belongs

Build 410 keeps the parts of Build 409 that made the customized Home screen useful: compact weather, the 12-hour clock, live CPU/GPU/RAM monitoring, fixed quick apps, the wallpaper-only secondary Home page, launcher fullscreen handling, and the anchored notification tray with manual and automatic five-minute clearing.

The goal was not to redesign the launcher again. It was to fill an obvious empty space with useful information while reducing duplicated text.

## Build information

Build 410 uses Android version code **410** and version name **`2-storage-gauge-battery`**. The project continues to target API 36 with Android 6.0 / API 23 as the minimum supported version.

The source release and formatter test update are now in the public Netrunner-Launcher repository. A signed APK and physical-device verification are **not yet recorded for Build 410**, so this announcement does not present a binary as device-verified.

The technical release note is available in the repository under **Build 410 Storage Gauge + Battery Monitor**, alongside the preserved Build 409 dashboard documentation.

## Built on the work that came before

Netrunner-Launcher remains a customized fork of DvilSpawn's Re:TUI, which continues Francesco Andreuzzi's original T-UI Console Launcher. The upstream Git history, MIT license, and developer attribution remain part of the project.

Build 410 is another layer on top of that foundation: a more compact dashboard, a clearer read on the phone, and one less empty patch of screen staring back at me.
