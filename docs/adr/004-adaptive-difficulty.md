# ADR-004: Adaptive Difficulty System

**Status:** Proposed
**Date:** 2026-07-28
**Deciders:** Vettech Dental Probing Trainer development team

## Context

Students using the dental probing trainer have varying skill levels and learning paces. Training should adapt to individual student capabilities — providing easier scenarios for beginners and progressively harder ones as skills improve — to maintain engagement and maximize learning outcomes.

## Decision

We will implement an **ELO-inspired scoring system with skill area tracking and threshold-based difficulty adjustment**.

- **ELO-inspired scoring:** Each student maintains a dynamic skill score (similar to chess ELO ratings) that adjusts based on performance in probing tasks.
- **Skill area tracking:** The system tracks performance across distinct skill areas (e.g., probe angulation, pressure control, measurement accuracy, quadrants).
- **Threshold-based difficulty adjustment:** When a student's score in a skill area exceeds a defined threshold, the system automatically advances them to the next difficulty level; scores falling below a threshold trigger regression to easier scenarios.

## Consequences

### Positive
- Personalized learning path — each student progresses at their own pace through targeted skill development
- Transparent to students — they can see their scores and understand why difficulty changes occur
- Simpler to implement and maintain than ML-based adaptive systems
- Deterministic and auditable — difficulty decisions can be traced back to specific scores and thresholds
- Skill area granularity allows the system to challenge a student in weak areas while maintaining difficulty in strong ones

### Negative
- Requires calibration data to set appropriate initial difficulty and threshold values for each skill area
- ELO-inspired scoring may not capture all aspects of dental probing competence (e.g., soft skills like patient communication)
- Threshold tuning requires ongoing iteration based on real student performance data

### Risks
- Poorly calibrated thresholds could frustrate students with sudden difficulty spikes or bore them with slow progression
- ELO scores may converge too quickly for students with prior dental experience, making the system less adaptive over time
- No existing published benchmarks for ELO-based dental training — threshold values must be derived from empirical testing
