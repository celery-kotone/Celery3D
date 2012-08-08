//GLOBAL SYMBOLS
var width = getBrowserWidth() * 0.99;
var height = getBrowserHeight() * 0.99;
var scene;
var controls;
var renderer;
var mesh = [];

window.onload = function(){
    init();
    initScene();
    animate();
}

function init() {
    scene = new THREE.Scene();
 
    camera = new THREE.PerspectiveCamera(75, width / height, 1, 100000);
    camera.position.z = 20000;
    scene.add(camera);
 
    div_canvas = document.getElementById('rotation');
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
 
    div_canvas.appendChild(renderer.domElement);
 
    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.zoomSpeed = 2.0;
}
 
function initScene() {
    var geometry = new THREE.SphereGeometry(600, 10, 10);
    var geosun   = new THREE.SphereGeometry(6000, 10, 10);
    //var texture  = new THREE.ImageUtils.loadTexture('./img/test.png');
    var material = new THREE.MeshBasicMaterial({wireframe: true, color: 0xff0000});
    material.transparent = true;
    var max = 9;
    var theta = 2 * Math.PI / max;
    var r = 10000;

    sun = new THREE.Mesh(geosun, material);
    scene.add(sun);

    for(var i = 0; i < max; i++){
	mesh[i] = new THREE.Mesh(geometry, material);
	mesh[i].position.x = Math.sin(theta * i) * (r + 2000);
	mesh[i].position.z = Math.cos(theta * i) * (r + 2000);
	scene.add(mesh[i]);
    }
}

function handle(delta){

}

function meshMove(){
    sun.rotation.y += 0.001;
    for(var i in mesh){
	mesh[i].rotation.y += 0.01;
    }
}

function collision(){
    var projector = new THREE.Projector();
    renderer.domElement.addEventListener('mousedown', function(e){
	    var mouse_x =   ((e.pageX-e.target.offsetParent.offsetLeft) / renderer.domElement.width)  * 2 - 1;
	    var mouse_y = - ((e.pageY-e.target.offsetParent.offsetTop) / renderer.domElement.height) * 2 + 1;
	    var vector = new THREE.Vector3(mouse_x, mouse_y, 0.5);
	    projector.unprojectVector(vector, camera);

	    var ray = new THREE.Ray(camera.position, vector.subSelf(camera.position).normalize());
	    var obj = ray.intersectObjects(mesh);

	    if(obj.length > 0){
		//document.getElementById("sound_element").innerHTML= "<embed src='../se/select.wav' hidden=true autostart=true loop=false>";
	    }
	}, false);
}

function render(){
    controls.update();
    meshMove();
    collision();
    renderer.render(scene, camera);
}

function animate(){
    requestAnimationFrame(animate);
    render();
}
