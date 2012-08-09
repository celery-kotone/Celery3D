var width = getBrowserWidth() * 0.99;
var height = getBrowserHeight() * 0.99;

var max = 9;
var theta = 2 * Math.PI / max;
var r_max  = 10000;
var r_init = 2000;
var r_now  = r_init;

var scene;
var controls;
var renderer;
var mesh = [];
var sun;
var obj = [];

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
 
    div_canvas = document.getElementById('canvas');
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
 
    div_canvas.appendChild(renderer.domElement);
 
    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.zoomSpeed = 2.0;
}
 
function initScene() {
    var geometry = new THREE.SphereGeometry(600, 10, 10);
    var geosun   = new THREE.SphereGeometry(6000, 10, 10);
    var material = new THREE.MeshBasicMaterial({wireframe: true, color: 0xff0000});
    material.transparent = true;

    sun = new THREE.Mesh(geosun, material);
    scene.add(sun);
    camera.lookAt(sun);

    for(var i = 0; i < max; i++){
	mesh[i] = new THREE.Mesh(geometry, material);
	mesh[i].position.x = Math.sin(theta * i) * r_init;
	mesh[i].position.z = Math.cos(theta * i) * r_init;
	scene.add(mesh[i]);
    }
}

var selected = 0;

function collision(){
    var projector = new THREE.Projector();
    renderer.domElement.addEventListener('mousemove', function(e){
	    if(obj.length > 0){
		selected = 1;
	    }else{
		selected = 0;
	    }
	    var mouse_x =   ((e.pageX-e.target.offsetParent.offsetLeft) / renderer.domElement.width)  * 2 - 1;
	    var mouse_y = - ((e.pageY-e.target.offsetParent.offsetTop) / renderer.domElement.height) * 2 + 1;
	    var vector = new THREE.Vector3(mouse_x, mouse_y, 0.5);
	    projector.unprojectVector(vector, camera);
	    
	    var ray = new THREE.Ray(camera.position, vector.subSelf(camera.position).normalize());
	    scene.add(ray);
	    obj = ray.intersectObjects([sun]);
	}, false);
}

function moveOut(){
    if(selected){
	if(r_now < r_max){
	    r_now += Math.pow((r_max - r_now + 1),2/3);
	    for(var i = 0; i < max; i++){
		mesh[i].position.x = Math.sin(theta * i) * r_now;
		mesh[i].position.z = Math.cos(theta * i) * r_now;
	    }
	}
    }else{
	if(r_now > r_init){
            r_now -= Math.pow((r_now - r_init + 1),2/3);
	    for(var i = 0; i < max; i++){
                mesh[i].position.x = Math.sin(theta * i) * r_now;
                mesh[i].position.z = Math.cos(theta * i) * r_now;
            }
        }
    }
}

function meshMove(){
    sun.rotation.y = ((sun.rotation.y.toFixed(2) * 100) % (Math.PI.toFixed(2) * 200) + 1) / 100;
    for(var i = 0; i < max; i++){
	mesh[i].rotation.y = ((sun.rotation.y.toFixed(2) * 100) % (Math.PI.toFixed(2) * 200) + 1) / 100;
    }
}

function render(){
    controls.update();
    collision();
    meshMove();
    moveOut();
    renderer.render(scene, camera);
}

function animate(){
    requestAnimationFrame(animate);
    render();
}
