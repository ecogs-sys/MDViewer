import type { Configuration } from 'electron-builder'

const config: Configuration = {
  appId: 'com.mdviewer.app',
  productName: 'MDViewer',
  directories: {
    output: 'release',
  },
  files: [
    'dist/**/*',
    'dist-electron/**/*',
    'resources/**/*',
    'package.json',
  ],
  win: {
    target: [{ target: 'nsis', arch: ['x64'] }],
    icon: 'resources/icon.png',
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
  },
  mac: {
    target: [{ target: 'dmg', arch: ['x64', 'arm64'] }],
    category: 'public.app-category.productivity',
    icon: 'resources/icon.png',
  },
  linux: {
    target: [{ target: 'AppImage', arch: ['x64'] }],
    category: 'Utility',
  },
}

export default config
