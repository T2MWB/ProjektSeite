import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const sceneWidth = 150;
const sceneHeight = 150;

const projektname = "index";
const progressList = document.getElementById("inProgress")
const finishedList = document.getElementById("finished");

const ORIGIN = window.location.origin;
const ENDPOINT = `${ORIGIN}/api/data/${projektname}`;

fetch(ENDPOINT)
    .then(response => response.json())
    .then(data => {
        data.projects.forEach(element => {
            const ref = element.name
            const link = document.createElement('a');
            link.href = `/catalogue/${ref}`;
            const container = document.createElement('div');
            container.classList.add('project');
            const name = document.createElement("p");
            name.textContent = element.name;
            container.appendChild(name);
            link.appendChild(container);
            if(element.state === 0){
                progressList.appendChild(link);
            }
            else{
                finishedList.appendChild(link);
            }
            const scene = new THREE.Scene();
            scene.background = new THREE.Color().setStyle('#504945');
            const camera = new THREE.PerspectiveCamera(75, sceneWidth / sceneHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(sceneWidth, sceneHeight);
            container.insertBefore(renderer.domElement, name);

            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(5, 10, 7.5);
            scene.add(ambientLight, directionalLight);

            camera.position.z = 5;

            const loader = new GLTFLoader();
            
            loader.load(`/static/models/${element.name}.glb`, glb => {
            console.log("GLTF geladen!");
                glb.scene.rotation.y = THREE.MathUtils.degToRad(-45);
                scene.add(glb.scene);

                //Kamera Bounding Box
                const box = new THREE.Box3().setFromObject(glb.scene);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());
                // Kamera positionieren
                camera.position.copy(center.clone().add(new THREE.Vector3(0, size.y, size.z * 1.5)));
                camera.lookAt(center);
            });
            function animate() {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
            }
            animate();
        });
        

    })
    .catch(error => console.error('Fehler beim Laden der JSON-Daten:', error));
    