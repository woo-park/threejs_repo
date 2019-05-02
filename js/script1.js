
    let camera, scene, renderer, controls, mesh_group;


    function init() {
        

        Physijs.scripts.worker = '../../libs/other/physijs/physijs_worker.js';
        Physijs.scripts.ammo = './ammo.js';

        scene = new Physijs.Scene({reportSize: 10, fixedTimeStep: 1 /60});
        scene.setGravity(new THREE.Vector3(0,-10,0));

       

        //creating ground and wall
        function createGroundWall(scene){
            let textureLoader = new THREE.TextureLoader();
            let ground_material_ground = Physijs.createMaterial(   
                new THREE.MeshStandardMaterial(
                    {map: textureLoader.load('../assets/textures/general/wood-2.jpg'), transparent:false, opacity:1}), 0.9, 0.3
            );
            let ground_material_sides = Physijs.createMaterial(   
                new THREE.MeshStandardMaterial(
                    {map: textureLoader.load('../assets/textures/general/wood-2.jpg'), transparent:true, opacity:0.8}), 0.9, 0.3
            );
            
            // let x_length = 400;
            // let y_length = 400;
            // let z_length = 400;

            let ground = new Physijs.BoxMesh(new THREE.BoxGeometry(400, 1, 400), ground_material_ground, 0);
            ground.castShadow = true;
            ground.receiveShadow = true;
                    
                    //lets add side walls
            let border_left = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 400, 400), ground_material_sides, 0);
            border_left.position.x = -201;
            border_left.position.y = 200;
            border_left.castShadow = true;
            border_left.receiveShadow = true;
            ground.add(border_left);

            let border_right = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 400, 400), ground_material_sides, 0);
            border_right.position.x = 201;
            border_right.position.y = 200;
            border_right.castShadow = true;
            border_right.receiveShadow = true;
            ground.add(border_right);

            let border_back = new Physijs.BoxMesh(new THREE.BoxGeometry(400, 400, 2), ground_material_sides, 0);
            border_back.position.z = 201;
            border_back.position.y = 200;
            border_back.castShadow = true;
            border_back.receiveShadow = true;
            ground.add(border_back);

            let border_front = new Physijs.BoxMesh(new THREE.BoxGeometry(400, 400, 2), ground_material_sides, 0);
            border_front.position.z = -200;
            border_front.position.y = 200;
            border_front.castShadow = true;
            border_front.receiveShadow = true;
            ground.add(border_front);



            scene.add(ground);
        }//end of groundwallfunction
        createGroundWall(scene);
        let stoneGem = new THREE.BoxGeometry(0.6, 6, 2);
        let stone = new Physijs.BoxMesh(stoneGem, Physijs.createMaterial(
            new THREE.MeshStandardMaterial({
                color: 0x333333, transparent:true, opacity:0.8
        })));
        scene.add(stone);

       


        // create a camera
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(-90, 50, -500);   //back on z axis - up to y
        camera.lookAt(new THREE.Vector3(0, 0, 0));  // scene default is 0,0,0
        // camera.lookAt(scene.position);
        scene.add(camera);
       

        var spotLight = new THREE.SpotLight(0xFFFFFF);
        spotLight.position.set(0, 1000, 0);
        spotLight.castShadow = true;
        spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
        spotLight.shadow.camera.far = 130;
        spotLight.shadow.camera.near = 40;
        scene.add(spotLight);

        let helper = new THREE.SpotLightHelper(spotLight);
        scene.add(helper);


         //renderer
         renderer = new THREE.WebGLRenderer({alpha: 1, antialias: true});
         renderer.setClearColor(new THREE.Color(0x000000));  
         renderer.setSize(window.innerWidth, window.innerHeight);
         renderer.shadowMap.enabled = true;
 
         document.getElementById("webgl-output").appendChild(renderer.domElement);
         let trackballControls = initTrackballControls(camera, renderer);
         let clock = new THREE.Clock();
 
         function initTrackballControls(camera, renderer) {
             var trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
             trackballControls.rotateSpeed = 1.0;
             trackballControls.zoomSpeed = 1.2;
             trackballControls.panSpeed = 0.8;
             trackballControls.noZoom = false;
             trackballControls.noPan = false;
             trackballControls.staticMoving = true;
             trackballControls.dynamicDampingFactor = 0.3;
             trackballControls.keys = [65, 83, 68];
 
             return trackballControls;
         }
 
        // controls.redraw();
        render();
        function render() {
            // recursive requestAnimationFrame
            trackballControls.update(clock.getDelta()); //works now with inittrackballcontrols
            requestAnimationFrame(render);
            renderer.render(scene, camera);
            scene.simulate();
            helper.update();
            
        }

        function onResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        window.addEventListener('resize', onResize, false);




        

        // var planeGeometry1 = new THREE.PlaneGeometry(60,20);
        // var planeMaterial1 = new THREE.MeshLambertMaterial({
        //     color: 0x9acd32
        // });
        // var plane1 = new THREE.Mesh(planeGeometry1, planeMaterial1);
        // plane1.rotation.x = -0.5 * Math.PI;
        // plane1.position.set(15, 20, 0);
        // plane1.receiveShadow = true;
        // scene.add(plane1);

        // // create a cube
        // var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
        // var cubeMaterial = new THREE.MeshBasicMaterial({color: 0xFF0000,wireframe: true});
        // var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        // cube.position.set(-4, 3, 0);
        // cube.castShadow = true;
        // scene.add(cube);

         // // create directionallight
        // let directionalLight = new THREE.DirectionalLight(0xffffff, 1); // color, intensity   //similar to sun
        // directionalLight.position.set(1, 1, 1); // location x, y, z
        // scene.add(directionalLight);

        // // add subtle ambient lighting
        // var ambientLight = new THREE.AmbientLight(0x3c3c3c);
        // scene.add(ambientLight);

        // //shows where the spotLight is coming
        // let debugCamera = new THREE.CameraHelper(spotLight.shadow.camera);
        // // scene.add(debugCamera);

        //page 96
        

        // //linear fog // nothing is happening
        // scene.fog = new THREE.Fog(0xffffff, 1, 1000);

       
        

//from mhere
        function addLargeGroundPlane(scene, useTexture) {

        var withTexture = (useTexture !== undefined) ? useTexture : false;

        // create the ground plane
        var planeGeometry = new THREE.PlaneGeometry(500, 500);
        var planeMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff
        });
        if (withTexture) {
            var textureLoader = new THREE.TextureLoader();
            planeMaterial.map = textureLoader.load("./forest-texture.jpg");
            planeMaterial.map.wrapS = THREE.RepeatWrapping; 
            planeMaterial.map.wrapT = THREE.RepeatWrapping; 
            planeMaterial.map.repeat.set(80,80)
        }
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

        scene.add(plane);
        return plane;
        }

        // var groundPlane = addLargeGroundPlane(scene)
        // groundPlane.position.y = -30;
        

        
    }   //end of function init

    
    
