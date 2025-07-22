import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
import Stats from 'three/addons/libs/stats.module.js';
import {
  CSS2DRenderer,
  CSS2DObject,
} from 'three/addons/renderers/CSS2DRenderer.js';
import {
  CSS3DRenderer,
  CSS3DObject,
} from 'three/addons/renderers/CSS3DRenderer.js';
import { Game } from './game.js';
import { SceneObject } from './sceneObject.js';
import imgBios1Url from '../assets/images/bios1.PNG';
import imgBios2Url from '../assets/images/bios2.PNG';
import modelSelfUrl from '../assets/models/self.glb';
import modelTableUrl from '../assets/models/table.glb';
import modelComputerUrl from '../assets/models/computer.glb';
import modelMonitorUrl from '../assets/models/monitor.glb';
import modelKeyboardUrl from '../assets/models/keyboard.glb';
import modelChairUrl from '../assets/models/chair.glb';
import modelPosterUrl from '../assets/models/poster.glb';
import modelBooksUrl from '../assets/models/books.glb';
import modelFloppyUrl from '../assets/models/floppy.glb';
import modelShoesUrl from '../assets/models/shoes.glb';
// textures

import {
  createMaterialFromTextures,
  getTexturesPathFromPrefix,
  loadingManager,
} from './loadingManager.js';
const textures = import.meta.glob('../assets/**/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
});
console.log(textures);

import '/style.css';

let mixer, mix, clipAction;

const clock = new THREE.Clock();
const modelLoader = new GLTFLoader();
const pointer = new THREE.Vector2();
const focus = new THREE.Vector3();
const labelRenderer = new CSS2DRenderer();
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
const scene = new THREE.Scene();
const screen = new Screen('SJOz3qjfQXU', 0.025, 1.28, 0.53, 0);
const sceneRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const screenRenderer = new CSS3DRenderer({ alpha: true });
const raycaster = new THREE.Raycaster();
const effect = new OutlineEffect(sceneRenderer);
const controls = new OrbitControls(camera, sceneRenderer.domElement);

const stats = new Stats();
const axesHelper = new THREE.AxesHelper(10);

let label, labelDiv;
let intersects;

let camPosX, camPosY, camPosZ, camRotX, camRotY, camRotZ;

const games = {
  outcash: new Game({
    name: 'Out of cash',
    texturesPath: '../assets/outcash/outofcash',
  }),
  pes94: new Game({
    name: "Pesadilla del '94",
    texturesPath: '../assets/pes94/pes94',
  }),
  hormona: new Game({
    name: 'La fiesta de las hormonas',
    texturesPath: '../assets/hormona/hormona',
  }),
  rio: new Game({ name: 'Rio Inmaculado', texturesPath: '../assets/rio/rio' }),
  gandara: new Game({
    name: 'La Gandara',
    texturesPath: '../assets/gandara/gandara',
  }),
  sk: new Game({ name: 'School Kombat', texturesPath: '../assets/sk/sk' }),
  biricia: new Game({
    name: 'La Biricia',
    texturesPath: '../assets/biricia/biricia',
  }),
};

let computerCPU = new SceneObject('CPU');
let computerScreen = new SceneObject('Screen');
let keyboard = new SceneObject('Keyboard');
let poster = new SceneObject('Poster');
let chair = new SceneObject('Silla');
let shoes = new SceneObject('Bambas');
let books = new SceneObject('Libros');

let text;

let cameraMoving = false;
let focusIn, zoomIn, focusOut, zoomOut, focused, zoomed;

Init();
Animate();

// -------------- FUNCTIONS -------------------------

function InitLights() {
  // Set light
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);
}

function InitHelpers() {
  scene.add(axesHelper);
  document.body.appendChild(stats.dom);
}

function InitLabel() {
  labelRenderer.setSize(innerWidth, innerHeight);
  labelRenderer.domElement.style.position = 'absolute';
  labelRenderer.domElement.style.top = '0px';
  labelRenderer.domElement.style.pointerEvents = 'none';
  document.body.appendChild(labelRenderer.domElement);

  labelDiv = document.createElement('div');
  labelDiv.className = 'label';
  labelDiv.style.marginTop = '-1em';
  labelDiv.textContent = '';
  label = new CSS2DObject(labelDiv);
  label.visible = false;
  scene.add(label);
}

