const THREE = require('three');
const OrbitControls =require('./OrbitControls');

const container = document.getElementById('container');

let renderer = null;
let camera = null;
let cameraControls = null;
let scene = null;
const clock = new THREE.Clock();

init();
animate();

function init() {
  const canvasWidth = 1200;
  const canvasHeight = 900;

  const canvasRatio = canvasWidth / canvasHeight;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvasWidth, canvasHeight);
  renderer.setClearColor(0xAAAAAA, 1.0);
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(75, canvasRatio, 0.1, 1000);
  camera.up.set(0, 0, 1);
  camera.position.set(0, 0, 500)
  cameraControls = new OrbitControls(camera, renderer.domElement);
}

function fillScene() {
  scene = new THREE.Scene();

  const ambientLight = new THREE.AmbientLight(0x444444);
  const light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
  light.position.set(500, 500, 500);
  scene.add(ambientLight);
  scene.add(light);
  const geometry = icosahedronGeometry(100);
  const material = new THREE.MeshLambertMaterial({ color: 0x2914CE, flatShading: true });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

function render() {
  fillScene();
  cameraControls && cameraControls.update();
  renderer.render(scene, camera)
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function radiansToDegrees(radians) {
  return radians * 180 / Math.PI;
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
  const latitude = radiansToDegrees(Math.atan(0.5));
  geometry.vertices.push(
    vectorSpherical(90, 0, r),
    vectorSpherical(latitude, 0, r),
    vectorSpherical(latitude, 72, r),
    vectorSpherical(latitude, 144, r),
    vectorSpherical(latitude, 216, r),
    vectorSpherical(latitude, 288, r),
    vectorSpherical(-latitude, 36, r),
    vectorSpherical(-latitude, 108, r),
    vectorSpherical(-latitude, 180, r),
    vectorSpherical(-latitude, 252, r),
    vectorSpherical(-latitude, 324, r),
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
    geometry.faces.push(new THREE.Face3(11, i + 1, i));
  }
  geometry.faces.push(new THREE.Face3(11, 6, 10));
  return geometry;
}
