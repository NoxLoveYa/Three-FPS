import * as THREE from 'three';

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

//Render scene
renderer.render( scene, camera );