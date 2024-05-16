import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

//Create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

//Create renderer and add to DOM
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Create all the objects
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

//Create cube and add to scene
const cube = new THREE.Mesh( geometry.cube.clone(), material.phong.clone() );
cube.position.setX(1);
cube.position.setY(1);
cube.material.color.set( "rgb(75, 255, 0)" );
scene.add( cube );

const cube2 = new THREE.Mesh( geometry.cube.clone(), material.phong.clone() );
cube2.position.setX(-1);
cube2.position.setY(1);
cube2.material.color.set( "rgb(148, 0, 211)"  );
scene.add( cube2 );

//Create grid and add to scene
const gridHelper = new THREE.GridHelper( 5, 5 );
scene.add( gridHelper );

//Create light and add to scene
const ambientLight = new THREE.AmbientLight( "rgb(255, 255? 255)", 0.1 );

const directionalLight = new THREE.DirectionalLight( "rgb(255, 255, 255)", 1 );
directionalLight.position.set( 1, 1, 0 ).normalize();

scene.add( directionalLight );
scene.add( ambientLight );

//Setup scene and camera
camera.position.z = 5;
camera.position.y = 2;

//Add orbit controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.listenToKeyEvents( window );

//resize renderer on window resize
window.addEventListener( 'resize', function () {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}, false );

//Animate scene
const animate = function () {
	requestAnimationFrame( animate );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	cube2.rotation.x -= 0.01;
	cube2.rotation.y -= 0.01;

	controls.update();

	renderer.render( scene, camera );
};

//Render scene
animate();