function InitModels() {
  // Load self
  modelLoader.load(
    modelSelfUrl,
    function (gltf) {
      gltf.scene.position.set(-1.0, 1.5, 0.0);
      gltf.scene.rotation.set(0.0, 1.55, 0.0);
      scene.add(gltf.scene);
    },
    undefined,
    function (error) {
      console.error(error);
    },
  );

  // Load table
  modelLoader.load(
    modelTableUrl,
    function (gltf) {
      gltf.scene.position.set(0.0, -0.02, 0.0);
      gltf.scene.rotation.set(0.0, 0.0, 0.0);
      gltf.scene.scale.set(0.8, 0.8, 0.8);
      scene.add(gltf.scene);
    },
    undefined,
    function (error) {
      console.error(error);
    },
  );

  // Load computer cpu
  modelLoader.load(
    modelComputerUrl,
    function (gltf) {
      gltf.scene.position.set(0.0, 0.83, 0.3);
      gltf.scene.rotation.set(0.0, -1.5, 0.0);
      gltf.scene.scale.set(1.0, 1.0, 1.0);
      computerCPU.mesh = gltf.scene;
      computerCPU.id = gltf.scene.children[0].id;
      computerCPU.name = 'CPU 486 DX2 66MHz';
      scene.add(computerCPU.mesh);
    },
    undefined,
    function (error) {
      console.error(error);
    },
  );

  // Load computer monitor
  modelLoader.load(
    modelMonitorUrl,
    function (gltf) {
      gltf.scene.position.set(0.025, 1.34, 0.55);
      gltf.scene.rotation.set(0.0, -1.5, 0.0);
      gltf.scene.scale.set(1.0, 1.0, 1.0);
      computerScreen.mesh = gltf.scene;
      computerScreen.id = gltf.scene.children[0].children[0].id;
      computerScreen.name = 'Monitor';
      scene.add(computerScreen.mesh);
    },
    undefined,
    function (error) {
      console.error(error);
    },
  );

  // Load computer keyboard
  modelLoader.load(
    modelKeyboardUrl,
    function (gltf) {
      gltf.scene.position.set(0.025, 0.85, 0.7);
      gltf.scene.rotation.set(0.0, -1.5, 0.0);
      gltf.scene.scale.set(1.3, 1.3, 1.3);
      keyboard.mesh = gltf.scene;
      keyboard.id = gltf.scene.id;
      keyboard.name = 'PC';
      scene.add(keyboard.mesh);
    },
    undefined,
    function (error) {
      console.error(error);
    },
  );

  // Load chair
  modelLoader.load(
    modelChairUrl,
    function (gltf) {
      gltf.scene.position.set(0.5, -0.1, 1.5);
      gltf.scene.rotation.set(0.0, -0.9, 0.0);
      gltf.scene.scale.set(0.8, 0.8, 0.8);
      scene.add(gltf.scene);
    },
    undefined,
    function (error) {
      console.error(error);
    },
  );

  // Load poster
  modelLoader.load(
    modelPosterUrl,
    function (gltf) {
      gltf.scene.position.set(1.7, 1.2, 0.0);
      gltf.scene.rotation.set(0.0, -1.55, 0.0);
      gltf.scene.scale.set(0.6, 0.6, 0.6);
      poster.mesh = gltf.scene;
      poster.id = gltf.scene.children[0].children[0].id;
      scene.add(poster.mesh);
    },
    undefined,
    function (error) {
      console.error(error);
    },
  );

  // Load books
  modelLoader.load(
    modelBooksUrl,
    function (gltf) {
      gltf.scene.position.set(-0.6, 0.85, 0.4);
      gltf.scene.rotation.set(0.0, -1.0, 0.0);
      gltf.scene.scale.set(1.0, 1.0, 1.0);
      scene.add(gltf.scene);
    },
    undefined,
    function (error) {
      console.error(error);
    },
  );

  // Load floppy 1
  modelLoader.load(
    modelFloppyUrl,
    function (gltf) {
      gltf.scene.position.set(0.6, 0.85, 0.4);
      gltf.scene.rotation.set(-1.55, 0.0, 0.0);
      gltf.scene.scale.set(0.1, 0.1, 0.1);
      scene.add(gltf.scene);
    },
    undefined,
    function (error) {
      console.error(error);
    },
  );

  // Load floppy 2
  modelLoader.load(
    modelFloppyUrl,
    function (gltf) {
      gltf.scene.position.set(0.62, 0.85, 0.46);
      gltf.scene.rotation.set(-1.5, 0.0, 0.2);
      gltf.scene.scale.set(0.1, 0.1, 0.1);
      scene.add(gltf.scene);
    },
    undefined,
    function (error) {
      console.error(error);
    },
  );

  // Load SHOES
  /*modelLoader.load( modelShoesUrl, function ( gltf ) {
		  gltf.scene.position.set(-0.5,0.0,1.0);
			  gltf.scene.rotation.set(0.0,90.0,0.0);
		  gltf.scene.scale.set(0.3,0.3,0.3);
			  scene.add( gltf.scene );
	  }, undefined, function ( error ) {
			  console.error( error );
	  } );*/
}

