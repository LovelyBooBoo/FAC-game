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
import { AnimationMixer } from 'three';

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

// load in the grid

let displayedGrid = null;
let displayedUnit = null;
let floor = null;

loader.load( `/Assets/placeholder_models/temporary grid.glb`, function ( gltf ) {
  displayedGrid = gltf.scene;
  scene.add(displayedGrid);

}, undefined, function ( error ) {

  console.error( error );

} );

loader.load( `/Assets/placeholder_models/floor.glb`, function ( gltf ) {
  floor = gltf.scene;
  scene.add(floor);

}, undefined, function ( error ) {

  console.error( error );

} );







// add an axes helper to keep the axes straight!

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

// fps counter

let lastTime = performance.now();
let frames = 0;
let fps = 0;

// Create FPS display
const fpsDisplay = document.createElement('div');
fpsDisplay.style.position = 'fixed';
fpsDisplay.style.top = '10px';
fpsDisplay.style.left = '10px';
fpsDisplay.style.background = 'rgba(0,0,0,0.7)';
fpsDisplay.style.color = 'white';
fpsDisplay.style.fontFamily = 'monospace';
fpsDisplay.style.padding = '4px 8px';
fpsDisplay.style.zIndex = 1000;
fpsDisplay.textContent = 'FPS: 0';
document.body.appendChild(fpsDisplay);


// set the game clock

const clock = new THREE.Clock();

// set animation loop

function animate() {
  

frames++;
  const now = performance.now();
  if (now - lastTime >= 1000) {
    fps = frames;
    frames = 0;
    lastTime = now;
    fpsDisplay.textContent = `FPS: ${fps}`;
  }

  // get the delta from the game clock (so this is running to a set speed not animation refresh rate)
  const delta = clock.getDelta();

  for (let unit of activeUnits) {
  if (unit.mixer) {
    unit.mixer.update(delta);
  }
}
  
  movementAttackController();

  renderer.render(scene, camera);
  controls.update();
  

}

renderer.setAnimationLoop( animate );


// create an array that stores all unit objects currently active in the round

let activeUnits = [];

// function that creates units based on specfications

