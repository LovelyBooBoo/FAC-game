/* 
Concept - office Wars: an autobattler using very simple office objects as the combatants

Low tier units (chaff) - Mice (melee), Paperclips (melee), pushpin 
Mid tier units - Stapler (ranged), Bulldog catapults (ranged using elastic band), 
High tier units - water dispenser (ranged flamethrower), shredder (melee), PC (GOD TIER)


units are availble from the "in tray"
you can sell them in the bin
*/


import * as THREE from 'three';
import { Loader } from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DragControls } from 'three/addons/controls/DragControls.js';
import { MapControls } from 'three/addons/controls/MapControls.js';
import { degToRad } from 'three/src/math/MathUtils.js';

// instantiate the scene

const scene = new THREE.Scene();

// instantiate the Loader

const loader = new GLTFLoader();

// add lights to the scene

const color = 0xFFFFFF;
const intensity = 6;
const light2 = new THREE.DirectionalLight(color, intensity);
light2.position.set(0, 10, 0);
light2.target.position.set(-5, 0, 0);
scene.add(light2);
scene.add(light2.target);

const light = new THREE.AmbientLight(0x404040, 4);
scene.add( light );

const spotLight = new THREE.SpotLight(0xffffff, 3, 100, 0.2, 0.5);
spotLight.position.set(0,25,0);
scene.add(spotLight);

// add camera

const canvas = document.querySelector('canvas.threejs')

const camera = new THREE.PerspectiveCamera(30, (window.outerWidth) / (window.outerHeight), 0.1, 150)
camera.position.set(30, 80, 20);



scene.add(camera)

// instantiate camera controls

const controls = new MapControls( camera, canvas );
controls.enableDamping = true;
controls.target.set(30, 0, -15);    // your desired look-at point
controls.update(); 

// instantiate the renderer with alpha for transparency

const renderer = new THREE.WebGLRenderer(
  {canvas: canvas,
  alpha: true}
);



renderer.setClearColor(0xffffff, 0);

renderer.setSize(window.outerWidth, window.outerHeight);

// resize window when it's resized

window.addEventListener('resize', () =>{
  camera.updateProjectionMatrix()
  renderer.setSize(window.outerWidth, window.outerHeight);
})

// add a test unit

const ratChaff = {
  name: "ratChaff",
  playerAlignment: null,
  health: 20,
  damage: 4,
  damage_interval: 1,
  range: 4,
  status: "alive",
  set status(status) {
    this.status = status;
  },
  target: null,
  position: new THREE.Vector3(30, 0, 0),
  target_Position: new THREE.Vector3(30, 0, -100),
  mesh: null
}

// load in the grid

let displayedGrid = null;
let displayedUnit = null;

loader.load( `/Assets/placeholder_models/temporary grid.glb`, function ( gltf ) {
  displayedGrid = gltf.scene;
  scene.add(displayedGrid);

}, undefined, function ( error ) {

  console.error( error );

} );

loader.load( `/Assets/placeholder_models/ratChaff.glb`, function ( gltf ) {
  ratChaff.mesh = gltf.scene;
  ratChaff.mesh.position.copy(ratChaff.position);
  scene.add(ratChaff.mesh);

}, undefined, function ( error ) {

  console.error( error );

} );

// add an axes helper to keep the axes straight!

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

// set animation loop

function animate() {
  
  movementAttackController();
  // reassess targets

  // set new targets

  // set attacks

  // check if all one side is destroyed

  renderer.render(scene, camera);
  controls.update();
  
  
}

renderer.setAnimationLoop( animate );


// create an array that stores all unit objects currently active in the round

let activeUnits = [];

// function that creates units based on specfications

const unitFactory = function (unitName, playerAlignment, x, z) {
  if (unitName = "ratChaff") {
  
  return {
  name: `${unitName}`,
  playerAlignment: playerAlignment,
  health: 20,
  damage: 3,
  damage_interval: 1,
  armour: 0,
  range: 4,
  speed: 0.005,
  fieldOfView: 45,
  _status: "alive",
  set status(val) {
    this._status = val;
  },
  get status() {return this._status;},
  target: null,
  positionStart: new THREE.Vector3(x, 0, z),
  position: new THREE.Vector3(x, 0, z),
  target: null,
  target_Position: new THREE.Vector3(0, 0, 0),
  mesh: null,
  nearestEnemy: [0, 0],
  attackAction () {
  if (this.target && this.target.health > 0) {
    this.target.health = this.target.health-(this.damage-this.target.armour);
    if (this.target.health <= 0) {
      this.target.death();
      clearInterval(this._attackInterval); // Stop attacking after death
    }
  }
},
death () {
  this.status = "dead";
  if (this.mesh && this.mesh.children[0] && this.mesh.children[0].material) {
    this.mesh.children[0].material.color.setHex(0x252627);
  }
},
attack () {
  if (this._attackInterval || this.status === "dead") return; // Don't start another interval
  this._attackInterval = setInterval(() => this.attackAction(), this.damage_interval * 1000);
},
}
} else if (unitName = "ratTank") {

  return {
  name: `${unitName}`,
  playerAlignment: playerAlignment,
  health: 200,
  damage: 4,
  damage_interval: 2,
  armour: 2,
  range: 6,
  speed: 0.003,
  fieldOfView: 30,
  _status: "alive",
  set status(val) {
    this._status = val;
  },
  get status() {return this._status;},
  target: null,
  positionStart: new THREE.Vector3(x, 0, z),
  position: new THREE.Vector3(x, 0, z),
  target: null,
  target_Position: new THREE.Vector3(0, 0, 0),
  mesh: null,
  nearestEnemy: [0, 0],
  attackAction () {
  if (this.target && this.target.health > 0) {
    this.target.health = this.target.health-(this.damage-this.target.armour);
    if (this.target.health <= 0) {
      this.target.death();
      clearInterval(this._attackInterval); // Stop attacking after death
    }
  }
},
death () {
  this.status = "dead";
  if (this.mesh && this.mesh.children[0] && this.mesh.children[0].material) {
    this.mesh.children[0].material.color.setHex(0x252627);
  }
},
attack () {
  if (this._attackInterval || this.status === "dead") return; // Don't start another interval
  this._attackInterval = setInterval(() => this.attackAction(), this.damage_interval * 1000);
},
}
}
}


