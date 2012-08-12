var width = getBrowserWidth() * 0.99;
var height = getBrowserHeight() * 0.99;

var scene;
var controls;
var renderer;
var node;
var nodes = [];

window.onload = function(){
    init();
    initScene();
    animate();
}

function init() {
    scene = new THREE.Scene();
 
    camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000);
    camera.position.z = 300;
    scene.add(camera);
 
    div_canvas = document.getElementById('canvas');
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
 
    div_canvas.appendChild(renderer.domElement);
 
    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.zoomSpeed = 2.0;
}
 

function initScene() {
    var geometry = new THREE.SphereGeometry(100, 10, 10);
    var material = new THREE.MeshBasicMaterial({wireframe: true, color: 0x6060ff});
    material.transparent = true;
    node = new createNode(geometry,material);
    scene.add(node.mesh);
}

function render(){
    node.update();
    controls.update();
    renderer.render(scene, camera);
}

function animate(){
    requestAnimationFrame(animate);
    render();
}
