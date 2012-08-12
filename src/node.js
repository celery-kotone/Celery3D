createNode = function(geometry, material){
    this.mesh = new THREE.Mesh(geometry, material);

    this.child = [];
    this.clicked = 0;
    var mesh = this.mesh;

    this.update = function(){
	//RECURSIVELY UPDATE CHILD NODES
	if(this.child.length > 0){
	    this.child.update();
	}

	//CHECK COLLISION
	var projector = new THREE.Projector();
	renderer.domElement.addEventListener('mousedown', function(e){
		this.mouse_x =   ((e.pageX-e.target.offsetParent.offsetLeft) / renderer.domElement.width)  * 2 - 1;
		this.mouse_y = - ((e.pageY-e.target.offsetParent.offsetTop) / renderer.domElement.height) * 2 + 1;
		this.vector = new THREE.Vector3(this.mouse_x, this.mouse_y, 0.5);
		projector.unprojectVector(this.vector, camera);

		this.ray = new THREE.Ray(camera.position, this.vector.subSelf(camera.position).normalize());
		this.obj = this.ray.intersectObjects([mesh]);
		if(this.obj.length > 0){
		    clicked += 1;
		}
	    }, false);

	//ROTATE MESH
	this.mesh.rotation.y = ((this.mesh.rotation.y.toFixed(2) * 100) % (Math.PI.toFixed(2) * 100) + 1) / 100;
    }
};