function InitBoxes() {
  // TODO: Load games within a loop since they share most of the code
  Load_PES94();
  Load_HORMONA();
  Load_OUTCASH();
  Load_RIO();
  Load_GANDARA();
  Load_SK();
  Load_BIRICIA();
}

function InitScreen() {
  screen.scale.x = 0.00075;
  screen.scale.y = 0.00075;
  screen.scale.z = 0.00075;
  scene.add(screen);
}

function InitSceneRenderer() {
  sceneRenderer.setPixelRatio(window.devicePixelRatio);
  sceneRenderer.setSize(window.innerWidth, window.innerHeight);
  sceneRenderer.setAnimationLoop(Animate);
  document.body.appendChild(sceneRenderer.domElement);
}

function InitScreenRenderer() {
  screenRenderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(screenRenderer.domElement);
}

function InitControls() {
  controls.minDistance = 0;
  controls.maxDistance = 10;
  controls.minAzimuthAngle = -0.8;
  controls.maxAzimuthAngle = 1;
  controls.minPolarAngle = 1;
  controls.maxPolarAngle = 1.5;
  controls.enablePan = true;
  controls.update();
}

function InitCamera() {
  camPosX = -1;
  camPosY = 1.8;
  camPosZ = 3.5;

  camRotX = -1;
  camRotY = 1;
  camRotZ = 4;

  camera.position.set(camPosX, camPosY, camPosZ);
  camera.rotation.set(camRotX, camRotY, camRotZ);
  scene.getWorldPosition(focus);
  //computerScreen.mesh.getWorldPosition( focus );
  camera.lookAt(focus);

  //SetFocusOnScreen();
}

async function InitialScene() {
  scene.visible = false;

  // Load bios 2 image
  const containerBios2 = document.createElement('div');
  containerBios2.style = 'position: absolute; top: 20px; right: 10px';
  var bios2Image = new Image();
  bios2Image.src = imgBios2Url;
  bios2Image.width = '200';
  bios2Image.height = '150';
  containerBios2.appendChild(bios2Image);
  document.body.appendChild(containerBios2);

  await sleep(1000);

  // Load bios 1 image
  const containerBios1 = document.createElement('div');
  containerBios1.style = 'position: absolute; top: 20px; left: 10px';
  var bios1Image = new Image();
  bios1Image.src = imgBios1Url;
  bios1Image.width = '30';
  bios1Image.height = '50';
  containerBios1.appendChild(bios1Image);
  document.body.appendChild(containerBios1);

  // Write text line 1
  const containerText1 = document.createElement('div');
  containerText1.style = 'position: absolute; top: 0px; left: 50px; color:gray';
  const p1 = document.createElement('p');
  p1.innerHTML = 'Atmosphere';
  containerText1.appendChild(p1);
  document.body.appendChild(containerText1);

  // Write text line 2
  const containerText2 = document.createElement('div');
  containerText2.style =
    'position: absolute; top: 20px; left: 50px; color:gray';
  const p2 = document.createElement('p');
  p2.innerHTML = 'Copyright(C) 1996, MS-Dos Club';
  containerText2.appendChild(p2);
  document.body.appendChild(containerText2);

  await sleep(1000);

  // Write text line 3
  const containerText3 = document.createElement('div');
  containerText3.style =
    'position: absolute; top: 100px; left: 50px; color:gray';
  const p3 = document.createElement('p');
  p3.innerHTML = 'Total memory: ';
  containerText3.appendChild(p3);
  document.body.appendChild(containerText3);

  // Write text line 4
  const containerText4 = document.createElement('div');
  containerText4.style =
    'position: absolute; top: 100px; left: 160px; color:gray';
  const p4 = document.createElement('p');
  p4.innerHTML = '0 MB';
  containerText4.appendChild(p4);
  document.body.appendChild(containerText4);

  var mem = 0;
  while (mem < 160) {
    mem += 32;
    p4.innerHTML = mem + ' KB';
    await sleep(10);
  }

  await sleep(1000);

  // Write text line 5
  const containerText5 = document.createElement('div');
  containerText5.style =
    'position: absolute; top: 200px; left: 50px; color:gray';
  const p5 = document.createElement('p');
  p5.innerHTML = 'Loading resources...';
  containerText5.appendChild(p5);
  document.body.appendChild(containerText5);

  await sleep(1000);

  // Write text line 6
  const containerText6 = document.createElement('div');
  containerText6.style =
    'position: absolute; top: 220px; left: 50px; color:gray';
  const p6 = document.createElement('p');
  p6.innerHTML = 'Loading assets...';
  containerText6.appendChild(p6);
  document.body.appendChild(containerText6);

  await sleep(1000);

  document.body.removeChild(containerBios1);
  document.body.removeChild(containerBios2);
  document.body.removeChild(containerText1);
  document.body.removeChild(containerText2);
  document.body.removeChild(containerText3);
  document.body.removeChild(containerText4);
  document.body.removeChild(containerText5);
  document.body.removeChild(containerText6);

  await sleep(1000);

  scene.visible = true;
  document.body.style.backgroundColor = 'white';
}

