//GLOBAL SYMBOLS
var width = getBrowserWidth() * 0.99;
var height = getBrowserHeight() * 0.99;
var scene;
var controls;
var renderer;

init();
initScene();
animate();
 
function init() {
    scene = new THREE.Scene();
 
    camera = new THREE.PerspectiveCamera( 75, width / height, 1, 10000 );
    camera.position.z = 1000;
    scene.add( camera );
 
    material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
 
    div_canvas = document.getElementById( 'rotation' );
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );
 
    div_canvas.appendChild( renderer.domElement );
 
    controls = new THREE.TrackballControls( camera, renderer.domElement );
}
 
function initScene() {
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
	scene.add(mesh[i]);
    }
}

function handle(delta){

}

function render(){
    controls.update();
    renderer.render(scene, camera);
}

function animate(){
    requestAnimationFrame(animate);
    render();
}
