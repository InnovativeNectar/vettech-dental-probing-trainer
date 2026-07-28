# ADR-005: 3D Asset Pipeline

**Status:** Accepted
**Date:** 2026-07-28
**Deciders:** Vettech Dental Probing Trainer development team

## Context

3D dental models need to be web-ready — small in file size, fast to load, and compatible with our Three.js/R3F rendering stack. We need a pipeline that supports both placeholder geometry during development and production-quality models for deployment.

## Decision

We will use **GLB/GLTF format with Draco compression, LOD management, and placeholder geometry for initial development**.

- **GLB/GLTF format:** Industry-standard 3D format with excellent Three.js support via GLTFLoader (available in Drei).
- **Draco compression:** Google's open-source mesh compression library to reduce GLB file sizes significantly (typically 80-90% reduction).
- **LOD (Level of Detail) management:** Multiple mesh resolutions per model, automatically switching based on camera distance to optimize rendering performance.
- **Placeholder geometry:** Simple box/cylinder geometry used during initial development to unblock software development while 3D dental models are being created.

## Consequences

### Positive
- GLB/GLTF is the industry standard format with strong tooling support (Blender, online viewers, Three.js)
- Draco compression dramatically reduces file sizes, improving initial load times and reducing bandwidth costs
- LOD management ensures smooth performance even with detailed dental models
- Placeholder geometry allows parallel development — software engineers can build the UI, interactions, and logic while 3D artists create final models
- Three.js has native GLTFLoader support with Draco decompression built in

### Negative
- Draco compression adds a decompression step at load time (minimal performance impact, but non-zero)
- LOD management requires creating and maintaining multiple versions of each 3D model
- Placeholder geometry may lead to visual regressions when replaced with final models if interaction tolerances differ

### Risks
- Draco-compressed GLB files require the draco3d library (~30KB) for decompression
- LOD generation tooling must be integrated into the artist pipeline (e.g., Blender LOD baking or automated mesh decimation)
- Placeholder geometry dimensions must match final models closely to avoid breaking collision detection and probe physics logic
