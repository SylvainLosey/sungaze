const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Enable package exports support (required for @sungaze/api/types exports)
config.resolver.unstable_enablePackageExports = true;

// Add asset extensions for drei loaders (useGLTF, useTexture, etc.)
config.resolver.assetExts.push('glb', 'gltf');

// 1. Watch all files in the monorepo
config.watchFolders = [workspaceRoot];

// 2. Resolve modules from the project and the workspace root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = config;
