import * as THREE from 'three';
import fpsController, * as FPSController from './fpsController.js';
import physicsController, * as PHYSICSController from './physicsController.js';
import entity, * as entityTypes from './entity.js';
import entityController, * as ENTITYController from './entityController.js';

//Create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

//Create renderer and add to DOM
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Create all objects
const geometry = {
	"cube": new THREE.BoxGeometry( 1, 1, 1 ),
	"plane": new THREE.PlaneGeometry( 5, 5 ),
	"sphere": new THREE.SphereGeometry( 1, 32, 32 ),
	"torus": new THREE.TorusGeometry( 1, 0.4, 16, 100 )
};

const material = {
	"basic": new THREE.MeshBasicMaterial( { color: "rgb(255, 0, 0)" } ),
	"lambert": new THREE.MeshLambertMaterial( { color: "rgb(255, 0, 0)" } ),
	"phong": new THREE.MeshPhongMaterial( { color: "rgb(255, 0, 0)" } ),
	"standard": new THREE.MeshStandardMaterial( { color: "rgb(255, 0, 0)" } ),
	"toon": new THREE.MeshToonMaterial( { color: "rgb(255, 0, 0)" } )
};

//Create plane
const plane = new THREE.Mesh( geometry.plane.clone(), material.basic.clone() );
plane.geometry.scale(2, 2, 2);
plane.geometry.rotateX(-Math.PI / 2);
plane.material.side = THREE.DoubleSide;
plane.material.color = new THREE.Color("rgb(55, 55, 55)");
plane.position.y = -1;
scene.add( plane );

//Create cube
const cube = new THREE.Mesh( geometry.cube.clone(), material.basic.clone() );
cube.position.x = 2;
cube.position.y = -1;
scene.add( cube );

//Setup scene and camera
const physics = new physicsController(camera, scene, renderer.domElement);
const fpsCamera = new fpsController(camera, renderer.domElement, physics);
const entities = new entityController(scene);
entities.addEntity(new entityTypes.hostileEntity(geometry.cube.clone(), material.basic.clone(), physics, fpsCamera, scene, "vilain cube"));
const vilainCube = entities.getEntitiesByType("vilain cube")[0];
vilainCube.material.color = new THREE.Color("rgb(0, 0, 255)");
vilainCube.scale.set(0.5, 0.5, 0.5);
entities.addEntity(new entityTypes.healthPackEntity(geometry.sphere.clone(), material.basic.clone(), fpsCamera, scene, "Medkit"));
const healthPack = entities.getEntitiesByType("Medkit")[0]
healthPack.material.color = new THREE.Color("rgb(0, 255, 0)");
healthPack.scale.set(0.1, 0.1, 0.1);
healthPack.position.set(4, -0.9, 4);
// entities.addEntity(new entityTypes.hostileEntity(geometry.cube.clone(), material.basic.clone(), "vilain cube"));
// entities.addEntity(new entityTypes.hostileEntity(geometry.sphere.clone(), material.basic.clone(), "vilain sphere"));
//resize renderer on window resize
window.addEventListener( 'resize', function () {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}, false );

//Add event listeners
window.addEventListener( 'keydown', function (event) {
	if (fpsCamera.properties_.in_focus === false || gameRunning === false) {
		return;
	}
	fpsCamera.onKeyDown(event);
	physics.onKeyDown(event);
}, false );

window.addEventListener( 'keyup', function (event) {
	if (fpsCamera.properties_.in_focus === false || gameRunning === false) {
		return;
	}
	fpsCamera.onKeyUp(event);
	physics.onKeyUp(event);
}, false );

//Render loop
var gameRunning = false;
let oldT = null;
export default function animate() {
	requestAnimationFrame((t) => {
		if (oldT === null) {
			oldT = t;
		}

		step(t - oldT);
		oldT= t;
		if (gameRunning)
			animate();
	});
}

var objects = [];

function step(timeElapsed) {
	//Calculate delta time
	const deltaTime = timeElapsed * 0.001;
	//Update camera
	fpsCamera.update(deltaTime);
	physics.update(deltaTime);
	entities.update(deltaTime);
	//Render scene
	renderer.render( scene, camera );
}

fpsCamera.scene_ = scene;

window.addEventListener('mousemove', function(event) {
	if (fpsCamera.properties_.in_focus === false || gameRunning === false) {
		return;
	}
	fpsCamera.updateMouseDelta(event);
});

window.addEventListener('click', function(event) {
	if (gameRunning === false) {
		return;
	}
	let hits = fpsCamera.fireLookRay();
	if (hits.length > 0) {
		let hit = hits[0];
		if (hit.object.type_ !== undefined) {
			hit.object.takeDamage(1);
		}
	}
});

const playButton = document.getElementById('PlayButton');
const crosshair = document.getElementById('crosshair');

function playAlert() {
	if (gameRunning === false) {
		playButton.style.display = "block";
		crosshair.style.display = "none";
		return;
	} else {
		playButton.style.display = "none";
		crosshair.style.display = "block";
	}
}

playButton.addEventListener('click', function() {
	if (gameRunning === false) {
		gameRunning = true;
		playAlert();
		animate();
	} else {
		gameRunning = false;
		renderer.clear();
	}
});