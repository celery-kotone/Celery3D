Node = function(geometry, material, scene){
    var thisNode = this;

    thisNode.mesh      = new THREE.Mesh(geometry, material);
    thisNode.projector = new THREE.Projector();

    scene.add(thisNode.mesh);

    thisNode.child      = [];
    thisNode.clicked    = null;
    thisNode.move       = null;
    thisNode.lastClick  = null;
    thisNode.distance   = 0;
    thisNode.theta      = 0;
    thisNode.generation = 0;
    thisNode.radius     = 800;
    thisNode.ready      = 1;
    thisNode.hasChild   = 0;
    thisNode.cameraPos  = 0;

    thisNode.update = function(){

	//RECURSIVELY UPDATE CHILD NODES
	if(thisNode.child.length > 0){
	    for(var i in thisNode.child){
		thisNode.child[i].update();
	    }
	}

	//POSITION CHILD NODES
	if(thisNode.hasChild){
	    thisNode.theta = 2 * Math.PI / thisNode.child.length;
	    for(var i = 0; i < thisNode.child.length; i++){
		thisNode.x2 = Math.pow(thisNode.child[i].mesh.position.x - thisNode.mesh.position.x, 2);
		thisNode.y2 = Math.pow(thisNode.child[i].mesh.position.y - thisNode.mesh.position.y, 2);
		thisNode.z2 = Math.pow(thisNode.child[i].mesh.position.z - thisNode.mesh.position.z, 2);
		thisNode.distance = Math.sqrt(thisNode.x2 + thisNode.y2 + thisNode.z2);
		if(thisNode.child[i].mesh.position.y < (thisNode.child[i].generation - 1) * 500){
		    thisNode.child[i].mesh.position.y += Math.sqrt((thisNode.child[i].generation - 1) * 500 - thisNode.child[i].mesh.position.y);
		    thisNode.mesh.position.y = thisNode.child[i].mesh.position.y;
		}
		if(thisNode.distance < thisNode.radius){
		    thisNode.child[i].mesh.position.x += Math.cos(thisNode.theta * i) * Math.sqrt(thisNode.radius - thisNode.distance);
		    thisNode.child[i].mesh.position.z += Math.sin(thisNode.theta * i) * Math.sqrt(thisNode.radius - thisNode.distance);
		}else{
		    thisNode.child[i].ready = 1;
		}
	    }
	}else{
	    if(thisNode.mesh.position.y > (thisNode.generation - 1)  * 500 && thisNode.generation > 0){
		thisNode.mesh.position.y -= Math.sqrt(thisNode.mesh.position.y - (thisNode.generation - 1) * 500);
	    }
	}

	//ROTATE MESH
	thisNode.mesh.rotation.y = ((thisNode.mesh.rotation.y.toFixed(2) * 100) % (Math.PI.toFixed(2) * 100) + 1) / 100;

	//CREATE/REMOVE CHILD NODES
	if(thisNode.clicked){
	    if(!thisNode.hasChild && thisNode.ready){
		thisNode.createChild(6, geometry, material, scene);
		thisNode.hasChild = 1;
	    }
	}else{
	    thisNode.hasChild = 0;
	    thisNode.removeChild();
	}

	//RESIZE NODE
	if(thisNode.move || thisNode.clicked){
	    if(thisNode.mesh.scale.x < 2){
		thisNode.mesh.scale.x += (Math.pow(2 - thisNode.mesh.scale.x, 1/2)) * 0.07;
		thisNode.mesh.scale.y += (Math.pow(2 - thisNode.mesh.scale.y, 1/2)) * 0.07;
		thisNode.mesh.scale.z += (Math.pow(2 - thisNode.mesh.scale.z, 1/2)) * 0.07;
	    }
	}else{
	    if(thisNode.mesh.scale.x > 1){
		thisNode.mesh.scale.x -= (Math.pow(thisNode.mesh.scale.x - 1, 1/2)) * 0.07;
		thisNode.mesh.scale.y -= (Math.pow(thisNode.mesh.scale.y - 1, 1/2)) * 0.07;
		thisNode.mesh.scale.z -= (Math.pow(thisNode.mesh.scale.z - 1, 1/2)) * 0.07;
	    }
	}

	//MOVE CAMERA
	if(thisNode.lastClick){
	    if(controls.target != thisNode.position){
		controls.target.x += (thisNode.mesh.position.x - controls.target.x) / 10;
		controls.target.y += (thisNode.mesh.position.y - controls.target.y) / 10;
		controls.target.z += (thisNode.mesh.position.z - controls.target.z) / 10;
	    }
	}

	//CHECK MOUSECLICK
	renderer.domElement.addEventListener('click', thisNode.mouseClick, false);

	//CHECK MOUSEOVER
	renderer.domElement.addEventListener('mousemove', thisNode.mouseOver, false);
    };

    thisNode.mouseClick = function(e){
	thisNode.mouse_x =   ((e.pageX-e.target.offsetParent.offsetLeft) / renderer.domElement.width)  * 2 - 1;
	thisNode.mouse_y = - ((e.pageY-e.target.offsetParent.offsetTop) / renderer.domElement.height) * 2 + 1;
	thisNode.vector = new THREE.Vector3(thisNode.mouse_x, thisNode.mouse_y, 0.5);
	thisNode.projector.unprojectVector(thisNode.vector, camera);
	
	thisNode.ray = new THREE.Ray(camera.position, thisNode.vector.subSelf(camera.position).normalize());
	thisNode.obj = thisNode.ray.intersectObjects([thisNode.mesh]);
	if(thisNode.obj.length > 0){
	    thisNode.lastClick = 1;
	    if(thisNode.clicked){
		thisNode.clicked = 0;
	    }else{
		thisNode.clicked = 1;
	    }
	}else{
	    thisNode.lastClick = 0;
	}
    };

    thisNode.mouseOver = function(e){
        thisNode.mouse_x =   ((e.pageX-e.target.offsetParent.offsetLeft) / renderer.domElement.width)  * 2 - 1;
        thisNode.mouse_y = - ((e.pageY-e.target.offsetParent.offsetTop) / renderer.domElement.height) * 2 + 1;
        thisNode.vector = new THREE.Vector3(thisNode.mouse_x, thisNode.mouse_y, 0.5);
        thisNode.projector.unprojectVector(thisNode.vector, camera);

        thisNode.ray = new THREE.Ray(camera.position, thisNode.vector.subSelf(camera.position).normalize());
        thisNode.obj = thisNode.ray.intersectObjects([thisNode.mesh]);
        if(thisNode.obj.length > 0){
	    thisNode.move = 1;
        }else{
	    thisNode.move = 0;
	}
    };

    thisNode.createChild = function(max, geometry, material, scene){
	for(var i = 0; i < max; i++){
	    thisNode.child[i] = new Node(geometry, material, scene);
	    thisNode.child[i].ready = 0;
	    thisNode.child[i].radius = 500;
	    thisNode.child[i].generation = thisNode.generation + 1;
	    thisNode.child[i].mesh.position.x = thisNode.mesh.position.x;
	    thisNode.child[i].mesh.position.y = thisNode.mesh.position.y;
	    thisNode.child[i].mesh.position.z = thisNode.mesh.position.z;
	}
    };

    thisNode.removeChild = function(){
	for(var i = 0; i < thisNode.child.length; i++){
	    if(thisNode.child[i].child.length != 0){
		thisNode.child[i].removeChild();
	    }
	    if(thisNode.child[i].mesh.scale.x * thisNode.child[i].mesh.scale.y * thisNode.child[i].mesh.scale.z > 0){
		thisNode.child[i].mesh.scale.x -= 0.07 * (1 + thisNode.child[i].clicked * 2);
		thisNode.child[i].mesh.scale.y -= 0.07 * (1 + thisNode.child[i].clicked * 2);
		thisNode.child[i].mesh.scale.z -= 0.07 * (1 + thisNode.child[i].clicked * 2);
		continue;
	    }else{
		thisNode.child[i].mesh.scale.x = 0;
		thisNode.child[i].mesh.scale.y = 0;
		thisNode.child[i].mesh.scale.z = 0;
		scene.remove(thisNode.child[i].mesh);
	    }
	}
    };
};
