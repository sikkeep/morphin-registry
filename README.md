<div align="center">
  <p>
    <img src="./morphin-dropdown.gif" alt="Morphin dropdown preview" />
  </p>
  <h1>Morphin Registry</h1>
  <p><strong>The component registry behind the Morphin CLI.</strong></p>
  <p>
    A curated collection of installable React UI components, demos, and supporting assets
    published as JSON manifests and file payloads for Morphin consumers.
  </p>
  <p>
    <a href="https://registry.morphin.dev"><strong>Registry</strong></a>
    ·
    <a href="./registry.json"><strong>Catalog</strong></a>
    ·
    <a href="./items/animated-svg-branch-connector.json"><strong>Example Item</strong></a>
  </p>
  <p>
    <img alt="Registry" src="https://img.shields.io/badge/type-component_registry-111111?style=flat-square" />
    <img alt="React" src="https://img.shields.io/badge/stack-React%20%2B%20TypeScript-111111?style=flat-square" />
    <img alt="Tailwind CSS" src="https://img.shields.io/badge/styling-Tailwind_CSS-111111?style=flat-square" />
    <img alt="Published" src="https://img.shields.io/badge/domain-registry.morphin.dev-111111?style=flat-square" />
  </p>
</div>

## Overview

This repository is the source of truth for the Morphin component registry.

It does not contain the CLI itself. Instead, it stores the manifests and file payloads the CLI consumes when a user installs a component from the registry.

Current shape of the registry:

- 31 published items
- all entries are `component` manifests
- most packages target React + TypeScript + Tailwind CSS
- the most common runtime dependencies are `framer-motion`, `clsx`, and `tailwind-merge`

## What Lives Here

Every registry item is described in two places:

1. [`registry.json`](./registry.json) is the top-level catalog.
2. [`items/`](./items) contains one manifest per component.

The installable source files themselves live under [`files/`](./files).

Typical examples:

- [`registry.json`](./registry.json) lists available items and their descriptions.
- [`items/animated-svg-branch-connector.json`](./items/animated-svg-branch-connector.json) defines one installable component.
- [`files/components/animated-svg-branch-connector/svg-branches.tsx`](./files/components/animated-svg-branch-connector/svg-branches.tsx) is one of the source payload files referenced by that manifest.

## Registry Structure

```text
.
├── CNAME
├── registry.json
├── items/
│   └── <slug>.json
└── files/
    ├── components/
    ├── lib/
    ├── hooks/
    ├── providers/
    ├── public/
    └── types/
```

There is one implementation detail worth noting:

- manifest `files[].path` values are registry paths such as `components/...`
- the repository stores the actual payloads under `files/...`

In other words, the manifest path describes the published registry asset path, not the literal path inside this Git repository.

## Item Contract

Each manifest follows the same general contract:

```json
{
  "name": "component-slug",
  "type": "component",
  "files": [
    {
      "path": "components/component-slug/example.tsx",
      "target": "components/example.tsx"
    }
  ],
  "dependencies": ["framer-motion", "clsx", "tailwind-merge"]
}
```

Field meanings:

- `name`: unique registry slug
- `type`: currently `component`
- `files`: published source files and where they should be written in the consumer project
- `dependencies`: packages the consumer needs installed

## Adding A New Component

To publish a new item to the registry:

1. Add the installable source files under [`files/`](./files).
2. Create a new manifest in [`items/`](./items) describing those files and dependencies.
3. Register the item in [`registry.json`](./registry.json) with its name, type, manifest path, and description.
4. Publish the updated static registry to `registry.morphin.dev`.

Use an existing item as the template if you want the safest starting point:

- [`items/animated-svg-branch-connector.json`](./items/animated-svg-branch-connector.json)
- [`items/transaction-flow-in-one-button.json`](./items/transaction-flow-in-one-button.json)
- [`items/scroll-scramble-section.json`](./items/scroll-scramble-section.json)

## Design Of The Registry

This registry is optimized for animated, installation-ready UI blocks rather than generic package distribution.

Most items ship as:

- TSX components
- local utility files
- demo files
- occasional hooks, providers, types, and public assets

That makes the repository easy to inspect, easy to diff, and straightforward for a CLI to consume as raw source code.

## Contributing

If you are contributing new registry entries, keep these rules consistent:

- use a unique kebab-case slug
- keep manifest paths and targets explicit
- only declare dependencies the installed item actually needs
- include every required local file in the manifest
- update [`registry.json`](./registry.json) in the same change as the new item

## Links

- Registry domain: `https://registry.morphin.dev`
- Repository: `https://github.com/sikkeep/morphin-registry`
- Catalog: [`registry.json`](./registry.json)

## Acknowledgements

The presentation style of this README is inspired by the Magic UI project:

- `https://github.com/magicuidesign/magicui`

## License

No license file is currently present in this repository.
