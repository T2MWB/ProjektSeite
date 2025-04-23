import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.175.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.175.0/examples/jsm/loaders/GLTFLoader.js";


const container = document.getElementById('project-image');
const width = container.clientWidth;
const height = container.clientHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

const loader = new GLTFLoader();

loader.load( '/static/models/AbstractionTest.glb', function ( gltf ) {

  scene.add( gltf.scene );

}, undefined, function ( error ) {

  console.error( error );

} );


function animate() {
  resizeRendererToDisplaySize();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function resizeRendererToDisplaySize() {
    const width = container.clientWidth;
  
    renderer.setSize(width, height); // false = kein force-canvas-resize (optional)
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

animate();