const unitFactory = function (unitName, playerAlignment, x, z) {
  if (unitName === "ratChaff") {
  
  return {
  _name: `${unitName}`,
    get name() {
  return this._name;
  },
  playerAlignment: playerAlignment,
  health: 20,
  damage: 10 ,
  damage_interval: 1,
  armour: 0,
  range: 4,
  speed: 0.012,
  turningSpeed: 1,
  fieldOfView: 45,
  _size: 0.5,
  get size() {return this._size;},
  airborne: "no",
  canAttack: "both",
  _status: "alive",
  set status(val) {
    this._status = val;
  },
  get status() {return this._status;},
  _target: null,
   set target(val) {
    this._target = val;
  },
  get target() {
  return this._target;
  },
   _lastTarget: null,
   set lastTarget(val) {
    this._lastTarget = val;
  },
  get lastTarget() {
  return this._lastTarget;
  },
  positionStart: new THREE.Vector3(x, 0, z),
  position: new THREE.Vector3(x, 0, z),
  mesh: null,
  nearestEnemy: [0, 0],
  attackAction () {
  if (this.target && this.target.health > 0) {
    this.target.health = this.target.health-(this.damage-this.target.armour);
    
    if (this.target.health <= 0) {
      this.target.death();
      this.target = null;
      if (this._attackInterval) {
      clearInterval(this._attackInterval); // Stop attacking after death
      }
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
  
  if (this.status === "dead" || this._attackInterval) return; // Don't start another interval
  this.attackAction();
  this._attackInterval = setInterval(() => this.attackAction(), this.damage_interval * 1000);
},
}
} else if (unitName === "ratTank") {

  return {
  _name: `${unitName}`,
    get name() {
  return this._name;
  },
  playerAlignment: playerAlignment,
  health: 200,
  damage: 30,
  damage_interval: 2,
  armour: 2,
  range: 6,
  speed: 0.01,
  turningSpeed: 0.5,
  fieldOfView: 30,
  _size: 1.0,
   get size() {return this._size;},
  _target: null,
  airborne: "no",
  canAttack: "ground",
  _status: "alive",
  set status(val) {
    this._status = val;
  },
  get status() {return this._status;},
  _target: null,
   set target(val) {
    this._target = val;
  },
  get target() {
  return this._target;
  },
   _lastTarget: null,
   set lastTarget(val) {
    this._lastTarget = val;
  },
  get lastTarget() {
  return this._lastTarget;
  },
  positionStart: new THREE.Vector3(x, 0, z),
  position: new THREE.Vector3(x, 0, z),
  mesh: null,
  nearestEnemy: [0, 0],
  animationActionStash: {
    attack: null,
    movement: null,
    death: null
  },
  playAnimation (animation) {
      this.animationActionStash.attack.reset();

      if (animation === 'death') {
        this.animationActionStash.attack.stop();
        this.animationActionStash.movement.stop();
      this.animationActionStash.death.setLoop(THREE.LoopOnce, 1); 
      this.animationActionStash.death.clampWhenFinished = true;
      this.animationActionStash.death.play();
    } else if (animation === 'attack') {
        
      if (this.animationActionStash.movement.isRunning()) {
        this.animationActionStash.movement.stop();
        this.animationActionStash.movement.reset();
    }
      this.animationActionStash.attack.setLoop(THREE.LoopOnce, 1); 
      this.animationActionStash.attack.clampWhenFinished = true;
      this.animationActionStash.attack.play();      
    } else if (animation === 'movement' && !this.animationActionStash.movement.isRunning() && !this.animationActionStash.attack.isRunning()) {
      this.animationActionStash.movement.setLoop(THREE.LoopRepeat, Infinity); 
      this.animationActionStash.movement.play();   
    } if (animation === 'movement' && this.animationActionStash.movement.isRunning()) {
      
    }
},

  attackAction () {
  if (this.target && this.target.health > 0) {
    
    this.target.health = this.target.health-(this.damage-this.target.armour);
    
    if (!this.animationActionStash.attack.isRunning()) {
    this.playAnimation('attack');
    }

    if (this.target.health <= 0) {
      this.target.death();
      this.target = null;
      if (this._attackInterval) {
      clearInterval(this._attackInterval); // Stop attacking after death
      } 
    }
  }
},
death () {
  this.status = "dead";
  if (this.mesh && this.mesh.children[0] && this.mesh.children[0].material) {
    this.mesh.children[0].material.color.setHex(0x252627);
  }
  this.playAnimation('death');
},
attack () {
  if (this.status === "dead" || this._attackInterval) return;  
  this.attackAction();
  this._attackInterval = setInterval(() => this.attackAction(), this.damage_interval * 1000);
},
}
} else if (unitName === "ratBat") {
  
  return {
  _name: `${unitName}`,
    get name() {
  return this._name;
  },
  playerAlignment: playerAlignment,
  health: 30,
  damage: 10 ,
  damage_interval: 1.2,
  armour: 0,
  range: 2.5,
  speed: 0.03,
  turningSpeed: 2,
  fieldOfView: 45,
  _size: 0.5,
  get size() {return this._size;},
  airborne: "yes",
  canAttack: "both",
  _status: "alive",
  set status(val) {
    this._status = val;
  },
  get status() {return this._status;},
  _target: null,
   set target(val) {
    this._target = val;
  },
  get target() {
  return this._target;
  },
   _lastTarget: null,
   set lastTarget(val) {
    this._lastTarget = val;
  },
  get lastTarget() {
  return this._lastTarget;
  },
  positionStart: new THREE.Vector3(x, 0, z),
  position: new THREE.Vector3(x, 0, z),
  mesh: null,
  nearestEnemy: [0, 0],
  attackAction () {
  if (this.target && this.target.health > 0) {
    this.target.health = this.target.health-(this.damage-this.target.armour);
    
    if (this.target.health <= 0) {
      this.target.death();
      this.target = null;
      if (this._attackInterval) {
      clearInterval(this._attackInterval); // Stop attacking after death
      }
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
  if (this.status === "dead" || this._attackInterval) return;  // Don't start another interval
  this.attackAction();
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
    if (Math.random() <0.025) {
      placementBoard[i][j] = "bat";
    }
}
}

let playerUnitCount = 0;
let EnemyUnitCount = 0;

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
      if (playerAlignment === "opponent") { 
        EnemyUnitCount++;}
      else {playerUnitCount++;}
      break;
    case "tank":
      addUnit("ratTank", playerAlignment, (j+1), i*-1);
      if (playerAlignment === "opponent") { 
        EnemyUnitCount++;}
      else {playerUnitCount++;}
      break;
    case "bat":
      addUnit("ratBat", playerAlignment, (j+1), i*-1);
      if (playerAlignment === "opponent") { 
        EnemyUnitCount++;}
      else {playerUnitCount++;}
      break;
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

      if (gltf.animations && gltf.animations.length > 0) {
    newUnit.mixer = new THREE.AnimationMixer(gltf.scene);
    newUnit.animations = gltf.animations;
    const addAnimations = ['movement', 'attack', 'death'];
         for (const animationClipName of addAnimations) {
        const newAnimationClip = THREE.AnimationClip.findByName(newUnit.animations, `${animationClipName}`);
        const newAction = newUnit.mixer.clipAction(newAnimationClip);
        newUnit.animationActionStash[animationClipName] = newAction;
         }
        }

      if (newUnit.mesh.position.z > -20) {
        switch (unit) {
        case "ratChaff":
          newUnit.mesh.children[0].rotation.set(0,3.14159,0);
          newUnit.mesh.children[0].material.color.setHex(0xE767C7);
          break;
        case "ratBat":
          newUnit.mesh.children[0].rotation.set(0,3.14159,0);
          newUnit.mesh.children[0].material.color.setHex(0xE767C7);
          break;
        case "ratTank":
          newUnit.mesh.children[0].rotation.set(0,0,0);
        }
      }
      scene.add(newUnit.mesh);

}, undefined, function ( error ) {

  console.error( error );

} );
}

// function that controls unit movement and attacks

unitInitialiser();






function findNearestEnemyAndAlly(unit, unitsArray) {
  let nearestEnemy = null;
  let nearestAlly = null;
  let minimumDistanceEnemy = Infinity;
  let minimumDistanceAlly = Infinity;

  for (let otherUnit of unitsArray) {
    if (otherUnit === unit || otherUnit.status === "dead") continue;

    const dist = unit.position.distanceTo(otherUnit.position);

    if (otherUnit.playerAlignment !== unit.playerAlignment && unit.canAttack === "both") {
      if (dist < minimumDistanceEnemy) {
        minimumDistanceEnemy = dist;
        nearestEnemy = otherUnit;
      }
    } else if (otherUnit.playerAlignment !== unit.playerAlignment && unit.canAttack === "ground" && otherUnit.airborne === "no" || otherUnit.playerAlignment !== unit.playerAlignment && unit.canAttack === "both" && otherUnit.airborne === "no") {
      if (dist < minimumDistanceEnemy) {
        minimumDistanceEnemy = dist;
        nearestEnemy = otherUnit;
      }
     } else if (otherUnit.playerAlignment !== unit.playerAlignment && unit.canAttack === "ground" && otherUnit.airborne === "yes") {
       continue; 
     }
     else {
      if (dist < minimumDistanceAlly) {
        minimumDistanceAlly = dist;
        nearestAlly = otherUnit;
      }
    }
  }

  return [nearestEnemy, nearestAlly];
}


function movementAttackController () {
    for (let unit of activeUnits) {

      // if the unit isn't dead, proceed to move / attack
      if (unit.status === "alive") {
        
        // retrieve nearest enemy and ally assign nearest enemy to unit's property
        
        if(unit.target) {
          if(unit.target.status === "dead" && unit._attackInterval) {
            clearInterval(unit._attackInterval);
          }
        }

        const nearestEnemyAndAlly = findNearestEnemyAndAlly(unit, activeUnits);
        if (unit.target != nearestEnemyAndAlly[0]) {
          unit.lastTarget = unit.target;
          unit.target = nearestEnemyAndAlly[0];
        }
        
        // if there are no units to attack, unit should not move or attack

        if (!nearestEnemyAndAlly[0]) continue;
        
        // define constants direction and distance, direction being a vector from unit to its target

            const enemyDirection = new THREE.Vector3().subVectors(unit.target.position, unit.position);
            const distance = enemyDirection.length();
          // ...rest of your movement/attack logic...
        
        // if the unit hasn't got a target or its current target is dead then assign nearest enemy to the unit's target property
        if(!unit.target || unit.target.status === "dead") {        
            const nearestEnemy = nearestEnemyAndAlly[0]   
                unit.target = nearestEnemy;    
        }
/*if (unit.name === "ratTank") {
  // log here

        console.log(
  `[${unit.name}] status: ${unit.status}, ` +
  `target: ${unit.target ? unit.target.name : 'none'} (${unit.target ? unit.target.status : 'n/a'}), ` +
  `distance: ${distance.toFixed(2)}, ` +
  `attackInterval: ${!!unit._attackInterval}`
);
}
*/
// Calculate desired angle to target (radians)
const angle = Math.atan2(enemyDirection.x, enemyDirection.z) + (unit.playerAlignment === "player" ? Math.PI : 0);

// Get current facing angle (radians), wrapped to [-PI, PI]
let currentAngle = ((unit.mesh.rotation.y + Math.PI) % (2 * Math.PI)) - Math.PI;

// Calculate shortest signed angle difference (-PI to PI)
let angleDifference = ((angle - currentAngle + Math.PI) % (2 * Math.PI)) - Math.PI;

// If not facing target, turn toward it
if (Math.abs(angleDifference) > THREE.MathUtils.degToRad(1)) { // 1 degree threshold for snapping
    // Turn by up to 1 degree per frame (converted to radians)
    let turnStep = Math.sign(angleDifference) * Math.min(Math.abs(angleDifference), THREE.MathUtils.degToRad(unit.turningSpeed));
    unit.mesh.rotation.y += turnStep;
    // Wrap rotation after update
    unit.mesh.rotation.y = ((unit.mesh.rotation.y + Math.PI) % (2 * Math.PI)) - Math.PI;
} else {
    // Snap to target angle, wrapped
    unit.mesh.rotation.y = ((angle + Math.PI) % (2 * Math.PI)) - Math.PI;
}


          
              // if the unit is too near to another unit, move further away to prevent stacking and bunching
              
              const nearestAlly = nearestEnemyAndAlly[1];
              // check that nearestAlly isn't null, for instance if there is only one unit left
              if (nearestAlly){
              const allyDirection = new THREE.Vector3().subVectors(unit.position, nearestAlly.position);
              const allyDistance = allyDirection.length();

              // only move if the distance between nearest allies is less than both unit's size and unit is in transit

              if (allyDistance <= unit.size + unit.target.size && distance > unit.range) {
                allyDirection.normalize();
                    unit.position.addScaledVector(allyDirection, unit.speed);
                    unit.mesh.position.copy(unit.position);
              }
            }

            // if the distance between unit and target is greater than the unit's range, then move position closer to target
            
            if (distance > unit.range) {
                

                    enemyDirection.normalize();
                    unit.position.addScaledVector(enemyDirection, (0.02));
                    unit.mesh.position.copy(unit.position);
                    if (unit.name === 'ratTank' && !unit.animationActionStash.attack.isRunning()) {
                      unit.playAnimation('movement');
                    }   
            }   
            
            
             // If the target has changed, clear the interval
          if (unit.lastTarget !== nearestEnemyAndAlly[0]) {
             if (unit._attackInterval) {
              clearInterval(unit._attackInterval);
              unit._attackInterval = null;
            }
          unit.lastTarget = nearestEnemyAndAlly[0];
          }

          // If in range and facing, start attack interval if not running
          if (distance <= unit.range && Math.abs(angleDifference) < unit.fieldOfView) {
              if (!unit._attackInterval) {
              unit.attack();
              /*(`Calling attack() for ${unit.name} (${unit.playerAlignment}) on target ${unit.target?.name} (${unit.target?.playerAlignment})`);
              */}
          }
          const found = activeUnits.find((element) => element.name === "ratTank");
          //console.log(found);
        }
    }
}
