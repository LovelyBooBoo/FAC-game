/* 
Concept - office Wars: an autobattler using very simple office objects as the combatants

Low tier units (chaff) - Mice (melee), Paperclips (melee), pushpin 
Mid tier units - Stapler (ranged), Bulldog catapults (ranged using elastic band), 
High tier units - water dispenser (ranged flamethrower), shredder (melee), PC (GOD TIER)


units are availble from the "in tray"
you can sell them in the bin
*/


import * as THREE from 'three';
//import { Loader } from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MapControls } from 'three/addons/controls/MapControls.js';
import { degToRad } from 'three/src/math/MathUtils.js';
import { AnimationMixer } from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { BleachBypassShader } from 'three/addons/shaders/BleachBypassShader.js';
import { ColorCorrectionShader } from 'three/addons/shaders/ColorCorrectionShader.js';
import { FXAAPass } from 'three/addons/postprocessing/FXAAPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// instantiate the scene

const scene = new THREE.Scene();

// instantiate the Loader

const loader = new GLTFLoader();

let composer;


const unitLightcolor = 0xFFFFFF;
const unitLightIntensity = 9;
const unitLight = new THREE.DirectionalLight(unitLightcolor, unitLightIntensity);
unitLight.position.set(110, 90, -15);
unitLight.target.position.set(0, 0, -20);
unitLight.castShadow = false;

scene.add(unitLight);
scene.add(unitLight.target);




//const helper = new THREE.CameraHelper(unitLight.shadow.camera);


const light = new THREE.AmbientLight(0x404040, 4);
scene.add( light );



// add camera

const canvas = document.querySelector('canvas.threejs')

const camera = new THREE.PerspectiveCamera(30, (window.innerWidth) / (window.innerHeight), 0.1, 150)
camera.position.set(30, 80, 20);



scene.add(camera)

// instantiate camera controls

const controls = new MapControls( camera, canvas );
controls.enableDamping = true;
controls.target.set(30, 0, -15);    // your desired look-at point
controls.saveState();
controls.update(); 


// add a series of planes to the camera that are always relative to its position for then adding shop mesh objects
const newShopUnitLocationMarkers = [];

// function that loads units from gltfs into the shop

// add sound to the camera and load sounds

const listener = new THREE.AudioListener();
camera.add( listener );

let tankFireBuffer = null;
const audioLoader = new THREE.AudioLoader();
audioLoader.load('Assets/sounds/tankFire.wav', function(buffer) {
  tankFireBuffer = buffer;
});



let newShopUnit;
let selectedShopButton = null;
let lastHighlightedGridCell = null;

const loadShopUnits = function() {

  for (let availableUnit of currentShopStock) {
      
  

  }
}

// add sprite materials for firing of weapons

const tankAttackMap1 = new THREE.TextureLoader().load( 'Assets/Textures/sprites/tank-attack/tankattack01.png', () => {
  console.log('Texture loaded!')
} );
const tankAttackMaterial1 = new THREE.SpriteMaterial( { map: tankAttackMap1, transparent: true } );

const tankAttackMap2 = new THREE.TextureLoader().load( 'Assets/Textures/sprites/tank-attack/tankattack02.png', () => {
  console.log('Texture loaded!')
}  );
const tankAttackMaterial2 = new THREE.SpriteMaterial( { map: tankAttackMap2, transparent: true } );

const attackSpriteTest = new THREE.Sprite( tankAttackMaterial2 );
attackSpriteTest.position.set(0,1,0);
scene.add(attackSpriteTest);

// instantiate drag controls and unit shop array

let currentFunds = 0;
const currentShopStock = [{name: "ratChaff", cost: 50}, {name :"ratTank", cost: 150}, {name: "ratBat", cost: 125}];

const unitShop = []
const shopButtons = []

// add funds display to the top right of the screen displaying player's available funds

const fundsDisplay = document.createElement('div');
fundsDisplay.id = 'funds-counter';
fundsDisplay.style.position = 'fixed';
fundsDisplay.style.top = '20px';
fundsDisplay.style.right = '30px';
fundsDisplay.style.background = 'rgba(255, 220, 120, 0.95)';
fundsDisplay.style.color = '#222';
fundsDisplay.style.fontSize = '2rem';
fundsDisplay.style.fontFamily = 'monospace';
fundsDisplay.style.padding = '12px 32px';
fundsDisplay.style.borderRadius = '12px';
fundsDisplay.style.zIndex = '2002';
fundsDisplay.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
fundsDisplay.textContent = `Funds: ${currentFunds}`;
document.body.appendChild(fundsDisplay);

// Function to update funds display
function updateFundsDisplay() {
  fundsDisplay.textContent = `Funds: ${currentFunds}`;
}

// add a clock element at the top of the screen 

