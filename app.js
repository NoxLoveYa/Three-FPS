import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

//Create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

//Create renderer and add to DOM
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Create cube and add to scene
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshPhongMaterial( { color: "rgb(255, 0, 0)" } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

//Create light and add to scene
const ambientLight = new THREE.AmbientLight( "rgb(255, 255? 255)", 0.1 );

const directionalLight = new THREE.DirectionalLight( "rgb(255, 255, 255)", 1 );
directionalLight.position.set( 1, 1, 1 ).normalize();

scene.add( directionalLight );
scene.add( ambientLight );


//Setup scene and camera
camera.position.z = 5;

//Add orbit controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.listenToKeyEvents( window );

//Animate scene
const animate = function () {
	requestAnimationFrame( animate );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	controls.update();

	renderer.render( scene, camera );
};

//Render scene
animate();