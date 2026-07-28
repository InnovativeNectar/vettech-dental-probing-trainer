# ADR-007: xAPI and LMS Integration

**Status:** Proposed
**Date:** 2026-07-28
**Deciders:** Vettech Dental Probing Trainer development team

## Context

The dental probing trainer must integrate with Learning Management Systems (LMS) used by dental schools and training programs. We need standardized learning analytics to track student progress, assessment results, and training effectiveness — enabling instructors to monitor cohorts and institutions to evaluate program outcomes.

## Decision

We will implement **xAPI (Experience API) statements sent to an LRS, LTI 1.3 for LMS integration, and SCORM package export**.

- **xAPI (Experience API):** Standard protocol for sending structured learning activity statements (e.g., "Student completed probing exercise on tooth #14 with 85% accuracy") to a Learning Record Store (LRS).
- **LTI 1.3 (Learning Tools Interoperability):** Standard protocol for embedding the training application within an LMS (Canvas, Blackboard, Moodle, etc.) with secure single sign-on and grade passback.
- **SCORM package export:** Ability to export training modules as SCORM packages for LMS platforms that do not support LTI, ensuring broad compatibility.

## Consequences

### Positive
- Industry standard for learning analytics — xAPI is widely adopted across educational technology platforms
- LTI 1.3 provides secure, standardized LMS integration with automatic user provisioning and grade passback
- SCORM export ensures compatibility with older LMS platforms that lack LTI support
- Rich analytics data enables instructors to identify struggling students and curriculum gaps
- xAPI statements are granular — every probing action, measurement, and assessment can be tracked

### Negative
- Adds significant integration complexity to the application architecture
- LRS (Learning Record Store) is required for xAPI statement storage — an additional infrastructure dependency
- LTI 1.3 requires OAuth 2.0 and JSON Web Token (JWT) handling, increasing security implementation burden
- SCORM package export requires adherence to the SCORM runtime environment specification, which constrains the application's execution model

### Risks
- LRS hosting adds operational cost and complexity (options: Learning Locker, Wax LRS, or custom implementation)
- LTI 1.3 certification process may be required by some LMS platforms before the integration is approved
- xAPI statement volume can grow rapidly with fine-grained tracking, requiring LRS scaling strategies
- SCORM packages are inherently limited — complex 3D interactions may not map cleanly to SCORM's data model
- Standards evolve — xAPI and LTI specifications may introduce breaking changes in future versions