// Initialization
function Init() {
  // Clear current console output
  // console.clear();

  // Initial scene
  InitialScene();
  // Init lights
  InitLights();
  // Init helpers
  InitHelpers();
  // Init label
  InitLabel();
  // Init models
  InitModels();
  // Init boxes
  InitBoxes();
  // Init screen
  InitScreen();
  // Init scene renderer
  InitSceneRenderer();
  // Init screen renderer
  InitScreenRenderer();
  // Init controls
  InitControls();
  // Init camera
  InitCamera();

  // Declare events
  document.addEventListener('mousemove', onPointerMove);
  document.addEventListener('click', onPointerClick);
  window.addEventListener('resize', onWindowResize);
}

//#region Load Boxes

// Load Out of cash box
function Load_OUTCASH() {
  // Generate game box
  var geometry = new THREE.BoxGeometry(1, 1.5, 0.2);
  // Textures
  //
  const texturePaths = getTexturesPathFromPrefix(
    textures,
    '../assets/outcash/outofcash',
  );
  const material = createMaterialFromTextures(texturePaths);

  games.outcash.mesh = new THREE.Mesh(geometry, material);
  games.outcash.setScale(0.2, 0.2, 0.2);
  games.outcash.setPosition(-1.4, 1.7, 0.14);
  games.outcash.setRotation(0.0, -0.8, 0.0);
  games.outcash.setCameraOnFocus(-2, 2, 1);
  scene.add(games.outcash.mesh);
}

