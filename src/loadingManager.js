import { LoadingManager as ThreeLoadingManager } from 'three'

const loadingManager = new ThreeLoadingManager();


loadingManager.onStart = function onStart(url, itemsLoaded, itemsTotal) {
    console.log(`Started loading file ${url}.\n Loaded ${itemsLoaded} of ${itemsTotal}`)
}

loadingManager.onLoad = function onLoad() {
    console.log("Loading Complete")
}

loadingManager.onProgress = function onProgress(url, itemsLoaded, itemsTotal) {
    console.log(`Loading file ${url}.\n Loaded ${itemsLoaded} of ${itemsTotal}`)
}

loadingManager.onError = function onError(url) {
    console.warn('Error loading', url)
}


export { loadingManager }