const battleTimerDisplay = document.createElement('div');
battleTimerDisplay.id = 'battle-timer';
battleTimerDisplay.style.position = 'fixed';
battleTimerDisplay.style.top = '20px';
battleTimerDisplay.style.left = '50%';
battleTimerDisplay.style.transform = 'translateX(-50%)';
battleTimerDisplay.style.background = 'rgba(80, 120, 255, 0.95)';
battleTimerDisplay.style.color = 'white';
battleTimerDisplay.style.fontSize = '2rem';
battleTimerDisplay.style.fontFamily = 'monospace';
battleTimerDisplay.style.padding = '12px 32px';
battleTimerDisplay.style.borderRadius = '12px';
battleTimerDisplay.style.zIndex = '2002';
battleTimerDisplay.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
battleTimerDisplay.textContent = '';
battleTimerDisplay.style.display = 'none'; // Hidden by default
document.body.appendChild(battleTimerDisplay);


// instantiate the renderer with alpha for transparency

const renderer = new THREE.WebGLRenderer(
  {canvas: canvas,
  alpha: true}
);



renderer.setClearColor(0xffffff, 0);

renderer.setSize(window.innerWidth, window.innerHeight);

/*renderer.autoClear = false;

				const renderModel = new RenderPass( scene, camera );

				const effectBleach = new ShaderPass( BleachBypassShader );
				const effectColor = new ShaderPass( ColorCorrectionShader );
				const outputPass = new OutputPass();
				const effectFXAA = new FXAAPass();

				effectBleach.uniforms[ 'opacity' ].value = 1;

				effectColor.uniforms[ 'powRGB' ].value.set( 1, 1, 1 );
				effectColor.uniforms[ 'mulRGB' ].value.set( 1, 1, 1 );

				const renderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { type: THREE.HalfFloatType, depthTexture: new THREE.DepthTexture() } );

				composer = new EffectComposer( renderer, renderTarget );

				composer.addPass( renderModel );
				composer.addPass( effectBleach );
				composer.addPass( effectColor );
				composer.addPass( outputPass );
				composer.addPass( effectFXAA );

        */

// resize window when it's resized

window.addEventListener('resize', () =>{
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight);
})

const dragControls = new DragControls(unitShop, camera, renderer.domElement);
dragControls.transformGroup = true;

// floating cursor

const floatingCursor = document.createElement('img');
floatingCursor.style.position = 'fixed';
floatingCursor.style.pointerEvents = 'none';
floatingCursor.style.width = '48px';
floatingCursor.style.height = '48px';
floatingCursor.style.zIndex = '9999';
floatingCursor.style.display = 'none'; // Hidden by default
document.body.appendChild(floatingCursor);

document.addEventListener('mousemove', (e) => {
  if (floatingCursor.style.display === 'block') {
    floatingCursor.style.left = `${e.clientX + 8}px`;
    floatingCursor.style.top = `${e.clientY + 8}px`;
  }
});

// load in the grid

let displayedGrid = null;
let displayedUnit = null;
let floor = null;
const displayedGridMeshes = [];

let battleWinCheckInterval = null;
let startBattleButtonContainer = null;




