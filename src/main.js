var width = getBrowserWidth() * 0.99;
var height = getBrowserHeight() * 0.99;

var geometry = new THREE.CubeGeometry(250, 250, 0);
var mesh     = new Array;
var texture  = new THREE.ImageUtils.loadTexture('./img/test.png');
var material = new THREE.MeshBasicMaterial({map: texture});
material.transparent = true;

var max = 12;
var theta = 2 * Math.PI / max;
var r = 1000;

for(var i = 0; i < max; i++){
    mesh[i] = new THREE.Mesh(geometry, material);
    mesh[i].position.x = Math.sin(theta * i) * r;
    mesh[i].position.z = Math.cos(theta * i) * r;
    mesh[i].rotation.y = theta * i;
}


var camera   = new THREE.PerspectiveCamera(40, width / height, 1, 10000);

var scene    = new THREE.Scene();
for(var i in mesh){
    scene.add(mesh[i]);
}

var light    = new THREE.DirectionalLight(0xffffff, 1.5);
light.position = {x:0, y:0.2, z:-1};
scene.add(light);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);

//event stuff
var mousedown = false;
var projector = new THREE.Projector();
renderer.domElement.addEventListener('mousedown', function(e){
	var mouse_x =   ((e.pageX-e.target.offsetParent.offsetLeft) / renderer.domElement.width)  * 2 - 1;
	var mouse_y = - ((e.pageY-e.target.offsetParent.offsetTop) / renderer.domElement.height) * 2 + 1;
	var vector = new THREE.Vector3(mouse_x, mouse_y, 0.5);
	projector.unprojectVector(vector, camera);

	var ray = new THREE.Ray(camera.position, vector.subSelf(camera.position).normalize());
	var obj = ray.intersectObjects(mesh);

	if(obj.length > 0){
	    document.getElementById("sound_element").innerHTML= "<embed src='./se/select.wav' hidden=true autostart=true loop=false>";
	}
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

var focus = 0;

window.onload = function(){
    document.getElementById('canvas-wrapper').appendChild(renderer.domElement);
    setInterval(animate, 16);
    render();
}
