import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const projektname = window.location.pathname.split('/').slice(-2, -1)[0];
console.log(projektname);
document.title = projektname;

//get data from JSON files
const ORIGIN = window.location.origin;
const ENDPOINT = `${ORIGIN}/api/data/${projektname}`;

fetch(ENDPOINT)
.then(response => response.json())
.then(elements =>{
  const parts = {};
  const buttons = [];
  let currentActivePart = null;
  document.getElementById('bigTitle').textContent = `${elements.projNumber}: ${elements.name}`;
  document.getElementById('subTitle').textContent = elements.credits;
  document.documentElement.style.setProperty('--bg', elements.colors.find(x => x.name === 'bg').hex);
  document.documentElement.style.setProperty('--lapse-default', elements.colors.find(x => x.name === 'lapse-default').hex);
  document.documentElement.style.setProperty('--lapse-clicked', elements.colors.find(x => x.name === 'lapse-clicked').hex);
  document.documentElement.style.setProperty('--lapse-expanded', elements.colors.find(x => x.name === 'lapse-expanded').hex);
  const container = document.getElementById('project-image');
  const width = container.clientWidth;
  const height = container.clientHeight;
  //Get background for three js scene. Formatting from #[hex] to 0x[hex] to make three js understand
  const bgc = elements.colors.find(x => x.name === 'image-bg').hex.replace('#','0x');

  const scene = new THREE.Scene();
  scene.background = new THREE.Color().setHex(bgc);
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);
  
  //Add light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(ambientLight, directionalLight);
  
  //Add Orbit Controls for Rotation of Object
  const controls = new OrbitControls( camera, renderer.domElement );
  //Disable Rotation along X and Y
  //We do not disable
  //controls.minPolarAngle = Math.PI/2;
  //controls.maxPolarAngle = Math.PI/2;
  controls.enablePan = false;
  
  //Load Object
  const loader = new GLTFLoader();
  loader.load(`/static/models/${projektname}.glb`, glb => {
      console.log("GLTF geladen!");
    glb.scene.rotation.y = THREE.MathUtils.degToRad(-100);
    scene.add(glb.scene);
    //divide different colored parts into collection based on their parent
    glb.scene.traverse(obj => {
      if (obj.isMesh) {
        const currParent = obj.parent.name.toLowerCase();
        console.log(currParent);
        if (parts[currParent]){
          parts[currParent].push({mesh: obj, originalMaterial: obj.material.clone()})
        }
        else{
          parts[currParent] = [];
          parts[currParent].push({mesh: obj, originalMaterial: obj.material.clone()})
          //parts.currParent.push(obj);
        }
      }
    })
    console.log(parts)
    createButtons();                   //Not the Function, just getting invoked
    //Kamera Bounding Box erstellen
    const box = new THREE.Box3().setFromObject(glb.scene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      // Kamera positionieren
      camera.position.copy(center.clone().add(new THREE.Vector3(0, size.y, size.z * 2)));
      camera.lookAt(center);
  }, undefined, error => {
    console.error(error);
  });
  
  camera.position.z = 5;
  
  function addContent(button, name){
    const content = document.createElement('div');
    content.classList.add('content')
    elements.parts.find(x => x.name === name).sub.forEach(subPart =>{
      const contentRow = document.createElement('p');
      contentRow.classList.add('contentRow');
      contentRow.textContent = subPart.name;
      content.appendChild(contentRow);
    })
    
    button.addEventListener('click', () => {
      colorPart(name);
      revealContent(button, content);
      if(!(button.classList.contains("active"))){
        discolorpart(name);
      }
    });
    //button.insertAdjacentElement('afterend', content);
    buttons.push({ button: button, content: content });
    document.getElementById('status').appendChild(button);
    document.getElementById('status').appendChild(content);
    content.style.display = "none";
  }

  function discolorpart(partName){
    parts[partName].forEach(({ mesh, originalMaterial }) => {
      mesh.material = originalMaterial;
    });
  }


  function colorPart(partName, highlightColor = elements.colors.find(x => x.name === 'image-highlight').hex) {
    if (currentActivePart) {
      // Zurücksetzen
      parts[currentActivePart].forEach(({ mesh, originalMaterial }) => {
        mesh.material = originalMaterial;
      });
    }
    //Neu färben
    parts[partName].forEach(({ mesh }) => {
      mesh.material = new THREE.MeshStandardMaterial({ color: highlightColor });
    });
    currentActivePart = partName;
  }

  function revealContent(clickedButton, clickedContent){
    //content = elements.colors.find(x => x.name === 'image-highlight').hex
    buttons.forEach(pair => {
        // Wenn nicht der aktuelle Button, schließen
      if (pair.button !== clickedButton) {
          pair.content.style.display = "none";
          pair.button.classList.remove("active");
      }
    });
    // Toggle für geklickten Button
    const isOpen = clickedContent.style.display === "block";
    clickedContent.style.display = isOpen ? "none" : "block";
    clickedButton.classList.toggle("active", !isOpen);
  }

  function normalerButton(clickedButton){
    //content = elements.colors.find(x => x.name === 'image-highlight').hex
    buttons.forEach(pair => {
        // Wenn nicht der aktuelle Button, schließen
      if (pair.button !== clickedButton) {
          pair.button.classList.remove("active");
      }
    });
    // Toggle für geklickten Button
    clickedButton.classList.toggle("active");
  }

  function createButtons(){
    const statusContainer = document.getElementById("status");
    Object.keys(parts).forEach(partName => {
      const btn = document.createElement('button');
      btn.textContent = partName;
      btn.classList.add('statusContainer');
      if (Array.isArray(elements.parts.find(x => x.name === partName).sub)) {
        addContent(btn, partName);
      }
      else{
        btn.addEventListener('click', () => {
          colorPart(partName);
          normalerButton(btn);
          if(!(btn.classList.contains("active"))){
            discolorpart(partName);
          }
        });
        document.getElementById('status').appendChild(btn);
      }
    });
  }

  function resizeRendererToDisplaySize() {
      const width = container.clientWidth;
      const height = container.clientHeight;
    
      renderer.setSize(width, height); // false = kein force-canvas-resize (optional)
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  
  function animate() {
      resizeRendererToDisplaySize();
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  
  animate();
})