loader.load( `/Assets/placeholder_models/floor.glb`, function ( gltf ) {
  floor = gltf.scene;
  floor.position.set(0,-0.1,0);
  floor.scale.set(1,1,1);
  console.log(floor);
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

// pointer function for identifying objects

const pointer = new THREE.Vector2();
function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;

}

window.addEventListener( 'pointermove', onPointerMove );

// set variable that the unit placement raycaster is not active

let placementRaycasterActive = false;

// set the game clock

const clock = new THREE.Clock();

// set variables for player turns and higher-order game logic

let currentGameRound = 0;
const gamePhases = ["placement", "battle"]
let currentPhaseIndex = 0
let battlePhaseDuration = 30; 
let battlePhaseRemaining = battlePhaseDuration;
let numberUnitsToPlace;

// declare player and opponent health and display on screen

let playerHealth = 100;
let opponentHealth = 100;

// Player health display (top left)
const playerHealthDisplay = document.createElement('div');
playerHealthDisplay.id = 'player-health';
playerHealthDisplay.style.position = 'fixed';
playerHealthDisplay.style.top = '20px';
playerHealthDisplay.style.left = '30px';
playerHealthDisplay.style.background = 'rgba(120, 255, 120, 0.95)';
playerHealthDisplay.style.color = '#222';
playerHealthDisplay.style.fontSize = '2rem';
playerHealthDisplay.style.fontFamily = 'monospace';
playerHealthDisplay.style.padding = '12px 32px';
playerHealthDisplay.style.borderRadius = '12px';
playerHealthDisplay.style.zIndex = '2002';
playerHealthDisplay.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
playerHealthDisplay.textContent = `Player Health: ${playerHealth}`;
document.body.appendChild(playerHealthDisplay);

// Opponent health display (top right)
const opponentHealthDisplay = document.createElement('div');
opponentHealthDisplay.id = 'opponent-health';
opponentHealthDisplay.style.position = 'fixed';
opponentHealthDisplay.style.top = '20px';
opponentHealthDisplay.style.right = '300px';
opponentHealthDisplay.style.background = 'rgba(255, 120, 120, 0.95)';
opponentHealthDisplay.style.color = '#222';
opponentHealthDisplay.style.fontSize = '2rem';
opponentHealthDisplay.style.fontFamily = 'monospace';
opponentHealthDisplay.style.padding = '12px 32px';
opponentHealthDisplay.style.borderRadius = '12px';
opponentHealthDisplay.style.zIndex = '2002';
opponentHealthDisplay.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
opponentHealthDisplay.textContent = `Opponent Health: ${opponentHealth}`;
document.body.appendChild(opponentHealthDisplay);

// game controller function

function gamePhaseController () {
  const phase = gamePhases[currentPhaseIndex];
 switch (phase) {
    case "placement":
      currentFunds += (currentGameRound * 200)
      updateFundsDisplay();
      startPlacementPhase();
      break;
    case "battle":
      startBattlePhase();
      break;
  }


}

function startPlacementPhase () {
  // reset the camera and lock the map controls
  camera.position.set(30, 80, 20);
  controls.reset();
  controls.enabled = false;
  dragControls.enabled = true;
  
  switch (currentPhaseIndex) {
    case 1: currentShopStock.push({name: "ratTank", cost: 150});
    break;
    case 2: currentShopStock.push({name: "ratBat", cost: 125});
    break;
  }

  updateHealthDisplays();

  numberUnitsToPlace = 2 + currentGameRound

  boardUnitCleanUp();
  
  addShopButtons();

  placementRaycaster();

  enemyPlacementController();

  unitInitialiser();

  addUnit("ratoTron", "player", 5, 5);



  // add a grid of meshes for raycasting on board points (and thereby placing units)

  for (let i = 0; i < 40; i++) {
    if (i === 19 || i === 20) {
      continue;
    }
  for (let j = 0; j < 60; j++) {
  const geometry = new THREE.PlaneGeometry( 1, 1); 
  const material = new THREE.MeshBasicMaterial( {color: 0x88E788} ); 
  const plane = new THREE.Mesh( geometry, material ); 
  plane.position.set(j, 0, (i * -1));
  plane.rotation.set(degToRad(-90),0,0)
  displayedGridMeshes.push(plane);
  
  plane.visible = false;
  scene.add( plane );
  }
}

/*
// Get a vector pointing to the right of the camera
const cameraRight = new THREE.Vector3();
cameraRight.crossVectors(camera.up, cameraDirection).normalize();

for (let i = 0; i < 3; i++) {
  const shopOffset = new THREE.Vector3(4, ((i - 12) * 1.2 ), (-4 -i * 1.1)); 
  const geometry = new THREE.PlaneGeometry( 1, 1); 
  const material = new THREE.MeshBasicMaterial( {color: 0xFF0000} ); 
  const plane = new THREE.Mesh( geometry, material ); 
  plane.position.copy(camera.position.clone().add(shopOffset))
  newShopUnitLocationMarkers.push(plane);
  scene.add( plane );
}*/


// function that loads in the shop units so that they can then be placed on board and spawn a unit

loadShopUnits();


   // add a start battle button at bottom of the screen
startBattleButtonContainer = document.createElement('div');
startBattleButtonContainer.style.position = 'fixed';
startBattleButtonContainer.style.left = '50%';
startBattleButtonContainer.style.bottom = '30px'; // 30px from the bottom
startBattleButtonContainer.style.transform = 'translateX(-50%)';
startBattleButtonContainer.style.display = 'flex';
startBattleButtonContainer.style.flexDirection = 'column';
startBattleButtonContainer.style.gap = '20px';
startBattleButtonContainer.style.zIndex = '1001';

const btn = document.createElement('button');
  btn.textContent = `Start Battle`;
  btn.style.width = '300px';
  btn.style.height = '100px';
  btn.style.fontSize = '1.1rem';
  btn.style.borderRadius = '8px';
  btn.style.border = 'none';
  btn.style.background = '#2d7be0';
  btn.style.color = 'white';
  btn.style.cursor = 'pointer';
  btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
  btn.style.transition = 'background 0.2s';
  btn.onmouseenter = () => btn.style.background = '#1756a9';
  btn.onmouseleave = () => btn.style.background = '#2d7be0';
  btn.addEventListener("click", startBattlePhase);

  startBattleButtonContainer.appendChild(btn);
  document.body.appendChild(startBattleButtonContainer);


}

function startBattlePhase() {
  console.log(placementBoard);
 currentPhaseIndex = 1;
 controls.reset();
  controls.enabled = true;
  dragControls.enabled = false;
  shopButtons.forEach((button) => {
    button.remove();
  }
  );
  startBattleButtonContainer.remove();
  startBattleButtonContainer = null;
  shopButtons.length = 0;

  for (const plane of displayedGridMeshes) {
    plane.visible = false;
  }
   battlePhaseRemaining = battlePhaseDuration;
    battleTimerDisplay.style.display = 'block';
    clock.start();

    // check once per second to see if all units on either side are dead

    if (battleWinCheckInterval) clearInterval(battleWinCheckInterval);
  battleWinCheckInterval = setInterval(() => {
    const allPlayerUnitsDead = !activeUnits.some(unit => unit.playerAlignment === "player" && unit.status === "alive");
    const allOpponentUnitsDead = !activeUnits.some(unit => unit.playerAlignment === "opponent" && unit.status === "alive");
    if (allPlayerUnitsDead) {
      const remainingOpponentUnits = activeUnits.filter((unit) => unit.status === "alive" && unit.playerAlignment === "opponent").length
      roundResolveAlert("Opponent", "Player", remainingOpponentUnits)
      playerHealth -= remainingOpponentUnits;
      clearInterval(battleWinCheckInterval);
    }
    if (allOpponentUnitsDead) {
      const remainingPlayerUnits = activeUnits.filter((unit) => unit.status === "alive" && unit.playerAlignment === "player").length
       roundResolveAlert("Player", "Opponent", remainingPlayerUnits);
       opponentHealth -= remainingPlayerUnits;
      clearInterval(battleWinCheckInterval);
      // handle win logic here
    }
  }, 1000); 

}


// set animation loop

function animate() {
  
  // Highlight planes on hover during placement phase
if (currentPhaseIndex === 0 && selectedShopButton) {
  // Reset all planes to default color

  // Raycast from pointer
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(displayedGridMeshes);

    if (intersects.length > 0) {
    const hoveredCell= intersects[0];
    if (lastHighlightedGridCell && lastHighlightedGridCell !== hoveredCell) {
      lastHighlightedGridCell.object.visible = false;
    }
    hoveredCell.object.visible = true;
    lastHighlightedGridCell = hoveredCell;
  } else if (lastHighlightedGridCell) {
    lastHighlightedGridCell.object.visible = false;
    lastHighlightedGridCell = null;
  }
}

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

  
  if (clock.elapsedTime > 30 && currentPhaseIndex === 1) {
    
    clock.stop();
    
  }


  for (let unit of activeUnits) {
  if (unit.mixer) {
    unit.mixer.update(delta);
  }
}

if (currentPhaseIndex === 1) {
movementAttackController();
  battlePhaseRemaining -= clock.getDelta();
  if (battlePhaseRemaining < 0) {
    battlePhaseRemaining = 0;}
  battleTimerDisplay.textContent = `Battle Time: ${battlePhaseRemaining.toFixed(1)}s`;
  if (battlePhaseRemaining === 0) {
    battleTimerDisplay.style.display = 'none';
}


/*if (currentGamePhase === "placement") {
  for (marker of newShopUnitLocationMarkers) {
    marker.position.copy(camera.position.clone().add(shopOffset))
    marker.rotation.copy(camera.rotation)
  }
}*/
  

} else {
  battleTimerDisplay.style.display = 'none';
}


  //composer.render();

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
  health: 40,
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
  targetDirection: null,
  positionStart: new THREE.Vector3(x, 0, z),
  position: new THREE.Vector3(x, 0, z),
  mesh: null,
  meshMaterials: [],
  meshOpacities: [],
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
attackPoint: null,

  attackAction () {
  if (this.target && this.target.health > 0) {
    
    this.target.health = this.target.health-(this.damage-this.target.armour);
    
    if (!this.animationActionStash.attack.isRunning()) {
    this.playAnimation('attack');
    }

    this.attackSprite();

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
  if (this._attackInterval) {
    clearInterval(this._attackInterval);
    this._attackInterval = null;
  }
  this.playAnimation('death');


  this._fadeInterval = setInterval(() => {
    let fadeComplete = false;
    for (const material of this.meshMaterials) {
      material.transparent = true;
    }
    for (const material of this.meshMaterials) {
      if (material.opacity >= 0.05) {
        material.opacity = material.opacity - 0.02;
      } else if (material.opacity  < 0.05) {
      fadeComplete = true;
      }
      if (fadeComplete) {
        
        materialCleanUp();
      clearInterval(this._fadeInterval);
      }
    } 
  }, 75);
  
  const materialCleanUp = () => {
  this.mesh.traverse(obj => {
    if (obj.isMesh) {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(mat => mat.dispose());
        } else {
          obj.material.dispose();
        }
      }
    }
  });
  scene.remove(this.mesh);
}
}, 
attack () {
  if (this.status === "dead" || this._attackInterval) return;  
  this.attackAction();
  this._attackInterval = setInterval(() => this.attackAction(), this.damage_interval * 1000);
},
attackSprite () {
      const attackSprite = new THREE.Sprite( tankAttackMaterial2 );
      attackSprite.position.copy(this.mesh.position);
      attackSprite.position.y += 1;
      attackSprite.scale.set(1, 1, 1);
       if (this.targetDirection) {
       // Get angle in radians from targetDirection vector
      const angle = Math.atan2(this.targetDirection.x, this.targetDirection.z);
      attackSprite.material.rotation = angle + Math.PI / 2;// Yaw rotation
      }
      scene.add( attackSprite );  
      setTimeout(() => {
    scene.remove(attackSprite);
      }, 500);  
}
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
  targetDirection: null,
  positionStart: new THREE.Vector3(x, 0, z),
  position: new THREE.Vector3(x, 0, z),
  mesh: null,
  meshMaterials: [],
  meshOpacities: [],
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
attackPoint: null,
  attackAction () {
  if (this.target && this.target.health > 0) {
    
    this.target.health = this.target.health-(this.damage-this.target.armour);
    
    if (!this.animationActionStash.attack.isRunning()) {
    this.playAnimation('attack');
    }

    this.attackSprite();
    this.attackSound();

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
  if (this._attackInterval) {
    clearInterval(this._attackInterval);
    this._attackInterval = null;
  }
  this.playAnimation('death');


  this._fadeInterval = setInterval(() => {
    let fadeComplete = false;
    for (const material of this.meshMaterials) {
      material.transparent = true;
    }
    for (const material of this.meshMaterials) {
      if (material.opacity >= 0.05) {
        material.opacity = material.opacity - 0.02;
      } else if (material.opacity  < 0.05) {
      fadeComplete = true;
      }
      if (fadeComplete) {
        
        materialCleanUp();
      
      }
    } 
  }, 75);
  
  const materialCleanUp = () => {
  this.mesh.traverse(obj => {
    if (obj.isMesh) {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(mat => mat.dispose());
        } else {
          obj.material.dispose();
        }
      }
    }
  });
  scene.remove(this.mesh);
  clearInterval(this._fadeInterval);
}
}, 
attack () {
  if (this.status === "dead" || this._attackInterval) return;  
  this.attackAction();
  this._attackInterval = setInterval(() => this.attackAction(), this.damage_interval * 1000);
},
attackSprite () {
      const attackSprite = new THREE.Sprite( tankAttackMaterial1 );
      const worldPos = new THREE.Vector3();
      this.mesh.attackPoint.getWorldPosition(worldPos);
      attackSprite.position.copy(worldPos);
      console.log('attackPoint:', this.mesh.attackPoint);
      attackSprite.material.depthTest = false;
      attackSprite.material.depthWrite = false;
      
      
      attackSprite.scale.set(1, 1, 1);
       scene.add( attackSprite );  
       setTimeout(() => {
    attackSprite.material = tankAttackMaterial2
    
    attackSprite.material.depthTest = false;
    attackSprite.material.depthWrite = false;
      }, 200);  
      setTimeout(() => {
    scene.remove(attackSprite);
      }, 500);  
},
attackSound () {
  if (tankFireBuffer) {
    const tankFireSound = new THREE.Audio(listener);
    tankFireSound.setBuffer(tankFireBuffer);
    tankFireSound.setLoop(false);

    // Calculate distance from unit to camera's target (board center)
    const cameraTarget = controls.target;
    const unitPos = this.mesh.position;
    const distance = unitPos.distanceTo(cameraTarget);

    // Set volume based on distance (closer to center = louder)
    const maxDistance = 10;
    const minVolume = 0.1;
    const maxVolume = 0.7;
    let volume = maxVolume - (distance / maxDistance) * (maxVolume - minVolume);
    volume = Math.max(minVolume, Math.min(maxVolume, volume));

    tankFireSound.setVolume(volume);
    tankFireSound.play();

    setTimeout(() => {
      tankFireSound.stop();
      if (tankFireSound.parent) tankFireSound.parent.remove(tankFireSound);
    }, 1500);
  }
}
}
} else if (unitName === "ratBat") {
  
  return {
  _name: `${unitName}`,
    get name() {
  return this._name;
  },
  playerAlignment: playerAlignment,
  health: 50,
  damage: 5 ,
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
  targetDirection: null,
  positionStart: new THREE.Vector3(x, 0, z),
  position: new THREE.Vector3(x, 0, z),
  mesh: null,
  meshMaterials: [],
  meshOpacities: [],
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
       
  
    } else if (animation === 'movement' && !this.animationActionStash.movement.isRunning()) {
      this.animationActionStash.movement.setLoop(THREE.LoopRepeat, Infinity); 
      this.animationActionStash.movement.play();   
    } 
},
attackPoint: null,
  attackAction () {
  if (this.target && this.target.health > 0) {
    
    this.target.health = this.target.health-(this.damage-this.target.armour);
    
    if (!this.animationActionStash.attack.isRunning()) {
    this.playAnimation('attack');
    }

    this.attackSprite();

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
  if (this._attackInterval) {
    clearInterval(this._attackInterval);
    this._attackInterval = null;
  }
  this.playAnimation('death');


  this._fadeInterval = setInterval(() => {
    let fadeComplete = false;
    for (const material of this.meshMaterials) {
      material.transparent = true;
    }
    for (const material of this.meshMaterials) {
      if (material.opacity >= 0.05) {
        material.opacity = material.opacity - 0.02;
      } else if (material.opacity  < 0.05) {
      fadeComplete = true;
      }
      if (fadeComplete) {
        
        materialCleanUp();
      clearInterval(this._fadeInterval);
      }
    } 
  }, 75);
  
  const materialCleanUp = () => {
  this.mesh.traverse(obj => {
    if (obj.isMesh) {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(mat => mat.dispose());
        } else {
          obj.material.dispose();
        }
      }
    }
  });
  scene.remove(this.mesh);
}
}, 
attack () {
  if (this.status === "dead" || this._attackInterval) return;  
  this.attackAction();
  this._attackInterval = setInterval(() => this.attackAction(), this.damage_interval * 1000);
},
attackSprite () {
      const attackSprite = new THREE.Sprite( tankAttackMaterial2 );
      attackSprite.position.copy(this.mesh.position);
      attackSprite.position.y += 1;
      attackSprite.scale.set(1, 1, 1);
       if (this.targetDirection) {
       // Get angle in radians from targetDirection vector
      const angle = Math.atan2(this.targetDirection.x, this.targetDirection.z);
      attackSprite.material.rotation = angle + Math.PI / 2;// Yaw rotation
      }
      scene.add( attackSprite );  
      setTimeout(() => {
    scene.remove(attackSprite);
      }, 500);  
}
}

} else if (unitName === "ratoTron") {
  
  return {
  _name: `${unitName}`,
    get name() {
  return this._name;
  },
  playerAlignment: playerAlignment,
  health: 500,
  damage: 150 ,
  damage_interval: 2,
  armour: 0,
  range: 4,
  speed: 0.015,
  turningSpeed: 1,
  fieldOfView: 25,
  _size: 4,
  get size() {return this._size;},
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
  targetDirection: null,
  positionStart: new THREE.Vector3(x, 0, z),
  position: new THREE.Vector3(x, 0, z),
  mesh: null,
  meshMaterials: [],
  meshOpacities: [],
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
       
  
    } else if (animation === 'movement' && !this.animationActionStash.movement.isRunning()) {
      this.animationActionStash.movement.setLoop(THREE.LoopRepeat, Infinity); 
      this.animationActionStash.movement.play();   
    } 
},
attackPoint: null,
  attackAction () {
  if (this.target && this.target.health > 0) {
    
    this.target.health = this.target.health-(this.damage-this.target.armour);
    
    if (!this.animationActionStash.attack.isRunning()) {
    this.playAnimation('attack');
    }

    this.attackSprite();

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
  if (this._attackInterval) {
    clearInterval(this._attackInterval);
    this._attackInterval = null;
  }
  this.playAnimation('death');


  this._fadeInterval = setInterval(() => {
    let fadeComplete = false;
    for (const material of this.meshMaterials) {
      material.transparent = true;
    }
    for (const material of this.meshMaterials) {
      if (material.opacity >= 0.05) {
        material.opacity = material.opacity - 0.02;
      } else if (material.opacity  < 0.05) {
      fadeComplete = true;
      }
      if (fadeComplete) {
        
        materialCleanUp();
      clearInterval(this._fadeInterval);
      }
    } 
  }, 75);
  
  const materialCleanUp = () => {
  this.mesh.traverse(obj => {
    if (obj.isMesh) {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(mat => mat.dispose());
        } else {
          obj.material.dispose();
        }
      }
    }
  });
  scene.remove(this.mesh);
}
}, 
attack () {
  if (this.status === "dead" || this._attackInterval) return;  
  
  this._attackInterval = setInterval(() => this.attackAction(), this.damage_interval * 1000);
},
attackSprite () {
      const attackSprite = new THREE.Sprite( tankAttackMaterial2 );
      attackSprite.position.copy(this.mesh.position);
      attackSprite.position.y += 1;
      attackSprite.scale.set(1, 1, 1);
       if (this.targetDirection) {
       // Get angle in radians from targetDirection vector
      const angle = Math.atan2(this.targetDirection.x, this.targetDirection.z);
      attackSprite.material.rotation = angle + Math.PI / 2;// Yaw rotation
      }
      scene.add( attackSprite );  
      setTimeout(() => {
    scene.remove(attackSprite);
      }, 500);  
}
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