// instantiate a 2D matrix which forms the basis for the placement board

const boardWidth = 60;
const boardDepth = 40;

let placementBoard =  [];

for (let i = 0; i < boardDepth; i++) {
  placementBoard.push([]);
  for (let j = 0; j < boardWidth; j++)  {
    placementBoard[i].push("empty");
  }
}

// add some test chaff

for (let i = 0; i < boardDepth; i++) {
  for (let j = 0; j < boardWidth; j++)  {
    
    if (Math.random() > 0.95) {
      placementBoard[i][j] = "chaff";
  }
    if (Math.random() <0.01) {
      placementBoard[i][j] = "tank";
    }
}
}

console.log(placementBoard);

// function that goes through each row of the placement array and invokes addUnit to place relevant units there

const unitInitialiser = function () {

let playerAlignment;

placementBoard.forEach((row, i) => {
  row.forEach((cell, j) => {

    if (i > 20) {
      playerAlignment = "opponent";
    } else {
      playerAlignment = "player";
    }

   switch(cell) {
    case "empty":
      break;
    case "chaff":
      addUnit("ratChaff", playerAlignment, (j+1), i*-1);
      break;
    case "tank":
      addUnit("ratTank", playerAlignment, (j+1), i*-1);
   }
  });
});
};

// function that adds units to the array storing units for this round

const addUnit = function(unit, playerAlignment, x, z) {

  loader.load( `/Assets/placeholder_models/${unit}.glb`, function ( gltf ) {
    activeUnits.push(unitFactory(unit, playerAlignment, x, z));
    const newUnit = activeUnits[activeUnits.length - 1];
      newUnit.mesh = gltf.scene;
      newUnit.mesh.position.copy(newUnit.position);
      if (newUnit.mesh.position.z > -20) {
        newUnit.mesh.rotation.set(0,3.14159,0);
        newUnit.mesh.children[0].material.color.setHex(0xE767C7);
      }
      scene.add(newUnit.mesh);

}, undefined, function ( error ) {

  console.error( error );

} );
}

// function that controls unit movement and attacks

unitInitialiser();

const unitController = function () {

}

function findNearestEnemy(unit, unitsArray) {
 let nearestEnemy = null;
 let minimumDistance = Infinity;
 for (let otherUnit of unitsArray) {
  if(otherUnit === unit || otherUnit.playerAlignment === unit.playerAlignment || otherUnit.status === "dead") continue;
  const distance = unit.position.distanceTo(otherUnit.position);
  if (distance < minimumDistance) {
    minimumDistance = distance;
    nearestEnemy = otherUnit;
  }
 }
 return nearestEnemy;
}

console.log(ratChaff);

function movementAttackController () {
    for (let unit of activeUnits) {
      if (unit.status === "alive") {

        if(!unit.target || unit.target.status === "dead") {
        const nearestEnemy = findNearestEnemy(unit, activeUnits);
        if (nearestEnemy) {
          unit.target = nearestEnemy;
          unit.target_Position = nearestEnemy.position;
        }
      }
      if (unit.target) {
          const direction = new THREE.Vector3().subVectors(unit.target_Position, unit.position);
          const distance = direction.length();

          if (distance > unit.range) {
          const angle = Math.atan2(direction.x, direction.z);
  let currentAngle = unit.mesh.rotation.y;
  let angleDifference = angle - currentAngle;

  // Wrap angleDifference to [-PI, PI] for shortest rotation
  angleDifference = ((angleDifference + Math.PI) % (2 * Math.PI)) - Math.PI;

  if (Math.abs(angleDifference) > 0.03) {
    unit.mesh.rotation.y += Math.sign(angleDifference) * 0.03;
  } else {
    unit.mesh.rotation.y = angle; // Snap to target angle when close enough

                 
                direction.normalize();
                unit.position.addScaledVector(direction, unit.speed);
                unit.mesh.position.copy(unit.position);
  }
            
          }

          if (distance > unit.range) {
            direction.normalize();
            unit.position.addScaledVector(direction, unit.speed);
            unit.mesh.position.copy(unit.position);
          } else if (distance <= unit.range) {
            unit.attack();
          }
      }
      }
  }
}