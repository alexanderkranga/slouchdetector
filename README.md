## SlouchDetector

![App screenshot](public/og-image.png)

AI-powered posture monitoring that runs entirely in your browser.

- Live app: https://slouchdetector.net
- License: MIT
- Developer: [@AlexHardmond on X](https://x.com/AlexHardmond)

### What it does

SlouchDetector uses MediaPipe face detection to learn your ideal sitting posture and reminds you to sit up when you slouch. All processing happens locally in your browser; no video data is sent to any server.

### Quick start

Requirements: Node 20+, npm.

```bash
npm ci
npm run dev
# open http://localhost:3000
```

### Scripts

- `npm run dev` — start development server
- `npm run build` — build for production
- `npm start` — run production server
- `npm run lint` — run ESLint

### Privacy

- Camera access is required to detect posture
- All computation runs locally in the browser
- No video leaves your device

### Tech

- Next.js 15, React 19, TypeScript, Tailwind CSS 4
- MediaPipe Tasks Vision

### Contributing

Please read `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, and `SECURITY.md` before opening issues or pull requests.