let playerUnitCount = 0;
let EnemyUnitCount = 0;



// function that goes through each row of the placement array and invokes addUnit to place relevant units there




// function that adds units to the array storing units for this round

const addUnit = function(unit, playerAlignment, x, z) {

  loader.load( `/Assets/placeholder_models/${unit}.glb`, function ( gltf ) {
    activeUnits.push(unitFactory(unit, playerAlignment, x, z));
    const newUnit = activeUnits[activeUnits.length - 1];
      newUnit.mesh = gltf.scene;
      newUnit.mesh.position.copy(newUnit.position);

      newUnit.mesh.traverse(child => {
      if (child.isMesh) {
    
      const toonMaterial = new THREE.MeshToonMaterial({
      name: child.material.name,
      color: child.material.color,
      map: child.material.map,
      normalMap: child.material.normalMap,
      transparent: true,
      opacity: child.material.opacity
      });
     child.material = toonMaterial;
      } 

    /*newUnit.mesh.traverse(child => {
        if (child.isMaterial && child.name === "Main" && playerAlignment === "player") {
          child.color = new THREE.Color().setHex( 0x5951E7FF );
        }
      })
*/    
      
      
      });
    
      function collectMaterialColoursAndOpacity(object) {
        object.traverse(child => {
        if (child.isMesh && child.material && !newUnit.meshMaterials.includes(child.material)) {
            
            newUnit.meshMaterials.push(child.material);
        } 
        }
        );
        }

        newUnit.meshMaterials = [];
       collectMaterialColoursAndOpacity(newUnit.mesh);

      
        for (let material of newUnit.meshMaterials) {
          if (material.name === "Main" && playerAlignment === "player") {
            material.color = new THREE.Color().setHex( 0x4267E7 );
          }
        }
      
      

      function storeAttackPoint(object) {
        object.traverse(child => {
          if (child.name && child.name === "attackPoint") {
            newUnit.mesh.attackPoint = child;
          }
        }

        )
      }

      storeAttackPoint(newUnit.mesh);
    

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
          newUnit.mesh.children[0].rotation.set(0,0,0);
          //newUnit.mesh.children[0].material.color.setHex(0xE767C7);
          
          break;
        case "ratBat":
          newUnit.mesh.children[0].rotation.set(0,0,0);
          
          break;
        case "ratTank":
          newUnit.mesh.children[0].rotation.set(0,0,0);
          break;
        case "ratoTron":
          newUnit.mesh.children[0].rotation.set(0,3.14159265,0)
        }
      }
      console.log(newUnit);
      scene.add(newUnit.mesh);

}, undefined, function ( error ) {

  console.error( error );

} );
}


