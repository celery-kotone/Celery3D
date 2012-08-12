createNode = function(geometry, material, scene){
    var thisNode = this;

    thisNode.mesh      = new THREE.Mesh(geometry, material);
    thisNode.projector = new THREE.Projector();

    scene.add(thisNode.mesh);

    thisNode.child      = [];
    thisNode.childId    = [];
    thisNode.clicked    = 0;
    thisNode.isChild    = 0;
    thisNode.theta      = 0;
    thisNode.generation = 0;

    thisNode.update = function(){

	//RECURSIVELY UPDATE CHILD NODES
	if(thisNode.child.length > 0){
	    for(var i in thisNode.child){
		thisNode.child[i].update();
	    }
	}

	//POSITION CHILD NODES
	if(thisNode.child.length > 0){
	    for(var i in thisNode.child){
		thisNode.child[i].mesh.position.x = 300;
	    }
	}

	//CHECK COLLISION
	renderer.domElement.addEventListener('mousedown', thisNode.mouse, false);

	//ROTATE MESH
	thisNode.mesh.rotation.y = ((thisNode.mesh.rotation.y.toFixed(2) * 100) % (Math.PI.toFixed(2) * 100) + 1) / 100;

	//RESCALE MESH
	if(thisNode.clicked){
	    if(thisNode.child.length < 1){
		thisNode.createChild(1, geometry, material, scene);
	    }
	    if(thisNode.mesh.scale.x < 2){
		thisNode.mesh.scale.x += 0.1;
		thisNode.mesh.scale.y += 0.1;
		thisNode.mesh.scale.z += 0.1;
	    }
	}else{
	    thisNode.removeChild();
	    if(thisNode.mesh.scale.x > 1){
		thisNode.mesh.scale.x -= 0.1;
		thisNode.mesh.scale.y -= 0.1;
		thisNode.mesh.scale.z -= 0.1;
	    }
	}
    };

    thisNode.mouse = function(e){
	thisNode.mouse_x =   ((e.pageX-e.target.offsetParent.offsetLeft) / renderer.domElement.width)  * 2 - 1;
	thisNode.mouse_y = - ((e.pageY-e.target.offsetParent.offsetTop) / renderer.domElement.height) * 2 + 1;
	thisNode.vector = new THREE.Vector3(thisNode.mouse_x, thisNode.mouse_y, 0.5);
	thisNode.projector.unprojectVector(thisNode.vector, camera);
	
	thisNode.ray = new THREE.Ray(camera.position, thisNode.vector.subSelf(camera.position).normalize());
	thisNode.obj = thisNode.ray.intersectObjects([thisNode.mesh]);
	if(thisNode.obj.length > 0){
	    if(thisNode.clicked){
		thisNode.clicked = 0;
	    }else{
		thisNode.clicked = 1;
	    }
	}
    };

    thisNode.createChild = function(max, geometry, material, scene){
	for(var i = 0; i < max; i++){
	    thisNode.child[i] = new createNode(geometry, material, scene);
	    thisNode.childId[i] = thisNode.child[i].mesh.id;
	}
    };

    thisNode.removeChild = function(){
	for(var i = 0; i < thisNode.child; i++){
	    scene.remove(thisNode.childId[i]);
	}
    };
};
