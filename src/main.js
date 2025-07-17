
  	import * as THREE from 'three';
  	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
	import Stats from 'three/addons/libs/stats.module.js';
	import { CSS2DRenderer, CSS2DObject, } from 'three/addons/renderers/CSS2DRenderer.js';
	import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
	import { Game } from './game.js';
	import { SceneObject } from './sceneObject.js';

	import '/src/style.css';

	let stats;
	let effect;
	let camera, scene, raycaster, renderer,screenRenderer,controls,mixer,mix,clipAction;

	const clock = new THREE.Clock();
    const modelLoader = new GLTFLoader();
	const pointer = new THREE.Vector2();
	const focus = new THREE.Vector3();
	const labelRenderer = new CSS2DRenderer();

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

	let computerCPU = new SceneObject("CPU");
	let computerScreen = new SceneObject("Screen");
	let keyboard = new SceneObject("Keyboard");
	let poster = new SceneObject("Poster");
	let chair = new SceneObject("Silla");
	let shoes = new SceneObject("Bambas");
	let books = new SceneObject("Libros");

	let text;
	let screen;

	let cameraMoving = false;
	let focusIn, zoomIn, focusOut, zoomOut, focused, zoomed;

	Init();
    Animate();

	// -------------- FUNCTIONS -------------------------
	
	// Initialization
	function Init() {

		// Clear current console output
		console.clear();

		camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 100 );
        scene = new THREE.Scene();
	
		// Set light
		const light = new THREE.DirectionalLight( 0xffffff, 3 );
		light.position.set( 1, 1, 1 ).normalize();
		scene.add( light );
	
		const axesHelper = new THREE.AxesHelper( 10 );
		scene.add( axesHelper );

		labelRenderer.setSize(innerWidth, innerHeight);
  		labelRenderer.domElement.style.position = 'absolute';
  		labelRenderer.domElement.style.top = '0px';
  		labelRenderer.domElement.style.pointerEvents = 'none';
  		document.body.appendChild(labelRenderer.domElement);

  		labelDiv = document.createElement('div');
  		labelDiv.className = 'label';
  		labelDiv.style.marginTop = '-1em';
		labelDiv.textContent = "hola mundo";
  		label = new CSS2DObject(labelDiv);
		label.visible = false;
  		scene.add(label);
		
		// Load self
        modelLoader.load( 'assets/models/self.glb', function ( gltf ) {
			gltf.scene.position.set(-1.0,1.5,0.0);
          	gltf.scene.rotation.set(0.0,1.55,0.0);
          	scene.add( gltf.scene );
        }, undefined, function ( error ) {
          	console.error( error );
        } );

		// Load table
        modelLoader.load( 'assets/models/table.glb', function ( gltf ) {
			gltf.scene.position.set(0.0,-0.02,0.0);
          	gltf.scene.rotation.set(0.0,0.0,0.0);
			gltf.scene.scale.set(0.8,0.8,0.8);
          	scene.add( gltf.scene );
        }, undefined, function ( error ) {
          	console.error( error );
        } );

		// Load computer cpu
        modelLoader.load( 'assets/models/computer.glb', function ( gltf ) {
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
        modelLoader.load( 'assets/models/monitor.glb', function ( gltf ) {
			gltf.scene.position.set(0.025,1.13,0.4);
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
        modelLoader.load( 'assets/models/keyboard.glb', function ( gltf ) {
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
        modelLoader.load( 'assets/models/chair.glb', function ( gltf ) {
			gltf.scene.position.set(0.5,-0.1,1.5);
          	gltf.scene.rotation.set(0.0,-0.9,0.0);
			gltf.scene.scale.set(0.8,0.8,0.8);
          	scene.add( gltf.scene );
        }, undefined, function ( error ) {
          	console.error( error );
        } );

		// Load poster
        modelLoader.load( 'assets/models/poster.glb', function ( gltf ) {
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
        modelLoader.load( 'assets/models/books.glb', function ( gltf ) {
			gltf.scene.position.set(-0.6,0.85,0.4);
          	gltf.scene.rotation.set(0.0,-1.0,0.0);
			gltf.scene.scale.set(1.0,1.0,1.0);
          	scene.add( gltf.scene );
        }, undefined, function ( error ) {
          	console.error( error );
        } );

		// Load floppy 1
        modelLoader.load( 'assets/models/floppy.glb', function ( gltf ) {
			gltf.scene.position.set(0.6,0.85,0.4);
          	gltf.scene.rotation.set(-1.55,0.0,0.0);
			gltf.scene.scale.set(0.1,0.1,0.1);
          	scene.add( gltf.scene );
        }, undefined, function ( error ) {
          	console.error( error );
        } );

		// Load floppy 2
        modelLoader.load( 'assets/models/floppy.glb', function ( gltf ) {
			gltf.scene.position.set(0.62,0.85,0.46);
          	gltf.scene.rotation.set(-1.50,0.0,0.2);
			gltf.scene.scale.set(0.1,0.1,0.1);
          	scene.add( gltf.scene );
        }, undefined, function ( error ) {
          	console.error( error );
        } );

		// Load SHOES
        /*modelLoader.load( 'assets/models/shoes.glb', function ( gltf ) {
			gltf.scene.position.set(-0.5,0.0,1.0);
          	gltf.scene.rotation.set(0.0,90.0,0.0);
			gltf.scene.scale.set(0.3,0.3,0.3);
          	scene.add( gltf.scene );
        }, undefined, function ( error ) {
          	console.error( error );
        } );*/

       	Load_PES94();
		Load_HORMONA();
		Load_OUTCASH();
		Load_RIO();
		Load_GANDARA();
		Load_SK();
		Load_BIRICIA();

        raycaster = new THREE.Raycaster();

		renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true  } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.setAnimationLoop( Animate );
		document.body.appendChild( renderer.domElement );

		screenRenderer = new CSS3DRenderer({alpha: true });
		screenRenderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( screenRenderer.domElement );

		screen = new Screen( 'SJOz3qjfQXU', 0.025, 1.28, 0.53, 0 );
		screen.scale.x = 0.00075;
		screen.scale.y = 0.00075;
		screen.scale.z = 0.00075;
		scene.add( screen );
	
		stats = new Stats();
		document.body.appendChild( stats.dom );
 
        const container = document.createElement( 'div' );
        container.style= "text-align:center; background-color:red; cursor: pointer; opacity: 0.9; z-index: 10000;";
        const p = document.createElement( 'p' );
        p.id = "messageBox";
        container.appendChild(p)
        document.body.appendChild( container );
        var panel = document.getElementById("messageBox");
        panel.innerHTML = "test";
        panel.style.display = "block";

        controls = new OrbitControls( camera, renderer.domElement );
        controls.minDistance = 0.8;
        controls.maxDistance = 28;
		controls.minAzimuthAngle = -0.8;
		controls.maxAzimuthAngle = 1;
		controls.minPolarAngle = 1;
		controls.maxPolarAngle = 1.5;
		controls.enablePan = true;
		controls.update();

		camPosX = -1;
		camPosY = 1.8;
		camPosZ = 3.5;

		camRotX = -1;
		camRotY = 1;
		camRotZ = 4;

		camera.position.set(camPosX,camPosY,camPosZ);
		scene.getWorldPosition( focus );
		camera.lookAt( scene.position );
		camera.updateMatrixWorld();
		
		effect = new OutlineEffect( renderer );

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
       		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/outcash/outofcash_left.png") }),
      		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/outcash/outofcash_right.png") }),
    		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/outcash/outofcash_top.png") }),
      		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/outcash/outofcash_bottom.png") }),
      		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/outcash/outofcash_front.png") }),
       		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/outcash/outofcash_back.png") })
    	];

		outcash.mesh = new THREE.Mesh( geometry, material );
		outcash.setScale(0.2,0.2,0.2);
		outcash.setPosition(-1.4,1.7,0.14);
		outcash.setRotation(0.0,-0.8,0.0);
		outcash.setCameraOnFocus(-2,2,1);
		scene.add(outcash.mesh);
	}
	// Load pes94 box
	function Load_PES94(){
		// Generate game box
        var geometry = new THREE.BoxGeometry(1,1.5,0.2);
        // Textures
        var material = [
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/pes94/pes94_left.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/pes94/pes94_right.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/pes94/pes94_top.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/pes94/pes94_bottom.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/pes94/pes94_front.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/pes94/pes94_back.png") })
        ];

		pes94.mesh = new THREE.Mesh( geometry, material );
		pes94.setScale(0.2,0.2,0.2);
		pes94.setPosition(-1.25,1.7,0.14);
		pes94.setRotation(0.0,-0.8,0.0);
		pes94.setCameraOnFocus(-1.6,2,1);
		scene.add(pes94.mesh);
	}
	// Load Hormona box
	function Load_HORMONA(){
		// Generate game box
        var geometry = new THREE.BoxGeometry(1,1.5,0.2);
        // Textures
        var material = [
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/hormona/hormona_left.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/hormona/hormona_right.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/hormona/hormona_top.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/hormona/hormona_bottom.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/hormona/hormona_front.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/hormona/hormona_back.png") })
        ];

        hormona.mesh = new THREE.Mesh( geometry, material );
		hormona.setScale(0.2,0.2,0.2);
		hormona.setPosition(-1.1,1.7,0.12);
		hormona.setRotation(0.0,-0.8,0.0);
		hormona.setCameraOnFocus(-1.2,2,1);
		scene.add(hormona.mesh);
	}
	// Load Rio box
	function Load_RIO(){
		// Generate game box
        var geometry = new THREE.BoxGeometry(1,1.5,0.2);
        // Textures
        var material = [
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/rio/rio_left.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/rio/rio_right.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/rio/rio_top.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/rio/rio_bottom.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/rio/rio_front.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/rio/rio_back.png") })
        ];

        rio.mesh = new THREE.Mesh( geometry, material );
		rio.setScale(0.2,0.2,0.2);
		rio.setPosition(-0.95,1.7,0.12);
		rio.setRotation(0.0,-0.8,0.0);
		rio.setCameraOnFocus(-1.0,0,1);
		scene.add(rio.mesh);
	}
	// Load Rio box
	function Load_GANDARA(){
		// Generate game box
        var geometry = new THREE.BoxGeometry(1,1.5,0.2);
        // Textures
        var material = [
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/gandara/gandara_left.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/gandara/gandara_right.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/gandara/gandara_top.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/gandara/gandara_bottom.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/gandara/gandara_front.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/gandara/gandara_back.png") })
        ];

        gandara.mesh = new THREE.Mesh( geometry, material );
		gandara.setScale(0.2,0.2,0.2);
		gandara.setPosition(-0.8,1.7,0.12);
		gandara.setRotation(0.0,-0.8,0.0);
		gandara.setCameraOnFocus(-0.8,2,1);
		scene.add(gandara.mesh);
	}
	// Load Rio box
	function Load_SK(){
		// Generate game box
        var geometry = new THREE.BoxGeometry(1,1.5,0.2);
        // Textures
        var material = [
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/sk/sk_left.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/sk/sk_right.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/sk/sk_top.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/sk/sk_bottom.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/sk/sk_front.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/sk/sk_back.png") })
        ];

        sk.mesh = new THREE.Mesh( geometry, material );
		sk.setScale(0.2,0.2,0.2);
		sk.setPosition(-0.65,1.7,0.12);
		sk.setRotation(0.0,-0.8,0.0);
		sk.setCameraOnFocus(-0.6,0,1);
		scene.add(sk.mesh);
	}
	// Load Rio box
	function Load_BIRICIA(){
		// Generate game box
        var geometry = new THREE.BoxGeometry(1,1.5,0.2);
        // Textures
        var material = [
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/biricia/biricia_left.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/biricia/biricia_right.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/biricia/biricia_top.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/biricia/biricia_bottom.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/biricia/biricia_front.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/biricia/biricia_back.png") })
        ];

        biricia.mesh = new THREE.Mesh( geometry, material );
		biricia.setScale(0.2,0.2,0.2);
		biricia.setPosition(-0.5,1.7,0.12);
		biricia.setRotation(0.0,-0.8,0.0);
		biricia.setCameraOnFocus(-0.4,0,1);
		scene.add(biricia.mesh);
	}

	//#endregion

	//#region Events

	// Window resize event
	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
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
			switch(intersects[0].object.id){
				case outcash.mesh.id:
					if(!focused){ SetFocusOnOutCash();	} 
					if(focused & !outcash.isFocused()){ ReleaseFocus(); }
					if(focused & outcash.isFocused()){ ZoomInOutCashBox(); }
					break;
				case pes94.mesh.id:
					if(!focused){ SetFocusOnPes94(); } 
					if(focused & !pes94.isFocused()){ ReleaseFocus(); }
					if(focused & pes94.isFocused()){ ZoomInPes94Box(); } 
					break;
				case hormona.mesh.id:
					if(!focused){ SetFocusOnHormona(); } 
					if(focused & !hormona.isFocused()){ ReleaseFocus(); }
					if(focused & hormona.isFocused()){ ZoomInHomonaBox(); } 
					break;
				case rio.mesh.id:
					if(!focused){ SetFocusOnRio(); } 
					if(focused & !rio.isFocused()){ ReleaseFocus(); }
					if(focused & rio.isFocused()){ ZoomInRioBox(); } 
					break;
				case gandara.mesh.id:
					if(!focused){ SetFocusOnGandara(); } 
					if(focused & !gandara.isFocused()){ ReleaseFocus(); }
					if(focused & gandara.isFocused()){  } 
					break;
				case sk.mesh.id:
					if(!focused){ SetFocusOnSK(); } 
					if(focused & !sk.isFocused()){ ReleaseFocus(); }
					if(focused & sk.isFocused()){  } 
					break;
				case biricia.mesh.id:
					if(!focused){ SetFocusOnBiricia(); } 
					if(focused & !biricia.isFocused()){ ReleaseFocus(); }
					if(focused & biricia.isFocused()){  } 
					break;
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
		} else {
			if(hormona.isFocused()){FocusOutHormonaBox();}
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

	function SetFocusOnHormona(){
		camPosX = hormona.cameraOnFocus.x;
		camPosZ = hormona.cameraOnFocus.z;
		hormona.focus = true;
		focusIn = true;	
		cameraMoving = true;
		FocusInHomonaBox();
	}

	function SetFocusOnPes94(){
		camPosX = pes94.cameraOnFocus.x;
		camPosZ = pes94.cameraOnFocus.z;
		pes94.focus = true;	
		focusIn = true;	
		cameraMoving = true;
	}

	function SetFocusOnOutCash(){
		camPosX = outcash.cameraOnFocus.x;
		camPosZ = outcash.cameraOnFocus.z;
		outcash.focus = true;	
		focusIn = true;	
		cameraMoving = true;	
	}

	function SetFocusOnRio(){
		camPosX = rio.cameraOnFocus.x;
		camPosZ = rio.cameraOnFocus.z;
		rio.focus = true;	
		focusIn = true;	
		cameraMoving = true;
	}

	function SetFocusOnGandara(){
		camPosX = gandara.cameraOnFocus.x;
		camPosZ = gandara.cameraOnFocus.z;
		gandara.focus = true;
		focusIn = true;		
		cameraMoving = true;
	}

	function SetFocusOnSK(){
		camPosX = sk.cameraOnFocus.x;
		camPosZ = sk.cameraOnFocus.z;
		sk.focus = true;		
		focusIn = true;
		cameraMoving = true;
	}

	function SetFocusOnBiricia(){
		camPosX = biricia.cameraOnFocus.x;
		camPosZ = biricia.cameraOnFocus.z;
		biricia.focus = true;	
		focusIn = true;	
		cameraMoving = true;
	}

	function SetFocusOnScreen(){
		camPosX = 0;
		camPosY = 1.2;
		camPosZ = 1;

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
		ActionUpdate();
	    labelRenderer.render( scene, camera);
		screenRenderer.render( scene, camera);
		renderer.render( scene, camera );
		effect.render( scene, camera );
	}

	// Animation update
	function Animate() {

		Render();
		stats.update();
        controls.update(); 
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
				switch(intersects[0].object.id){
					case outcash.mesh.id:
						// Show label
      					labelDiv.textContent = outcash.name;
      					label.position.set(
        					outcash.mesh.position.x,
        					outcash.mesh.position.y + 0.2,
        					outcash.mesh.position.z + 0.2
      					);
						label.visible = true;
						if(!focused){ outcash.mesh.getWorldPosition( focus );}
						break;
					case pes94.mesh.id:
						// Show label
      					labelDiv.textContent = pes94.name;
      					label.position.set(
        					pes94.mesh.position.x,
        					pes94.mesh.position.y + 0.2,
        					pes94.mesh.position.z + 0.2
      					);
						label.visible = true;
						if(!focused){pes94.mesh.getWorldPosition( focus );}
						break;
					case hormona.mesh.id:
						labelDiv.textContent = hormona.name;
      					label.position.set(
        					hormona.mesh.position.x,
        					hormona.mesh.position.y + 0.2,
        					hormona.mesh.position.z + 0.2
      					);
						label.visible = true;
						if(!focused){hormona.mesh.getWorldPosition( focus );}
						break;
					case rio.mesh.id:
						labelDiv.textContent = rio.name;
      					label.position.set(
        					rio.mesh.position.x,
        					rio.mesh.position.y + 0.2,
        					rio.mesh.position.z + 0.2
      					);
						label.visible = true;
						if(!focused){rio.mesh.getWorldPosition( focus );}
						break;
					case gandara.mesh.id:
						labelDiv.textContent = gandara.name;
      					label.position.set(
        					gandara.mesh.position.x,
        					gandara.mesh.position.y + 0.2,
        					gandara.mesh.position.z + 0.2
      					);
						label.visible = true;
						if(!focused){gandara.mesh.getWorldPosition( focus );}
						break;
					case sk.mesh.id:
						labelDiv.textContent = sk.name;
      					label.position.set(
        					sk.mesh.position.x,
        					sk.mesh.position.y + 0.2,
        					sk.mesh.position.z + 0.2
      					);
						label.visible = true;
						if(!focused){sk.mesh.getWorldPosition( focus );}
						break;
					case biricia.mesh.id:
						labelDiv.textContent = biricia.name;
      					label.position.set(
        					biricia.mesh.position.x,
        					biricia.mesh.position.y + 0.2,
        					biricia.mesh.position.z + 0.2
      					);
						label.visible = true;
						if(!focused){biricia.mesh.getWorldPosition( focus );}
						break;
					case computerCPU.id:
						labelDiv.textContent = computerCPU.name;
      					label.position.set(
        					computerCPU.mesh.position.x,
        					computerCPU.mesh.position.y + 0.2,
        					computerCPU.mesh.position.z + 0.2
      					);
						label.visible = true;
						computerCPU.mesh.getWorldPosition( focus );
						break;
					case computerScreen.id:
						labelDiv.textContent = computerScreen.name;
      					label.position.set(
        					computerScreen.mesh.position.x,
        					computerScreen.mesh.position.y + 0.4,
        					computerScreen.mesh.position.z + 0.2
      					);
						label.visible = true;
						if(!focused){computerScreen.mesh.getWorldPosition( focus );}
						break;
					case poster.id:
						labelDiv.textContent = poster.name;
      					label.position.set(
        					poster.mesh.position.x,
        					poster.mesh.position.y + 0.6,
        					poster.mesh.position.z + 0.2
      					);
						label.visible = true;
						if(!focused){poster.mesh.getWorldPosition( focus );}
						break;
					default:
						// Hide label
						if(!focused){scene.getWorldPosition( focus );}
						label.visible = false;
						break;
				}
			} else {
				// Hide label
				scene.getWorldPosition( focus );
				label.visible = false;
				document.getElementById("messageBox").innerHTML = "";
        		//document.getElementById("messageBox").innerHTML = "nothing";
			}
		}
	}

	function ActionUpdate(){
		if(hormona.isFocused() & !cameraMoving){document.getElementById("messageBox").innerHTML = "focus on hormona";}
		if(pes94.isFocused() & !cameraMoving){document.getElementById("messageBox").innerHTML = "focus on pes94";}
		if(outcash.isFocused() & !cameraMoving){document.getElementById("messageBox").innerHTML = "focus on out of cash";}
		if(rio.isFocused() & !cameraMoving){document.getElementById("messageBox").innerHTML = "focus on rio";}
		if(gandara.isFocused() & !cameraMoving){document.getElementById("messageBox").innerHTML = "focus on gandara";}
		if(sk.isFocused() & !cameraMoving){document.getElementById("messageBox").innerHTML = "focus on school kombat";}
		if(biricia.isFocused() & !cameraMoving){document.getElementById("messageBox").innerHTML = "focus on biricia";}
		if(computerScreen.isFocused() & !cameraMoving){document.getElementById("messageBox").innerHTML = "focus on screen";}
		if(poster.isFocused() & !cameraMoving){document.getElementById("messageBox").innerHTML = "focus on poster";}
		
		if(cameraMoving){document.getElementById("messageBox").innerHTML = "camera moving";}
	}

	function Animations(){
		const delta = clock.getDelta();
		if ( mixer ) { mixer.update( delta ); }
		if (mix) {mix.update(delta);}
	}

	function FocusInHomonaBox(){
		
		// Hormona box movement
		const pos = new THREE.VectorKeyframeTrack( '.position', [ 0, 1, 2 ], [ hormona.mesh.position.x, hormona.mesh.position.y, hormona.mesh.position.z, hormona.mesh.position.x + 0.2, hormona.mesh.position.y, hormona.mesh.position.z + 0.2, hormona.mesh.position.x + 0.2, hormona.mesh.position.y, hormona.mesh.position.z + 1 ] );
		const scale = new THREE.VectorKeyframeTrack( '.scale', [ 0, 1, 2 ], [ hormona.mesh.scale.x, hormona.mesh.scale.y, hormona.mesh.scale.z, hormona.mesh.scale.x, hormona.mesh.scale.y, hormona.mesh.scale.z, hormona.mesh.scale.x , hormona.mesh.scale.y , hormona.mesh.scale.z ] );
		const axis = new THREE.Vector3( 0, 1, 0 );
		const inital_q = new THREE.Quaternion().setFromAxisAngle( axis, -0.8 );
		const middle_q = new THREE.Quaternion().setFromAxisAngle( axis, -0.4 );
		const final_q = new THREE.Quaternion().setFromAxisAngle( axis, 0.0 );
		const quaternion = new THREE.QuaternionKeyframeTrack( '.quaternion', [ 0, 1, 2 ], [ inital_q.x, inital_q.y, inital_q.z, inital_q.w, middle_q.x, middle_q.y, middle_q.z, middle_q.w, final_q.x, final_q.y, final_q.z, final_q.w ] );
		const clip = new THREE.AnimationClip( 'Action', 3, [ scale, pos, quaternion ] );
		mix = new THREE.AnimationMixer( hormona.mesh );

		// create a ClipAction and set it to play
		clipAction = mix.clipAction( clip );
		clipAction.setLoop(THREE.LoopOnce);
  		clipAction.clampWhenFinished = true;
		clipAction.play();
	}

	function FocusOutHormonaBox(){
		// Hormona box movement
		const pos = new THREE.VectorKeyframeTrack( '.position', [ 0, 1, 2 ], [ hormona.mesh.position.x, hormona.mesh.position.y, hormona.mesh.position.z, hormona.mesh.position.x, hormona.mesh.position.y, hormona.mesh.position.z - 0.8, hormona.mesh.position.x - 0.2, hormona.mesh.position.y, hormona.mesh.position.z - 1.0 ] );
		const scale = new THREE.VectorKeyframeTrack( '.scale', [ 0, 1, 2 ], [ hormona.mesh.scale.x, hormona.mesh.scale.y, hormona.mesh.scale.z, hormona.mesh.scale.x, hormona.mesh.scale.y, hormona.mesh.scale.z , hormona.mesh.scale.x , hormona.mesh.scale.y , hormona.mesh.scale.z ] );
		const axis = new THREE.Vector3( 0, 1, 0 );
		const inital_q = new THREE.Quaternion().setFromAxisAngle( axis, 0.0 );
		const middle_q = new THREE.Quaternion().setFromAxisAngle( axis, -0.4 );
		const final_q = new THREE.Quaternion().setFromAxisAngle( axis, -0.8 );
		const quaternion = new THREE.QuaternionKeyframeTrack( '.quaternion', [ 0, 1, 2 ], [ inital_q.x, inital_q.y, inital_q.z, inital_q.w, middle_q.x, middle_q.y, middle_q.z, middle_q.w, final_q.x, final_q.y, final_q.z, final_q.w ] );
		const clip = new THREE.AnimationClip( 'Action', 3, [ scale, pos, quaternion ] );
		mix = new THREE.AnimationMixer( hormona.mesh );

		// create a ClipAction and set it to play
		clipAction = mix.clipAction( clip );
		clipAction.setLoop(THREE.LoopOnce);
  		clipAction.clampWhenFinished = true;
		clipAction.play();

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
		iframe.src = [ 'https://www.youtube.com/embed/', id, '?rel=0' ].join( '' );
		div.appendChild( iframe );

		const object = new CSS3DObject( div );
		object.position.set( x, y, z );
		object.rotation.y = ry;

		return object;
	}