// add the intro card on loading

const introImg = document.createElement('img');
introImg.src = 'Assets/Textures/Intro card/intro-card-01.png'; // Replace with your actual image path
introImg.style.position = 'fixed';
introImg.style.left = '50%';
introImg.style.top = '50%';
introImg.style.width = '1080px';
introImg.style.height = '1080px';
introImg.style.transform = 'translate(-50%, -50%)';
introImg.style.zIndex = '2000'; 

document.body.appendChild(introImg);



const introBtn = buttonMaker(
  '300px', 
  '80px', 
  'Start Game',
  () => {
    introImg.remove();
    introBtn.remove();
    currentGameRound++;
    gamePhaseController();
  }
);
introBtn.style.position = 'fixed';
introBtn.style.left = '50%';
introBtn.style.top = 'calc(50% + 570px)';
introBtn.style.transform = 'translateX(-50%)';
introBtn.style.zIndex = '2001';

document.body.appendChild(introBtn);








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
            unit.targetDirection = enemyDirection;
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
                    }  else if (unit.name != 'ratTank') {
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

const raycaster = new THREE.Raycaster();

 function onMouseDown(event) {
    const coords = new THREE.Vector2(
      (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
      - ((event.clientY / renderer.domElement.clientHeight) * 2 - 1),
    );
    
  raycaster.setFromCamera(pointer, camera);
  // Raycast
  const intersections = raycaster.intersectObjects(displayedGridMeshes, true);
  if (intersections.length > 0 && selectedShopButton) {
    if (intersections[0].object.geometry.type === "PlaneGeometry") {
      intersections[0].object.visible = true;
    }
    {}
    if (currentFunds >= selectedShopButton.cost) {
    addUnit(selectedShopButton.name, "player", intersections[0].object.position.x, intersections[0].object.position.z);
    console.log(`${intersections[0].object.position.x}, ${intersections[0].object.position.z}`);
    const i = Math.round(intersections[0].object.position.z * -1);
    const j = Math.round(intersections[0].object.position.x);
    placementBoard[i][j] = selectedShopButton.name;
    
    currentFunds = currentFunds - selectedShopButton.cost;
    updateFundsDisplay();
    selectedShopButton = null;
    } else {
      showFundsWarning(`Not enough funds for ${selectedShopButton.name}!`);
      intersections[0].object.visible = false;
      selectedShopButton = null;
    }
  }
  }

   


function placementRaycaster() {

if (placementRaycasterActive) return;
  placementRaycasterActive = true;

 window.addEventListener('mousedown', onMouseDown);
 
 
}

function buttonMaker (width, height, text, onClick, options = {}) {
  const btn = document.createElement('button');
  btn.textContent = text;
  btn.style.width = options.width || width;
  btn.style.height = options.height || height;
  btn.style.fontSize = options.fontSize || '1.1rem';
  btn.style.borderRadius = options.borderRadius || '8px';
  btn.style.border = 'none';
  btn.style.background = options.background || '#2d7be0';
  btn.style.color = options.color || 'white';
  btn.style.cursor = 'pointer';
  btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
  btn.style.transition = 'background 0.2s';
  btn.onmouseenter = () => btn.style.background = options.hoverBackground || '#1756a9';
  btn.onmouseleave = () => btn.style.background = options.background || '#2d7be0';
  btn.addEventListener('click', onClick);
  return btn;
}

function addShopButtons () {
  for (let i = 0; i < currentShopStock.length; i++) {
  const unit = currentShopStock[i];
  const btn = buttonMaker(
    '200px',
    '150px',
    `${unit.name} - ${unit.cost}`,
    () => {
    selectedShopButton = unit;
    floatingCursor.src = `Assets/Textures/cursor-icons/${unit.name}.png`; 
    floatingCursor.style.display = 'block'; 
   
}
  );

  btn.style.position = 'fixed';
  btn.style.right = '30px';
  btn.style.top = `${400 + (i * 200)}px`;
  btn.style.zIndex = '2001';
  btn.style.display = 'flex';
  btn.style.flexDirection = 'column'; 
  btn.style.alignItems = 'center';
  btn.style.justifyContent = 'center';

  // Image centered inside button
  const img = document.createElement('img');
  img.src = `Assets/Textures/shop-buttons/${unit.name}.png`;
  img.style.width = '160px';
  img.style.height = '100px';
  img.style.pointerEvents = 'none';

  btn.appendChild(img);

  shopButtons.push(btn);
  document.body.appendChild(btn);

}

document.addEventListener('mousedown', function(e) {
  if (!shopButtons.some(btn => btn.contains(e.target))) {
    floatingCursor.style.display = 'none'; // Hide the cursor image
  }
});

}

function showFundsWarning(message) {
  let warningDiv = document.getElementById('funds-warning');
  if (!warningDiv) {
    warningDiv = document.createElement('div');
    warningDiv.id = 'funds-warning';
    warningDiv.style.position = 'fixed';
    warningDiv.style.top = '50%';
    warningDiv.style.left = '50%';
    warningDiv.style.transform = 'translate(-50%, -50%)';
    warningDiv.style.background = 'rgba(255, 80, 80, 0.95)';
    warningDiv.style.color = 'white';
    warningDiv.style.fontSize = '2rem';
    warningDiv.style.padding = '24px 48px';
    warningDiv.style.borderRadius = '16px';
    warningDiv.style.zIndex = '3000';
    warningDiv.style.boxShadow = '0 2px 16px rgba(0,0,0,0.2)';
    document.body.appendChild(warningDiv);
  }
  warningDiv.textContent = message;
  warningDiv.style.display = 'block';
  setTimeout(() => {
    warningDiv.style.display = 'none';
  }, 2000); // Hide after 2 seconds
}

function enemyPlacementController (){
  

  for (let i = 20; i < boardDepth; i++) {
  for (let j = 0; j < boardWidth; j++)  {
    
    if (Math.random() > 0.96 && placementBoard[i][j] == "empty" && numberUnitsToPlace > 0) {
      placementBoard[i][j] = "ratChaff";
      numberUnitsToPlace--;
  } else if (Math.random() <0.01 && placementBoard[i][j] == "empty" && numberUnitsToPlace > 0) {
      placementBoard[i][j] = "ratTank";
      numberUnitsToPlace--;
    } else if (Math.random() <0.02 && placementBoard[i][j] == "empty" && numberUnitsToPlace > 0) {
      placementBoard[i][j] = "ratBat";
      numberUnitsToPlace--;
    }
}
}



};

function roundResolveAlert(winner, loser, healthLost) {
  
  let resolveAlertDiv = document.getElementById('resolve-alert');
  if (!resolveAlertDiv) {
    resolveAlertDiv = document.createElement('div');
    resolveAlertDiv.id = 'resolve-alert';
    resolveAlertDiv.style.position = 'fixed';
    resolveAlertDiv.style.top = '50%';
    resolveAlertDiv.style.left = '50%';
    resolveAlertDiv.style.transform = 'translate(-50%, -50%)';
    resolveAlertDiv.style.background = 'rgba(255, 80, 80, 0.95)';
    resolveAlertDiv.style.color = 'white';
    resolveAlertDiv.style.fontSize = '2rem';
    resolveAlertDiv.style.padding = '24px 48px';
    resolveAlertDiv.style.borderRadius = '16px';
    resolveAlertDiv.style.zIndex = '3000';
    resolveAlertDiv.style.boxShadow = '0 2px 16px rgba(0,0,0,0.2)';
    document.body.appendChild(resolveAlertDiv);
  }
  if (playerHealth < 1 || opponentHealth < 1) {
      resolveAlertDiv.fontSize = '4rem'
      resolveAlertDiv.textContent = `${winner} wins the rat war! Game Over. Refresh the page to play again`;
  } else {
  resolveAlertDiv.textContent = `${winner} wins! ${loser} lost ${healthLost} health.`;
  resolveAlertDiv.style.display = 'block';

  let continueBtn = buttonMaker(
    100, 
    70, 
    "Continue",
    () => {
    currentGameRound++;
    currentPhaseIndex--;
    gamePhaseController();
    continueBtn.remove();
    resolveAlertDiv.remove();
    }
  );
  resolveAlertDiv.appendChild(continueBtn);
}

}

function unitInitialiser () {
    placementBoard.forEach((row, i) => {
  row.forEach((cell, j) => {
    
    let playerAlignment;
    if (i > 19) {
      playerAlignment = "opponent";
    } else {
      playerAlignment = "player";
    }

      if (cell != "empty") {
      addUnit(cell, playerAlignment, j, (i * -1));
};
    
  });
});
}

function boardUnitCleanUp () {
  
  scene.traverse(obj => {
    if (obj.isMesh && obj.geometry && obj.geometry.type != "PlaneGeometry") {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(mat => mat.dispose());
        } else {
          obj.material.dispose();
        }
      }
    }
  });
  for (const unit of activeUnits) {
    if (unit.mesh) {
      scene.remove(unit.mesh);
    }
  }

  activeUnits.length = 0;

}

function updateHealthDisplays() {
  playerHealthDisplay.textContent = `Player Health: ${playerHealth}`;
  opponentHealthDisplay.textContent = `Opponent Health: ${opponentHealth}`;
}