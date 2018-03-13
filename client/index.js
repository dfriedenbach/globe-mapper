const THREE = require('three');

const container = document.getElementById('container');

let renderer = null;
let camera = null;
let scene = null;
const clock = new THREE.Clock();

init();
render();

function init() {
  const canvasWidth = 1200;
  const canvasHeight = 900;

  const canvasRatio = canvasWidth / canvasHeight;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvasWidth, canvasHeight);
  renderer.setClearColor(0xAAAAAA, 1.0);
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(75, canvasRatio, 0.1, 1000);
  camera.position.set(0, 0, 500)
}

function fillScene() {
  scene = new THREE.Scene();

  const ambientLight = new THREE.AmbientLight(0x444444);
  const light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
  light.position.set(500, 500, 500);
  scene.add(ambientLight);
  scene.add(light);
  const geometry = icosahedronGeometry(100);
  // const geometry = new THREE.IcosahedronGeometry(100);
  const material = new THREE.MeshLambertMaterial({ color: 0x2914CE, flatShading: true });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

function render() {
  fillScene();
  renderer.render(scene, camera)
}

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function vectorSpherical(lat, long, r) {
  const polarAngle = degreesToRadians(90 - lat);
  const azimuthalAngle = degreesToRadians(long);
  const x = r * Math.sin(polarAngle) * Math.cos(azimuthalAngle);
  const y = r * Math.sin(polarAngle) * Math.sin(azimuthalAngle);
  const z = r * Math.cos(polarAngle);
  return new THREE.Vector3(x, y, z);
}

function icosahedronGeometry(r) {
  const geometry = new THREE.Geometry();
  geometry.vertices.push(
    vectorSpherical(90, 0, r),
    vectorSpherical(Math.atan(0.5), 0, r),
    vectorSpherical(Math.atan(0.5), 72, r),
    vectorSpherical(Math.atan(0.5), 144, r),
    vectorSpherical(Math.atan(0.5), 216, r),
    vectorSpherical(Math.atan(0.5), 288, r),
    vectorSpherical(-Math.atan(0.5), 36, r),
    vectorSpherical(-Math.atan(0.5), 108, r),
    vectorSpherical(-Math.atan(0.5), 180, r),
    vectorSpherical(-Math.atan(0.5), 252, r),
    vectorSpherical(-Math.atan(0.5), 324, r),
    vectorSpherical(-90, 0, r)
  );
  for (let i = 0; i < 4; i++) {
    geometry.faces.push(new THREE.Face3(0, i + 1, i + 2));
  }
  geometry.faces.push(new THREE.Face3(0, 5, 1));
  for (let i = 1; i < 5; i++) {
    geometry.faces.push(new THREE.Face3(i, i + 5, i + 1));
  }
  geometry.faces.push(new THREE.Face3(5, 10, 1));
  geometry.faces.push(new THREE.Face3(1, 10, 6));
  for (let i = 2; i < 6; i++) {
    geometry.faces.push(new THREE.Face3(i, i + 4, i + 5));
  }
  for (let i = 6; i < 10; i++) {
    geometry.faces.push(new THREE.Face3(0, i + 1, i));
  }
  geometry.faces.push(new THREE.Face3(0, 6, 10));
  return geometry;
}
