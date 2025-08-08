# Contributing

Thanks for your interest in improving SlouchDetector. This guide explains how to set up the project locally and how to propose changes.

## Development setup

- Required: Node.js 20.x (use `.nvmrc`)
- Package manager: npm

Steps:

```bash
nvm use || nvm install
npm ci
npm run dev
```

Open http://localhost:3000.

Useful scripts:

- `npm run dev` — start Next.js in dev mode
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — lint the codebase

## Making changes

- Keep edits focused and small; include rationale in the PR description.
- Match existing code style and formatting; run `npm run lint` before committing.
- Add or update documentation in the README when behavior changes.

## Pull requests

1. Fork and create a branch: `feat/short-description` or `fix/short-description`.
2. Ensure the app builds and lints locally.
3. Describe the problem and solution, and include screenshots if UI changes.
4. Link related issues.

We use standard GitHub reviews. A maintainer will merge once approved.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

