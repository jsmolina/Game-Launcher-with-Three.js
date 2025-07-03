
  	import * as THREE from 'three';
  	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
  	import Stats from 'three/addons/libs/stats.module.js';
	import '/src/style.css';

	let stats;
	let camera, scene, raycaster, renderer,controls;

	let INTERSECTED;
	let theta = 0;

    const loader = new GLTFLoader();
	const pointer = new THREE.Vector2();
	const radius = 3;
    let gameArray = {};  
	const gameIndex={
		pes94: 0,
		hormona: 1,
		outofcash: 2
	};
	
	//const pes94 = new Game("Pesadilla del 94");

	let pes94,hormona,outofcash,rio,gandara,sk,biricia;

	Init();
    Animate();

	// -------------- FUNCTIONS -------------------------
	
	// Initialization
	function Init() {
		camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 100 );
        scene = new THREE.Scene();
		scene.background = new THREE.Color( 0xf0f0f0 );

		// Set light
		const light = new THREE.DirectionalLight( 0xffffff, 3 );
		light.position.set( 1, 1, 1 ).normalize();
		scene.add( light );

		// Load self
        loader.load( 'assets/models/self.glb', function ( gltf ) {
			gltf.scene.position.set(0.0,1.98,0.0);
          	gltf.scene.rotation.set(0.0,1.5,0.0);
    
          	scene.add( gltf.scene );
        }, undefined, function ( error ) {
          	console.error( error );
        } );

       	Load_PES94();
        scene.add( gameArray[gameIndex.pes94] );
		Load_HORMONA();
        scene.add( gameArray[gameIndex.hormona] );

        raycaster = new THREE.Raycaster();

		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.setAnimationLoop( Animate );
		document.body.appendChild( renderer.domElement );

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
        controls.minDistance = 4;
        controls.maxDistance = 10;
        controls.target.set( 0, 0, - 0.2 );
        controls.update();

		// Declare events
		document.addEventListener( 'mousemove', onPointerMove );
		window.addEventListener( 'resize', onWindowResize );
	}

	// Load pes94 box
	function Load_PES94(){
		// Generate game box
        var geometry = new THREE.BoxGeometry(1,2,0.2);
        // Pes94 textures
        var material = [
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/pes94/pes94_left.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/pes94/pes94_right.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/pes94/pes94_top.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/pes94/pes94_top.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/pes94/pes94_front.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/pes94/pes94_back.png") })
        ];

		//pes94.obj = new THREE.Mesh( geometry, material );
        //const object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
        gameArray[gameIndex.pes94] = new THREE.Mesh( geometry, material );
		gameArray[gameIndex.pes94].scale.set(0.3,0.3,0.3);
		gameArray[gameIndex.pes94].position.set(-0.5,2.34,0.12);
		gameArray[gameIndex.pes94].rotation.set(0.0,80.0,0.0);
	}

	// Load Hormona box
	function Load_HORMONA(){
		// Generate game box
        var geometry = new THREE.BoxGeometry(1,2,0.2);
        // Pes94 textures
        var material = [
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/hormona/hormona_left.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/hormona/hormona_right.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/hormona/hormona_top.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/hormona/hormona_top.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/hormona/hormona_front.png") }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("assets/hormona/hormona_back.png") })
        ];

        //const object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
        gameArray[gameIndex.hormona] = new THREE.Mesh( geometry, material );
		gameArray[gameIndex.hormona].scale.set(0.3,0.3,0.3);
		gameArray[gameIndex.hormona].position.set(-0.2,2.34,0.12);
		gameArray[gameIndex.hormona].rotation.set(0.0,80.0,0.0);
	}

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

	// Animation update
	function Animate() {
		Render();
		stats.update();
        controls.update();
	}

	// Render update
	function Render() {
		theta += 0.1;
        //camera.position.set(radius,radius,radius);
		//camera.position.x = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
		//camera.position.y = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
		//camera.position.z = radius * Math.cos( THREE.MathUtils.degToRad( theta ) );
		camera.lookAt( scene.position );
		camera.updateMatrixWorld();

		// find intersections
		raycaster.setFromCamera( pointer, camera );

		const intersects = raycaster.intersectObjects( scene.children, false );

		if ( intersects.length > 0 ) {
			switch(intersects[0].object.id){
				case gameIndex.pes94:
					document.getElementById("messageBox").innerHTML = "Pesadilla del '94";
					break;
				case gameIndex.hormona:
					document.getElementById("messageBox").innerHTML = "La fiesta de las hormonas";
					break;
				default:
					document.getElementById("messageBox").innerHTML = intersects[0].object.id;
					break;
			}
        	

			if ( INTERSECTED != intersects[ 0 ].object ) {
				/*if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
				INTERSECTED = intersects[ 0 ].object;
				INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
				INTERSECTED.material.emissive.setHex( 0xff0000 );*/        
			}
		} else {
        	document.getElementById("messageBox").innerHTML = "";
			//if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
			INTERSECTED = null;
		}

		renderer.render( scene, camera );
	}