---
title: "Installing Work Day with God on Windows and Linux"
description: "A practical guide to installing the current Work Day with God desktop releases while preserving a private, local reading experience."
date: "2026-08-27"
category: "Guides"
tags:
  - Work Day with God
  - Windows
  - Linux
  - Installation
coverImage: "/projects/work-day-with-god.png"
coverAlt: "Work Day with God devotional application"
featured: false
published: true
---

Work Day with God is available for Windows and Linux desktop users, with separate release tracks for each platform. The current Windows release is 1.4.4 stable. The current Linux release is 1.4.4 as a testing preview.

On Windows, download `Work-Day-with-God-Setup-1.4.4.exe` from the [Windows GitHub release](https://github.com/mcographics/WorkDaywithGod/releases/tag/v1.4.4). The installer is unsigned, so Windows may display an Unknown Publisher warning. Before running it, confirm that the file came from the official release and compare its SHA-256 checksum with the value published for the release.

On Linux, choose the package that matches the distribution. The AppImage is portable and can be made executable with `chmod +x`. Debian, Ubuntu, and Linux Mint users can install the DEB package with `sudo apt install ./package.deb`. Fedora, openSUSE, and related systems can use the RPM package with `sudo dnf install ./package.rpm`. The [Linux testing preview](https://github.com/mcographics/WorkDaywithGod/releases/tag/v1.4.4-linux-beta.1) contains all three formats.

The Linux packages are unsigned as well. That is not a reason to ignore a warning; it is a reason to verify the source carefully. Use the official GitHub release page, compare checksums, and stop if the downloaded file does not match.

Once installed, the app keeps settings, favourites, history, reading positions, and reminders locally. Closing the desktop window may hide it in the system tray so reminders can continue. To stop it completely on Windows or Linux, use the tray menu and choose Quit.

The installation process is part of the product's trust boundary. Clear instructions, honest release labels, and verifiable downloads matter just as much as the interface that appears after installation.