// Load pes94 box
function Load_PES94() {
  // Generate game box
  var geometry = new THREE.BoxGeometry(1, 1.5, 0.2);
  // Textures
  const texturePaths = getTexturesPathFromPrefix(
    textures,
    games.pes94.texturesPath,
  );
  const material = createMaterialFromTextures(texturePaths);

  games.pes94.mesh = new THREE.Mesh(geometry, material);
  games.pes94.setScale(0.2, 0.2, 0.2);
  games.pes94.setPosition(-1.25, 1.7, 0.14);
  games.pes94.setRotation(0.0, -0.8, 0.0);
  games.pes94.setCameraOnFocus(-1.6, 2, 1);
  scene.add(games.pes94.mesh);
}
// Load Hormona box
function Load_HORMONA() {
  // Generate game box
  var geometry = new THREE.BoxGeometry(1, 1.5, 0.2);
  // Textures
  const texturePaths = getTexturesPathFromPrefix(
    textures,
    games.hormona.texturesPath,
  );
  const material = createMaterialFromTextures(texturePaths);

  games.hormona.mesh = new THREE.Mesh(geometry, material);
  games.hormona.setScale(0.2, 0.2, 0.2);
  games.hormona.setPosition(-1.1, 1.7, 0.12);
  games.hormona.setRotation(0.0, -0.8, 0.0);
  games.hormona.setCameraOnFocus(-1.2, 2, 1);
  scene.add(games.hormona.mesh);
}
// Load Rio box
function Load_RIO() {
  // Generate game box
  var geometry = new THREE.BoxGeometry(1, 1.5, 0.2);
  // Textures
  const texturePaths = getTexturesPathFromPrefix(
    textures,
    games.rio.texturesPath,
  );
  const material = createMaterialFromTextures(texturePaths);

  games.rio.mesh = new THREE.Mesh(geometry, material);
  games.rio.setScale(0.2, 0.2, 0.2);
  games.rio.setPosition(-0.95, 1.7, 0.12);
  games.rio.setRotation(0.0, -0.8, 0.0);
  games.rio.setCameraOnFocus(-1.0, 0, 1);
  scene.add(games.rio.mesh);
}
// Load Rio box
function Load_GANDARA() {
  // Generate game box
  var geometry = new THREE.BoxGeometry(1, 1.5, 0.2);
  // Textures
  const texturePaths = getTexturesPathFromPrefix(
    textures,
    games.gandara.texturesPath,
  );
  const material = createMaterialFromTextures(texturePaths);

  games.gandara.mesh = new THREE.Mesh(geometry, material);
  games.gandara.setScale(0.2, 0.2, 0.2);
  games.gandara.setPosition(-0.8, 1.7, 0.12);
  games.gandara.setRotation(0.0, -0.8, 0.0);
  games.gandara.setCameraOnFocus(-0.8, 2, 1);
  scene.add(games.gandara.mesh);
}
// Load SK box
function Load_SK() {
  // Generate game box
  var geometry = new THREE.BoxGeometry(1, 1.5, 0.2);
  // Textures
  const texturePaths = getTexturesPathFromPrefix(
    textures,
    games.sk.texturesPath,
  );
  const material = createMaterialFromTextures(texturePaths);

  games.sk.mesh = new THREE.Mesh(geometry, material);
  games.sk.setScale(0.2, 0.2, 0.2);
  games.sk.setPosition(-0.65, 1.7, 0.12);
  games.sk.setRotation(0.0, -0.8, 0.0);
  games.sk.setCameraOnFocus(-0.6, 0, 1);
  scene.add(games.sk.mesh);
}
// Load BIRICIA box
function Load_BIRICIA() {
  // Generate game box
  var geometry = new THREE.BoxGeometry(1, 1.5, 0.2);
  // Textures
  const texturesPaths = getTexturesPathFromPrefix(
    textures,
    games.biricia.texturesPath,
  );
  const material = createMaterialFromTextures(texturesPaths);

  games.biricia.mesh = new THREE.Mesh(geometry, material);
  games.biricia.setScale(0.2, 0.2, 0.2);
  games.biricia.setPosition(-0.5, 1.7, 0.12);
  games.biricia.setRotation(0.0, -0.8, 0.0);
  games.biricia.setCameraOnFocus(-0.4, 0, 1);
  scene.add(games.biricia.mesh);
}

//#endregion

//#region Events

// Window resize event
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  sceneRenderer.setSize(window.innerWidth, window.innerHeight);
}

// Mouse pointer position update event
function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Mouse pointer position update event
function onPointerClick(event) {
  label.visible = false;
  // find intersections
  raycaster.setFromCamera(pointer, camera);
  intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const gameBox = Object.values(games).find((v) => intersects[0].object.id == v.mesh.id? v : undefined);
    gameBox && !focused && SetFocusOn(gameBox);
		gameBox && focused && gameBox.isFocused() ? ZoomInBox(gameBox) : ReleaseFocus();

    switch (intersects[0].object.id) {
        case computerCPU.id:
        break;
      case computerScreen.id:
        if (!focused) {
          SetFocusOnScreen();
        }
        if (focused) {
          ReleaseFocus();
        }
        break;
      case poster.id:
        if (!focused) {
          SetFocusOnPoster();
        }
        if (focused) {
          ReleaseFocus();
        }
        break;
      default:
        if (games.hormona.isFocused()) {
          FocusOutBox(games.hormona);
        }
        if (focused) {
          ReleaseFocus();
        }
        break;
    }
  } else {
    if (games.hormona.isFocused()) {
      FocusOutBox(games.hormona);
    }
    if (focused) {
      ReleaseFocus();
    }
  }
}

