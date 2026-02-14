import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
// import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
    plugins: [
        react(),
        // nodePolyfills(),
        // VitePWA({
        //     registerType: 'autoUpdate',
        //     includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        //     manifest: {
        //         name: 'ZONAVI - Career Navigation System',
        //         short_name: 'ZONAVI',
        //         description: 'The Career Navigation System',
        //         theme_color: '#ffffff',
        //         icons: [
        //             {
        //                 src: 'pwa-192x192.png',
        //                 sizes: '192x192',
        //                 type: 'image/png'
        //             },
        //             {
        //                 src: 'pwa-512x512.png',
        //                 sizes: '512x512',
        //                 type: 'image/png'
        //             }
        //         ]
        //     }
        // })
    ],
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true
            }
        }
    }
})
