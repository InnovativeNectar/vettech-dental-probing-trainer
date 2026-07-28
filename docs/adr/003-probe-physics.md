# ADR-003: Probe Physics Simulation

**Status:** Proposed
**Date:** 2026-07-28
**Deciders:** Vettech Dental Probing Trainer development team

## Context

The periodontal probe needs realistic physics interaction with teeth and gums during simulation. Students must be able to insert the probe into the sulcus, apply appropriate pressure, and receive feedback on their technique. We need to balance physical realism with web performance and development complexity.

## Decision

We will use **custom raycasting with simplified collision detection** rather than a full physics engine.

- **Raycasting:** A ray will be cast from the probe tip in the direction of insertion to detect intersections with tooth and gum mesh surfaces.
- **Simplified collision detection:** Boundary checks using mesh geometry to determine whether the probe is within the sulcus, pressing against gum tissue, or contacting tooth surface.
- **No full physics engine:** We will not integrate Ammo.js, Cannon.js, or Rapier for rigid/soft body simulation.

## Consequences

### Positive
- Lightweight implementation with minimal performance overhead
- Fast development cycle — custom logic is simpler to debug and tune than a full physics engine
- Sufficient fidelity for educational simulation where exact physics accuracy is not critical
- Probe force feedback will be communicated through visual cues (tissue deformation, color changes) and audio cues (scratching sounds, warning tones)
- No additional ~1MB+ physics engine bundle cost

### Negative
- Less realistic than a full physics engine (Ammo.js/Cannon.js) — no soft body tissue deformation simulation
- Custom collision detection must be maintained and extended manually as new scenarios are added
- Edge cases in collision detection (probe between closely spaced teeth, angled insertion) require careful handling

### Risks
- Raycasting accuracy depends on mesh quality and density — low-poly models may produce inaccurate collision results
- Students accustomed to real-world probing may perceive the simulation as unrealistic if visual/audio feedback is not convincing
- Custom physics logic may become a maintenance burden as the number of tooth models and probing scenarios grows
