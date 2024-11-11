import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'happy-dom',
        globals: true,
        setupFiles: ['./setup.ts'],
        coverage: {
            provider: 'istanbul',
            reporter: ['text', 'json', 'html'],
        },
    },
});