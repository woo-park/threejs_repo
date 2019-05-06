// import { isContext } from "vm";

    let camera, scene, renderer, controls, mesh_group;
    
    function init() {
        Physijs.scripts.worker = '../../libs/other/physijs/physijs_worker.js';
        Physijs.scripts.ammo = './ammo.js';

        scene = new Physijs.Scene({reportSize: 10, fixedTimeStep: 1 /60});
        scene.setGravity(new THREE.Vector3(0,-10,0));

        var stats = initStats();

        //creating ground and wall
        function createGroundWall(scene){
            let textureLoader = new THREE.TextureLoader();
            let ground_material_ground = Physijs.createMaterial(   
                new THREE.MeshStandardMaterial(
                    {map: textureLoader.load('svgandjpg/jpg/texture1_sm.jpg'), transparent:false, opacity:1}), 0.9, 0.3
            );
            let ground_material_sides = Physijs.createMaterial(   
                new THREE.MeshStandardMaterial(
                    {map: textureLoader.load('svgandjpg/jpg/texture7_sm.jpg'),
                    transparent:true,
                    opacity:0.4
                    }), 0.9, 0.3
            );
            
            let skybox_height = 2000;
            let skybox_size = 800;
            let platform_zlength = 800;

            let ground = new Physijs.BoxMesh(new THREE.BoxGeometry(skybox_size, 1, platform_zlength), ground_material_ground, 0);
            ground.name = 'ground';
            ground.castShadow = true;
            ground.receiveShadow = true;
            ground.position.y = 0;
                    
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
            // border_back.__dirtyPosition = true; // can't test if this is doing anything  yet
            // border_back.__dirtyRotation = true;
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

        let cubeCamera = new THREE.CubeCamera(0.1, 100, 512);

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
    
            //creating cube that will reflect
            let cubeMaterial = new THREE.MeshStandardMaterial({
                envMap: skyMap,
                color: 0xffffff,
                metalness:1,
                roughness: 0
            });
    
            // create new camera for cube mirror
            
            scene.add(cubeCamera);
            let cube_geom = new THREE.CubeGeometry(100,100,100);

            let mirrors = 280;
            for(let i = 0; i < mirrors; i ++) {
                cube =  new Physijs.BoxMesh(cube_geom, Physijs.createMaterial(
                    cubeMaterial
                ));

                cube.position.x = - 200 + Math.round(Math.random() * 400);
                cube.position.y = 500+ Math.round(Math.random() * 800);
                cube.position.z = - 200 + Math.round(Math.random() * 400);
                cube.rotation.y = Math.cos(Math.random()* Math.PI * 2); 
                cube.__dirtyPosition = true;
                cube.__dirtyRotation = true;
                cube.castShadow = true;       //check for error - add light to see
                cube.receiveShadow = true;    //
                scene.add(cube);
            }
        }
        
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
       

      
        let canvas_texture = new THREE.CanvasTexture(canvas);
        let cube_demo = new THREE.CubeGeometry(100,100,100);
        let cube_demo_mat = new THREE.MeshStandardMaterial({
        map: canvas_texture
        // displacementMap: canvas_texture
        
        // bumbmap: new THREE.Texture(canvas),
        // metalness:0,
        // roughness:1,
        // color:0xffffff,
        // bumpScale:3,
        // map: textureLoader.load('../assets/textures/general/wood-2.jpg')
        })
        let cube2;
        // let canvasMirrors = 100;
        function makemore(boxNumber){
            for(let i = 0; i < boxNumber; i ++) {
                cube2 =  new Physijs.BoxMesh(cube_demo, Physijs.createMaterial(
                    cube_demo_mat
                ));

                cube2.position.x = - 200 + Math.round(Math.random() * 400);
                cube2.position.y = 800+ Math.round(Math.random() * 800);
                cube2.position.z = - 200 + Math.round(Math.random() * 400);
                cube2.rotation.y = Math.cos(Math.random()* Math.PI * 2); 
                cube2.castShadow = true;       //check for error - add light to see
                cube2.receiveShadow = true;    //
                scene.add(cube2);
            }
        }
        makemore(70);

        



        // let demo = new THREE.Mesh(cube_demo, cube_demo_mat);
        //dont know why but its only showing one side
        // demo.position.y = 400;
        // scene.add(demo);



        //point wave

        // let pointclouds;
        // let mouse = new THREE.Vector2();
        // let intersection = null;
        // // let spheres = [];
        // // let spheresIndex = 0;
 
        // let threshold = 0.1;
        // let pointSize = 0.05;
        
        // let rotateY = new THREE.Matrix4().makeRotationY( 0.005 );   //hm

        // function generatePointCloudGeometry(color){

        //     let width = 400;
        //     let length = 400;

        //     let geometry =new THREE.BufferGeometry();
        //     let number_ofpoints = width * length;
            
        //     let positions = new Float32Array(number_ofpoints * 3);
        //     let colors = new Float32Array(number_ofpoints * 3);

        //     let k = 0;

        //     for (let i = 0; i < width; i++){
        //         for (let j = 0; j < length; j++) {
        //             let u = i / width; // so from 1/80 to 80/80
        //             let v = j / length; // so from 1/160 to 160/160
        //             let x = u - 0.5; //why?
        //             let y = (Math.cos( u * Math.PI * 4) + Math.sin( v * Math.PI * 8)) / 20; //okay the cos and sin - ups and downs
        //             let z = v - 0.5; // so always around 1.0

        //             //push to array
        //             positions[3 * k] = x;        // 0 //3 //6 
        //             positions[3 * k + 1] = y;    // 1 //4 //7 
        //             positions[3 * k + 2] = z;    // 2 //5 //8   

        //             let intensity = ( y + 0.1 ) * 5;
        //             colors[3 * k] = color.r * intensity;    //0 , 3, 6, 9, ...
        //             colors[3 * k] = color.g * intensity;    //1, 4, 7, ...
        //             colors[3 * k] = color.b * intensity;    //2, 5, 8 ...

        //             k++;
        //         }
        //     }
        //     // page 253

        //     geometry.addAttribute( 'position', new THREE.BufferAttribute(positions, 3));
        //     geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3));
        //     geometry.computeBoundingBox();

        //     return geometry;
        // }
        // function generatePointcloud(color) {
        //     let geometry = generatePointCloudGeometry(color);
            
        //     let material = new THREE.PointsMaterial({
        //         size:pointSize,
        //         vertexColors: THREE.VertexColors
        //     });

        //     return new THREE.Points(geometry, material);
        // }

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
        

        // // let pcBuffer33 = generatePointcloudIndex(new THREE.Color( 0, 1, 0 ));
        // // pcBuffer33.position.y = 300;
        // // pcBuffer33.scale.set(400,400,400);
        // // scene.add(pcBuffer33);



        // let pcBuffer = generatePointcloud(new THREE.Color( 1, 0, 0 ));
        // pcBuffer.position.y = 300;
        // pcBuffer.scale.set(400,400,400);
        // scene.add(pcBuffer);
        // // let pcBuffer2 = generatePointcloud(new THREE.Color( 30, 50, 29 ));
        // // let pcBuffer3 = generatePointcloud(new THREE.Color( 10, 10, 1 ));
        // // pcBuffer2.position.y = 200;
        // // pcBuffer3.position.y = 100;
        // // pcBuffer2.scale.set(400,400,400);
        // // pcBuffer3.scale.set(400,400,400);
        // // scene.add(pcBuffer2);
        // // scene.add(pcBuffer3);

        let threshold = 0.1;
        let pointSize = 0.05;
        let mouse = new THREE.Vector2();
        // let objects = [];
        let object_clicked = false;
        let raycaster = new THREE.Raycaster();
        raycaster.params.Points.threshold = threshold;

        function findMousePosition(event) {
            event.preventDefault();

            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;        //we'll see why we *2 +1 later
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
            //-0.5578703703703703 -0.22014388489208625 .i.e   
              console.log(scene.children);
        }

        function changeTarget(event){
            event.preventDefault();
            // object_clicked = true;

            scene.traverse(function(obj){
                if(obj instanceof THREE.Mesh && obj.name != 'ground' && obj.name != 'border_left' && obj.name != 'border_right' && obj.name != 'border_back' && obj.name != 'border_front'){
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
                                    // intersection.object.rotation.y += Math.cos(Math.PI * step);
                                    intersection.object.__dirtyPosition = true;
                                    intersection.object.__dirtyRotation = true;
                                    makemore(Math.floor(Math.random()*20));
                            //  }
                            
                            // intersection.object.position.y += 10;
                            // intersection.object.material.wireframe = true;
          
                        // this.tl.to(this.mesh.rotation, 0.5, {x: 20, ease: Expo.easeOut});
                    }
        
                }
            });
        }
        // document.addEventListener('mousemove',onDocMouseMove );
        document.addEventListener('mousemove',findMousePosition, false);
        document.addEventListener('click',changeTarget,false);

        // // lets add spheres - these will be airs
        // let airBubble = new function() {
        //     this.numberOfObjects = scene.children.length;
        //     // console.log(scene.children);
            
        //     this.removeSphere = function() {
        //         let allChildren = scene.children;
        //         let lastObject = allChildren[allChildren.length -1];
        //         if (lastObject instanceof THREE.Mesh) {
        //             scene.remove(lastObject);
        //             this.numberOfObjects = scene.children.length;   //updating
        //         }
        //     }

        //     this.addSphere = function () {
        //         let textureLoader = new THREE.TextureLoader()
        //         let bubble_size = Math.ceil(Math.random() * 3);
        //         let bubble_sphere = new THREE.SphereGeometry(bubble_size, 32, 32);
        //         let bubble_material = new THREE.MeshStandardMaterial({

        //             //one way of texture - metalic and changing shape/form
        //             map: textureLoader.load('../assets/textures/w_c.jpg'),
        //             displacementMap: textureLoader.load('../assets/textures/w_d.png'),
        //             metalness: 0.02,
        //             roughness:0.07,
        //             color: 0xffffff, 
        //             transparent:true, // 
        //             opacity:0.8

        //             // //second way of texturing
        //             // alphaMap: textureLoader.load('../assets/textures/alpha/partial-transparency.png'),
        //             // // envMap: alternativeMap, //dont need this apparently
        //             // metalness: 0.02,
        //             // roughness:0.07,
        //             // color: 0xffffff,
        //             // alphaTest: 1
        //         })
        //         // bubble_material.alphaMap.wrapS = THREE.RepeatWrapping;
        //         // bubble_material.alphaMap.wrapT = THREE.RepeatWrapping;
        //         // bubble_material.alphaMap.repeat.set(8,8);

        //         let bubble = new Physijs.SphereMesh(bubble_sphere, Physijs.createMaterial(
        //           bubble_material
        //         ));

        //         bubble.castShadow = true;
        //         bubble.name = "bubble-" + scene.children.length;

        //         bubble.position.x = - 200 + Math.round(Math.random() * 400);
        //         bubble.position.y = 100;
        //         bubble.position.z = - 200 + Math.round(Math.random() * 400);

        //         scene.add(bubble);
        //         this.numberOfObjects = scene.children.length;
        //     }

        //     this.outputObjects = function() {
        //         // console.log(scene.children);
        //     }
        // }

        // airBubble.addSphere();  

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
      
        function openContainer(){
            scene.traverse(function(obj){
                obj.__dirtyRotation = true;
                if(obj.name == 'border_left' ){
                    obj.translateY(-1000);
                    obj.translateX(-1000);
                    obj.rotation.z = -Math.PI / 2;
                    // obj.rotation.z -= 0.2;

                }
                if(obj.name == 'border_right' ){
                    obj.translateY(-1000);
                    obj.translateX(1000);
                    obj.rotation.z = -Math.PI / 2;
                }
                if(obj.name == 'border_back' ){
                    obj.translateY(-1000);
                    obj.translateZ(-1000);
                    obj.rotation.x = -Math.PI / 2;
                }
                if(obj.name == 'border_front' ){
                    obj.translateY(-1000);
                    obj.translateZ(1000);
                    obj.rotation.x = -Math.PI / 2;
                }
                obj.__dirtyRotation = true;
                obj.__dirtyPosition = true;

            });


        }
      


        setTimeout(() => {
            openContainer();
        }, 20000);
       


        // controls.redraw();
        render();
        
        
         
        function render() {
            stats.update();
            // window.addEventListener('click',airBubble.addSphere);

            // recursive requestAnimationFrame
            trackballControls.update(clock.getDelta()); //works now with inittrackballcontrols

            
            cube.visible = false;
            cubeCamera.updateCubeMap(renderer, scene);  //honestly it works without this //check 
            cube.visible = true;

            cube2.visible = false;
            cubeCamera.updateCubeMap(renderer, scene);  //honestly it works without this //check 
            cube2.visible = true;


            // demo.material.map.needsUpdate = true;

            raycaster.setFromCamera( mouse, camera );       //raycaster
            let angle = 0.1;

            // cube2.visible = false;
            // cubeCamera2.updateCubeMap(renderer, scene);
            // cube2.visible = true;
            // camera_pivot.rotateOnAxis( Y_AXIS, 0.01 );   
            camera.position.y = camera.position.y * Math.cos(angle) +2;
            while(camera.position.y < 600){

                setTimeout(() => {
                    camera.position.y += camera.position.y * 0.01;
                },7000);
                // camera.position.y -=  Math.cos(angle);   //this is good too
                // camera.position.z = 500 *  Math.sin(angle);
                angle += 0.0009;

                break;
            }


            requestAnimationFrame(render);
            renderer.render(scene, camera);
            cube.rotation.y += 0.01;
            cube2.rotation.y -= 0.01;       //maybe not
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

    
    