//#endregion

//#region Camera functions

function CameraCorrection() {
  if (cameraMoving) {
    if (camera.position.x > camPosX + 0.1) {
      camera.position.x -= 0.02;
    }
    if (camera.position.x < camPosX - 0.1) {
      camera.position.x += 0.02;
    }
    if (camera.position.y > camPosY + 0.1) {
      camera.position.y -= 0.02;
    }
    if (camera.position.y < camPosY - 0.1) {
      camera.position.y += 0.02;
    }
    if (camera.position.z > camPosZ + 0.1) {
      camera.position.z -= 0.02;
    }
    if (camera.position.z < camPosZ - 0.1) {
      camera.position.z += 0.02;
    }
  }

  if (
    (camPosX + 0.5 > camera.position.x) &
    (camPosX - 0.5 < camera.position.x) &
    (camPosY + 0.5 > camera.position.y) &
    (camPosY - 0.5 < camera.position.y) &
    (camPosZ + 0.5 > camera.position.z) &
    (camPosZ - 0.5 < camera.position.z)
  ) {
    if (focusIn) {
      focused = true;
      focusIn = false;
    }
    if (zoomIn) {
      zoomed = true;
      zoomIn = false;
    }
    if (focusOut) {
      focused = false;
      focusOut = false;
    }
    if (zoomOut) {
      zoomed = false;
      zoomOut = false;
    }

    cameraMoving = false;
  }
}

function SetFocusOn(gameBox){
		camPosX = gameBox.cameraOnFocus.x;
		camPosZ = gameBox.cameraOnFocus.z;
		gameBox.focus = true;
		focusIn = true;	
		cameraMoving = true;
    FocusInBox(gameBox);
	}

function SetFocusOnScreen() {
  camPosX = 0.1;
  camPosY = 1.1;
  camPosZ = 0.4;

  computerScreen.focus = true;
  focusIn = true;
  cameraMoving = true;
}

function SetFocusOnPoster() {
  camPosX = 2;
  camPosY = 2;
  camPosZ = 2;

  poster.focus = true;
  focusIn = true;
  cameraMoving = true;
}

function ReleaseFocus() {
  // Hide label
  label.visible = false;

  camPosX = -1;
  camPosY = 1.8;
  camPosZ = 3.5;

  camRotX = -1;
  camRotY = 1;
  camRotZ = 4;

  scene.getWorldPosition(focus);

  // Reset focus flags
  games.outcash.focus = false;
  games.pes94.focus = false;
  games.hormona.focus = false;
  games.rio.focus = false;
  games.gandara.focus = false;
  games.sk.focus = false;
  games.biricia.focus = false;
  computerScreen.focus = false;
  poster.focus = false;

  focusIn = false;
  focusOut = true;
  cameraMoving = true;
}

//#endregion

// Render update
function Render() {
  Animations();
  ObjectDetection();
  labelRenderer.render(scene, camera);
  screenRenderer.render(scene, camera);
  sceneRenderer.render(scene, camera);
  effect.render(scene, camera);
}

// Animation update
function Animate() {
  Render();
  stats.update();
  controls.update();
}

function showLabel(gameBox) {
		labelDiv.textContent = gameBox.name;
		label.position.set(
			gameBox.mesh.position.x,
			gameBox.mesh.position.y + 0.2,
			gameBox.mesh.position.z + 0.2
		);    
		label.visible = true;
		if(!focused){gameBox.mesh.getWorldPosition( focus );}
	}

