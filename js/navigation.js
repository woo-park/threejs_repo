// import { isContext } from "vm";


    let camera, scene, renderer, controls, mesh_group;
    let step5 = 0;
    let step10 = 0;

    
    function init() {
        Physijs.scripts.worker = '../../libs/other/physijs/physijs_worker.js';
        Physijs.scripts.ammo = './ammo.js';

        scene = new Physijs.Scene({reportSize: 10, fixedTimeStep: 1 /60});
        scene.setGravity(new THREE.Vector3(0,-10,0));

        var stats = initStats();

           
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        function setup(){
            //creating canvas
          
            document.getElementById('canvas-output').appendChild(canvas);

            let width = 400, height = 400;
            

            //setting css display size
            canvas.style.border = '1px dashed black';
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';   

            //skip scale
            let scale = window.devicePixelRatio;
            canvas.width = width * scale;
            canvas.height = width * scale;

            //normalize the coordinate system
            context.scale(scale, scale);
        }
        
        function draw() {
            let pixels = context.getImageData(0,0,canvas.width,canvas.height);
            let pixelData = pixels.data;

            //make each pixels have random values
            for (let i = 0; i < pixelData.length; i+= 4) {
                pixelData[i] = Math.floor(Math.random() * 255); //red color
                pixelData[i + 1] = Math.floor(Math.random() * 255);  // green 
                pixelData[i + 2] = Math.floor(Math.random() * 255);  // green 
                pixelData[i + 3] = 255; // alpha value 
            }

            context.putImageData(pixels, 0, 0);
        }
        setup();
        draw();

       
        let singleGeometry = new THREE.Geometry();
        // let singlePanel = new THREE.Mesh();
        let ratio = 10;
        let panel_geometry = new THREE.PlaneGeometry(60*ratio,60*ratio);
        let sphere_geometry = new THREE.SphereGeometry(32, 32, 32);
        let textureLoader = new THREE.TextureLoader();
        let panel_material1 = new THREE.MeshStandardMaterial({
            map: textureLoader.load('./svgandjpg/jpg/texture3_sm.jpg'),
            transparent: true,
            opacity: 0.4,
            color: 0xb01055
        });
        let panel_material2 = new THREE.MeshStandardMaterial({
            map: textureLoader.load('./svgandjpg/jpg/texture7_sm.jpg'),
            transparent: true,
            opacity: 0.4,
            color: 0xfa7a55
        });
        let panel_material3 = new THREE.MeshStandardMaterial({
            map: textureLoader.load('./svgandjpg/jpg/back2_sm.jpg'),
            transparent: true,
            opacity: 0.4,
            color: 0x208075
        });

        let panel_outside_material = new THREE.MeshStandardMaterial({
            color: 0x222222,
            transparent: true,
            opacity: 1,
        });
        let panel1 = new THREE.Mesh(panel_geometry, panel_material1);
        let panel2 = new THREE.Mesh(panel_geometry, panel_material2);
        let panel3 = new THREE.Mesh(panel_geometry, panel_material3);
        let sphereMesh = new THREE.Mesh(sphere_geometry);
        // panel1.position.x = -60;
        

        // panel1.matrixAutoUpdate = false;
        // panel2.matrixAutoUpdate = false;
        // panel3.matrixAutoUpdate = false;
            
            
        panel1.rotation.y = 2*Math.PI/3;
        panel2.rotation.y = 2*Math.PI * 2/3;
        panel3.rotation.y = 2*Math.PI;

        panel1.position.x = 15*ratio;
        panel2.position.x = -15*ratio;
        panel3.position.z = 26*ratio;




        panel1.name = 'panel1';
        panel2.name = 'panel2';
        panel3.name = 'panel3';

        panel1.material.side = THREE.DoubleSide;
        panel2.material.side = THREE.DoubleSide;
        panel3.material.side = THREE.DoubleSide;

        panel1.userData = { URL: ""}
        panel2.userData = { URL: ""}
        panel3.userData = { URL: ""}

        // console.log(panel1.userData);

        // panel1.updateMatrix();
        // panel2.updateMatrix();
        // panel3.updateMatrix();

        scene.add(panel1);
        scene.add(panel2);
        scene.add(panel3);

        // singlePanel.add(panel1);
        // singlePanel.add(panel2);
        // singlePanel.add(panel3);
        // scene.add(singlePanel);

        
        panel1.updateMatrix();
        singleGeometry.merge(panel1.geometry, panel1.matrix);

        panel2.updateMatrix();
        singleGeometry.merge(panel2.geometry, panel2.matrix);

        panel3.updateMatrix();
        singleGeometry.merge(panel3.geometry, panel3.matrix);

        // sphereMesh.updateMatrix();
        // singleGeometry.merge(sphereMesh.geometry, sphereMesh.matrix);

        let panels = new THREE.Mesh(singleGeometry, panel_outside_material);
        panels.scale.set(0.9,0.9,0.9);
        panels.material.side = THREE.DoubleSide;
        scene.add(panels);


        let cubeCamera = new THREE.CubeCamera(0.1, 100, 512);
        
        let urls = [
            './svgandjpg/beach/right.png',
            './svgandjpg/beach/left.png',
            './svgandjpg/beach/top.png',
            './svgandjpg/beach/bottom.png',
            './svgandjpg/beach/front.png',
            './svgandjpg/beach/back.png'
        ];

        let skyLoader = new THREE.CubeTextureLoader();
        // let textureLoader = new THREE.TextureLoader();
        let skyMap = skyLoader.load(urls);
        scene.background = skyMap;

        //creating cube that will reflect
        let cubeMaterial = new THREE.MeshStandardMaterial({
            envMap: skyMap,
            color: 0xffffff,
            metalness:1,
            roughness: 0
        });

        // create new camera for cube mirror
        
        scene.add(cubeCamera);
        
        function extrudeMasterKey(){
            let svg_master_string = document.getElementById("svg_master_string").getAttribute("d");
            function extrudeShape(svg_master_string) {
                let svg_master_geometry = transformSVGPathExposed(svg_master_string);
                return svg_master_geometry;
            }
           
            let options = {
                depth: 10,
                bevelThickness:20,
                bevelSize:1,
                bevelSegments:3,
                bevelEnabled: true,
                curveSegements:12,
                steps:1
            }
    
            svg_master_geometry = new THREE.ExtrudeGeometry(extrudeShape(svg_master_string), options);
            svg_master_geometry.center();
            
            // let textureLoader = new THREE.TextureLoader();
            let svg_master_material = new THREE.MeshStandardMaterial( { 
                map: textureLoader.load('./svgandjpg/jpg/texture3_sm.jpg'),
                opacity: 1,
                metalness:1,
                roughness:1
                // map: textureLoader.load('../assets/textures/w_c.jpg')
            } );
            
            let svg_master_key = new Physijs.BoxMesh(svg_master_geometry, Physijs.createMaterial(svg_master_material),1);
            svg_master_key.name = 'master_key';
            // svg_master_key.userData = { URL: "http://localhost:8080/threejs_repo/sketch2.html"}
            svg_master_key.scale.set(0.1,0.1,0.1);
            // svg_master_key.receiveShadow = true;
            // svg_master_key.castShadow = true;
            // svg_master_key.position.y = 90;
            // svg_master_key.position.x = 200;
            return svg_master_key;
        }
       
        function makemore(boxNumber){
            for(let i = 0; i < boxNumber; i++){
                let keys = extrudeMasterKey();
                keys.position.x = - 1000 + Math.round(Math.random() * 2000);
                keys.position.y = 1000 + Math.round(Math.random() * 4000);
                keys.position.z = - 1000 + Math.round(Math.random() * 2000);
                keys.__dirtyPosition = true;
                scene.add(keys);
            }
        }
        makemore(300);
       

        // create a camera
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
        camera.position.set(0, 600, 500);   //back on z axis - up to y
        
        camera.lookAt(scene.position);  // scene default is 0,0,0
   
        camera.updateMatrix();      //honestly idk why tho
        scene.add(camera);
       

        var spotLight = new THREE.SpotLight(0xFFFFFF);
        spotLight.position.set(500, 100, 200);
        spotLight.castShadow = true;
        spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
        spotLight.shadow.camera.far = 130;
        spotLight.shadow.camera.near = 40;
        scene.add(spotLight);

        var spotLight2 = new THREE.SpotLight(0xFFFFFF);
        spotLight2.position.set(0, 100, 500);
        spotLight2.castShadow = true;
        spotLight2.shadow.mapSize = new THREE.Vector2(1024, 1024);
        spotLight2.shadow.camera.far = 130;
        spotLight2.shadow.camera.near = 40;
        scene.add(spotLight2);

        var spotLight2 = new THREE.SpotLight(0xFFFFFF);
        spotLight2.position.set(-500, 100, 200);
        spotLight2.castShadow = true;
        spotLight2.shadow.mapSize = new THREE.Vector2(1024, 1024);
        spotLight2.shadow.camera.far = 130;
        spotLight2.shadow.camera.near = 40;
        scene.add(spotLight2);

        let helper = new THREE.SpotLightHelper(spotLight);
        // scene.add(helper);


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
         
         


         let threshold = 0.1;
  
         let raycaster = new THREE.Raycaster();
         let mouse = new THREE.Vector2();
      
         raycaster.params.Points.threshold = threshold;  //??
 
         function onMouseMove(event) {
             // event.preventDefault();
 
             mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;        //we'll see why we *2 +1 later
             mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
             //-0.5578703703703703 -0.22014388489208625 .i.e   
             //   console.log(scene.children);
         }
         render();
 
       
        function render() {
            stats.update();
            trackballControls.update(clock.getDelta()); //works now with inittrackballcontrols

        
            
            let angle = 0.1;

            // cube2.visible = false;
            // cubeCamera2.updateCubeMap(renderer, scene);
            // cube2.visible = true;
            // camera_pivot.rotateOnAxis( Y_AXIS, 0.01 );   
            // camera.position.y = camera.position.y * Math.cos(angle) +2;
            // if(camera.position.z < 2000){
            //     camera.position.z += Math.cos(angle) +2;
            // }

            var speed = Date.now() * 0.0003;
            camera.position.x = -Math.sin(speed) * 3000;
            camera.position.z = 1500 + Math.sin(speed) * 300;

            // camera.lookAt(panels.position); //0,0,0
            let intersects;
            
            
            //from here 
            raycaster.setFromCamera( mouse, camera );       //raycaster
            intersects = raycaster.intersectObjects(scene.children);
            
            if( intersects.length > 0){
            
                    
    
                // intersects[ 0 ].object.material.color.set( 0xff0000);
                    if(intersects[0].object.name == 'panel1'){
                        // window.open(intersects[0].object.userData.URL);
                        
                        intersects[0] = null;
                    } else if (intersects[0].object.name == 'panel2' ){
                        // window.open(intersects[0].object.userData.URL);
                        intersects[0] = null;
                    } else if (intersects[0].object.name == 'panel3' ){
                        // window.open(intersects[0].object.userData.URL);
                        intersects[0] = null;
                    } else {
                        intersects[0] = null;
                    }
            }


            // if( intersects.length > 0 && intersects[0].object.name == 'panel1'){
            //     // intersects[ 0 ].object.material.color.set( 0xff0000);
                
            //     window.open(intersects[0].object.userData.URL);
            // }
            // else if (intersects.length > 0 && intersects[0].object.name == 'panel2' ){
            //     window.open(intersects[0].object.userData.URL);

            // } else if (intersects.length > 0 && intersects[0].object.name == 'panel3' ){
            //     window.open(intersects[0].object.userData.URL);

            
            // }
            //to here
            step10 += 0.003;
           
            
        // panel1.matrixAutoUpdate = false;
        // panel2.matrixAutoUpdate = false;
        // panel3.matrixAutoUpdate = false;

            // panel1.rotation.y = Math.sin(step10);
            // panel2.rotation.y = Math.sin(step10);
            // panel3.rotation.y = Math.sin(step10);
            // singlePanel
            // panels.rotation.y = Math.sin(step10) + Math.cos(step10);

            // panel1.updateMatrix();
            // panel2.updateMatrix();
            // panel3.updateMatrix();
            

            requestAnimationFrame(render);
            renderer.render(scene, camera);
       
            scene.simulate();
            helper.update();
            
        }
        // panel1.on('click',()=>{
        //     console.log('clickeeeed');
        // })

        window.addEventListener('click', onMouseMove, false);


        function onResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        window.addEventListener('resize', onResize, false);


         // create directionallight
        let directionalLight = new THREE.DirectionalLight(0xffffff, 1); // color, intensity   //similar to sun
        directionalLight.position.set(1, 1, 1); // location x, y, z
        scene.add(directionalLight);

        // // add subtle ambient lighting
        var ambientLight = new THREE.AmbientLight(0x3c3c3c);
        scene.add(ambientLight);

    }   //end of function init

    
    
