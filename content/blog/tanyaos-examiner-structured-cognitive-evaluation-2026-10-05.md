---
title: "TanyaOS Examiner: A Structured, Inspectable Evaluation Prototype"
description: "The first TanyaOS Examiner workflow brings seeded tasks, separate server-side scoring, confidence tracking, and per-run reports to a limited set of qualified domains."
date: "2026-10-05"
category: "Research Project"
tags:
  - TanyaOS
  - Cognitive Evaluation
  - Local-First
  - Research
  - Development
coverImage: "/projects/tanyaos-identity-2026.png"
coverAlt: "TanyaOS identity concept artwork in luminous blue neural filaments"
bannerImage: "/projects/tanyaos-identity-2026.png"
bannerAlt: "Concept artwork for the TanyaOS local cognitive research project"
featured: false
archiveOrder: 1
published: true
---

TanyaOS now has an **Examiner** workflow for running structured tasks against its local cognitive runtime and keeping an inspectable record of what happened. It lives in the AI Core system view and treats each run as a bounded experiment, with generated questions, independent scoring, confidence reports, and recorded runtime context.

This is an early software evaluation prototype. Its purpose is to make specific task results easier to examine and reproduce, not to assign Tanya a general intelligence score.

## A small, qualified starting bank

The current question generators cover six domains: arithmetic, algebra, grammar and vocabulary, formal logic, pattern recognition, and uncertainty recognition. Quick tests, subject examinations, a cognitive battery, and the full enabled bank draw only from those qualified items. The dashboard keeps other planned domains visible as untested; an unavailable or unqualified domain is not silently counted as a failure.

Each run records a seed and the selected bank version. The backend keeps expected answers and scoring data separate from the question shown in the interface and the prompt sent through Tanya’s normal local chat runtime. A response is scored on the server against that item’s rubric, with response time and reported confidence included in the trial record.

## A record that can be reviewed

The Examiner can pause and resume a run, preserve it if the backend restarts, stop it, or emergency-abort while retaining committed answers. Per-run reports include the questions, responses, independent scores, confidence measurements, runtime provenance, and a hash-linked event history. Corrections and Tanya’s later self-report are appended separately; neither can rewrite an already committed answer or score.

The provenance record can include the configured language-model status, cognitive-engine state, memory summary, and available host and GPU samples. If a source is unavailable, the report records that gap instead of filling it with an estimate.

## What the results mean—and do not mean

Only the **Full TanyaOS** condition is currently available. Memory-isolated, closed-book, tool-assisted, constrained, learning, retention, and stress conditions remain unavailable because their controls or measurement protocols are not ready. The response travels through the frontend to the scoring endpoint; this capture path is not cryptographically attested.

The generated objective items and simple rubrics form a working prototype, not a validated psychometric instrument. There are no human norm tables, universal intelligence score, qualified long-term memory assessment, or validated stress protocol. A result describes Tanya’s recorded performance on those items in that run and condition. It does not establish broad ability, consciousness, or sentience.

The next step is to exercise the workflow against the full local runtime, improve coverage only when an independent item bank and enforceable conditions are ready, and keep each conclusion tied to its evidence.
