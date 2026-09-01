---
title: "ChainBreaker 0.0.1: Break the Chains. Build the Man."
description: "The first public Android release of ChainBreaker turns a private daily rule of life into one local-first loop: pray, read, act, train, reflect, and repeat."
date: "2026-09-01"
category: "Development Journal"
tags:
  - ChainBreaker
  - Android
  - Faith-Based Apps
  - KJV
  - Local-First
featured: false
published: true
coverImage: "/projects/chainbreaker-banner.png"
coverAlt: "ChainBreaker banner artwork showing two hands breaking a chain before a glowing cross"
---

ChainBreaker begins with a simple promise: **break the chains, build the man**. Version **0.0.1** is the first public Android release, and it is intentionally a focused vertical slice rather than a finished social platform. The app is a private daily rule of life built around one repeatable loop: pray, read, act, train, reflect, and repeat.

## One daily operating screen

Home is the place to begin each day. It brings the current chain count, a KJV verse, a short devotion, prayer, the day’s practical mission, the next Foundation workout, the primary battle, and a continue-reading entry into one view. Completion is stored locally and remains idempotent, so tapping a completed action again does not create duplicate progress.

The vocabulary is deliberate. Goals are missions. Habits are disciplines. Streaks are chains. Progress is growth. The profile is My Journey. These words keep the interface connected to the work the app is trying to support: faithful action repeated over time.

## Scripture stays central

The Word section bundles public-domain KJV Scripture from the local `scripture` folder. Readers can choose a book and chapter, move between chapters, search the bundled text, bookmark a verse, apply a highlight, and keep a private note. Reading progress is stored on the device, and Red Letter Mode filters the bundled verse-level speech metadata for the recorded words of Jesus.

The app does not ship a modern licensed translation or audio Bible in this release. Those features remain separate content and licensing decisions. The first release keeps the source boundary visible and keeps Scripture available without a network connection.

## Private battles without public performance

Battles are personal chains, not a public score. The release seeds the common choices a man may want to work against, including pornography, lust, alcohol, anger, fear, procrastination, gambling, isolation, nicotine, and unforgiveness. Each battle has a local start date, chain-day calculation, check-in history, primary-battle selection, and private notes that do not require a user to describe sensitive details.

The **I’m struggling** action is a short interruption flow: leave the triggering environment, read the displayed Scripture, complete a breathing and prayer step, choose a replacement action, and mark the intervention complete. It is not medical treatment or crisis care. When a situation is unsafe, the correct next step is trusted human or emergency help.

## Build the body for service

Build contains the first four-week Foundation plan with three sessions each week. The initial release includes movement prescriptions, completion controls, duration, session notes, workout history, and the virtue mapping that connects the day’s physical work to discipline, courage, endurance, responsibility, strength, brotherhood, or rest and worship.

The plan is intentionally modest. Nutrition calculation, advanced programs, rucking, HIIT, and wearable integrations are outside this first release. The purpose of Foundation is to make the next faithful session clear and achievable.

## Brotherhood is bundled editorial content

Brotherhood is an offline editorial library rather than a social feed. Its eight seed entries cover marriage and women, fatherhood, purpose and career, money, sexual discipline, mental strength, faith, and culture. Each article follows the same four-part structure: **The Issue**, **Biblical Perspective**, **Practical Solution**, and **Challenge**.

There are no accounts, posts, comments, likes, followers, or remote content calls in `0.0.1`. The app is meant to give a man a private place to read and act before it gives him another place to perform.

## Local by design

ChainBreaker uses a typed repository boundary with SQLite on Android and an in-memory implementation for tests. Bundled content remains separate from private user state. The current release needs no account, cloud backend, sync service, or network session to complete its daily loop.

That architecture leaves room for a future sync adapter without forcing a future account system into the first release. For now, the local device is the boundary: personal progress, battle check-ins, notes, highlights, bookmarks, and workout history stay there. My Journey includes the reset and delete-local-data action for starting over deliberately.

## What was verified

The `0.0.1` release was built from the Capacitor Android project with the Gradle wrapper and signed with a dedicated local release key. The APK was installed on a connected Samsung SM-G781W and used to capture the onboarding screen, Home, Word, Brotherhood, Build, My Journey, Brotherhood article detail, and Battle detail surfaces.

The public release is available as a direct Android APK through the [ChainBreaker GitHub repository](https://github.com/mcographics/ChainBreakerApp). This is an early public build, so the release notes keep the scope honest: the first job is to make the daily loop dependable, private, and worth returning to.

Break the chains. Build the man.
