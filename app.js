import * as THREE from 'three';
import fpsController, * as FPSController from './fpsController.js';

//Create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

//Create renderer and add to DOM
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Create cube and add to scene
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: "rgb(255, 0, 0)" } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

//Setup scene and camera
camera.position.z = 5;

const test = new fpsController(camera, renderer.domElement);

//resize renderer on window resize
window.addEventListener( 'resize', function () {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}, false );

//Add event listeners
window.addEventListener( 'keydown', function (event) {
	test.onKeyDown(event);
}, false );

window.addEventListener( 'keyup', function (event) {
	test.onKeyUp(event);
}, false );

//Animate scene
const animate = function () {
	requestAnimationFrame( animate );

	cube.rotateX(0.01);
	cube.rotateY(0.01);

	test.update();

	renderer.render( scene, camera );
};

//Render scene
animate();