# Architecture

CodePackr Study is a client-side educational application.

## UI

Reuse the existing design system and responsive component patterns. Do not introduce a parallel component or theme system when an existing one already solves the requirement.

## Data

Keep student inputs local to the browser unless a feature explicitly requires a remote service. Never silently send personal study data to third parties.

## Engineering

For source changes: lint, test where configured and production build.

For documentation-only changes: do not spend production deployment or build resources unnecessarily.
