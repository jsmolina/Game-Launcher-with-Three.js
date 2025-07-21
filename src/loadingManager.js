import { LoadingManager, TextureLoader, MeshBasicMaterial } from 'three';

// MANAGER
const loadingManager = new LoadingManager();

loadingManager.onStart = function onStart(url, itemsLoaded, itemsTotal) {
  console.log(
    `Started loading file ${url}.\n Loaded ${itemsLoaded} of ${itemsTotal}`,
  );
};

loadingManager.onLoad = function onLoad() {
  console.log('Loading Complete');
};

loadingManager.onProgress = function onProgress(url, itemsLoaded, itemsTotal) {
  console.log(`Loading file ${url}.\n Loaded ${itemsLoaded} of ${itemsTotal}`);
};

loadingManager.onError = function onError(url) {
  console.warn('Error loading', url);
};

// UTILS

const defaultOrder = ['left', 'right', 'top', 'bottom', 'front', 'back'];
/**
 *
 * @param {Array<string>} textures Array with all image textures paths
 * @param {string} prefix Prefix to find desired textures
 * @param {Array<string>} order OPTIONAL Order in which the textures will be loaded. Defaults to ['left', 'right', 'top', 'bottom', 'front', 'back']
 * @returns {Array<string>} Textures needed to create the box materials
 */
function getTexturesPathFromPrefix(textures, prefix, order = defaultOrder) {
  const paths = [];
  for (let side of order) {
    const path = textures[`${prefix}_${side}.png`];
    paths.push(path);
  }
  return paths;
}

const textureLoader = new TextureLoader(loadingManager);

/**
 *
 * @param {Array<string>} textures Arary of textures path in the order the materials will be created
 * @returns {Array<THREE.MeshBasicMaterial}
 */
function createMaterialFromTextures(textures) {
  const material = [];

  for (let tex of textures) {
    material.push(new MeshBasicMaterial({ map: textureLoader.load(tex) }));
  }

  return material;
}
export {
  loadingManager,
  createMaterialFromTextures,
  getTexturesPathFromPrefix,
};
