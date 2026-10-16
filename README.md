# CuroVex: Explainable AI for Drug Discovery Research

## Overview

CuroVex is a research prototype for exploring drug-disease relationships,
symptom overlap, and graph-based explanations. Symptom matching compares user
entries with the associations in the local condition catalog; it does not
diagnose conditions or establish that two conditions have the same cause.

Ranked candidates, graph explanations, and evidence links are available only
where the research dataset contains them. Computational scores and symptom
similarity are hypotheses for further investigation, not evidence of clinical
efficacy or medical advice.

## Account interface

The sign-in, sign-up, and settings screens are interface previews only. There
is no authentication server, institutional access control, or account recovery.
Passwords are not saved or verified; only a local profile is stored in the
browser. Do not enter real credentials, protected health information, or
confidential research data.

## Installation & Startup

1. Ensure Node.js 18 or later is installed.
2. Navigate to the project directory.
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## PWA Installation

In Chrome or Edge, use the Install icon in the address bar, or choose
**Install CuroVex** from the browser menu.
