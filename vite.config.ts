import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import autoprefixer from 'autoprefixer';
import path from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		assetsInlineLimit: Infinity
	},
	preview: {
		allowedHosts: ['localhost', 'budget.parfeniukink.space']
	},
	css: {
		postcss: {
			plugins: [autoprefixer()]
		}
	},
	resolve: {
		alias: {
			$src: path.resolve('./src'),
			$presentation: path.resolve('./src/presentation'),
			$styles: path.resolve('./src/styles'),
			$components: path.resolve('./src/presentation/components')
		}
	}
});
