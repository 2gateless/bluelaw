import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 빌드 시마다 dist/sw.js의 캐시 버전을 자동 갱신하여 구버전 캐시 누적 방지
function injectSwBuildVersion() {
  return {
    name: 'inject-sw-build-version',
    apply: 'build',
    closeBundle() {
      const swPath = path.resolve('dist', 'sw.js');
      if (!fs.existsSync(swPath)) return;
      const version = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
      const content = fs.readFileSync(swPath, 'utf-8');
      fs.writeFileSync(
        swPath,
        content.replace('__SW_BUILD_VERSION__', version),
        'utf-8'
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), injectSwBuildVersion()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    emptyOutDir: true,
  },
});
