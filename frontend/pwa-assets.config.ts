import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  headLinkOptions: {
    preset: '2023',
  },
  preset: {
    ...minimal2023Preset,
    maskable: {
      ...(minimal2023Preset.maskable ?? {}),
      resizeOptions: { background: '#0C0E12' },
    },
    apple: {
      ...(minimal2023Preset.apple ?? {}),
      resizeOptions: { background: '#0C0E12' },
    },
    appleSplashScreens: {
      padding: 0.4,
      resizeOptions: { background: '#0C0E12', fit: 'contain' },
      darkResizeOptions: { background: '#0C0E12' },
      name: (landscape, size, dark) => {
        const w = landscape ? size.height : size.width
        const h = landscape ? size.width : size.height
        const orientation = landscape ? 'landscape' : 'portrait'
        const mode = dark ? 'dark' : 'light'
        return `apple-splash/apple-splash-${orientation}-${mode}-${w}x${h}.png`
      },
      linkMediaOptions: {
        log: true,
        addMediaScreen: true,
        xhtml: false,
        includeId: false,
      },
      sizes: [
        { width: 640, height: 1136, scaleFactor: 2 },   // iPhone SE 1st gen
        { width: 750, height: 1334, scaleFactor: 2 },   // iPhone SE/6/7/8
        { width: 1242, height: 2208, scaleFactor: 3 },  // iPhone 6+/7+/8+
        { width: 1125, height: 2436, scaleFactor: 3 },  // iPhone X/XS/11 Pro
        { width: 1242, height: 2688, scaleFactor: 3 },  // iPhone XS Max/11 Pro Max
        { width: 828, height: 1792, scaleFactor: 2 },   // iPhone XR/11
        { width: 1080, height: 2340, scaleFactor: 3 },  // iPhone 12/13 mini
        { width: 1170, height: 2532, scaleFactor: 3 },  // iPhone 12/13/14
        { width: 1284, height: 2778, scaleFactor: 3 },  // iPhone 12/13 Pro Max / 14 Plus
        { width: 1179, height: 2556, scaleFactor: 3 },  // iPhone 14 Pro / 15 / 15 Pro
        { width: 1290, height: 2796, scaleFactor: 3 },  // iPhone 14 Pro Max / 15 Plus / 15 Pro Max
      ],
    },
  },
  images: ['public/logosvg.svg'],
})