function ObjectDetection() {
  if (!cameraMoving) {
    controls.target.lerp(focus, 0.001);
  } else {
    controls.target.lerp(focus, 0.03);
  }
  if (controls.enabled) {
    CameraCorrection();
  }
  camera.updateMatrixWorld();

  // find intersections
  raycaster.setFromCamera(pointer, camera);
  intersects = raycaster.intersectObjects(scene.children, true);

  // Object detection when zoom is not active
  if (!zoomed & !cameraMoving) {
    if (intersects.length > 0 && intersects[0].object.id !== axesHelper.id) {
      const gameBox = Object.values(games).find((v) => intersects[0].object.id == v.mesh.id? v : undefined);
      gameBox && showLabel(gameBox);

      if(!gameBox) {
        switch (intersects[0].object.id) {
          case computerCPU.id:
            labelDiv.textContent = computerCPU.name;
            label.position.set(
              computerCPU.mesh.position.x,
              computerCPU.mesh.position.y + 0.2,
              computerCPU.mesh.position.z + 0.2,
            );
            label.visible = true;
            computerCPU.mesh.getWorldPosition(focus);
            break;
          case computerScreen.id:
            labelDiv.textContent = computerScreen.name;
            label.position.set(
              computerScreen.mesh.position.x,
              computerScreen.mesh.position.y + 0.4,
              computerScreen.mesh.position.z + 0.2,
            );
            label.visible = true;
            if (!focused) {
              computerScreen.mesh.getWorldPosition(focus);
            }
            break;
          case poster.id:
            labelDiv.textContent = poster.name;
            label.position.set(
              poster.mesh.position.x,
              poster.mesh.position.y + 0.6,
              poster.mesh.position.z + 0.2,
            );
            label.visible = true;
            if (!focused) {
              poster.mesh.getWorldPosition(focus);
            }
            break;
          default:
            // Hide label
            label.visible = false;
            //if(!focused){scene.getWorldPosition( focus );}
            break;
        }
      }
    } else {
      // Hide label
      //scene.getWorldPosition( focus );
    }
  }
}

function Animations() {
  const delta = clock.getDelta();
  if (mixer) {
    mixer.update(delta);
  }
  if (mix) {
    mix.update(delta);
  }
}

