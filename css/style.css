/**
 * 3D Event Stage Visualizer - Core Engine
 * Manages Three.js scene, camera controls, lighting, model generation, 
 * interactive controls, UI events, export systems, and animation loops.
 */

// Global State & Data Store
const STATE = {
  theme: 'royal-marwari',
  selectedElement: null,
  isDragging: false,
  gridVisible: true,
  cameraMode: 'perspective',
  lightingPreset: 'evening-warm',
  elements: [],
  undoStack: [],
  redoStack: [],
  metrics: {
    totalBudget: 450000,
    areaSqFt: 2400,
    itemCount: 0,
    powerConsumptionKW: 12.5
  }
};

// Preset Configuration Libraries
const LIGHTING_PRESETS = {
  'daylight-bright': {
    ambient: 0xffffff,
    ambientIntensity: 0.8,
    directional: 0xfffaed,
    directionalIntensity: 1.2,
    position: { x: 50, y: 100, z: 50 },
    background: 0xe0f7fa
  },
  'evening-warm': {
    ambient: 0xffe0b2,
    ambientIntensity: 0.5,
    directional: 0xffb74d,
    directionalIntensity: 1.0,
    position: { x: 30, y: 60, z: 40 },
    background: 0x1a0e2e
  },
  'sangeet-party': {
    ambient: 0xaa00ff,
    ambientIntensity: 0.4,
    directional: 0x00e676,
    directionalIntensity: 0.9,
    position: { x: -20, y: 40, z: 30 },
    background: 0x0d001a
  },
  'royal-wedding': {
    ambient: 0xffd700,
    ambientIntensity: 0.6,
    directional: 0xff4081,
    directionalIntensity: 1.1,
    position: { x: 0, y: 80, z: 60 },
    background: 0x210303
  }
};

const ELEMENT_CATALOG = [
  { id: 'stage-base', name: 'Main Stage Platform', category: 'Structure', defaultDimensions: { x: 20, y: 2, z: 12 }, color: 0x8d6e63, cost: 45000 },
  { id: 'royal-sofa', name: 'Marwari Maharaja Sofa', category: 'Furniture', defaultDimensions: { x: 4, y: 3, z: 2 }, color: 0xd4af37, cost: 25000 },
  { id: 'mandap-pillar', name: 'Carved Floral Pillar', category: 'Mandap', defaultDimensions: { x: 1.5, y: 10, z: 1.5 }, color: 0xfff8e7, cost: 12000 },
  { id: 'flower-arch', name: 'Marigold & Rose Arch', category: 'Decor', defaultDimensions: { x: 12, y: 8, z: 1 }, color: 0xe65100, cost: 35000 },
  { id: 'par-light', name: 'LED Stage PAR Light', category: 'Lighting', defaultDimensions: { x: 1, y: 1.5, z: 1 }, color: 0x29b6f6, cost: 3500 },
  { id: 'guest-chair', name: 'Gold Banquet Chair', category: 'Seating', defaultDimensions: { x: 1.5, y: 3, z: 1.5 }, color: 0xffd54f, cost: 800 },
  { id: 'round-table', name: 'Royal Dining Table', category: 'Seating', defaultDimensions: { x: 5, y: 2.5, z: 5 }, color: 0x5d4037, cost: 4500 },
  { id: 'chandelier', name: 'Crystal Chandelier', category: 'Lighting', defaultDimensions: { x: 3, y: 5, z: 3 }, color: 0xffffff, cost: 18000 }
];

// App Initialization Handler
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing 3D Event Visualizer App...');
  const appContainer = document.getElementById('canvas-container') || createFallbackContainer();
  
  const visualizer = new EventVisualizer3D(appContainer);
  const uiController = new UIController(visualizer);
  
  visualizer.init();
  uiController.bindEvents();
  
  // Expose instance globally for debugging & testing
  window.AppVisualizer = visualizer;
  window.AppUI = uiController;
});

function createFallbackContainer() {
  const div = document.createElement('div');
  div.id = 'canvas-container';
  div.style.width = '100vw';
  div.style.height = '100vh';
  div.style.position = 'fixed';
  div.style.top = '0';
  div.style.left = '0';
  div.style.zIndex = '1';
  document.body.appendChild(div);
  return div;
}

// Main 3D Engine Class
class EventVisualizer3D {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    this.lights = {
      ambient: null,
      directional: null,
      spots: []
    };
    
    this.stageGroup = new THREE.Group();
    this.gridHelper = null;
    this.planeMesh = null;
    
