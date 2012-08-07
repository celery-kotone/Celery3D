var width  = document.documentElement.clientWidth - 100;
var height = document.documentElement.clientHeight - 100;

var geometry = new THREE.CubeGeometry(250, 250, 0);
var mesh     = new Array;
var texture  = new THREE.ImageUtils.loadTexture('./img/test.png');
var material = new THREE.MeshBasicMaterial({map: texture});
material.transparent = true;

for(var i = 0; i < 10; i++){
    mesh[i] = new THREE.Mesh(geometry, material);
    mesh[i].position.z = 400;
    mesh[i].position.x = i * 300 - 1500;
}

var camera   = new THREE.PerspectiveCamera(40, width / height, 1, 10000);
camera.lookAt(mesh[0].position);

var scene    = new THREE.Scene();
for(var i in mesh){
    scene.add(mesh[i]);
}

var light    = new THREE.DirectionalLight(0xffffff, 1.5);
light.position = {x:0, y:0.2, z:-1};
scene.add(light);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);

var mousedown = false;
renderer.domElement.addEventListener('mousedown', function(e){
	mousedown = true;
	prevPosition = {x: e.pageX, y: e.pageY};
    }, false);

renderer.domElement.addEventListener('mousemove', function(e){
	if(!mousedown) return;
	moveDistance = {x: prevPosition.x - e.pageX, y: prevPosition.y - e.pageY};
	
	prevPosition = {x: e.pageX, y: e.pageY};
	render();
    }, false);

renderer.domElement.addEventListener('mouseup', function(e){
	mousedown = false;
    }, false);

function handle(delta){
	camera.rotation.y -= delta * 0.01;
}

function render(){
    renderer.render(scene, camera);
}

var accel = new Array;
for(var i in mesh){
    accel[i] = Math.random() + 1;
}

function animate(){
    for(var i in mesh){
	mesh[i].rotation.z -= 0.01 * accel[i];
    }
    render();
}

window.onload = function(){
    document.getElementById('canvas-wrapper').appendChild(renderer.domElement);
    setInterval(animate, 16);
    render();
}
