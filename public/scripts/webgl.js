if (!Detector.webgl){
	Detector.addGetWebGLMessage();
} else {
	var _scene;
	var _camera;
	var _renderer;
	var _stats;
	var _mesh;
	var _ambLight;
	var _pl1;
	var _pl1SphereSize;
	var _pl1Helper;
	
	var params = {
		rotate         : true,
		camX  		   : 0,
		camY 		   : 0,
		camZ 		   : 1500,
		camFov         : 45,
		fogColor       : 0x333333,
		fogNear		   : 1,
		fogFar		   : 5000,
		alColor 	   : 0x333333,
		alIntensity    : 0.5,
		pl1Color 	   : 0xffffff,
		pl1Intensity   : 0.5,
		pl1Distance    : 0,
		pl1Decay 	   : 5000,
		pl1SphereSize  : 1,
		rendClearColor : 0xcccccc
	};

	init();
	animate();
}

function init() {
	// camera
	_camera = new THREE.PerspectiveCamera(params.Fov, window.innerWidth / window.innerHeight, 1, 5000);
	_camera.position.z = params.camZ;
	
	// create and set the scene
	_scene = new THREE.Scene();
	_scene.fog = new THREE.Fog(params.fogColor, params.fogNear, params.fogFar);
	//_scene.fog.color.setHSL( 0.6, 0, 1 );
	
	// ambient light
	_ambLight = new THREE.AmbientLight(params.alColor, params.alIntensity);
	_scene.add(_ambLight);
	
	// point light
	_pl1 = new THREE.PointLight(params.pl1Color, params.pl1Intensity, params.pl1Distance, params.pl1Decay);
	_pl1.position.set(-200, 300, 0);
	_scene.add(_pl1);
	
	_pl1Helper = new THREE.PointLightHelper(_pl1, params.pl1SphereSize);
	_scene.add(_pl1Helper);
	
	// box
	new THREE.TextureLoader().load('images/crate.jpg', function(map){
		
		map.wrapS            = THREE.RepeatWrapping;
		map.wrapT 			 = THREE.RepeatWrapping;
		map.anisotropy 		 = 4;
		map.repeat.set(1, 1);
		
		var geometry = new THREE.BoxBufferGeometry(512, 512, 512);
		var material = new THREE.MeshPhongMaterial({
				//roughness : 0.7,
				color     : 0xffffff,
				bumpScale : 0.002//,
				//metalness : 0.2
		});
		material.map 		 = map;
		material.needsUpdate = true;

		_mesh = new THREE.Mesh(geometry, material);
		_scene.add(_mesh);
	});
	
	// renderer
	_renderer = new THREE.WebGLRenderer();
	_renderer.setClearColor(params.rendClearColor);
	_renderer.physicallyCorrectLights = true;
	_renderer.setPixelRatio( window.devicePixelRatio );
	_renderer.setSize( window.innerWidth, window.innerHeight );
	//_renderer.gammaInput = true;
	//_renderer.gammaOutput = true;
	//_renderer.shadowMap.enabled = true;
	//_renderer.shadowMap.cullFace = THREE.CullFaceBack;
	//_renderer.toneMapping = THREE.ReinhardToneMapping;
	document.body.appendChild(_renderer.domElement);
	
	// stats (fps, etc.)
	_stats = new Stats();
	document.body.appendChild(_stats.dom);
	
	window.addEventListener( 'resize', onWindowResize, false );
	
	var gui = new dat.GUI();
	
	gui.add(params, 'rotate');
	gui.addColor(params, 'rendClearColor');
	
	var camFldr = gui.addFolder('Camera Position');
	camFldr.add(params, 'camX', -5000, 5000);
	camFldr.add(params, 'camY', -5000, 5000);
	camFldr.add(params, 'camZ', 1500, 5000);
	camFldr.add(params, 'camFov', 20, 180);
	
	var fogFldr = gui.addFolder('Fog');
	fogFldr.addColor(params, 'fogColor');
	fogFldr.add(params, 'fogNear', 1, 10000);
	fogFldr.add(params, 'fogFar', 1, 10000);
	
	var lightsFldr = gui.addFolder('Lights');
	lightsFldr.addColor(params, 'alColor');
	lightsFldr.add(params, 'alIntensity', 0, 1);
	lightsFldr.addColor(params, 'pl1Color');
	lightsFldr.add(params, 'pl1Intensity', 0, 1);
	lightsFldr.add(params, 'pl1Distance', 0, 10000);
	lightsFldr.add(params, 'pl1Decay', 100, 10000);
	lightsFldr.add(params, 'pl1SphereSize', 1, 1000);
	
	gui.open();
}

function animate() {
	requestAnimationFrame(animate);
	render();
	_stats.update();
}

function render() {
	_camera.position.x       = params.camX;
	_camera.position.y       = params.camY;
	_camera.position.z       = params.camZ;
	_camera.setFocalLength(params.camFov);
	
	_scene.fog.color	     = new THREE.Color(params.fogColor);
	_scene.fog.near 	     = params.fogNear;
	_scene.fog.far		     = params.fogFar;
	                         
	_ambLight.color          = new THREE.Color(params.alColor);
	_ambLight.intensity      = params.alIntensity;
	                         
	_pl1.color 			     = new THREE.Color(params.pl1Color);
	_pl1.intensity 		     = params.pl1Intensity;
	_pl1.distance 		     = params.pl1Distance;
	_pl1.decay 			     = params.pl1Decay;
	_pl1Helper.sphereSize    = params.pl1SphereSize;
	_pl1Helper.update();
	
	if(params.rotate) {
		_mesh.rotation.x    += 0.005;
		_mesh.rotation.y    += 0.01;
	}
	
	_renderer.setClearColor(params.rendClearColor);
	_renderer.render(_scene, _camera);
}

function onWindowResize() {
	_camera.aspect = window.innerWidth / window.innerHeight;
	_camera.updateProjectionMatrix();
	_renderer.setSize( window.innerWidth, window.innerHeight );
}