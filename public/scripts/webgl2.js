if (!Detector.webgl) {
	Detector.addGetWebGLMessage();
}

var container, stats;
var camera, scene, renderer;
var mesh;

var params = {
	rotate		: true,
	camX  		: 0,
	camY 		: 0,
	camZ 		: 2750,
	camFov      : 27,
	triangles	: 2000,
	cubeSize	: 500,
	triangleSize: 50
};

var prevParams = {
	rotate		: true,
	camX  		: 0,
	camY 		: 0,
	camZ 		: 2750,
	camFov      : 27,
	triangles	: 2000,
	cubeSize	: 500,
	triangleSize: 50
};

init();
initGui();
animate();

function init() {

	container = document.getElementById('container');

	camera = new THREE.PerspectiveCamera(params.Fov, window.innerWidth / window.innerHeight, 1, 3500);
	camera.position.z = params.camZ;

	scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0x050505, 2000, 3500);

	scene.add(new THREE.AmbientLight(0x444444));

	var light1 = new THREE.DirectionalLight(0xffffff, 0.5);
	light1.position.set(1, 1, 1);
	scene.add(light1);

	var light2 = new THREE.DirectionalLight(0xffffff, 1.5);
	light2.position.set(0, -1, 0);
	scene.add(light2);

	initTriangleMeshes();

	renderer = new THREE.WebGLRenderer({ antialias: false });
	renderer.setClearColor(scene.fog.color);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	renderer.gammaInput = true;
	renderer.gammaOutput = true;

	container.appendChild(renderer.domElement);

	stats = new Stats();
	container.appendChild(stats.dom);

	window.addEventListener('resize', onWindowResize, false);
}

function initTriangleMeshes() {

	scene.remove(mesh);

	var triangles = params.triangles;

	var geometry = new THREE.BufferGeometry();

	var positions = new Float32Array(triangles * 3 * 3);
	var normals = new Float32Array(triangles * 3 * 3);
	var colors = new Float32Array(triangles * 3 * 3);

	var color = new THREE.Color();

	// triangles spread in the cube
	var n = params.cubeSize;
	var n2 = n/2;
	
	// individual triangle size
	var d = params.triangleSize;
	var d2 = d/2;

	var pA = new THREE.Vector3();
	var pB = new THREE.Vector3();
	var pC = new THREE.Vector3();

	var cb = new THREE.Vector3();
	var ab = new THREE.Vector3();

	for (var i = 0; i < positions.length; i += 9) {

		// positions

		var x = Math.random() * n - n2;
		var y = Math.random() * n - n2;
		var z = Math.random() * n - n2;

		var ax = x + Math.random() * d - d2;
		var ay = y + Math.random() * d - d2;
		var az = z + Math.random() * d - d2;

		var bx = x + Math.random() * d - d2;
		var by = y + Math.random() * d - d2;
		var bz = z + Math.random() * d - d2;

		var cx = x + Math.random() * d - d2;
		var cy = y + Math.random() * d - d2;
		var cz = z + Math.random() * d - d2;

		positions[ i ]     = ax;
		positions[ i + 1 ] = ay;
		positions[ i + 2 ] = az;

		positions[ i + 3 ] = bx;
		positions[ i + 4 ] = by;
		positions[ i + 5 ] = bz;

		positions[ i + 6 ] = cx;
		positions[ i + 7 ] = cy;
		positions[ i + 8 ] = cz;

		// flat face normals

		pA.set(ax, ay, az);
		pB.set(bx, by, bz);
		pC.set(cx, cy, cz);

		cb.subVectors(pC, pB);
		ab.subVectors(pA, pB);
		cb.cross(ab);

		cb.normalize();

		var nx = cb.x;
		var ny = cb.y;
		var nz = cb.z;

		normals[ i ]     = nx;
		normals[ i + 1 ] = ny;
		normals[ i + 2 ] = nz;

		normals[ i + 3 ] = nx;
		normals[ i + 4 ] = ny;
		normals[ i + 5 ] = nz;

		normals[ i + 6 ] = nx;
		normals[ i + 7 ] = ny;
		normals[ i + 8 ] = nz;

		// colors

		var vx = (x / n) + 0.5;
		var vy = (y / n) + 0.5;
		var vz = (z / n) + 0.5;

		color.setRGB(vx, vy, vz);

		colors[ i ]     = color.r;
		colors[ i + 1 ] = color.g;
		colors[ i + 2 ] = color.b;

		colors[ i + 3 ] = color.r;
		colors[ i + 4 ] = color.g;
		colors[ i + 5 ] = color.b;

		colors[ i + 6 ] = color.r;
		colors[ i + 7 ] = color.g;
		colors[ i + 8 ] = color.b;

	}

	geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
	geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
	geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

	geometry.computeBoundingSphere();

	var material = new THREE.MeshPhongMaterial({
		color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
		side: THREE.DoubleSide, vertexColors: THREE.VertexColors
	});

	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	requestAnimationFrame(animate);
	render();
	stats.update();
}

function render() {
	handleGuiParams();
	renderer.render(scene, camera);
}

function handleGuiParams() {
	
	if(
		params.rotate 	 	!= prevParams.rotate ||
		params.camX 	 	!= prevParams.camX ||
		params.camY 	 	!= prevParams.camY ||
		params.camZ 	 	!= prevParams.camZ ||
		params.camFov 	 	!= prevParams.camFov ||
		params.triangles 	!= prevParams.triangles ||
		params.cubeSize  	!= prevParams.cubeSize ||
		params.triangleSize != prevParams.triangleSize) {

		camera.position.x = params.camX;
		camera.position.y = params.camY;
		camera.position.z = params.camZ;
		camera.setFocalLength(params.camFov);
		
		initTriangleMeshes();

		prevParams.rotate 	 	= params.rotate;
		prevParams.camX 	 	= params.camX;
		prevParams.camY 	 	= params.camY;
		prevParams.camZ 	 	= params.camZ;
		prevParams.camFov 	 	= params.camFov;
		prevParams.triangles 	= params.triangles;
		prevParams.cubeSize  	= params.cubeSize;
		prevParams.triangleSize = params.triangleSize;
	}

	if(params.rotate) {
		mesh.rotation.x += 0.01;
		mesh.rotation.y += 0.01;
	}
}

function initGui() {
	var gui = new dat.GUI();
	
	gui.add(params, 'rotate');

	var camFldr = gui.addFolder('Camera Position');
	camFldr.add(params, 'camX', -5000, 5000);
	camFldr.add(params, 'camY', -5000, 5000);
	camFldr.add(params, 'camZ', 1500, 5000);
	camFldr.add(params, 'camFov', 20, 180);
	
	var triFldr = gui.addFolder('Triangles');
	triFldr.add(params, 'triangles', 200, 200000);
	triFldr.add(params, 'cubeSize', 100, 5000);
	triFldr.add(params, 'triangleSize', 1, 200);
	
	gui.open();
}