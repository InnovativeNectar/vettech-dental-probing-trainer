# ADR-002: 3D Engine Selection

**Status:** Accepted
**Date:** 2026-07-28
**Deciders:** Vettech Dental Probing Trainer development team

## Context

We need a high-performance 3D dental simulation in the browser that can render detailed tooth models, simulate periodontal probing, and provide interactive feedback — all within a React application. The engine must integrate cleanly with our existing React-based frontend.

## Decision

We will use **Three.js with React Three Fiber (R3F) and Drei helpers**.

- **Three.js:** Industry-standard 3D rendering library for WebGL/WebGPU in the browser.
- **React Three Fiber (R3F):** React renderer for Three.js, enabling declarative 3D scene construction using JSX components.
- **Drei:** A collection of useful helpers, abstractions, and pre-built components for R3F (cameras, controls, loaders, materials, etc.).

## Consequences

### Positive
- React-idiomatic 3D development — scenes and objects are React components with hooks and lifecycle
- R3F abstracts Three.js scene management, reducing manual setup and teardown boilerplate
- Drei provides pre-built controls (OrbitControls, TrackballControls), camera rigs, loaders (GLTFLoader), and materials out of the box
- Large ecosystem with active community and extensive documentation
- Seamless integration with existing React state management (Zustand)
- Hot module replacement works with R3F scenes for fast iteration

### Negative
- Adds approximately 150KB to the production bundle (Three.js + R3F + Drei)
- R3F abstractions can obscure underlying Three.js behavior, requiring occasional escape to raw Three.js API
- Learning curve for developers unfamiliar with 3D concepts (matrices, transformations, materials)

### Risks
- Three.js performance on lower-end devices may require aggressive LOD management and optimization
- R3F version compatibility with specific Three.js versions must be carefully managed
- Complex 3D scenes may encounter memory leaks if React component lifecycle and Three.js disposal are not properly coordinated
