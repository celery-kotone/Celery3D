Node = function(geometry, material, scene){
    var thisNode = this;

    thisNode.mesh      = new THREE.Mesh(geometry, material);
    thisNode.projector = new THREE.Projector();

    scene.add(thisNode.mesh);

    thisNode.child      = [];
    thisNode.clicked    = null;
    thisNode.move       = null;
    thisNode.distance   = 0;
    thisNode.theta      = 0;
    thisNode.generation = 0;
    thisNode.radius     = 800;
    thisNode.ready      = 1;

    thisNode.update = function(){

	if(!thisNode.ready){
	    return;
	}

	//RECURSIVELY UPDATE CHILD NODES
	if(thisNode.child.length > 0){
	    for(var i in thisNode.child){
		thisNode.child[i].update();
	    }
	}

	//POSITION CHILD NODES
	if(thisNode.child.length > 0){
	    thisNode.theta = 2 * Math.PI / thisNode.child.length;
	    for(var i = 0; i < thisNode.child.length; i++){
		thisNode.x2 = Math.pow(thisNode.child[i].mesh.position.x - thisNode.mesh.position.x, 2);
		thisNode.y2 = Math.pow(thisNode.child[i].mesh.position.y - thisNode.mesh.position.y, 2);
		thisNode.z2 = Math.pow(thisNode.child[i].mesh.position.z - thisNode.mesh.position.z, 2);
		thisNode.distance = Math.sqrt(thisNode.x2 + thisNode.y2 + thisNode.z2);
		document.getElementById('rotation').innerHTML = thisNode.distance + " " + thisNode.child[i].ready;
		if(thisNode.distance < thisNode.radius){
		    thisNode.child[i].mesh.position.x += Math.cos(thisNode.theta * i) * Math.sqrt(thisNode.radius - thisNode.distance);
		    thisNode.child[i].mesh.position.z += Math.sin(thisNode.theta * i) * Math.sqrt(thisNode.radius - thisNode.distance);
		}else{
		    thisNode.child[i].ready = 1;
		}
	    }
	}

	//CHECK MOUSECLICK
	renderer.domElement.addEventListener('click', thisNode.mouseClick, false);

	//CHECK MOUSEOVER
	renderer.domElement.addEventListener('mousemove', thisNode.mouseOver, false);

	//ROTATE MESH
	thisNode.mesh.rotation.y = ((thisNode.mesh.rotation.y.toFixed(2) * 100) % (Math.PI.toFixed(2) * 100) + 1) / 100;

	//CREATE/REMOVE CHILD NODES
	if(thisNode.clicked){
	    if(thisNode.child.length == 0){
		thisNode.createChild(6, geometry, material, scene);
	    }
	}else{
	    thisNode.removeChild();
	}

	//RESIZE NODE
	if(thisNode.move || thisNode.clicked){
	    if(thisNode.mesh.scale.x < 2){
		thisNode.mesh.scale.x += 0.1;
		thisNode.mesh.scale.y += 0.1;
		thisNode.mesh.scale.z += 0.1;
	    }
	}else{
	    if(thisNode.mesh.scale.x > 1){
		thisNode.mesh.scale.x -= 0.1;
		thisNode.mesh.scale.y -= 0.1;
		thisNode.mesh.scale.z -= 0.1;
	    }
	}
    };

    thisNode.mouseClick = function(e){
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
	    if(thisNode.child[i].mesh.scale.x > 0){
		if(thisNode.child[i].clicked){
		    thisNode.child[i].mesh.scale.x -= 0.2;
		    thisNode.child[i].mesh.scale.y -= 0.2;
		    thisNode.child[i].mesh.scale.z -= 0.2;
		}
		thisNode.child[i].mesh.scale.x -= 0.1;
		thisNode.child[i].mesh.scale.y -= 0.1;
		thisNode.child[i].mesh.scale.z -= 0.1;
	    }else{
		scene.remove(thisNode.child[i].mesh);
		if(i == thisNode.child.length - 1){
		    thisNode.child.length = 0;
		}
	    }
	}
    };
};