function FocusInBox(gameBox){
		
		// gameBox box movement
		const pos = new THREE.VectorKeyframeTrack( '.position', [ 0, 1, 2 ], [ gameBox.mesh.position.x, gameBox.mesh.position.y, gameBox.mesh.position.z, gameBox.mesh.position.x + 0.2, gameBox.mesh.position.y, gameBox.mesh.position.z + 0.2, gameBox.mesh.position.x + 0.2, gameBox.mesh.position.y, gameBox.mesh.position.z + 1 ] );
		const scale = new THREE.VectorKeyframeTrack( '.scale', [ 0, 1, 2 ], [ gameBox.mesh.scale.x, gameBox.mesh.scale.y, gameBox.mesh.scale.z, gameBox.mesh.scale.x, gameBox.mesh.scale.y, gameBox.mesh.scale.z, gameBox.mesh.scale.x , gameBox.mesh.scale.y , gameBox.mesh.scale.z ] );
		const axis = new THREE.Vector3( 0, 1, 0 );
		const inital_q = new THREE.Quaternion().setFromAxisAngle( axis, -0.8 );
		const middle_q = new THREE.Quaternion().setFromAxisAngle( axis, -0.4 );
		const final_q = new THREE.Quaternion().setFromAxisAngle( axis, 0.0 );
		const quaternion = new THREE.QuaternionKeyframeTrack( '.quaternion', [ 0, 1, 2 ], [ inital_q.x, inital_q.y, inital_q.z, inital_q.w, middle_q.x, middle_q.y, middle_q.z, middle_q.w, final_q.x, final_q.y, final_q.z, final_q.w ] );
		const clip = new THREE.AnimationClip( 'Action', 3, [ scale, pos, quaternion ] );
		mix = new THREE.AnimationMixer( gameBox.mesh );

		// create a ClipAction and set it to play
		clipAction = mix.clipAction( clip );
		clipAction.setLoop(THREE.LoopOnce);
  		clipAction.clampWhenFinished = true;
		clipAction.play();
	}

	function FocusOutBox(gameBox){
		// gameBox box movement
		const pos = new THREE.VectorKeyframeTrack( '.position', [ 0, 1, 2 ], [ gameBox.mesh.position.x, gameBox.mesh.position.y, gameBox.mesh.position.z, gameBox.mesh.position.x, gameBox.mesh.position.y, gameBox.mesh.position.z - 0.8, gameBox.mesh.position.x - 0.2, gameBox.mesh.position.y, gameBox.mesh.position.z - 1.0 ] );
		const scale = new THREE.VectorKeyframeTrack( '.scale', [ 0, 1, 2 ], [ gameBox.mesh.scale.x, gameBox.mesh.scale.y, gameBox.mesh.scale.z, gameBox.mesh.scale.x, gameBox.mesh.scale.y, gameBox.mesh.scale.z , gameBox.mesh.scale.x , gameBox.mesh.scale.y , gameBox.mesh.scale.z ] );
		const axis = new THREE.Vector3( 0, 1, 0 );
		const inital_q = new THREE.Quaternion().setFromAxisAngle( axis, 0.0 );
		const middle_q = new THREE.Quaternion().setFromAxisAngle( axis, -0.4 );
		const final_q = new THREE.Quaternion().setFromAxisAngle( axis, -0.8 );
		const quaternion = new THREE.QuaternionKeyframeTrack( '.quaternion', [ 0, 1, 2 ], [ inital_q.x, inital_q.y, inital_q.z, inital_q.w, middle_q.x, middle_q.y, middle_q.z, middle_q.w, final_q.x, final_q.y, final_q.z, final_q.w ] );
		const clip = new THREE.AnimationClip( 'Action', 3, [ scale, pos, quaternion ] );
		mix = new THREE.AnimationMixer( gameBox.mesh );

		// create a ClipAction and set it to play
		clipAction = mix.clipAction( clip );
		clipAction.setLoop(THREE.LoopOnce);
  		clipAction.clampWhenFinished = true;
		clipAction.play();

	}

	function ZoomInBox(gameBox) {
    console.warn("zoominbox");
		// create a keyframe track (i.e. a timed sequence of keyframes) for each animated property
		// Note: the keyframe track type should correspond to the type of the property being animated

		// POSITION
		const positionKF = new THREE.VectorKeyframeTrack( '.position', [ 0, 1, 2 ], [ -1.1, 1.7, 0.12, -1.0, 1.8, 0.20, -1.6, 1.7, 0.3 ] );

		// SCALE
		const scaleKF = new THREE.VectorKeyframeTrack( '.scale', [ 0, 1, 2 ], [ 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.5, 0.5, 0.5 ] );
		// ROTATION
				
		// Rotation should be performed using quaternions, using a THREE.QuaternionKeyframeTrack
		// Interpolating Euler angles (.rotation property) can be problematic and is currently not supported

		// set up rotation about y axis for first step 
		const xAxis = new THREE.Vector3( 0, 1, 0 );
		const qInitial = new THREE.Quaternion().setFromAxisAngle( xAxis, -0.8 );
		const qMiddle = new THREE.Quaternion().setFromAxisAngle( xAxis, -0.4 );
		const qFinal = new THREE.Quaternion().setFromAxisAngle( xAxis, 0.0); //Math.PI );
		const quaternionKF = new THREE.QuaternionKeyframeTrack( '.quaternion', [ 0, 1, 2 ], [ qInitial.x, qInitial.y, qInitial.z, qInitial.w, qMiddle.x, qMiddle.y, qMiddle.z, qMiddle.w, qFinal.x, qFinal.y, qFinal.z, qFinal.w ] );

		// COLOR
		const colorKF = new THREE.ColorKeyframeTrack( '.material.color', [ 0, 1, 2 ], [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ], THREE.InterpolateDiscrete );

		// OPACITY
		const opacityKF = new THREE.NumberKeyframeTrack( '.material.opacity', [ 0, 1, 2 ], [ 1, 1, 1 ] );

		// create an animation sequence with the tracks
		// If a negative time value is passed, the duration will be calculated from the times of the passed tracks array
		const clip = new THREE.AnimationClip( 'Action', 3, [ scaleKF, positionKF, quaternionKF, colorKF, opacityKF ] );

		// setup the THREE.AnimationMixer
		mixer = new THREE.AnimationMixer( gameBox.mesh );

		// create a ClipAction and set it to play
		clipAction = mixer.clipAction( clip );
		clipAction.setLoop(THREE.LoopOnce);
  		clipAction.clampWhenFinished = true;
  		//clipAction.enable = true;
		clipAction.play();

		zoomIn = true;
		gameBox.zoom = true;
		controls.enabled = false;
	}



function Screen(id, x, y, z, ry) {
  const div = document.createElement('div');
  div.style.width = '480px';
  div.style.height = '360px';
  div.style.backgroundColor = '#232342';

  const iframe = document.createElement('iframe');
  iframe.style.width = '480px';
  iframe.style.height = '360px';
  iframe.style.border = '0px';
  iframe.src = 'https://msdos.club';
  div.appendChild(iframe);

  const object = new CSS3DObject(div);
  object.position.set(x, y, z);
  object.rotation.y = ry;

  return object;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
