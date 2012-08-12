createNode = function(geometry, material){
    this.mesh = new THREE.Mesh(geometry, material);
    this.projector = new THREE.Projector();

    this.child = [];
    this.clicked = 0;

    this.update = function(){
	//RECURSIVELY UPDATE CHILD NODES
	if(this.child.length > 0){
	    this.child.update();
	}

	//CHECK COLLISION
	renderer.domElement.addEventListener('mousedown', this.mouse, false);

	//ROTATE MESH
	this.mesh.rotation.y = ((this.mesh.rotation.y.toFixed(2) * 100) % (Math.PI.toFixed(2) * 100) + 1) / 100;
    };

    this.mouse = function(e){
	this.mouse_x =   ((e.pageX-e.target.offsetParent.offsetLeft) / renderer.domElement.width)  * 2 - 1;
	this.mouse_y = - ((e.pageY-e.target.offsetParent.offsetTop) / renderer.domElement.height) * 2 + 1;
	this.vector = new THREE.Vector3(this.mouse_x, this.mouse_y, 0.5);
	this.projector.unprojectVector(this.vector, camera);
	
	this.ray = new THREE.Ray(camera.position, this.vector.subSelf(camera.position).normalize());
	this.obj = this.ray.intersectObjects([this.mesh]);
	if(this.obj.length > 0){
	    clicked += 1;
	}
    };
};