    this.animationFrameId = null;
    this.clock = new THREE.Clock();
    this.transformMode = 'translate'; // translate, rotate, scale
  }

  init() {
    this.setupScene();
    this.setupCamera();
    this.setupRenderer();
    this.setupLighting();
    this.setupEnvironment();
    this.setupInteractionListeners();
    this.animate();
    
    console.log('3D Engine initialized successfully.');
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(LIGHTING_PRESETS['evening-warm'].background);
    this.scene.fog = new THREE.FogExp2(0x1a0e2e, 0.015);
    this.scene.add(this.stageGroup);
  }

  setupCamera() {
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    this.camera.position.set(0, 25, 45);
    this.camera.lookAt(0, 0, 0);
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    
    this.container.appendChild(this.renderer.domElement);
  }

  setupLighting() {
    const preset = LIGHTING_PRESETS['evening-warm'];

    this.lights.ambient = new THREE.AmbientLight(preset.ambient, preset.ambientIntensity);
    this.scene.add(this.lights.ambient);

    this.lights.directional = new THREE.DirectionalLight(preset.directional, preset.directionalIntensity);
    this.lights.directional.position.set(preset.position.x, preset.position.y, preset.position.z);
    this.lights.directional.castShadow = true;
    this.lights.directional.shadow.mapSize.width = 2048;
    this.lights.directional.shadow.mapSize.height = 2048;
    this.lights.directional.shadow.camera.near = 0.5;
    this.lights.directional.shadow.camera.far = 150;
    
    const d = 40;
    this.lights.directional.shadow.camera.left = -d;
    this.lights.directional.shadow.camera.right = d;
    this.lights.directional.shadow.camera.top = d;
    this.lights.directional.shadow.camera.bottom = -d;
    
    this.scene.add(this.lights.directional);

    // Decorative Stage Accent Spotlights
    const spot1 = new THREE.SpotLight(0xff007f, 2);
    spot1.position.set(-15, 20, -5);
    spot1.angle = Math.PI / 6;
    spot1.penumbra = 0.5;
    spot1.target.position.set(-10, 0, 0);
    
    const spot2 = new THREE.SpotLight(0x00f0ff, 2);
    spot2.position.set(15, 20, -5);
    spot2.angle = Math.PI / 6;
    spot2.penumbra = 0.5;
    spot2.target.position.set(10, 0, 0);

    this.scene.add(spot1);
    this.scene.add(spot1.target);
    this.scene.add(spot2);
    this.scene.add(spot2.target);
    
    this.lights.spots.push(spot1, spot2);
  }

  setupEnvironment() {
    // Stage Floor Plane
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.4,
      metalness: 0.2
    });
    this.planeMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    this.planeMesh.rotation.x = -Math.PI / 2;
    this.planeMesh.receiveShadow = true;
    this.scene.add(this.planeMesh);

    // Dynamic Grid Overlay
    this.gridHelper = new THREE.GridHelper(100, 50, 0xd4af37, 0x444444);
    this.gridHelper.position.y = 0.01;
    this.scene.add(this.gridHelper);

    // Initialize Default Stage Setup
    this.buildDefaultStageLayout();
  }

  buildDefaultStageLayout() {
    this.addElementToScene('stage-base', 0, 1, 0);
    this.addElementToScene('royal-sofa', 0, 3.5, -2);
    this.addElementToScene('flower-arch', 0, 6, -5);
    this.addElementToScene('mandap-pillar', -8, 5, -4);
    this.addElementToScene('mandap-pillar', 8, 5, -4);
  }

  addElementToScene(catalogId, posX = 0, posY = 0, posZ = 0) {
    const catalogItem = ELEMENT_CATALOG.find(item => item.id === catalogId);
    if (!catalogItem) return;

    const group = new THREE.Group();
    const dims = catalogItem.defaultDimensions;
    
    let geometry, material;

    switch (catalogItem.category) {
      case 'Structure':
        geometry = new THREE.BoxGeometry(dims.x, dims.y, dims.z);
        material = new THREE.MeshStandardMaterial({ color: catalogItem.color, roughness: 0.5 });
        break;
      case 'Furniture':
        geometry = new THREE.BoxGeometry(dims.x, dims.y, dims.z);
        material = new THREE.MeshStandardMaterial({ color: catalogItem.color, metalness: 0.3, roughness: 0.3 });
        break;
      case 'Mandap':
        geometry = new THREE.CylinderGeometry(dims.x / 2, dims.x / 2, dims.y, 16);
        material = new THREE.MeshStandardMaterial({ color: catalogItem.color, roughness: 0.2 });
        break;
      case 'Decor':
        geometry = new THREE.TorusGeometry(dims.x / 2, 0.5, 16, 100);
        material = new THREE.MeshStandardMaterial({ color: catalogItem.color, roughness: 0.8 });
        break;
      case 'Lighting':
        geometry = new THREE.ConeGeometry(dims.x, dims.y, 16);
        material = new THREE.MeshBasicMaterial({ color: catalogItem.color, wireframe: true });
        break;
      default:
        geometry = new THREE.BoxGeometry(dims.x, dims.y, dims.z);
        material = new THREE.MeshStandardMaterial({ color: catalogItem.color });
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);

    group.position.set(posX, posY, posZ);
    group.userData = {
      instanceId: 'elem_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      catalogId: catalogItem.id,
      name: catalogItem.name,
      cost: catalogItem.cost,
      category: catalogItem.category
    };

    this.stageGroup.add(group);
    STATE.elements.push(group.userData);
    this.notifyStateChange();

    return group;
  }

  setLightingPreset(presetKey) {
    const preset = LIGHTING_PRESETS[presetKey];
    if (!preset) return;

    STATE.lightingPreset = presetKey;
    
    // Smooth Lighting Transitions
    this.lights.ambient.color.setHex(preset.ambient);
    this.lights.ambient.intensity = preset.ambientIntensity;
    
    this.lights.directional.color.setHex(preset.directional);
    this.lights.directional.intensity = preset.directionalIntensity;
    this.lights.directional.position.set(preset.position.x, preset.position.y, preset.position.z);
    
    this.scene.background = new THREE.Color(preset.background);
    this.scene.fog.color = new THREE.Color(preset.background);
  }

  toggleGrid(visible) {
    STATE.gridVisible = visible;
    if (this.gridHelper) {
      this.gridHelper.visible = visible;
    }
  }

  setupInteractionListeners() {
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
    
    const canvas = this.renderer.domElement;
    canvas.addEventListener('pointerdown', this.onPointerDown.bind(this), false);
    canvas.addEventListener('pointermove', this.onPointerMove.bind(this), false);
    canvas.addEventListener('pointerup', this.onPointerUp.bind(this), false);
  }

  onWindowResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  onPointerDown(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.stageGroup.children, true);

    if (intersects.length > 0) {
      let topObject = intersects[0].object;
      while (topObject.parent && topObject.parent !== this.stageGroup) {
        topObject = topObject.parent;
      }
      this.selectElement(topObject);
    } else {
      this.deselectElement();
    }
  }

  onPointerMove(event) {
    if (!STATE.isDragging || !STATE.selectedElement) return;

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.planeMesh);

    if (intersects.length > 0) {
      const point = intersects[0].point;
      // Snap to 0.5 unit grid
      STATE.selectedElement.position.x = Math.round(point.x * 2) / 2;
      STATE.selectedElement.position.z = Math.round(point.z * 2) / 2;
      this.notifyStateChange();
    }
  }

  onPointerUp() {
    STATE.isDragging = false;
  }

  selectElement(object) {
    this.deselectElement();
    STATE.selectedElement = object;
    STATE.isDragging = true;

    // Highlight Selected Mesh
    object.traverse((child) => {
      if (child.isMesh) {
        child.userData.originalColor = child.material.color.getHex();
        child.material.color.setHex(0x00e676);
      }
    });

    const event = new CustomEvent('elementSelected', { detail: object.userData });
    window.dispatchEvent(event);
  }

  deselectElement() {
    if (STATE.selectedElement) {
      STATE.selectedElement.traverse((child) => {
        if (child.isMesh && child.userData.originalColor !== undefined) {
          child.material.color.setHex(child.userData.originalColor);
        }
      });
      STATE.selectedElement = null;
      STATE.isDragging = false;

      const event = new CustomEvent('elementDeselected');
      window.dispatchEvent(event);
    }
  }

  removeSelectedElement() {
    if (!STATE.selectedElement) return;

    const instanceId = STATE.selectedElement.userData.instanceId;
    this.stageGroup.remove(STATE.selectedElement);
    
    STATE.elements = STATE.elements.filter(e => e.instanceId !== instanceId);
    STATE.selectedElement = null;
    
    this.notifyStateChange();
    const event = new CustomEvent('elementDeselected');
    window.dispatchEvent(event);
  }

  exportSceneData() {
    const exportPayload = {
      version: '2.4.0',
      timestamp: new Date().toISOString(),
      preset: STATE.lightingPreset,
      metrics: STATE.metrics,
      objects: this.stageGroup.children.map(child => ({
        instanceId: child.userData.instanceId,
        catalogId: child.userData.catalogId,
        position: { x: child.position.x, y: child.position.y, z: child.position.z },
        rotation: { x: child.rotation.x, y: child.rotation.y, z: child.rotation.z },
        scale: { x: child.scale.x, y: child.scale.y, z: child.scale.z }
      }))
    };
    return JSON.stringify(exportPayload, null, 2);
  }

  notifyStateChange() {
    // Recalculate metrics
    let totalCost = 0;
    STATE.elements.forEach(item => {
      totalCost += (item.cost || 0);
    });
    
    STATE.metrics.totalBudget = totalCost;
    STATE.metrics.itemCount = STATE.elements.length;

    const stateEvent = new CustomEvent('appStateUpdated', { detail: STATE });
    window.dispatchEvent(stateEvent);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    
    const elapsedTime = this.clock.getElapsedTime();

    // Subtle ambient animation for spotlights
    this.lights.spots.forEach((spot, idx) => {
      spot.position.x += Math.sin(elapsedTime + idx) * 0.02;
    });

    // Slow orbit camera if resting
    if (!STATE.isDragging && !STATE.selectedElement) {
      this.camera.position.x = Math.sin(elapsedTime * 0.1) * 45;
      this.camera.position.z = Math.cos(elapsedTime * 0.1) * 45;
      this.camera.lookAt(0, 2, 0);
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// User Interface & Event Controller
class UIController {
  constructor(visualizer) {
    this.visualizer = visualizer;
    this.catalogContainer = document.getElementById('catalog-list');
    this.budgetDisplay = document.getElementById('budget-counter');
    this.itemCountDisplay = document.getElementById('item-counter');
    this.presetSelector = document.getElementById('lighting-preset');
    this.gridToggle = document.getElementById('toggle-grid');
    this.deleteBtn = document.getElementById('btn-delete-selected');
    this.exportBtn = document.getElementById('btn-export-json');
  }

  bindEvents() {
    this.renderCatalog();

    // App state change update listeners
    window.addEventListener('appStateUpdated', (e) => {
      this.updateMetricsUI(e.detail.metrics);
    });

    window.addEventListener('elementSelected', (e) => {
      if (this.deleteBtn) this.deleteBtn.disabled = false;
      console.log('Selected object:', e.detail.name);
    });

    window.addEventListener('elementDeselected', () => {
      if (this.deleteBtn) this.deleteBtn.disabled = true;
    });

    if (this.presetSelector) {
      this.presetSelector.addEventListener('change', (e) => {
        this.visualizer.setLightingPreset(e.target.value);
      });
    }

    if (this.gridToggle) {
      this.gridToggle.addEventListener('change', (e) => {
        this.visualizer.toggleGrid(e.target.checked);
      });
    }

    if (this.deleteBtn) {
      this.deleteBtn.addEventListener('click', () => {
        this.visualizer.removeSelectedElement();
      });
    }

    if (this.exportBtn) {
      this.exportBtn.addEventListener('click', () => {
        const json = this.visualizer.exportSceneData();
        this.triggerDownload('event-stage-layout.json', json);
      });
    }
  }

  renderCatalog() {
    if (!this.catalogContainer) return;
    this.catalogContainer.innerHTML = '';

    ELEMENT_CATALOG.forEach(item => {
      const card = document.createElement('div');
      card.className = 'catalog-card';
      card.style.cssText = `
        padding: 10px;
        margin: 5px;
        background: #2a2a38;
        color: #fff;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
      `;
      card.innerHTML = `
        <div>
          <div style="font-weight: bold;">${item.name}</div>
          <div style="font-size: 12px; color: #aaa;">${item.category} • ₹${item.cost.toLocaleString()}</div>
        </div>
        <button class="add-btn" style="padding: 4px 8px; background: #d4af37; border: none; border-radius: 4px; cursor: pointer;">Add</button>
      `;

      card.querySelector('.add-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        this.visualizer.addElementToScene(item.id, (Math.random() - 0.5) * 10, 2, (Math.random() - 0.5) * 10);
      });

      this.catalogContainer.appendChild(card);
    });
  }

  updateMetricsUI(metrics) {
    if (this.budgetDisplay) {
      this.budgetDisplay.innerText = `₹${metrics.totalBudget.toLocaleString()}`;
    }
    if (this.itemCountDisplay) {
      this.itemCountDisplay.innerText = metrics.itemCount.toString();
    }
  }

  triggerDownload(filename, content) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}

// Canvas & WebGL Utilities
const StageUtils = {
  calculateBoundingBox(object) {
    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    box.getSize(size);
    return size;
  },

  formatCurrencyINR(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  },

  generateRandomColorHex() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  }
};
