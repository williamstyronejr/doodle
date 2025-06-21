import * as THREE from 'three';
const STATE = {
  name: '',
  room: '',
};

window.addEventListener('DOMContentLoaded', onLoad);

function handleIntro() {
  const nameSubmit = document.querySelector('#name_submit');

  nameSubmit.addEventListener('click', () => {
    const name = document.querySelector('#name').value;
    STATE.name = name;
  });
}

function onLoad() {
  handleIntro();

  const canvas = document.querySelector('canvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.z = 5;

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  renderer.render(scene, camera);
}
