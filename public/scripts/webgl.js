var _scene;
var _camera;
var _renderer;
var _composer;
var _glitchPass;
var _stats;
var _mesh;
var _ambLight;
var _pl1;
var _pl1SphereSize;
var _pl1Helper;
var _pl2;
var _pl2SphereSize;
var _pl2Helper;

var params = {
	rotate         : true,
	glitch 		   : true,
	camX  		   : 0,
	camY 		   : 0,
	camZ 		   : 3000,
	camFov         : 45,
	fogColor       : 0x333333,
	fogNear		   : 1,
	fogFar		   : 10000,
	
	alColor 	   : 0x000000,
	alIntensity    : 1.0,
	
	pl1Color 	   : 0xffffff,
	pl1Intensity   : 1.0,
	pl1Distance    : 0,
	pl1Decay 	   : 5000,
	pl1SphereSize  : 1,
	
	pl2Color 	   : 0xffffff,
	pl2Intensity   : 1.0,
	pl2Distance    : 0,
	pl2Decay 	   : 5000,
	pl2SphereSize  : 1,
	
	rendClearColor : 0x000000
};

if (!Detector.webgl){
	Detector.addGetWebGLMessage();
} else {
	init();
	animate();
}

function init() {
	initCamera();
	initScene();
	initLights();
	initGeometry();
	initRenderer();
	initStats();
	initGui();
	initWindowEvents();
}
function animate() {
	requestAnimationFrame(animate);
	render();
	//_stats.update();
}

function render() {
	handleGuiParams();
	if(params.glitch) {
		_composer.render();
	} else {
		_renderer.render(_scene, _camera);
	}
}
function handleGuiParams() {
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
}
function initCamera() {
	// camera
	_camera = new THREE.PerspectiveCamera(params.Fov, window.innerWidth / window.innerHeight, 1, 5000);
	_camera.position.z = params.camZ;
}
function initScene() {
	// create and set the scene
	_scene = new THREE.Scene();
	_scene.fog = new THREE.Fog(params.fogColor, params.fogNear, params.fogFar);
}
function initLights() {
	// ambient light
	_ambLight = new THREE.AmbientLight(params.alColor, params.alIntensity);
	_scene.add(_ambLight);
	
	// point light 1
	_pl1 = new THREE.PointLight(params.pl1Color, params.pl1Intensity, params.pl1Distance, params.pl1Decay);
	_pl1.position.set(-1200, 0, 0);
	_scene.add(_pl1);
	_pl1Helper = new THREE.PointLightHelper(_pl1, params.pl1SphereSize);
	_scene.add(_pl1Helper);

	// point light 1
	_pl2 = new THREE.PointLight(params.pl1Color, params.pl1Intensity, params.pl1Distance, params.pl1Decay);
	_pl2.position.set(-1200, 0, -1200);
	_scene.add(_pl2);
	_pl2Helper = new THREE.PointLightHelper(_pl2, params.pl2SphereSize);
	_scene.add(_pl2Helper);
}
function initGeometry() {
	// box
	new THREE.TextureLoader().load('images/crate.jpg', function(map){
		
		map.wrapS            = THREE.RepeatWrapping;
		map.wrapT 			 = THREE.RepeatWrapping;
		map.anisotropy 		 = 4;
		map.repeat.set(1, 1);
		
		var geometry = new THREE.BoxBufferGeometry(512, 512, 512);
		var material = new THREE.MeshPhongMaterial({
				color     : 0xffffff,
				bumpScale : 0.002//,
		});
		material.map 		 = map;
		material.needsUpdate = true;

		_mesh = new THREE.Mesh(geometry, material);
		_scene.add(_mesh);
	});
}
function initRenderer() {
	// renderer
	_renderer = new THREE.WebGLRenderer();
	_renderer.setClearColor(params.rendClearColor);
	_renderer.physicallyCorrectLights = true;
	_renderer.setPixelRatio( window.devicePixelRatio );
	_renderer.setSize( window.innerWidth, window.innerHeight );

	_composer = new THREE.EffectComposer(_renderer);
	_composer.addPass(new THREE.RenderPass(_scene, _camera));

	_glitchPass = new THREE.GlitchPass();
	_glitchPass.renderToScreen = true;
	_composer.addPass(_glitchPass);

	document.body.appendChild(_renderer.domElement);
}
function initStats() {
	// stats (fps, etc.)
	_stats = new Stats();
	document.body.appendChild(_stats.dom);
}
function initGui() {
	var gui = new dat.GUI();
	
	gui.add(params, 'rotate');
	gui.add(params, 'glitch');
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
	
	var alFldr  = gui.addFolder('Ambient Light');
	var pl1Fldr = gui.addFolder('Point Light #1');
	var pl2Fldr = gui.addFolder('Point Light #2');
	
	alFldr.addColor(params, 'alColor');
	alFldr.add(params, 'alIntensity', 0, 1);
	
	pl1Fldr.addColor(params, 'pl1Color');
	pl1Fldr.add(params, 'pl1Intensity', 0, 1);
	pl1Fldr.add(params, 'pl1Distance', 0, 10000);
	pl1Fldr.add(params, 'pl1Decay', 100, 10000);
	pl1Fldr.add(params, 'pl1SphereSize', 1, 1000);

	pl2Fldr.addColor(params, 'pl2Color');
	pl2Fldr.add(params, 'pl2Intensity', 0, 1);
	pl2Fldr.add(params, 'pl2Distance', 0, 10000);
	pl2Fldr.add(params, 'pl2Decay', 100, 10000);
	pl2Fldr.add(params, 'pl2SphereSize', 1, 1000);
	
	gui.open();
}
function initWindowEvents() {
	
	window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
	_camera.aspect = window.innerWidth / window.innerHeight;
	_camera.updateProjectionMatrix();
	_renderer.setSize( window.innerWidth, window.innerHeight );
}