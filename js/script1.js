// import { isContext } from "vm";

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
        stone.__dirtyRotation = true;
        stone.position.y = 100;
        scene.add(stone);
        

        let urls = [
            '../assets/textures/cubemap/beach/right.png',
            '../assets/textures/cubemap/beach/left.png',
            '../assets/textures/cubemap/beach/top.png',
            '../assets/textures/cubemap/beach/bottom.png',
            '../assets/textures/cubemap/beach/front.png',
            '../assets/textures/cubemap/beach/back.png'
        ];

        let cubeLoader = new THREE.CubeTextureLoader();
        let textureLoader = new THREE.TextureLoader();
        let cubeMap = cubeLoader.load(urls);
        scene.background = cubeMap;

    
        //creating cube that will reflect
        let cubeMaterial = new THREE.MeshStandardMaterial({
            envMap: cubeMap,
            color: 0xffffff,
            metalness:1,
            roughness: 0
        });


        // let cubeMirror = function () {
        //     let cubeCamera = new THREE.CubeCamera(0.1, 100, 512);
        //     scene.add(cubeCamera);

        //     let cube_geom = new THREE.CubeGeometry(70,70,70);
        //     let cube = new Physijs.SphereMesh(cube_geom, Physijs.createMaterial(
        //         cubeMaterial
        //       ));
        //     cube.position.x = - 200 + Math.round(Math.random() * 400);

        //     return cube;
        // }
        // scene.add(cubeMirror());

        // create new camera
        let cubeCamera = new THREE.CubeCamera(0.1, 100, 512);
        scene.add(cubeCamera);

        //geometry
        let cube_geom = new THREE.CubeGeometry(70,70,70);
        let cube = new Physijs.BoxMesh(cube_geom, Physijs.createMaterial(
            cubeMaterial
          ));
        // let cube = new THREE.Mesh(cube_geom, cubeMaterial);  //this is normal and above is with physics applied
        cube.position.x = - 200 + Math.round(Math.random() * 400);
        cube.position.y = 600;
        cube.position.z = - 200 + Math.round(Math.random() * 400);

        // cube.rotation.y = -1/3*Math.PI;        
        cubeCamera.position.copy(cube.position);
        cubeMaterial.envMap = cubeCamera.renderTarget;
       
        scene.add(cube);

        //second one

        let cubeMaterial2 = new THREE.MeshStandardMaterial({
            envMap: cubeMap,
            color: 0xffffff,
            metalness:1,
            roughness: 0
        });
        // let cubeCamera2 = new THREE.CubeCamera(0.1, 100, 512);
        // scene.add(cubeCamera2);
        let cube_geom2 = new THREE.CubeGeometry(90,90,90);
        let cube2 = new Physijs.BoxMesh(cube_geom2, Physijs.createMaterial(
            cubeMaterial2
          ));
        cube2.position.x = - 200 + Math.round(Math.random() * 400);
        cube2.position.y = 600;
        cube2.position.z = - 200 + Math.round(Math.random() * 400);

        // cubeCamera2.position.copy(cube2.position);
        // cubeMaterial2.envMap = cubeCamera2.renderTarget;
        scene.add(cube2);
        

        
       
        
        // let sphereMaterial = cubeMaterial.clone();      //this is so useful
        


        //figure out the helper function tmr - need to look with render

        function extrudeShape() {
            let svg_string = document.querySelector("#batman-path").getAttribute("d");
            let shape = transformSVGPathExposed(svg_string);
            return shape;
        }
        let options = {
            amount: 10,
            bevelThickness:20,
            bevelSize:1,
            bevelSegments:3,
            bevelEnabled: true,
            curveSegements:12,
            steps:1
        }
        shape = new THREE.ExtrudeGeometry(extrudeShape(), options);
        shape.center();
        
        let svg_material = new THREE.MeshStandardMaterial({
            color: 0xffffff, transparent:true, opacity:0.8
        });
        
        let svg_logo = new Physijs.BoxMesh(shape, Physijs.createMaterial(svg_material),1);
        
        svg_logo.position.z = 0;
        svg_logo.position.y = 400;
        svg_logo.scale.set(0.2,0.2,0.2);
        svg_logo.castShadow = true;
        svg_logo.receiveShadow = true;
        
        scene.add(svg_logo);
        // page 211 
      

        // mesh_group = new Physijs.Mesh();
        // making number of svg logos 
        for (let y = -300; y <= 300; y +=200) {
            for (let x = -300; x <= 300; x +=200) {
                for (let z = -300; z <= 300; z +=200) {
                    let svg_logo2 = new Physijs.BoxMesh(shape, Physijs.createMaterial(svg_material),1);
                    
                    // svg_logo2.center();
                    svg_logo2.scale.set(0.1,0.1,0.1);
                    svg_logo2.position.set(x , y , z );
                    
                    scene.add(svg_logo2);
                 }
             }
        }
        
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
        let cube_demo = new THREE.CubeGeometry(30,30,30);
        let cube_demo_mat = new THREE.MeshStandardMaterial({
            map: canvas_texture
            // bumbmap: new THREE.Texture(canvas),
            // metalness:0,
            // roughness:1,
            // color:0xffffff,
            // bumpScale:3,
            // map: textureLoader.load('../assets/textures/general/wood-2.jpg')
        })

        let demo = new THREE.Mesh(cube_demo, cube_demo_mat);
        //dont know why but its only showing one side
        demo.position.y = 400;
        scene.add(demo);


        
        


        // var geometry = new THREE.BufferGeometry();
        // // create a simple square shape. We duplicate the top left and bottom right
        // // vertices because each vertex needs to appear once per triangle.
        // var vertices = new Float32Array( [
        //     -1.0, -1.0,  1.0,
        //      1.0, -1.0,  1.0,
        //      1.0,  1.0,  1.0,
        
        //      1.0,  1.0,  1.0,
        //     -1.0,  1.0,  1.0,
        //     -1.0, -1.0,  1.0
        // ] );
        
        // // itemSize = 3 because there are 3 values (components) per vertex
        // geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        // var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        // var mesh = new THREE.Mesh( geometry, material );


    let pointclouds;
    let mouse = new THREE.Vector2();
    let intersection = null;
    let spheres = [];
    let spheresIndex = 0;
    //clock

    let threshold = 0.1;
    let pointSize = 0.05;
    
    let rotateY = new THREE.Matrix4().makeRotationY( 0.005 );

    function generatePointCloudGeometry(color){

        let width = 400;
        let length = 400;

        let geometry =new THREE.BufferGeometry();
        let number_ofpoints = width * length;
        
        let positions = new Float32Array(number_ofpoints * 3);
        let colors = new Float32Array(number_ofpoints * 3);

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

                let intensity = ( y + 0.1 ) * 5;
                colors[3 * k] = color.r * intensity;    //0 , 3, 6, 9, ...
                colors[3 * k] = color.g * intensity;    //1, 4, 7, ...
                colors[3 * k] = color.b * intensity;    //2, 5, 8 ...

                k++;
            }
        }

        geometry.addAttribute( 'position', new THREE.BufferAttribute(positions, 3));
        geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3));
        geometry.computeBoundingBox();

        return geometry;
    }
    function generatePointcloud(color) {
        let geometry = generatePointCloudGeometry(color);
        
        let material = new THREE.PointsMaterial({size:pointSize, vertexColors: THREE.VertexColors});

        return new THREE.Points(geometry, material);
    }

    function generatePointcloudIndex(color) {
        let width = 400;        //same as the above function
        let length = 400;
        let geometry = generatePointcloud(color);
        let number_ofpoints = width * length;
        let number_ofindexes = new Uint16Array( number_ofpoints);

        let k = 0;
        //iterate through and lets give indexes
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < length; j++) {
                number_ofindexes[k] = k; // number_ofindexes[0] = 0; [1] = 1; [2] = 2;...
                k++;        
            }
        }

        geometry.setIndex( new THREE.BufferAttribute(number_ofindexes, 1) );
        let material = new THREE.PointsMaterial({size: pointSize, vertexColors: THREE.VertexColors});
        return new THREE.Points(geometry, material);

    }
    

    // let pcBuffer33 = generatePointcloudIndex(new THREE.Color( 0, 1, 0 ));
    // pcBuffer33.position.y = 300;
    // pcBuffer33.scale.set(400,400,400);
    // scene.add(pcBuffer33);



    let pcBuffer = generatePointcloud(new THREE.Color( 1, 0, 0 ));
    pcBuffer.position.y = 300;
    pcBuffer.scale.set(400,400,400);
    scene.add(pcBuffer);
    // let pcBuffer2 = generatePointcloud(new THREE.Color( 30, 50, 29 ));
    // let pcBuffer3 = generatePointcloud(new THREE.Color( 10, 10, 1 ));
    // pcBuffer2.position.y = 200;
    // pcBuffer3.position.y = 100;
    // pcBuffer2.scale.set(400,400,400);
    // pcBuffer3.scale.set(400,400,400);
    // scene.add(pcBuffer2);
    // scene.add(pcBuffer3);


    let objects = [];
    let object_clicked = false;
    let raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = threshold;

    function findMousePosition(event) {
        event.preventDefault();

        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;        //we'll see why we *2 +1 later
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        //-0.5578703703703703 -0.22014388489208625 .i.e   
    }
    
    function changeTarget(event){
        event.preventDefault();
        object_clicked = true;

        let intersections = raycaster.intersectObjects(scene.children);
        intersection = (intersections.length) > 0 ? intersections[0] : null;
        if(intersections.length > 0) {
            toggle = true;
            intersection = intersections[0];
            
            console.log(intersection.object);
            console.log(intersection.object.position);
            
            if(object_clicked){
                intersection.object.material.color.set(0xff0000);
                intersection.object.position.y += 10;
                intersection.object.material.wireframe = true;
            }
                
           

           
            
           

            // this.tl.to(this.mesh.rotation, 0.5, {x: 20, ease: Expo.easeOut});
            intersection.object.__dirtyPosition = true;
            intersection.object.__dirtyRotation = true;
            
            console.log(intersection.object.uuid);
        } else{
            // null
        }
    }
    

    document.addEventListener('mousemove',findMousePosition, false);
    document.addEventListener('click',changeTarget,false);

        // lets add spheres - these will be airs
        let airBubble = new function() {
            this.numberOfObjects = scene.children.length;
            console.log(scene.children);
            
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
                let bubble_size = Math.ceil(Math.random() * 3);
                let bubble_sphere = new THREE.SphereGeometry(bubble_size, 32, 32);
                let bubble_material = new THREE.MeshStandardMaterial({

                    //one way of texture - metalic and changing shape/form
                    map: textureLoader.load('../assets/textures/w_c.jpg'),
                    displacementMap: textureLoader.load('../assets/textures/w_d.png'),
                    metalness: 0.02,
                    roughness:0.07,
                    color: 0xffffff, 
                    transparent:true, // 
                    opacity:0.8

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

                let bubble = new Physijs.SphereMesh(bubble_sphere, Physijs.createMaterial(
                  bubble_material
                ));

                bubble.castShadow = true;
                bubble.name = "bubble-" + scene.children.length;

                bubble.position.x = - 200 + Math.round(Math.random() * 400);
                bubble.position.y = 100;
                bubble.position.z = - 200 + Math.round(Math.random() * 400);

                scene.add(bubble);
                this.numberOfObjects = scene.children.length;
            }

            this.outputObjects = function() {
                console.log(scene.children);
            }
        }

        airBubble.addSphere();  

        // create a camera
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(-90, 50, -500);   //back on z axis - up to y
        camera.lookAt(new THREE.Vector3(0, 0, 0));  // scene default is 0,0,0
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
            window.addEventListener('click',airBubble.addSphere);

            // recursive requestAnimationFrame
            trackballControls.update(clock.getDelta()); //works now with inittrackballcontrols

            cube.visible = false;
            cubeCamera.updateCubeMap(renderer, scene);
            cube.visible = true;

            demo.material.map.needsUpdate = true;

            raycaster.setFromCamera( mouse, camera );       //raycaster


            // cube2.visible = false;
            // cubeCamera2.updateCubeMap(renderer, scene);
            // cube2.visible = true;


            requestAnimationFrame(render);
            renderer.render(scene, camera);
            cube.rotation.y += 0.01;
            cube2.rotation.y -= 0.01;
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
        // 
    }   //end of function init

    
    
