
  	import * as THREE from 'three';
  	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
	import Stats from 'three/addons/libs/stats.module.js';
	import { CSS2DRenderer, CSS2DObject, } from 'three/addons/renderers/CSS2DRenderer.js';
	import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
	import { Game } from './game.js';
	import { SceneObject } from './sceneObject.js';
	import imgBios1Url from '/assets/images/bios1.PNG';
	import imgBios2Url from '/assets/images/bios2.PNG';
	import modelSelfUrl from '/assets/models/self.glb';
	import modelTableUrl from '/assets/models/table.glb';
	import modelComputerUrl from '/assets/models/computer.glb';
	import modelMonitorUrl from '/assets/models/monitor.glb';
	import modelKeyboardUrl from '/assets/models/keyboard.glb';
	import modelChairUrl from '/assets/models/chair.glb';
	import modelPosterUrl from '/assets/models/poster.glb';
	import modelBooksUrl from '/assets/models/books.glb';
	import modelFloppyUrl from '/assets/models/floppy.glb';
	import modelShoesUrl from '/assets/models/shoes.glb';
	// textures
	import textureBiriciaBack from '/assets/biricia/biricia_back.png';
	import textureBiriciaFront from '/assets/biricia/biricia_front.png';
	import textureBiriciaLeft from '/assets/biricia/biricia_left.png';
	import textureBiriciaRight from '/assets/biricia/biricia_right.png';
	import textureBiriciaTop from '/assets/biricia/biricia_top.png';
	import textureBiriciaBottom from '/assets/biricia/biricia_bottom.png';

	import textureGandaraBack from '/assets/gandara/gandara_back.png';
	import textureGandaraFront from '/assets/gandara/gandara_front.png';
	import textureGandaraLeft from '/assets/gandara/gandara_left.png';
	import textureGandaraRight from '/assets/gandara/gandara_right.png';
	import textureGandaraTop from '/assets/gandara/gandara_top.png';
	import textureGandaraBottom from '/assets/gandara/gandara_bottom.png';

	import textureHormonaBack from '/assets/hormona/hormona_back.png';
	import textureHormonaFront from '/assets/hormona/hormona_front.png';
	import textureHormonaLeft from '/assets/hormona/hormona_left.png';
	import textureHormonaRight from '/assets/hormona/hormona_right.png';
	import textureHormonaTop from '/assets/hormona/hormona_top.png';
	import textureHormonaBottom from '/assets/hormona/hormona_bottom.png';

	import textureOutcashBack from '/assets/outcash/outofcash_back.png';
	import textureOutcashFront from '/assets/outcash/outofcash_front.png';
	import textureOutcashLeft from '/assets/outcash/outofcash_left.png';
	import textureOutcashRight from '/assets/outcash/outofcash_right.png';
	import textureOutcashTop from '/assets/outcash/outofcash_top.png';
	import textureOutcashBottom from '/assets/outcash/outofcash_bottom.png';
	
	import texturePes94Back from '/assets/pes94/pes94_back.png';
	import texturePes94Front from '/assets/pes94/pes94_front.png';
	import texturePes94Left from '/assets/pes94/pes94_left.png';
	import texturePes94Right from '/assets/pes94/pes94_right.png';
	import texturePes94Top from '/assets/pes94/pes94_top.png';
	import texturePes94Bottom from '/assets/pes94/pes94_bottom.png';
	
	import textureRioBack from '/assets/rio/rio_back.png';
	import textureRioFront from '/assets/rio/rio_front.png';
	import textureRioLeft from '/assets/rio/rio_left.png';
	import textureRioRight from '/assets/rio/rio_right.png';
	import textureRioTop from '/assets/rio/rio_top.png';
	import textureRioBottom from '/assets/rio/rio_bottom.png';

	import textureSKBack from '/assets/sk/sk_back.png';
	import textureSKFront from '/assets/sk/sk_front.png';
	import textureSKLeft from '/assets/sk/sk_left.png';
	import textureSKRight from '/assets/sk/sk_right.png';
	import textureSKTop from '/assets/sk/sk_top.png';
	import textureSKBottom from '/assets/sk/sk_bottom.png';

	import '/style.css';

	let mixer,mix,clipAction;

	const clock = new THREE.Clock();
    const modelLoader = new GLTFLoader();
	const pointer = new THREE.Vector2();
	const focus = new THREE.Vector3();
	const labelRenderer = new CSS2DRenderer();
	const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 100 );
	const scene = new THREE.Scene();
	const screen = new Screen( 'SJOz3qjfQXU', 0.025, 1.28, 0.53, 0 );
	const sceneRenderer = new THREE.WebGLRenderer( { antialias: true, alpha: true  } );
	const screenRenderer = new CSS3DRenderer({alpha: true });
	const raycaster = new THREE.Raycaster();
	const effect = new OutlineEffect( sceneRenderer );
	const controls = new OrbitControls( camera, sceneRenderer.domElement );

	const stats = new Stats();
	const axesHelper = new THREE.AxesHelper( 10 );

	let label,labelDiv;
	let intersects;
	
	let camPosX, camPosY, camPosZ, camRotX, camRotY, camRotZ;
   	
	let pes94 = new Game("Pesadilla del '94");
	let hormona = new Game("La fiesta de las hormonas");
	let outcash = new Game("Out of cash");
	let rio = new Game("Rio Inmaculado");
	let gandara = new Game("La Gandara");
	let sk = new Game("School Kombat");
	let biricia = new Game("La Biricia");
	let mesh_ids = {};

	let computerCPU = new SceneObject("CPU");
	let computerScreen = new SceneObject("Screen");
	let keyboard = new SceneObject("Keyboard");
	let poster = new SceneObject("Poster");
	let chair = new SceneObject("Silla");
	let shoes = new SceneObject("Bambas");
	let books = new SceneObject("Libros");

	let text;

	let cameraMoving = false;
	let focusIn, zoomIn, focusOut, zoomOut, focused, zoomed;

	Init();
    Animate();

	// -------------- FUNCTIONS -------------------------
	
	function InitLights(){
		// Set light
		const light = new THREE.DirectionalLight( 0xffffff, 3 );
		light.position.set( 1, 1, 1 ).normalize();
		scene.add( light );
	}

	function InitHelpers(){
		scene.add( axesHelper );
		document.body.appendChild( stats.dom );
	}

	function InitLabel(){
		labelRenderer.setSize(innerWidth, innerHeight);
  		labelRenderer.domElement.style.position = 'absolute';
  		labelRenderer.domElement.style.top = '0px';
  		labelRenderer.domElement.style.pointerEvents = 'none';
  		document.body.appendChild(labelRenderer.domElement);

  		labelDiv = document.createElement('div');
  		labelDiv.className = 'label';
  		labelDiv.style.marginTop = '-1em';
		labelDiv.textContent = "";
  		label = new CSS2DObject(labelDiv);
		label.visible = false;
  		scene.add(label);
	}

	function InitModels(){
		
		// Load self
        modelLoader.load( modelSelfUrl, function ( gltf ) {
			gltf.scene.position.set(-1.0,1.5,0.0);
          	gltf.scene.rotation.set(0.0,1.55,0.0);
          	scene.add( gltf.scene );
        }, undefined, function ( error ) {
          	console.error( error );
        } );

		// Load table
        modelLoader.load( modelTableUrl, function ( gltf ) {
			gltf.scene.position.set(0.0,-0.02,0.0);
          	gltf.scene.rotation.set(0.0,0.0,0.0);
			gltf.scene.scale.set(0.8,0.8,0.8);
          	scene.add( gltf.scene );
        }, undefined, function ( error ) {
          	console.error( error );
        } );

		// Load computer cpu
        modelLoader.load( modelComputerUrl, function ( gltf ) {
			gltf.scene.position.set(0.0,0.83,0.3);
          	gltf.scene.rotation.set(0.0,-1.5,0.0);
			gltf.scene.scale.set(1.0,1.0,1.0);
			computerCPU.mesh = gltf.scene;
			computerCPU.id = gltf.scene.children[0].id;
          	computerCPU.name = "CPU 486 DX2 66MHz";
			scene.add( computerCPU.mesh );
        }, undefined, function ( error ) {
          	console.error( error );
        } );

		// Load computer monitor
        modelLoader.load( modelMonitorUrl, function ( gltf ) {
			gltf.scene.position.set(0.025,1.34,0.55);
          	gltf.scene.rotation.set(0.0,-1.5,0.0);
			gltf.scene.scale.set(1.0,1.0,1.0);
			computerScreen.mesh = gltf.scene;
			computerScreen.id = gltf.scene.children[0].children[0].id;
          	computerScreen.name = "Monitor";
			scene.add( computerScreen.mesh );
        }, undefined, function ( error ) {
          	console.error( error );
        } );

		// Load computer keyboard
        modelLoader.load( modelKeyboardUrl, function ( gltf ) {
			gltf.scene.position.set(0.025,0.85,0.7);
          	gltf.scene.rotation.set(0.0,-1.5,0.0);
			gltf.scene.scale.set(1.3,1.3,1.3);
			keyboard.mesh = gltf.scene;
			keyboard.id = gltf.scene.id;
          	keyboard.name = "PC";
			scene.add( keyboard.mesh );
        }, undefined, function ( error ) {
          	console.error( error );
        } );

		// Load chair
        modelLoader.load( modelChairUrl, function ( gltf ) {
			gltf.scene.position.set(0.5,-0.1,1.5);
          	gltf.scene.rotation.set(0.0,-0.9,0.0);
			gltf.scene.scale.set(0.8,0.8,0.8);
          	scene.add( gltf.scene );
        }, undefined, function ( error ) {
          	console.error( error );
        } );

		// Load poster
        modelLoader.load( modelPosterUrl, function ( gltf ) {
			gltf.scene.position.set(1.7,1.2,0.0);
          	gltf.scene.rotation.set(0.0,-1.55,0.0);
			gltf.scene.scale.set(0.6,0.6,0.6);
			poster.mesh = gltf.scene;
			poster.id = gltf.scene.children[0].children[0].id;
			scene.add( poster.mesh );
        }, undefined, function ( error ) {
          	console.error( error );
        } );

		// Load books
        modelLoader.load( modelBooksUrl, function ( gltf ) {
			gltf.scene.position.set(-0.6,0.85,0.4);
          	gltf.scene.rotation.set(0.0,-1.0,0.0);
			gltf.scene.scale.set(1.0,1.0,1.0);
          	scene.add( gltf.scene );
        }, undefined, function ( error ) {
          	console.error( error );
        } );

		// Load floppy 1
        modelLoader.load( modelFloppyUrl, function ( gltf ) {
			gltf.scene.position.set(0.6,0.85,0.4);
          	gltf.scene.rotation.set(-1.55,0.0,0.0);
			gltf.scene.scale.set(0.1,0.1,0.1);
          	scene.add( gltf.scene );
        }, undefined, function ( error ) {
          	console.error( error );
        } );

		// Load floppy 2
        modelLoader.load( modelFloppyUrl, function ( gltf ) {
			gltf.scene.position.set(0.62,0.85,0.46);
          	gltf.scene.rotation.set(-1.50,0.0,0.2);
			gltf.scene.scale.set(0.1,0.1,0.1);
          	scene.add( gltf.scene );
        }, undefined, function ( error ) {
          	console.error( error );
        } );

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

	function InitBoxes(){
		mesh_ids[Load_PES94().id] = pes94;
		mesh_ids[Load_HORMONA().id] = hormona;
		mesh_ids[Load_OUTCASH().id] = outcash;
		mesh_ids[Load_RIO().id] = rio;
		mesh_ids[Load_GANDARA().id] = gandara;
		mesh_ids[Load_SK().id] = sk;
		mesh_ids[Load_BIRICIA().id] = biricia;
	}

	function InitScreen(){
		screen.scale.x = 0.00075;
		screen.scale.y = 0.00075;
		screen.scale.z = 0.00075;
		scene.add( screen );
	}

	function InitSceneRenderer(){
		sceneRenderer.setPixelRatio( window.devicePixelRatio );
		sceneRenderer.setSize( window.innerWidth, window.innerHeight );
		sceneRenderer.setAnimationLoop( Animate );
		document.body.appendChild( sceneRenderer.domElement );
	}

	function InitScreenRenderer(){
		screenRenderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( screenRenderer.domElement );
	}

	function InitControls(){
		controls.minDistance = 0;
        controls.maxDistance = 10;
		controls.minAzimuthAngle = -0.8;
		controls.maxAzimuthAngle = 1;
		controls.minPolarAngle = 1;
		controls.maxPolarAngle = 1.5;
		controls.enablePan = true;
		controls.update();
	}

	function InitCamera(){
		camPosX = -1;
		camPosY = 1.8;
		camPosZ = 3.5;

		camRotX = -1;
		camRotY = 1;
		camRotZ = 4;

		camera.position.set(camPosX,camPosY,camPosZ);
		camera.rotation.set(camRotX,camRotY,camRotZ);
		scene.getWorldPosition( focus );
		//computerScreen.mesh.getWorldPosition( focus );
		camera.lookAt( focus );

		//SetFocusOnScreen();

	}

	async function InitialScene(){

		scene.visible = false;

		// Load bios 2 image
		const containerBios2 = document.createElement( 'div' );
        containerBios2.style = "position: absolute; top: 20px; right: 10px";
		var bios2Image = new Image();
		bios2Image.src = imgBios2Url;
		bios2Image.width = "200";
		bios2Image.height = "150";
		containerBios2.appendChild(bios2Image);
		document.body.appendChild( containerBios2 );

		await sleep(1000);

		// Load bios 1 image
		const containerBios1 = document.createElement( 'div' );
        containerBios1.style = "position: absolute; top: 20px; left: 10px";
		var bios1Image = new Image();
		bios1Image.src = imgBios1Url;
		bios1Image.width = "30";
		bios1Image.height = "50";
		containerBios1.appendChild(bios1Image);
		document.body.appendChild( containerBios1 );

		// Write text line 1
		const containerText1 = document.createElement( 'div' );
		containerText1.style = "position: absolute; top: 0px; left: 50px; color:gray";
		const p1 = document.createElement( 'p' );
		p1.innerHTML = "Atmosphere";
        containerText1.appendChild(p1);
		document.body.appendChild( containerText1 );

		// Write text line 2
		const containerText2 = document.createElement( 'div' );
		containerText2.style = "position: absolute; top: 20px; left: 50px; color:gray";
		const p2 = document.createElement( 'p' );
		p2.innerHTML = "Copyright(C) 1996, MS-Dos Club";
        containerText2.appendChild(p2);
		document.body.appendChild( containerText2 );

		await sleep(1000);

		// Write text line 3
		const containerText3 = document.createElement( 'div' );
		containerText3.style = "position: absolute; top: 100px; left: 50px; color:gray";
		const p3 = document.createElement( 'p' );
		p3.innerHTML = "Total memory: ";
        containerText3.appendChild(p3);
		document.body.appendChild( containerText3 );

		// Write text line 4
		const containerText4 = document.createElement( 'div' );
		containerText4.style = "position: absolute; top: 100px; left: 160px; color:gray";
		const p4 = document.createElement( 'p' );
		p4.innerHTML = "0 MB";
        containerText4.appendChild(p4);
		document.body.appendChild( containerText4 );

		var mem = 0;
		while(mem < 160){
			mem += 32;
			p4.innerHTML = mem + " KB";
			await sleep(10);
		}
		
		await sleep(1000);

		// Write text line 5
		const containerText5 = document.createElement( 'div' );
		containerText5.style = "position: absolute; top: 200px; left: 50px; color:gray";
		const p5 = document.createElement( 'p' );
		p5.innerHTML = "Loading resources...";
        containerText5.appendChild(p5);
		document.body.appendChild( containerText5 );

		await sleep(1000);

		// Write text line 6
		const containerText6 = document.createElement( 'div' );
		containerText6.style = "position: absolute; top: 220px; left: 50px; color:gray";
		const p6 = document.createElement( 'p' );
		p6.innerHTML = "Loading assets...";
        containerText6.appendChild(p6);
		document.body.appendChild( containerText6 );

		await sleep(1000);

		document.body.removeChild( containerBios1 );
		document.body.removeChild( containerBios2 );
		document.body.removeChild( containerText1 );
		document.body.removeChild( containerText2 );
		document.body.removeChild( containerText3 );
		document.body.removeChild( containerText4 );
		document.body.removeChild( containerText5 );
		document.body.removeChild( containerText6 );

		await sleep(1000);

		scene.visible = true;
		document.body.style.backgroundColor = "white";
	}

	// Initialization
	function Init() {

		// Clear current console output
		console.clear();
		
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
		document.addEventListener( 'mousemove', onPointerMove );
		document.addEventListener('click', onPointerClick );
		window.addEventListener( 'resize', onWindowResize );
	}

	//#region Load Boxes

	// Load Out of cash box
	function Load_OUTCASH(){
		// Generate game box
       	var geometry = new THREE.BoxGeometry(1,1.5,0.2);
       	// Textures
       	var material = [
       		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureOutcashLeft) }),
      		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureOutcashRight) }),
    		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureOutcashTop) }),
      		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureOutcashBottom) }),
      		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureOutcashFront) }),
       		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureOutcashBack) })
    	];

		outcash.mesh = new THREE.Mesh( geometry, material );
		outcash.setScale(0.2,0.2,0.2);
		outcash.setPosition(-1.4,1.7,0.14);
		outcash.setRotation(0.0,-0.8,0.0);
		outcash.setCameraOnFocus(-2,2,1);
		scene.add(outcash.mesh);
		return outcash.mesh;
	}
	// Load pes94 box
	function Load_PES94(){
		// Generate game box
        var geometry = new THREE.BoxGeometry(1,1.5,0.2);
        // Textures
        var material = [
         	new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(texturePes94Left) }),
      		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(texturePes94Right) }),
    		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(texturePes94Top) }),
      		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(texturePes94Bottom) }),
      		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(texturePes94Front) }),
       		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(texturePes94Back) })
        ];

		pes94.mesh = new THREE.Mesh( geometry, material );
		pes94.setScale(0.2,0.2,0.2);
		pes94.setPosition(-1.25,1.7,0.14);
		pes94.setRotation(0.0,-0.8,0.0);
		pes94.setCameraOnFocus(-1.6,2,1);
		scene.add(pes94.mesh);
		return pes94.mesh;
	}
	// Load Hormona box
	function Load_HORMONA(){
		// Generate game box
        var geometry = new THREE.BoxGeometry(1,1.5,0.2);
        // Textures
        var material = [
          	new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureHormonaLeft) }),
      		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureHormonaRight) }),
    		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureHormonaTop) }),
      		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureHormonaBottom) }),
      		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureHormonaFront) }),
       		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureHormonaBack) })
        ];

        hormona.mesh = new THREE.Mesh( geometry, material );
		hormona.setScale(0.2,0.2,0.2);
		hormona.setPosition(-1.1,1.7,0.12);
		hormona.setRotation(0.0,-0.8,0.0);
		hormona.setCameraOnFocus(-1.2,2,1);
		scene.add(hormona.mesh);
		return hormona.mesh;
	}
	// Load Rio box
	function Load_RIO(){
		// Generate game box
        var geometry = new THREE.BoxGeometry(1,1.5,0.2);
        // Textures
        var material = [
          	new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureRioLeft) }),
      		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureRioRight) }),
    		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureRioTop) }),
      		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureRioBottom) }),
      		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureRioFront) }),
       		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureRioBack) })
        ];

        rio.mesh = new THREE.Mesh( geometry, material );
		rio.setScale(0.2,0.2,0.2);
		rio.setPosition(-0.95,1.7,0.12);
		rio.setRotation(0.0,-0.8,0.0);
		rio.setCameraOnFocus(-1.0,0,1);
		scene.add(rio.mesh);
		return rio.mesh;
	}
	// Load Rio box
	function Load_GANDARA(){
		// Generate game box
        var geometry = new THREE.BoxGeometry(1,1.5,0.2);
        // Textures
        var material = [
          	new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureGandaraLeft) }),
      		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureGandaraRight) }),
    		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureGandaraTop) }),
      		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureGandaraBottom) }),
      		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureGandaraFront) }),
       		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureGandaraBack) })
        ];

        gandara.mesh = new THREE.Mesh( geometry, material );
		gandara.setScale(0.2,0.2,0.2);
		gandara.setPosition(-0.8,1.7,0.12);
		gandara.setRotation(0.0,-0.8,0.0);
		gandara.setCameraOnFocus(-0.8,2,1);
		scene.add(gandara.mesh);
		return gandara.mesh;
	}
	// Load Rio box
	function Load_SK(){
		// Generate game box
        var geometry = new THREE.BoxGeometry(1,1.5,0.2);
        // Textures
        var material = [
          	new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureSKLeft) }),
      		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureSKRight) }),
    		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureSKTop) }),
      		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureSKBottom) }),
      		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureSKFront) }),
       		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureSKBack) })
        ];

        sk.mesh = new THREE.Mesh( geometry, material );
		sk.setScale(0.2,0.2,0.2);
		sk.setPosition(-0.65,1.7,0.12);
		sk.setRotation(0.0,-0.8,0.0);
		sk.setCameraOnFocus(-0.6,0,1);
		scene.add(sk.mesh);
		return sk.mesh;
	}
	// Load Rio box
	function Load_BIRICIA(){
		// Generate game box
        var geometry = new THREE.BoxGeometry(1,1.5,0.2);
        // Textures
        var material = [
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureBiriciaLeft) }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureBiriciaRight) }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureBiriciaTop) }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureBiriciaBottom) }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureBiriciaFront) }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(textureBiriciaBack) })
        ];

        biricia.mesh = new THREE.Mesh( geometry, material );
		biricia.setScale(0.2,0.2,0.2);
		biricia.setPosition(-0.5,1.7,0.12);
		biricia.setRotation(0.0,-0.8,0.0);
		biricia.setCameraOnFocus(-0.4,0,1);
		scene.add(biricia.mesh);
		return biricia.mesh;
	}

	//#endregion

	//#region Events

	// Window resize event
	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		sceneRenderer.setSize( window.innerWidth, window.innerHeight );
	}

	// Mouse pointer position update event
	function onPointerMove( event ) {
		pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	}

	// Mouse pointer position update event
	function onPointerClick( event ) {

		label.visible = false;
		// find intersections
		raycaster.setFromCamera( pointer, camera );
		intersects = raycaster.intersectObjects( scene.children, true );

		if ( intersects.length > 0 ) {
			const gameBox = mesh_ids[intersects[0].object.id];
			gameBox && !focused && SetFocusOn(gameBox);
			gameBox && focused && gameBox.isFocused() ? ZoomInBox(gameBox) : ReleaseFocus();
			if (!gameBox) {
				switch(intersects[0].object.id) {
					case computerCPU.id:
						break;
					case computerScreen.id:
						if(!focused){SetFocusOnScreen();}
						if(focused){ ReleaseFocus();}
						break;
					case poster.id:
						if(!focused){SetFocusOnPoster();}
						if(focused){ ReleaseFocus();}
						break;
					default:
						if(hormona.isFocused()){FocusOutHormonaBox();}
						if(focused){ReleaseFocus();}
						break;
				}
			}
		} else {
			// TODO check all focus for all boxes
			if(hormona.isFocused()){FocusOutBox(hormona);}
			if(focused){ReleaseFocus();}
		}
	}

	//#endregion

	//#region Camera functions

	function CameraCorrection(){

		if(cameraMoving){
			if(camera.position.x > (camPosX+0.1)){ camera.position.x -= 0.02 ;}
			if(camera.position.x < (camPosX-0.1)){camera.position.x += 0.02 ;}
			if(camera.position.y > (camPosY+0.1)){camera.position.y -= 0.02;}
			if(camera.position.y < (camPosY-0.1)){camera.position.y += 0.02;}
			if(camera.position.z > (camPosZ+0.1)){camera.position.z -= 0.02;}
			if(camera.position.z < (camPosZ-0.1)){camera.position.z += 0.02;}
		}

		if( ((camPosX + 0.5) > camera.position.x )
			& ((camPosX - 0.5) < camera.position.x )
			& ((camPosY + 0.5) > camera.position.y )
			& ((camPosY - 0.5) < camera.position.y )
			& ((camPosZ + 0.5) > camera.position.z )
			& ((camPosZ - 0.5) < camera.position.z )
		){
			if(focusIn){
				focused = true;
				focusIn = false;
			}
			if(zoomIn){
				zoomed = true;
				zoomIn = false;
			}
			if(focusOut){
				focused = false;
				focusOut = false;
			}
			if(zoomOut){
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

	function SetFocusOnScreen(){
		camPosX = 0.1;
		camPosY = 1.1;
		camPosZ = 0.4;

		computerScreen.focus = true;
		focusIn = true;
		cameraMoving = true;
	}

	function SetFocusOnPoster(){
		camPosX = 2;	
		camPosY = 2;
		camPosZ = 2;

		poster.focus = true;
		focusIn = true;
		cameraMoving = true;
	}

	function ReleaseFocus(){
		// Hide label
		label.visible = false;

		camPosX = -1;
		camPosY = 1.8;
		camPosZ = 3.5;

		camRotX = -1;
		camRotY = 1;
		camRotZ = 4;

		scene.getWorldPosition( focus );

		// Reset focus flags
		outcash.focus = false;
		pes94.focus = false;
		hormona.focus = false;
		rio.focus = false;
		gandara.focus = false;
		sk.focus = false;
		biricia.focus = false;
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
	    labelRenderer.render( scene, camera);
		screenRenderer.render( scene, camera);
		sceneRenderer.render( scene, camera );
		effect.render( scene, camera );
	}

	// Animation update
	function Animate() {

		Render();
		stats.update();
        controls.update(); 
	}

	function showLabel(gameObj) {
		labelDiv.textContent = gameObj.name;
		label.position.set(
			gameObj.mesh.position.x,
			gameObj.mesh.position.y + 0.2,
			gameObj.mesh.position.z + 0.2
		);
		label.visible = true;
		if(!focused){gameObj.mesh.getWorldPosition( focus );}
	}

	function ObjectDetection(){
		if(!cameraMoving){controls.target.lerp( focus, 0.001 );}
		else{controls.target.lerp( focus, 0.03 );}
		if(controls.enabled){CameraCorrection();}
		camera.updateMatrixWorld();

		// find intersections
		raycaster.setFromCamera( pointer, camera );
		intersects = raycaster.intersectObjects( scene.children, true );

		// Object detection when zoom is not active
		if(!zoomed & !cameraMoving){
			if ( intersects.length > 0 ) {
				const gameObj = mesh_ids[intersects[0].object.id];
				gameObj && showLabel(gameObj);

				if (!gameObj) {
					switch(intersects[0].object.id){					
						case computerCPU.id:
							showLabel(computerCPU);
							break;
						case computerScreen.id:
							showLabel(computerScreen);
							break;
						case poster.id:
							showLabel(poster);
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

	function Animations(){
		const delta = clock.getDelta();
		if ( mixer ) { mixer.update( delta ); }
		if (mix) {mix.update(delta);}
	}

	function FocusInBox(gameBox){
		
		// Hormona box movement
		const pos = new THREE.VectorKeyframeTrack( '.position', [ 0, 1, 2 ], [ gameBox.mesh.position.x, gameBox.mesh.position.y, gameBox.mesh.position.z, gameBox.mesh.position.x + 0.2, gameBox.mesh.position.y, hormona.mesh.position.z + 0.2, gameBox.mesh.position.x + 0.2, gameBox.mesh.position.y, hormona.mesh.position.z + 1 ] );
		const scale = new THREE.VectorKeyframeTrack( '.scale', [ 0, 1, 2 ], [ gameBox.mesh.scale.x, gameBox.mesh.scale.y, gameBox.mesh.scale.z, gameBox.mesh.scale.x, gameBox.mesh.scale.y, gameBox.mesh.scale.z, hormona.mesh.scale.x , gameBox.mesh.scale.y , gameBox.mesh.scale.z ] );
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
		// Hormona box movement
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

	function ZoomInHomonaBox(){
		
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
		mixer = new THREE.AnimationMixer( hormona.mesh );

		// create a ClipAction and set it to play
		clipAction = mixer.clipAction( clip );
		clipAction.setLoop(THREE.LoopOnce);
  		clipAction.clampWhenFinished = true;
  		//clipAction.enable = true;
		clipAction.play();

		zoomIn = true;
		hormona.zoom = true;
		controls.enabled = false;
	}

	function ZoomOutHormonaBox(){
		// create a keyframe track (i.e. a timed sequence of keyframes) for each animated property
		// Note: the keyframe track type should correspond to the type of the property being animated

		// POSITION
		const positionKF = new THREE.VectorKeyframeTrack( '.position', [ 0, 1, 2 ], [-1.6, 1.7, 0.3, -1.0, 1.8, 0.20, -1.1, 1.7, 0.12  ] );

		// SCALE
		const scaleKF = new THREE.VectorKeyframeTrack( '.scale', [ 0, 1, 2 ], [ 0.5, 0.5, 0.5, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2 ] );
		// ROTATION
				
		// Rotation should be performed using quaternions, using a THREE.QuaternionKeyframeTrack
		// Interpolating Euler angles (.rotation property) can be problematic and is currently not supported

		// set up rotation about y axis for first step 
		const xAxis = new THREE.Vector3( 0, 1, 0 );
		const qInitial = new THREE.Quaternion().setFromAxisAngle( xAxis, 0.0 );
		const qMiddle = new THREE.Quaternion().setFromAxisAngle( xAxis, -0.4 );
		const qFinal = new THREE.Quaternion().setFromAxisAngle( xAxis, -0.8); //Math.PI );
		const quaternionKF = new THREE.QuaternionKeyframeTrack( '.quaternion', [ 0, 1, 2 ], [ qInitial.x, qInitial.y, qInitial.z, qInitial.w, qMiddle.x, qMiddle.y, qMiddle.z, qMiddle.w, qFinal.x, qFinal.y, qFinal.z, qFinal.w ] );

		// COLOR
		const colorKF = new THREE.ColorKeyframeTrack( '.material.color', [ 0, 1, 2 ], [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ], THREE.InterpolateDiscrete );

		// OPACITY
		const opacityKF = new THREE.NumberKeyframeTrack( '.material.opacity', [ 0, 1, 2 ], [ 1, 1, 1 ] );

		// create an animation sequence with the tracks
		// If a negative time value is passed, the duration will be calculated from the times of the passed tracks array
		const clip = new THREE.AnimationClip( 'Action', 3, [ scaleKF, positionKF, quaternionKF, colorKF, opacityKF ] );

		// setup the THREE.AnimationMixer
		mixer = new THREE.AnimationMixer( hormona.mesh );

		// create a ClipAction and set it to play
		clipAction = mixer.clipAction( clip );
		clipAction.setLoop(THREE.LoopOnce);
  		clipAction.clampWhenFinished = true;
  		//clipAction.enable = true;
		clipAction.play();

		zoomIn = false;
		hormona.zoom = false;
		controls.enabled = true;
	}

	function ZoomInOutCashBox(){


	}
	function ZoomOutOutCashBox(){

	}
	function ZoomInPes94Box(){


	}
	function ZoomOutPes94Box(){

	}
	function ZoomInRioBox(){


	}
	function ZoomOutRioBox(){

	}

	function Screen( id, x, y, z, ry ) {
		const div = document.createElement( 'div' );
		div.style.width = '480px';
		div.style.height = '360px';
		div.style.backgroundColor = '#232342';

		const iframe = document.createElement( 'iframe' );
		iframe.style.width = '480px';
		iframe.style.height = '360px';
		iframe.style.border = '0px';
		iframe.src = 'https://msdos.club';
		div.appendChild( iframe );

		const object = new CSS3DObject( div );
		object.position.set( x, y, z );
		object.rotation.y = ry;

		return object;
	}

	function sleep(ms) {
  		return new Promise(resolve => setTimeout(resolve, ms));		
	}