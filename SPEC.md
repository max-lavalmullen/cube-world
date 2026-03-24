# cube.world MVP spec

## Product framing

This should behave like a persistent social toy, not like a chat interface. The value comes from:

- watching figures develop recognizable habits
- arranging furniture to influence behavior
- seeing nearby cubes create small emergent stories

## Core deterministic model

Each resident has:

- a personality archetype
- four needs: `rest`, `social`, `play`, `explore`
- a finite action library
- fixed utility scoring with a seeded random tie-breaker

Each furniture item has:

- a type
- a visual form
- one affordance tag

The simulation loop:

1. Increase needs every fixed tick.
2. When an agent finishes its current sequence, score all valid next actions.
3. Choose the best action.
4. Execute it through deterministic movement and short scripted poses.

## World model

For the browser prototype:

- cubes are arranged in a grid
- adjacency is based on grid neighbors
- residents may cross into adjacent cubes
- any figure inside a cube may use that cube's furniture

For the networked version:

- the server should own authoritative world state
- clients should render snapshots/deltas
- actions should be replicated as state changes, not freeform commands

## MVP systems

1. Cube creation
2. Personality selection
3. Furniture placement
4. Adjacent visiting
5. Utility-based behavior
6. Activity feed
7. Visual cube shell with colored edges and toy buttons

## Recommended production architecture

Frontend:

- React or plain Canvas UI
- PixiJS only if animation needs outgrow DOM/canvas simplicity

Realtime server:

- Node.js with WebSockets
- authoritative sim tick

Persistence:

- Postgres for users, cubes, furniture, relationships
- Redis only if you need transient world fanout or job queues later

Simulation:

- pure deterministic engine with no network/UI dependencies
- serializable world state
- replayable seeds for debugging

## Build order

1. Local deterministic single-page prototype
2. Persisted single-user cube editing
3. Shared world state and live observers
4. Multi-user ownership and permissions
5. More furniture types and scripted interactions
6. Only then consider optional AI flavor

## Risks

- The product dies if behavior feels too random or too dead.
- Multiplayer introduces griefing and moderation questions fast.
- The original toy is recognizable enough that naming and visual identity should get an IP pass before launch.
