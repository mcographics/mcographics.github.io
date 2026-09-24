---
title: "Netrunner-Launcher: Matrix Notifications and Dashboard Refinements"
description: "A Build 410 dashboard update adds a falling Matrix-style notification reveal, roomier notification rows, a segmented storage gauge, and a briefly revealed then redacted network address."
date: "2026-09-24"
category: "Development Journal"
tags:
  - Netrunner-Launcher
  - Android
  - Kotlin
  - Re:TUI
  - Cyberpunk UI
  - Notifications
coverImage: "/projects/netrunner-launcher-banner-v1.png"
coverAlt: "Red and black Netrunner-Launcher cyberpunk terminal banner"
featured: false
published: true
---

Netrunner-Launcher keeps the familiar red terminal dashboard, but a few focused changes make its status panel and notifications feel more intentional. This update builds on Build 410's storage gauge and battery activity bar, adding a short Matrix-style entrance for notification text and a glitch treatment for the network address.

## Notifications assemble as they fall

Notification rows no longer appear all at once. In the regular dashboard view, each row drops into place while green Matrix-like glyphs cycle through its unrevealed characters. The glyphs resolve into the actual notification text, and the existing row tap still opens its notification. Up to three rows are shown at once; the compact keyboard layout keeps two. The regular rows retain the wider spacing requested for the tray.

The transition runs briefly when rows are rendered. The compact keyboard layout skips the animation so its tighter space stays readable.

## A quick network reveal, then redaction

The system monitor briefly shows the current IP address, then runs through several glitch masks and returns to **REDACTED**. The clear address is visible for 300 milliseconds. This is a visual effect, not a privacy boundary: anyone who captures the screen during that short window could still read the address.

## The dashboard's device readings

The circular storage gauge uses fifty segments around the ring, each representing two percentage points, to show used and free internal storage. The word **STORAGE** sits at the bottom of the circle. The battery remains aligned with the other monitor bars and shows its activity bar without adding a percentage label.

Together, the gauge and the monitor keep device readings in the open area beside the text rows without crowding the red terminal layout.

## Source and verification

These source changes are pushed to the public [Netrunner-Launcher repository](https://github.com/mcographics/Netrunner-Launcher) in commit [`0e9f795`](https://github.com/mcographics/Netrunner-Launcher/commit/0e9f795). The F-Droid debug variant built successfully and was installed on a connected Samsung Galaxy S20 FE for launch verification. This confirms the source build and install; it is not a separate signed production APK release.

Netrunner-Launcher remains Kenneth Salmon's customized fork of [DvilSpawn's Re:TUI](https://github.com/DvilSpawn/Re-TUI), which continues Francesco Andreuzzi's original T-UI Console Launcher. The upstream history, MIT license, and developer attribution remain intact.
