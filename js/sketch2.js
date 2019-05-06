// import { isContext } from "vm";

    let camera, scene, renderer, controls, mesh_group;
    
    function init() {
        Physijs.scripts.worker = '../../libs/other/physijs/physijs_worker.js';
        Physijs.scripts.ammo = './ammo.js';

        scene = new Physijs.Scene({reportSize: 10, fixedTimeStep: 1 /60});
        scene.setGravity(new THREE.Vector3(0,-10,0));

        var stats = initStats();

        let ground_area = new THREE.Mesh();
        //creating ground and wall
        function createGroundWall(scene){
            let textureLoader = new THREE.TextureLoader();
            let ground_material_ground = Physijs.createMaterial(   
                new THREE.MeshStandardMaterial(
                    {map: textureLoader.load('svgandjpg/jpg/texture1_sm.jpg'), color:0xc2b280, transparent:false, opacity:1}), 0.9, 0.3
            );
            let ground_material_sides = Physijs.createMaterial(   
                new THREE.MeshStandardMaterial(
                    {map: textureLoader.load('svgandjpg/jpg/back2_sm.jpg'),
                    transparent:true,
                    opacity:0.4
                    }), 0.9, 0.3
            );
            
            let skybox_height = 1000;
            let skybox_size = 2000;
            let platform_zlength = 2000;

            let ground = new Physijs.BoxMesh(new THREE.BoxGeometry(skybox_size, 1, platform_zlength), ground_material_ground, 0);
            ground.name = 'ground';
            ground.castShadow = true;
            ground.receiveShadow = true;
            ground.position.y = 0;
            ground_area.add(ground);
                    //lets add side walls
            let border_left = new Physijs.BoxMesh(new THREE.BoxGeometry(2, skybox_height, skybox_size), ground_material_sides, 0);
            border_left.name = 'border_left';
            border_left.position.x = -(skybox_size/2) -1;
            border_left.position.y = skybox_height/2;
            border_left.castShadow = true;
            border_left.receiveShadow = true;
            // border_left.material.side =  THREE.DoubleSide;
            ground.add(border_left);
            

            let border_right = new Physijs.BoxMesh(new THREE.BoxGeometry(2, skybox_height, skybox_size), ground_material_sides, 0);
            border_right.name = 'border_right';   
            border_right.position.x = (skybox_size/2) + 1;
            border_right.position.y = (skybox_height/2);
            border_right.castShadow = true;
            border_right.receiveShadow = true;
            // border_right.material.side =  THREE.DoubleSide;
            ground.add(border_right);

            let border_back = new Physijs.BoxMesh(new THREE.BoxGeometry(skybox_size, skybox_height, 2), ground_material_sides, 0);
            border_back.name = 'border_back';
            border_back.position.z = (skybox_size/2) +1;
            border_back.position.y = (skybox_height/2);;
            border_back.castShadow = true;
            border_back.receiveShadow = true;
            // border_back.material.side =  THREE.DoubleSide;
            ground.add(border_back);

            let border_front = new Physijs.BoxMesh(new THREE.BoxGeometry(skybox_size, skybox_height, 2), ground_material_sides, 0);
            border_front.name = 'border_front';
            border_front.position.z = -(skybox_size/2);;
            border_front.position.y = (skybox_height/2);;
            border_front.castShadow = true;
            border_front.receiveShadow = true;
            // border_front.material.side =  THREE.DoubleSide;
            ground.add(border_front);
            
            scene.add(ground);
        }//end of groundwallfunction




        // let stoneGem = new THREE.BoxGeometry(0.6, 6, 2);
        // let stone = new Physijs.BoxMesh(stoneGem, Physijs.createMaterial(
        //     new THREE.MeshStandardMaterial({
        //         color: 0x333333, transparent:true, opacity:0.8
        // })));
        // stone.__dirtyRotation = true;
        // stone.position.y = 100;
        // scene.add(stone);

        // let cubeCamera = new THREE.CubeCamera(0.1, 100, 512);

        function sky(){
            let urls = [
                './svgandjpg/beach/right.png',
                './svgandjpg/beach/left.png',
                './svgandjpg/beach/top.png',
                './svgandjpg/beach/bottom.png',
                './svgandjpg/beach/front.png',
                './svgandjpg/beach/back.png'
            ];
    
            let skyLoader = new THREE.CubeTextureLoader();
            let textureLoader = new THREE.TextureLoader();
            let skyMap = skyLoader.load(urls);
            scene.background = skyMap;
        }
        //     //creating cube that will reflect
        //     let cubeMaterial = new THREE.MeshStandardMaterial({
        //         envMap: skyMap,
        //         color: 0xffffff,
        //         metalness:1,
        //         roughness: 0
        //     });
    
        //     // create new camera for cube mirror
            
        //     scene.add(cubeCamera);
        //     let cube_geom = new THREE.CubeGeometry(100,100,100);

        //     let mirrors = 280;
        //     for(let i = 0; i < mirrors; i ++) {
        //         cube =  new Physijs.BoxMesh(cube_geom, Physijs.createMaterial(
        //             cubeMaterial
        //         ));

        //         cube.position.x = - 200 + Math.round(Math.random() * 400);
        //         cube.position.y = 500+ Math.round(Math.random() * 800);
        //         cube.position.z = - 200 + Math.round(Math.random() * 400);
        //         cube.rotation.y = Math.cos(Math.random()* Math.PI * 2); 
        //         cube.castShadow = true;       //check for error - add light to see
        //         cube.receiveShadow = true;    //
        //         scene.add(cube);
        //     }
        // }
        
        sky();
        
      

        // let sphereMaterial = cubeMaterial.clone();      //this is so useful


        // extruding svgs
        function extrudeSvg(){
            let svg_string4 = document.getElementById("key6").getAttribute("d");
            function extrudeShape(svgstring) {
                let shape = transformSVGPathExposed(svgstring);
                return shape;
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
    

            shape4 = new THREE.ExtrudeGeometry(extrudeShape(svg_string4), options);
            shape4.center();
       
            
            // let textureLoader = new THREE.TextureLoader();
            let svg_material1 = new THREE.MeshStandardMaterial( { 
                color: 0x4e3725,
                opacity: 1,
                metalness:1,
                roughness:1
                // map: textureLoader.load('../assets/textures/w_c.jpg')
            } );
            
            

            let svg_logo4 = new Physijs.BoxMesh(shape4, Physijs.createMaterial(svg_material1),1);
            
            svg_logo4.scale.set(0.1,0.1,0.1);

            svg_logo4.receiveShadow = true;
            svg_logo4.castShadow = true;
            svg_logo4.position.y = 90;

            scene.add(svg_logo4);

                            
                 
        }
        
        extrudeSvg();
        createGroundWall(scene);            //called after extrudesvg bc it has gravity of 0;
        
        // const canvas = document.createElement("canvas");
        // const context = canvas.getContext("2d");

        // function setup(){
        //     //creating canvas
          
        //     document.getElementById('canvas-output').appendChild(canvas);

        //     let width = 400, height = 400;
            

        //     //setting css display size
        //     canvas.style.border = '1px dashed black';
        //     canvas.style.width = width + 'px';
        //     canvas.style.height = height + 'px';   

        //     //skip scale
        //     let scale = window.devicePixelRatio;
        //     canvas.width = width * scale;
        //     canvas.height = width * scale;

        //     //normalize the coordinate system
        //     context.scale(scale, scale);
        // }
        
        // function draw() {
        //     let pixels = context.getImageData(0,0,canvas.width,canvas.height);
        //     let pixelData = pixels.data;

        //     //make each pixels have random values
        //     for (let i = 0; i < pixelData.length; i+= 4) {
        //         pixelData[i] = Math.floor(Math.random() * 255); //red color
        //         pixelData[i + 1] = Math.floor(Math.random() * 255);  // green 
        //         pixelData[i + 2] = Math.floor(Math.random() * 255);  // green 
        //         pixelData[i + 3] = 255; // alpha value 
        //     }

        //     context.putImageData(pixels, 0, 0);
        // }
        // setup();
        // draw();
       

      
        // let canvas_texture = new THREE.CanvasTexture(canvas);
        // let cube_demo = new THREE.CubeGeometry(100,100,100);
        // let cube_demo_mat = new THREE.MeshStandardMaterial({
        // map: canvas_texture
        // // displacementMap: canvas_texture
        
        // // bumbmap: new THREE.Texture(canvas),
        // // metalness:0,
        // // roughness:1,
        // // color:0xffffff,
        // // bumpScale:3,
        // // map: textureLoader.load('../assets/textures/general/wood-2.jpg')
        // })
        // let cube2;
        // let canvasMirrors = 100;
        // function makemore(){
        //     for(let i = 0; i < canvasMirrors; i ++) {
        //         cube2 =  new Physijs.BoxMesh(cube_demo, Physijs.createMaterial(
        //             cube_demo_mat
        //         ));

        //         cube2.position.x = - 200 + Math.round(Math.random() * 400);
        //         cube2.position.y = 800+ Math.round(Math.random() * 800);
        //         cube2.position.z = - 200 + Math.round(Math.random() * 400);
        //         cube2.rotation.y = Math.cos(Math.random()* Math.PI * 2); 
        //         cube2.castShadow = true;       //check for error - add light to see
        //         cube2.receiveShadow = true;    //
        //         scene.add(cube2);
        //     }
        // }
        // makemore();

        



        // let demo = new THREE.Mesh(cube_demo, cube_demo_mat);
        //dont know why but its only showing one side
        // demo.position.y = 400;
        // scene.add(demo);



        // point wave

        let pointclouds;
        let mouse = new THREE.Vector2();
        let intersection = null;
        // let spheres = [];
        // let spheresIndex = 0;
 
        let threshold = 0.1;
        let pointSize = 0.02;
        
        let rotateY = new THREE.Matrix4().makeRotationY( 0.005 );   //hm

        function generatePointCloudGeometry(color){

            let width = 1000;
            let length = 1000;

            let geometry =new THREE.BufferGeometry();
            let number_ofpoints = width * length;
            
            let positions = new Float32Array(number_ofpoints * 3);
            // let colors = new Float32Array(number_ofpoints * 3);

            let k = 0;

            for (let i = 0; i < width; i++){
                for (let j = 0; j < length; j++) {
                    let u = i / width; // so from 1/80 to 80/80
                    let v = j / length; // so from 1/160 to 160/160
                    let x = u - 0.5; //why?
                    let y = (Math.cos( u * Math.PI * 4) + Math.sin( v * Math.PI * 8)) / 20; //okay the cos and sin - ups and downs
                    let z = v - 0.5; // so always around 1.0

                    //push to array
                    positions[3 * k] = x;        // 0 //3 //6 
                    positions[3 * k + 1] = y;    // 1 //4 //7 
                    positions[3 * k + 2] = z;    // 2 //5 //8   

                    // let intensity = ( y + 0.1 ) * 5;
                    // colors[3 * k] = color.r * intensity;    //0 , 3, 6, 9, ...
                    // colors[3 * k] = color.g * intensity;    //1, 4, 7, ...
                    // colors[3 * k] = color.b * intensity;    //2, 5, 8 ...
                    // colors[3 * k] = color; //0 , 3, 6, 9, ...
                    // colors[3 * k] = color; //1, 4, 7, ...
                    // colors[3 * k] = color;   //2, 5, 8 ...

                    k++;
                }
            }
            // page 253

            geometry.addAttribute( 'position', new THREE.BufferAttribute(positions, 3));
            // geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3));
            geometry.computeBoundingBox();

            return geometry;
        }
        function generatePointcloud(color_temp) {
            let geometry = generatePointCloudGeometry();
            
            let material = new THREE.PointsMaterial({
                size:pointSize,
                // color: 0x42dff4,
                color: color_temp,
                transparent: true,
                opacity: 0.1
            });

            return new THREE.Points(geometry, material);
        }

        // function generatePointcloudIndex(color) {
        //     let width = 400;        //same as the above function
        //     let length = 400;
        //     let geometry = generatePointcloud(color);
        //     let number_ofpoints = width * length;
        //     let number_ofindexes = new Uint16Array( number_ofpoints);

        //     let k = 0;
        //     //iterate through and lets give indexes
        //     for (let i = 0; i < width; i++) {
        //         for (let j = 0; j < length; j++) {
        //             number_ofindexes[k] = k; // number_ofindexes[0] = 0; [1] = 1; [2] = 2;...
        //             k++;        
        //         }
        //     }

        //     geometry.setIndex( new THREE.BufferAttribute(number_ofindexes, 1) );
        //     let material = new THREE.PointsMaterial({size: pointSize, vertexColors: THREE.VertexColors});
        //     return new THREE.Points(geometry, material);

        // }
        

        // let pcBuffer33 = generatePointcloudIndex(new THREE.Color( 0, 1, 0 ));
        // pcBuffer33.position.y = 300;
        // pcBuffer33.scale.set(400,400,400);
        // scene.add(pcBuffer33);


        
        let pcBuffer = generatePointcloud(0x00809f);
        let pcBuffer2 = generatePointcloud(0x00858d);
        pcBuffer.position.y = 300;
        pcBuffer2.position.y = 700;
        pcBuffer.scale.set(2000,2000,2000);
        pcBuffer2.scale.set(2000,2000,2000);
        scene.add(pcBuffer);
        scene.add(pcBuffer2);
        // let pcBuffer2 = generatePointcloud(new THREE.Color( 30, 50, 29 ));
        // let pcBuffer3 = generatePointcloud(new THREE.Color( 10, 10, 1 ));
        // pcBuffer2.position.y = 200;
        // pcBuffer3.position.y = 100;
        // pcBuffer2.scale.set(400,400,400);
        // pcBuffer3.scale.set(400,400,400);
        // scene.add(pcBuffer2);
        // scene.add(pcBuffer3);

        // let threshold = 0.1;
        // let pointSize = 0.05;
        // let mouse = new THREE.Vector2();
        // let objects = [];


        let step = 0;
        radialWave = function (u, v, optionalTarget) {

            //takes three para
            var result = optionalTarget || new THREE.Vector3();
            var r = 2080;   //size of the plane
    
            var x = Math.sin(u) * 2380;      //bc x and z 
            var z = Math.sin(v / 2) * 2 * r;  //for seme reason - /2 mmakes it square
            // step += 0.005;
            var y = (Math.sin(u * 4 * Math.PI) + Math.cos(v * 2 * Math.PI)) * (20 + step);    //this 2.8 makes it far more drastic
        
            return result.set( x, y, z );
        };
        let wave_geometry = function () {
            let geom  = new THREE.ParametricGeometry(radialWave, 100, 100);
            geom.center();      //centers 0,0,0
            geom.castShadow = true;
            console.log(geom);
            return geom;
        }
        // wave_geometry();

        function createWave(scene){
            let textureLoader = new THREE.TextureLoader();

            let wave_material = Physijs.createMaterial(
                new THREE.MeshStandardMaterial(
                    {
                        //one way of texture - metalic and changing shape/form
                        map: textureLoader.load('./svgandjpg/jpg/texture3_sm.jpg'),
                        // map: textureLoader.load('../assets/textures/w_d.png'),
                    
                    // displacementMap: textureLoader.load('./svgandjpg/jpg/texture3_sm.jpg'),
                    metalness: 0.02,
                    roughness:0.07,
                    color: 0xffffff, 
                    transparent:true, // 
                    opacity:0.2
                    }
                )
            );
            wave_material.side = THREE.DoubleSide;
            
            // //it works if you want many waves compiled
            // let pile = new THREE.Geometry();
            // for(let i = 1; i <100; i++) {
            //     let waveMesh = new THREE.Mesh(wave_geometry(), wave_material);
            //     waveMesh.position.y = i;
            //     waveMesh.updateMatrix();
            //     pile.merge(waveMesh.geometry, waveMesh.matrix);
               
            // }
            // scene.add(new Physijs.PlaneMesh(pile, wave_material, 1));


            //one wave 
            let wave = new Physijs.PlaneMesh(wave_geometry(), wave_material, 1);
            wave.name = 'wave';
            wave.position.y = 900;
            wave.castShadow = true;
            wave.receiveShadow = true;

            scene.add(wave);
            
            

            
        }   //end of createwave function
        createWave(scene);
        







        let counter = 0;
        let object_clicked = false;
        let raycaster = new THREE.Raycaster();
        // raycaster.params.Points.threshold = threshold;

        
        function findMousePosition(event) {
            event.preventDefault();

            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;        //we'll see why we *2 +1 later
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
            //-0.5578703703703703 -0.22014388489208625 .i.e   
            //   console.log(scene.children);
        }

        function changeTarget(event){
            event.preventDefault();
            // object_clicked = true;

           
        }
        // document.addEventListener('mousemove',onDocMouseMove );
        document.addEventListener('mousemove',findMousePosition, false);
        

        // lets add spheres - these will be airs
        let airBubble = new function() {
            this.numberOfObjects = scene.children.length;
            // console.log(scene.children);
            
            this.removeSphere = function() {
                let allChildren = scene.children;
                let lastObject = allChildren[allChildren.length -1];
                if (lastObject instanceof THREE.Mesh) {
                    scene.remove(lastObject);
                    this.numberOfObjects = scene.children.length;   //updating
                }
            }

            this.addSphere = function () {
                let textureLoader = new THREE.TextureLoader()
                let bubble_size = Math.ceil(Math.random() * 20);
                let bubble_sphere = new THREE.SphereGeometry(bubble_size, 32, 32);
                let bubble_material = new THREE.MeshStandardMaterial({

                    //one way of texture - metalic and changing shape/form
                    map: textureLoader.load('./svgandjpg/jpg/texture3_sm.jpg'),
                    displacementMap: textureLoader.load('../assets/textures/w_d.png'),
                    metalness: 0.02,
                    roughness:1,
                    color: 0xffffff, 
                    transparent:true, // 
                    opacity:0.2

                    // //second way of texturing
                    // alphaMap: textureLoader.load('../assets/textures/alpha/partial-transparency.png'),
                    // // envMap: alternativeMap, //dont need this apparently
                    // metalness: 0.02,
                    // roughness:0.07,
                    // color: 0xffffff,
                    // alphaTest: 1
                })
                // bubble_material.alphaMap.wrapS = THREE.RepeatWrapping;
                // bubble_material.alphaMap.wrapT = THREE.RepeatWrapping;
                // bubble_material.alphaMap.repeat.set(8,8);

                let numberofbubbles = 100;
                for(let i = 0; i < numberofbubbles; i++){

                let bubble = new Physijs.SphereMesh(bubble_sphere, Physijs.createMaterial(
                  bubble_material
                ));
                
                bubble.castShadow = true;
                // bubble.name = "bubble-" + scene.children.length;

                bubble.position.x = - 1500 + Math.round(Math.random() * 3000);
                bubble.position.y = - 500 + Math.round(Math.random() * 3000);
                bubble.position.z = - 1500 + Math.round(Math.random() * 3000);

                scene.add(bubble);
                this.numberOfObjects = scene.children.length;
                }
            }

            this.outputObjects = function() {
                // console.log(scene.children);
            }
        }

        airBubble.addSphere();  

        function onDocMouseMove(event) {
            mouseX = ( event.clientX - windowHalfX ) * 10;
            mouseY = ( event.clientY - windowHalfY ) * 10;
        }

        // create a camera
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
        camera.position.set(0, 600, 500);   //back on z axis - up to y
        
        camera.lookAt(new THREE.Vector3(0, 100, 0));  // scene default is 0,0,0
        // camera.rotation.y = Math.cos(Math.PI);
        // camera.lookAt(scene.position);
        camera.updateMatrix();      //honestly idk why tho
        scene.add(camera);

        function createAudio(){
            let audioListener = new THREE.AudioListener();
            camera.add(audioListener);    
            var positionSound1 = new THREE.PositionalAudio( audioListener );
            var audioLoader = new THREE.AudioLoader();
            audioLoader.load('./cow.ogg', function(buffer) {
                positionSound1.setBuffer( buffer );
                positionSound1.setRefDistance( 100 );
                positionSound1.play();
                positionSound1.setRolloffFactor(5);
                positionSound1.setLoop(true);
            });
    
            ground_area.add(positionSound1);
        }
        createAudio();
        


        var spotLight = new THREE.SpotLight(0xFFFFFF);
        spotLight.position.set(0, 1000, 0);
        spotLight.castShadow = true;
        spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
        spotLight.shadow.camera.far = 130;
        spotLight.shadow.camera.near = 40;
        scene.add(spotLight);

        var spotLight2 = new THREE.SpotLight(0xFFFFFF);
        spotLight2.position.set(500, 500, 500);
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
         
         
        //  console.log(scene.children[0].type == cubeCamera);
      

        // controls.redraw();
        render();
        

        
      
        function render() {
            
            window.addEventListener('click',airBubble.addSphere);

            // recursive requestAnimationFrame
            trackballControls.update(clock.getDelta()); //works now with inittrackballcontrols

            stats.update();
            // cube.visible = false;
            // cubeCamera.updateCubeMap(renderer, scene);  //honestly it works without this //check 
            // cube.visible = true;

            // cube2.visible = false;
            // cubeCamera.updateCubeMap(renderer, scene);  //honestly it works without this //check 
            // cube2.visible = true;


            // demo.material.map.needsUpdate = true;

            raycaster.setFromCamera( mouse, camera );       //raycaster
            let angle = 0.1;

            // cube2.visible = false;
            // cubeCamera2.updateCubeMap(renderer, scene);
            // cube2.visible = true;
            // camera_pivot.rotateOnAxis( Y_AXIS, 0.01 );   
            camera.position.y = camera.position.y * Math.cos(angle) +2;
            while(camera.position.y < 400){

                setTimeout(() => {
                    camera.position.y += camera.position.y * 0.01;
                },7000);
                // camera.position.y -=  Math.cos(angle);   //this is good too
                // camera.position.z = 500 *  Math.sin(angle);
                angle += 0.0009;

                break;
            }
            counter += 0.07;
            // let counter2;
            // counter2 += 0.03;

            // document.addEventListener('mouseover', ()=>{ 
                scene.traverse(function(obj){
                    if(obj instanceof THREE.Mesh && obj.name != 'ground' && obj.name != 'border_left' && obj.name != 'border_right' && obj.name != 'border_back' && obj.name != 'border_front' && obj.name != 'wave'){
                        let objarray =[];
                        objarray.push(obj);
                        let intersections = raycaster.intersectObjects(objarray);
                             
                        let intersection = (intersections.length) > 0 ? intersections[0] : null;
            
                        if(intersections.length > 0) {
                                // for(each of scene.children){
                                    //  if (each.type !== 'CubeCamera' && each.type !== 'SpotLight') {
                                    //      console.log('works true');
                                    //  }
                        
                                    // if(each.name == 'ground'){console.log(each.name)}
                                        // let step;
                                        // step += 0.4;
                                        intersection.object.rotation.x += 0.01;
                                        intersection.object.rotation.y += 0.01;  
                                        // intersection.object.rotation.z += Math.abs(Math.sin(counter/2));    //maybe take it out

                                        intersection.object.position.x = intersection.object.position.x + 5 * Math.cos(counter);
                                        // intersection.object.position.y = 10 * Math.abs(Math.sin(counter));
                                        intersection.object.position.z = intersection.object.position.z + 5 * Math.cos(counter);
                                        intersection.object.__dirtyPosition = true;
                                        intersection.object.__dirtyRotation = true;
                                        
                                //  }
                                
                                // intersection.object.position.y += 10;
                                // intersection.object.material.wireframe = true;
              
                            // this.tl.to(this.mesh.rotation, 0.5, {x: 20, ease: Expo.easeOut});
                        }
            
                    }
                });
    
            // },false);
           
            
           

            


            requestAnimationFrame(render);
            renderer.render(scene, camera);
            // cube.rotation.y += 0.01;
            // cube2.rotation.y -= 0.01;       //maybe not
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

         // create directionallight
        let directionalLight = new THREE.DirectionalLight(0xffffff, 1); // color, intensity   //similar to sun
        directionalLight.position.set(1, 1, 1); // location x, y, z
        scene.add(directionalLight);

        // // add subtle ambient lighting
        var ambientLight = new THREE.AmbientLight(0x3c3c3c);
        scene.add(ambientLight);

        // //shows where the spotLight is coming
        // let debugCamera = new THREE.CameraHelper(spotLight.shadow.camera);
        // // scene.add(debugCamera);

        //page 96
        

        // //linear fog // nothing is happening
        // scene.fog = new THREE.Fog(0xffffff, 1, 1000);

    }   //end of function init

    
    
