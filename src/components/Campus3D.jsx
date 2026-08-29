import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Html, Tube, useCursor, ContactShadows, Instances, Instance } from '@react-three/drei';
import { BUILDINGS_DATA } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { Search, Navigation, Eye, RotateCcw, MapPin, Sparkles, X, ChevronRight, Compass, Home, Send, Building2, Star, Map, Play, Layers, Info, Maximize2 } from 'lucide-react';

// --- Professional 3D Building Label ---
function BuildingLabel({ building, isSelected, onClick, poiBadges = [] }) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered, 'pointer', 'auto');

  return (
    <Html 
      position={[0, building.floors * 3.5 + 4, 0]} 
      center 
      sprite 
      distanceFactor={isSelected ? 30 : 45}
      zIndexRange={[100, 0]}
      occlude
    >
      <div 
        className={`transition-all duration-300 pointer-events-auto flex flex-col items-center cursor-pointer ${isSelected ? 'scale-125' : 'scale-100 hover:scale-110'}`}
        onClick={(e) => {
          e.stopPropagation();
          onClick(building);
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <div style={{
          background: isSelected ? 'rgba(89, 98, 74, 0.95)' : 'rgba(255, 255, 255, 0.75)',
          border: `1px solid ${isSelected ? '#59624A' : 'rgba(30, 30, 30, 0.08)'}`,
          boxShadow: isSelected ? '0 10px 30px rgba(89, 98, 74, 0.3)' : '0 10px 40px rgba(30, 30, 30, 0.08)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '12px',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 250ms ease'
        }}>
          <MapPin style={{ width: 14, height: 14, color: isSelected ? '#FAF8F3' : '#59624A' }} />
          <span style={{ color: isSelected ? '#FAF8F3' : '#1D1D1B', fontSize: '13px', fontWeight: '600', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
            {building.name}
          </span>
        </div>
        <div style={{ width: 1.5, height: 28, background: isSelected ? '#59624A' : 'rgba(30,30,30,0.15)' }} />
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: isSelected ? '#59624A' : 'rgba(30,30,30,0.2)', boxShadow: isSelected ? '0 0 10px rgba(89, 98, 74, 0.5)' : 'none' }} />
        
        {/* POI Badges */}
        {poiBadges.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', position: 'absolute', top: '-30px' }}>
            {poiBadges.map((badge, idx) => (
              <div key={idx} style={{ background: '#59624A', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                {badge}
              </div>
            ))}
          </div>
        )}
      </div>
    </Html>
  );
}

// --- Hyper-Detailed Architectural Building ---
function ArchitecturalBuilding({ building, isSelected, onClick, buildingRef, poiBadges, showLabels = true }) {
  const isMain = building.id === 'main_building';
  
  const [hovered, setHovered] = useState(false);
  useCursor(hovered, 'pointer', 'auto');

  // Architectural Dimensions
  const width = isMain ? 44 : 18;
  const depth = isMain ? 12 : 14;
  const floorHeight = 3.2;
  const floors = building.floors || 3;
  const totalHeight = floors * floorHeight;

  // Materials
  const concreteMaterial = new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.9, metalness: 0.1 });
  const brickMaterial = new THREE.MeshStandardMaterial({ color: '#854d0e', roughness: 0.8, metalness: 0.1 }); // Terracotta brick
  const darkMetalMaterial = new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.5, metalness: 0.8 });
  
  // Realistic Glass
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: '#38bdf8',
    metalness: 0.9,
    roughness: 0.1,
    transmission: 0.8,
    transparent: true,
    opacity: 0.9,
    envMapIntensity: 2.0,
    emissive: isSelected ? '#0284c7' : '#000000',
    emissiveIntensity: isSelected ? 0.4 : 0
  });

  const columnsCount = Math.floor(width / 4);
  const columnSpacing = width / columnsCount;

  return (
    <group 
      ref={buildingRef}
      name={building.blockCode}
      position={building.position} 
      onClick={(e) => { e.stopPropagation(); onClick(building); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
    >
      {/* 1. Concrete Foundation Plinth */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow material={concreteMaterial}>
        <boxGeometry args={[width + 1, 0.8, depth + 1]} />
      </mesh>

      {/* 2. Core Brick Structure */}
      <mesh position={[0, totalHeight / 2 + 0.8, 0]} castShadow receiveShadow material={brickMaterial}>
        <boxGeometry args={[width - 0.5, totalHeight, depth - 0.5]} />
      </mesh>

      {/* 3. Glass Facades & Floor Slabs */}
      {[...Array(floors)].map((_, i) => (
        <group key={`floor-${i}`} position={[0, i * floorHeight + 2.4, 0]}>
          {/* Concrete Floor Divider Slab */}
          <mesh position={[0, -1.6, 0]} castShadow receiveShadow material={concreteMaterial}>
            <boxGeometry args={[width + 0.2, 0.4, depth + 0.2]} />
          </mesh>
          
          {/* Front Glass Pane */}
          <mesh position={[0, 0, depth / 2 + 0.1]} material={glassMaterial}>
            <boxGeometry args={[width - 1, floorHeight - 0.6, 0.1]} />
          </mesh>
          {/* Back Glass Pane */}
          <mesh position={[0, 0, -depth / 2 - 0.1]} material={glassMaterial}>
            <boxGeometry args={[width - 1, floorHeight - 0.6, 0.1]} />
          </mesh>

          {/* Vertical Mullions (Frames) for Front */}
          {[...Array(columnsCount + 1)].map((_, c) => (
            <mesh key={`mullion-${c}`} position={[-width/2 + c * columnSpacing, 0, depth / 2 + 0.15]} material={darkMetalMaterial} castShadow>
              <boxGeometry args={[0.2, floorHeight - 0.6, 0.3]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* 4. Roof Parapet & HVAC */}
      <group position={[0, totalHeight + 0.8, 0]}>
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow material={concreteMaterial}>
          <boxGeometry args={[width, 1.2, depth]} />
        </mesh>
        
        {/* HVAC Unit 1 */}
        <mesh position={[-width/4, 2, 0]} castShadow material={darkMetalMaterial}>
          <boxGeometry args={[2.5, 1.8, 2.5]} />
        </mesh>
        <mesh position={[-width/4, 2.9, 0]} castShadow material={new THREE.MeshStandardMaterial({color: '#1e293b'})}>
          <cylinderGeometry args={[0.8, 0.8, 0.2, 16]} />
        </mesh>

        {/* HVAC Unit 2 */}
        <mesh position={[width/4, 1.8, depth/4]} castShadow material={darkMetalMaterial}>
          <boxGeometry args={[2, 1.4, 2]} />
        </mesh>
        
        {/* Stairwell Access Housing */}
        <mesh position={[0, 2, -depth/4]} castShadow material={concreteMaterial}>
          <boxGeometry args={[3, 2.5, 4]} />
        </mesh>
      </group>

      {/* 5. Entrance Canopy & Pillars */}
      <group position={[0, 0, depth / 2 + 1.5]}>
        {/* Concrete Canopy */}
        <mesh position={[0, 3.5, 0]} castShadow receiveShadow material={concreteMaterial}>
          <boxGeometry args={[10, 0.6, 4]} />
        </mesh>
        {/* Entrance Pillars */}
        <mesh position={[-4, 1.75, 1]} castShadow receiveShadow material={concreteMaterial}>
          <cylinderGeometry args={[0.4, 0.4, 3.5, 16]} />
        </mesh>
        <mesh position={[4, 1.75, 1]} castShadow receiveShadow material={concreteMaterial}>
          <cylinderGeometry args={[0.4, 0.4, 3.5, 16]} />
        </mesh>
        {/* Glass Entrance Doors */}
        <mesh position={[0, 1.75, -1.4]} material={glassMaterial}>
          <boxGeometry args={[6, 3.5, 0.1]} />
        </mesh>
      </group>

      {/* 6. Main Building Grand Arch (Specific to IFET) */}
      {isMain && (
        <group position={[0, 0, depth / 2 + 2.5]}>
          {/* Main Blue Block */}
          <mesh position={[0, 6.5, 0]} castShadow receiveShadow material={new THREE.MeshStandardMaterial({color: '#1e3a8a', roughness: 0.3})}>
            <boxGeometry args={[12, 13, 3]} />
          </mesh>
          {/* Curved Roof Dome */}
          <mesh position={[0, 13, 0]} castShadow receiveShadow rotation={[-Math.PI / 2, 0, 0]} material={new THREE.MeshStandardMaterial({color: '#0f172a'})}>
            <cylinderGeometry args={[6, 6, 3.2, 24, 1, false, 0, Math.PI]} />
          </mesh>
          {/* Inner Cutout (Entrance Tunnel) */}
          <mesh position={[0, 3.5, 1.5]} material={new THREE.MeshStandardMaterial({color: '#020617'})}>
            <boxGeometry args={[6, 7, 0.2]} />
          </mesh>
          {/* IFET Signboard */}
          <mesh position={[0, 10, 1.6]} material={new THREE.MeshStandardMaterial({color: '#0ea5e9', emissive: '#0ea5e9'})}>
            <boxGeometry args={[8, 1.5, 0.2]} />
          </mesh>
        </group>
      )}

      {/* Selected Indicator */}
      {isSelected && (
        <mesh position={[0, building.floors * 0.75 + 1.5, 0]}>
          <coneGeometry args={[1, 2, 4]} />
          <meshStandardMaterial color="#59624A" emissive="#59624A" emissiveIntensity={0.5} wireframe />
        </mesh>
      )}

      {/* 3D Label */}
      {showLabels && <BuildingLabel building={building} isSelected={isSelected} onClick={onClick} poiBadges={poiBadges} />}
    </group>
  );
}

// --- Cinematic Camera Controller ---
function CameraRig({ selectedBuilding, activeRoute, cameraMode, buildingMap }) {
  const { camera, controls } = useThree();
  const targetCamPos = useRef(new THREE.Vector3(0, 45, 80));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  
  const startCamPos = useRef(new THREE.Vector3());
  const startLookAt = useRef(new THREE.Vector3());
  const animProgress = useRef(1);
  const isAnimating = useRef(false);

  useEffect(() => {
    if (!controls) return;
    
    startCamPos.current.copy(camera.position);
    startLookAt.current.copy(controls.target);
    animProgress.current = 0;
    isAnimating.current = true;

    // Show nav bar
    const navBar = document.getElementById('nav-status-bar');
    if (navBar) navBar.style.opacity = '1';

    if (cameraMode === 'top') {
      targetCamPos.current.set(0, 120, 1);
      targetLookAt.current.set(0, 0, 0);
    } else if (selectedBuilding) {
      const id = selectedBuilding.blockCode;
      const ref = buildingMap[id];

      // Mandatory Debug Check
      console.log({
        id,
        hasRef: !!ref?.current,
        objectName: ref?.current?.name,
        position: ref?.current?.position
      });

      // Find the actual building mesh using its explicit ref
      if (ref && ref.current) {
        const mesh = ref.current;
        
        // Critical Fix: Force world matrix update before calculating bounding box
        mesh.updateMatrixWorld(true);
        
        // Compute its bounding box
        const box = new THREE.Box3().setFromObject(mesh);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const worldPos = new THREE.Vector3();
        mesh.getWorldPosition(worldPos);

        // Calculate a tighter camera position based on the building size
        const maxDim = Math.max(size.x, size.y, size.z);
        const cameraOffset = new THREE.Vector3(
          maxDim * 1.8,
          maxDim * 1.2,
          maxDim * 1.8
        );

        const destination = center.clone().add(cameraOffset);
        
        targetLookAt.current.copy(center);
        targetCamPos.current.copy(destination);

        console.log({
          selectedId: id,
          selectedName: selectedBuilding.name,
          meshExists: !!mesh,
          meshUUID: mesh?.uuid,
          meshPosition: mesh?.position,
          worldPosition: worldPos,
          boxCenter: center,
          cameraBefore: camera.position.clone(),
          cameraAfter: destination,
          controlsTarget: center.clone()
        });
      } else {
        // Fallback
        targetLookAt.current.set(selectedBuilding.position[0], 4, selectedBuilding.position[2]);
        targetCamPos.current.set(selectedBuilding.position[0] + 30, 28, selectedBuilding.position[2] + 45);
      }
    } else if (activeRoute) {
      const targetBuilding = BUILDINGS_DATA.find(b => b.id === activeRoute.buildingId) || BUILDINGS_DATA[1];
      targetLookAt.current.set(targetBuilding.position[0], 5, targetBuilding.position[2]);
      targetCamPos.current.set(targetBuilding.position[0] + 18, 22, targetBuilding.position[2] + 28);
    } else {
      targetCamPos.current.set(0, 45, 80);
      targetLookAt.current.set(0, 0, 0);
    }
  }, [selectedBuilding, activeRoute, cameraMode, controls, buildingMap]);

  useFrame((state, delta) => {
    if (controls) {
      if (isAnimating.current && animProgress.current < 1) {
        animProgress.current += delta * 1.1; // ~900ms duration
        if (animProgress.current > 1) animProgress.current = 1;

        // Cubic Ease-in-out
        const t = animProgress.current;
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        // Interpolate LookAt
        const currentLookAt = new THREE.Vector3().lerpVectors(startLookAt.current, targetLookAt.current, ease);
        controls.target.copy(currentLookAt);

        // Interpolate Camera with Arc
        const currentCamPos = new THREE.Vector3().lerpVectors(startCamPos.current, targetCamPos.current, ease);
        const arcHeight = Math.sin(t * Math.PI) * 15; // 15 unit vertical arc
        currentCamPos.y += arcHeight;
        camera.position.copy(currentCamPos);

        // Update progress bar UI
        const progressBar = document.getElementById('nav-progress-fill');
        if (progressBar) progressBar.style.width = `${t * 100}%`;

        if (t === 1) {
          isAnimating.current = false;
          controls.target.copy(targetLookAt.current);
          controls.update();
          const navBar = document.getElementById('nav-status-bar');
          if (navBar) navBar.style.opacity = '0';
        }
      }
      controls.update();
    }
  });

  return (
    <OrbitControls 
      makeDefault 
      enableDamping={true}
      dampingFactor={0.08}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      rotateSpeed={0.8}
      zoomSpeed={1}
      panSpeed={0.8}
      minDistance={25}
      maxDistance={180}
      minPolarAngle={0.25}
      maxPolarAngle={Math.PI / 2.1}
      onStart={() => {
        isAnimating.current = false;
        const navBar = document.getElementById('nav-status-bar');
        if (navBar) navBar.style.opacity = '0';
      }}
    />
  );
}

// --- Heatmap Overlay (Ground plane radial blobs) ---
function HeatmapOverlay({ spots, visible }) {
  // We render each hotspot as a transparent glowing disc on the ground
  return (
    <group visible={visible}>
      {spots.map((spot) => (
        <mesh
          key={spot.id}
          position={[spot.pos[0], 0.12, spot.pos[1]]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[spot.radius, 32]} />
          <meshStandardMaterial
            color={spot.color}
            transparent
            opacity={0.45}
            depthWrite={false}
            emissive={spot.color}
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}
      {/* Outer soft glow rings */}
      {spots.map((spot) => (
        <mesh
          key={`ring-${spot.id}`}
          position={[spot.pos[0], 0.08, spot.pos[1]]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[spot.radius * 0.7, spot.radius * 1.4, 32]} />
          <meshStandardMaterial
            color={spot.color}
            transparent
            opacity={0.18}
            depthWrite={false}
            emissive={spot.color}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

// --- 3D Route Beam ---
function RouteBeam({ activeRoute, isEmergency }) {
  if (!activeRoute) return null;

  const targetBuilding = BUILDINGS_DATA.find(b => b.id === activeRoute.buildingId) || BUILDINGS_DATA[1];
  const startPoint = new THREE.Vector3(0, 0.4, 45); 
  const fountainPoint = new THREE.Vector3(0, 0.4, 15);
  const destPoint = new THREE.Vector3(targetBuilding.position[0], 0.4, targetBuilding.position[2]);

  const curve = new THREE.CatmullRomCurve3([startPoint, fountainPoint, destPoint]);

  return (
    <Tube args={[curve, 64, 0.35, 8, false]}>
      <meshStandardMaterial 
        color={isEmergency ? "#ef4444" : "#06b6d4"} 
        emissive={isEmergency ? "#ef4444" : "#06b6d4"} 
        emissiveIntensity={isEmergency ? 2 : 1.5} 
        transparent 
        opacity={0.8} 
      />
    </Tube>
  );
}

// --- Detailed Environment Setup ---
function EnvironmentSetup({ visibilitySettings }) {
  return (
    <>
      <color attach="background" args={['#87CEEB']} />
      <fog attach="fog" args={['#87CEEB', 50, 250]} />
      
      <ambientLight intensity={0.5} />
      <directionalLight 
        castShadow 
        position={[60, 120, 50]} 
        intensity={1.8} 
        shadow-mapSize={[4096, 4096]} 
        shadow-camera-far={250} 
        shadow-camera-left={-80} 
        shadow-camera-right={80} 
        shadow-camera-top={80} 
        shadow-camera-bottom={-80} 
        shadow-bias={-0.0005}
      />
      <directionalLight position={[-40, 30, -20]} intensity={0.6} color="#e0f2fe" />
      <Environment preset="city" />

      {/* 1. Masterplan Base Lawn */}
      {visibilitySettings.decorations && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
          <planeGeometry args={[300, 300]} />
          <meshStandardMaterial color="#355e3b" roughness={1} metalness={0} />
        </mesh>
      )}

      {/* 2. Main Asphalt Roads */}
      {visibilitySettings.roads && (
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 22]} receiveShadow>
            <planeGeometry args={[120, 8]} />
            <meshStandardMaterial color="#475569" roughness={0.9} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 2]} receiveShadow>
            <planeGeometry args={[120, 6]} />
            <meshStandardMaterial color="#475569" roughness={0.9} />
          </mesh>
          {/* Side roads connecting main paths */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-35, 0, 12]} receiveShadow>
            <planeGeometry args={[8, 30]} />
            <meshStandardMaterial color="#475569" roughness={0.9} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[35, 0, 12]} receiveShadow>
            <planeGeometry args={[8, 30]} />
            <meshStandardMaterial color="#475569" roughness={0.9} />
          </mesh>
        </>
      )}

      {/* 3. White Pedestrian Crosswalks */}
      {visibilitySettings.decorations && (
        <>
          {[...Array(6)].map((_, i) => (
            <mesh key={`cw1-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-35 + i * 1.2 - 3, 0.02, 22]}>
              <planeGeometry args={[0.5, 4]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          ))}
          {[...Array(6)].map((_, i) => (
            <mesh key={`cw2-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[35 + i * 1.2 - 3, 0.02, 2]}>
              <planeGeometry args={[0.5, 4]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          ))}
        </>
      )}

      {/* 4. Concrete Sidewalks & Courtyards */}
      {visibilitySettings.roads && (
        <>
          {/* Main Building Courtyard */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, -5]} receiveShadow>
            <planeGeometry args={[56, 18]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
          </mesh>
          {/* Fountain Circular Plaza */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 12]} receiveShadow>
            <circleGeometry args={[9, 32]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 7]} receiveShadow>
            <planeGeometry args={[4, 10]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
          </mesh>
        </>
      )}

      {/* 5. Trees (Instances) */}
      {visibilitySettings.trees && (
        <>
          <Instances range={40} material={new THREE.MeshStandardMaterial({ color: '#166534', roughness: 0.8 })} geometry={new THREE.SphereGeometry(1.5, 8, 8)}>
            {/* Main Road Trees */}
            {[-40, -30, -20, -10, 10, 20, 30, 40].map((x, i) => (
              <Instance key={`t1-${i}`} position={[x, 1.5, 27]} scale={[1, 1.5, 1]} />
            ))}
            {[-40, -30, -20, -10, 10, 20, 30, 40].map((x, i) => (
              <Instance key={`t2-${i}`} position={[x, 1.5, 17]} scale={[1, 1.5, 1]} />
            ))}
            {[-40, -30, -20, -10, 10, 20, 30, 40].map((x, i) => (
              <Instance key={`t3-${i}`} position={[x, 1.5, -2]} scale={[1, 1.5, 1]} />
            ))}
          </Instances>
          
          {/* Tree Trunks */}
          <Instances range={40} material={new THREE.MeshStandardMaterial({ color: '#451a03' })} geometry={new THREE.CylinderGeometry(0.2, 0.3, 2)}>
            {[-40, -30, -20, -10, 10, 20, 30, 40].map((x, i) => (
              <Instance key={`tr1-${i}`} position={[x, 1, 27]} />
            ))}
            {[-40, -30, -20, -10, 10, 20, 30, 40].map((x, i) => (
              <Instance key={`tr2-${i}`} position={[x, 1, 17]} />
            ))}
            {[-40, -30, -20, -10, 10, 20, 30, 40].map((x, i) => (
              <Instance key={`tr3-${i}`} position={[x, 1, -2]} />
            ))}
          </Instances>
        </>
      )}

      {/* 6. Fountain Block */}
      {visibilitySettings.decorations && (
        <group position={[0, 0.05, 12]}>
          <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
            <cylinderGeometry args={[5.5, 6, 0.8, 32]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
          <mesh position={[0, 0.85, 0]}>
            <cylinderGeometry args={[5, 5, 0.2, 32]} />
            <meshStandardMaterial color="#0ea5e9" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      )}

      {/* 7. Contact Shadows for grounding buildings */}
      <ContactShadows resolution={1024} scale={150} blur={2} opacity={0.6} far={20} color="#0f172a" />
    </>
  );
}

export default function Campus3D({ selectedBuilding, onSelectBuilding, activeRoute, isEmergency, onClearRoute, onAskAI }) {
  const { digitalTwin, toggleDigitalTwin, heatmapSpots } = useApp();
  // Derive local visibility aliases from shared context state
  const visibilitySettings = {
    labels: digitalTwin.showLabels,
    roads: digitalTwin.showRoads,
    trees: digitalTwin.showTrees,
    pois: digitalTwin.showPOIs,
    routes: digitalTwin.showRoutes,
    decorations: digitalTwin.showDecorations,
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [cameraMode, setCameraMode] = useState('perspective');
  const [activePanel, setActivePanel] = useState('flyTo');
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  // Route Planning State
  const [routeStart, setRouteStart] = useState('');
  const [routeEnd, setRouteEnd] = useState('');

  // POI State
  const [poiFilters, setPoiFilters] = useState({
    Library: true, Cafeteria: true, Labs: true, Hostel: true, Parking: true, Auditorium: true
  });

  // Bottom Floating Controls State
  const [activeBottomPanel, setActiveBottomPanel] = useState(null);
  
  // Show info panel when a building is selected
  useEffect(() => {
    if (selectedBuilding) {
      setShowInfoPanel(true);
    } else {
      setShowInfoPanel(false);
    }
  }, [selectedBuilding]);

  // --- Keyboard Shortcuts ---
  useEffect(() => {
    const handleKey = (e) => {
      // Don't fire when typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      switch (e.key.toLowerCase()) {
        case 'l': toggleDigitalTwin('showLabels'); break;
        case 'h': toggleDigitalTwin('showHeatmap'); break;
        case 'r': toggleDigitalTwin('showRoads'); break;
        case 't': toggleDigitalTwin('showTrees'); break;
        case 'p': toggleDigitalTwin('showPOIs'); break;
        case 'f': toggleDigitalTwin('isFull3DMode'); break;
        case 'escape': if (digitalTwin.isFull3DMode) toggleDigitalTwin('isFull3DMode'); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [toggleDigitalTwin, digitalTwin.isFull3DMode]);
  
  // --- Force R3F to re-measure Canvas after mount & mode changes ---
  // R3F measures the Canvas on first render. If the container was tab-switched 
  // into existence (previously un-rendered), WebGL may record 0×0 dimensions.
  // Dispatching resize forces R3F's internal ResizeObserver to re-query.
  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
    return () => cancelAnimationFrame(id);
  }, []);
  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
    return () => cancelAnimationFrame(id);
  }, [digitalTwin.isFull3DMode]);

  // Explicitly requested building refs
  const ifetMainBuildingRef = useRef();
  const kalamBlockRef = useRef();
  const visvesvarayaBlockRef = useRef();
  const centralLibraryRef = useRef();
  const fountainRef = useRef();
  const sportsRef = useRef();
  const foodCourtRef = useRef();
  const hostelRef = useRef();
  const auditoriumRef = useRef();

  // Restore the original mapping
  const buildingMap = useMemo(() => ({
    "MB-01": ifetMainBuildingRef,
    "AKB-02": kalamBlockRef,
    "MVB-03": visvesvarayaBlockRef,
    "LIB-04": centralLibraryRef,
    "PLZ-00": fountainRef,
    "SPT-05": sportsRef,
    "CAF-06": foodCourtRef,
    "HST-07": hostelRef,
    "AUD-08": auditoriumRef
  }), []);

  // Search Filter Handler
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredBuildings([]);
      setShowSearchDropdown(false);
    } else {
      const matches = BUILDINGS_DATA.filter(b =>
        b.name.toLowerCase().includes(query.toLowerCase()) ||
        b.shortName.toLowerCase().includes(query.toLowerCase()) ||
        b.keyLocations.some(k => k.toLowerCase().includes(query.toLowerCase())) ||
        b.departments.some(d => d.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredBuildings(matches);
      setShowSearchDropdown(true);
    }
  };

  const handleResetCamera = () => {
    setCameraMode('perspective');
    onSelectBuilding(null);
    setShowInfoPanel(false);
    if (onClearRoute) onClearRoute();
  };

  const handleToggleTopView = () => {
    if (cameraMode === 'perspective') {
      setCameraMode('top');
    } else {
      handleResetCamera();
    }
  };

  const startTour = (tourName) => {
    setActivePanel(null); // Close panel
    let buildingsToTour = BUILDINGS_DATA;
    
    if (tourName === 'Freshers Tour') {
      buildingsToTour = BUILDINGS_DATA.filter(b => ['main_building', 'kalam_block', 'hostel'].includes(b.id));
    } else if (tourName === 'Academic Tour') {
      buildingsToTour = BUILDINGS_DATA.filter(b => ['kalam_block', 'visvesvaraya_block', 'library'].includes(b.id));
    }
    
    let i = 0;
    const playNext = () => {
      if (i < buildingsToTour.length) {
        onSelectBuilding(buildingsToTour[i]);
        i++;
        setTimeout(playNext, 4500); // Wait 4.5 seconds at each building
      } else {
        setTimeout(handleResetCamera, 3000); // Reset at end
      }
    };
    playNext();
  };

  return (
    <div
      className="relative select-none font-sans"
      style={digitalTwin.isFull3DMode
        ? { position: 'fixed', inset: 0, zIndex: 50, width: '100vw', height: '100vh' }
        : { width: '100%', height: 'calc(100vh - 4rem)' }
      }
    >
      {/* 3D Canvas Mounting Container (R3F) — explicit pixel dims required by WebGL */}
      <div
        className="absolute inset-0 z-0"
        style={{ width: '100%', height: '100%' }}
      >
        <Canvas
          shadows
          camera={{ position: [0, 45, 80], fov: 45 }}
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <EnvironmentSetup visibilitySettings={visibilitySettings} />
          {/* Render Active Route */}
          {visibilitySettings.routes && <RouteBeam activeRoute={activeRoute} isEmergency={isEmergency} />}

          {/* Heatmap Overlay - reads from context */}
          <HeatmapOverlay spots={heatmapSpots} visible={digitalTwin.showHeatmap} />

          {/* Render Buildings */}
          {BUILDINGS_DATA.map((b) => {
            const badges = [];
            if (visibilitySettings.pois) {
              if (poiFilters.Library && b.id === 'central_library') badges.push('Library');
              if (poiFilters.Cafeteria && b.id === 'cafeteria') badges.push('Cafeteria');
              if (poiFilters.Hostel && b.id === 'hostels') badges.push('Hostel');
              if (poiFilters.Auditorium && b.id === 'auditorium') badges.push('Auditorium');
              if (poiFilters.Labs && b.keyLocations.some(l => l.toLowerCase().includes('lab'))) badges.push('Labs');
            }

            return (
              <ArchitecturalBuilding 
                key={b.id} 
                building={b} 
                isSelected={selectedBuilding?.id === b.id} 
                onClick={onSelectBuilding}
                buildingRef={buildingMap[b.blockCode]}
                poiBadges={badges}
                showLabels={visibilitySettings.labels}
              />
            );
          })}

          <CameraRig selectedBuilding={selectedBuilding} activeRoute={activeRoute} cameraMode={cameraMode} buildingMap={buildingMap} />
        </Canvas>
      </div>

      {/* ---------------- DIGITAL TWIN UI OVERLAYS ---------------- */}
      
      {/* Navigation Status Bar (Hidden by default, shown via CameraRig) */}
      <div 
        id="nav-status-bar" 
        className="absolute top-4 left-1/2 -translate-x-1/2 z-40 glass-editorial rounded-full px-6 py-3 shadow-editorial flex flex-col items-center transition-opacity duration-300 pointer-events-none"
        style={{ opacity: 0 }}
      >
        <div className="flex items-center space-x-3 mb-2">
          <Compass className="w-5 h-5 text-[var(--olive-primary)] animate-pulse" />
          <span className="text-[var(--text-primary)] text-sm font-bold tracking-widest uppercase">
            Navigating to Location...
          </span>
        </div>
        <div className="w-full h-1 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
          <div id="nav-progress-fill" className="h-full bg-[var(--olive-primary)] shadow-[0_0_8px_var(--olive-primary)]" style={{ width: '0%' }} />
        </div>
      </div>



      {/* Right Sidebar - Dynamic Panels */}
      {activePanel === 'flyTo' && (
        <div className="absolute top-12 right-20 z-30 w-72 max-h-[80vh] premium-card glow-effect flex flex-col rounded-2xl overflow-hidden animate-in slide-in-from-right fade-in duration-300 border border-[var(--border-color)]">
          {/* Header */}
          <div className="relative flex items-center justify-between bg-transparent text-[var(--text-primary)] px-5 py-4 font-bold text-sm tracking-widest border-b border-[var(--border-color)]">
            <div className="flex items-center space-x-3">
              <Send className="w-5 h-5 text-[var(--olive-primary)]" />
              <span className="text-[var(--text-primary)]">FLY TO</span>
            </div>
            <button onClick={() => setActivePanel(null)} className="hover:text-[var(--olive-primary)] hover:bg-[var(--bg-secondary)] p-1.5 rounded transition-colors text-[var(--text-secondary)]">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* List of Locations */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {/* Search Box */}
            <div className="relative mb-4 mt-2 group">
              <Search className="absolute left-3 top-3 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-[var(--olive-primary)] transition-colors" />
              <input
                type="text"
                placeholder="Search building, block or landmark..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full glass-editorial text-[var(--text-primary)] text-xs py-3 pl-9 pr-3 rounded-lg focus:outline-none focus:border-[var(--olive-primary)]/30 focus:shadow-editorial-hover placeholder:text-[var(--text-secondary)] transition-all cursor-text"
              />
            </div>

            {/* Dynamic Buildings List */}
            {(searchQuery ? filteredBuildings : BUILDINGS_DATA).map(b => (
              <button
                key={b.id}
                onClick={() => onSelectBuilding(b)}
                className="w-full text-left px-3 py-3 hover:bg-[var(--bg-secondary)] rounded-xl flex items-center space-x-4 transition-all group"
              >
                <div className="w-9 h-9 rounded-full glass-editorial text-[var(--olive-primary)] flex items-center justify-center shrink-0 group-hover:bg-[var(--olive-primary)] group-hover:text-[#FFFFFF] transition-all">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[var(--text-primary)] text-xs font-bold uppercase tracking-wider group-hover:text-[var(--olive-primary)] transition-colors">{b.name}</span>
                  {b.blockCode && <span className="text-[var(--text-secondary)] text-[10px] uppercase font-bold tracking-widest mt-0.5">{b.blockCode}</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activePanel === 'buildings' && (
        <div className="absolute top-12 right-20 z-30 w-72 max-h-[80vh] premium-card glow-effect flex flex-col rounded-2xl overflow-hidden animate-in slide-in-from-right fade-in duration-300 border border-[var(--border-color)]">
          <div className="relative flex items-center justify-between bg-transparent text-[var(--text-primary)] px-5 py-4 font-bold text-sm tracking-widest border-b border-[var(--border-color)]">
            <div className="flex items-center space-x-3">
              <Building2 className="w-5 h-5 text-[var(--olive-primary)]" />
              <span className="text-[var(--text-primary)]">BUILDINGS</span>
            </div>
            <button onClick={() => setActivePanel(null)} className="hover:text-[var(--olive-primary)] hover:bg-[var(--bg-secondary)] p-1.5 rounded transition-colors text-[var(--text-secondary)]"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {BUILDINGS_DATA.map(b => (
              <button key={`dir-${b.id}`} onClick={() => onSelectBuilding(b)} className="w-full text-left px-3 py-3 hover:bg-[var(--bg-secondary)] rounded-xl flex flex-col space-y-1 transition-all group border border-transparent hover:border-[var(--border-color)]">
                <span className="text-[var(--text-primary)] text-xs font-bold uppercase tracking-wider group-hover:text-[var(--olive-primary)] transition-colors">{b.name}</span>
                <span className="text-[var(--text-secondary)] text-[10px] uppercase font-bold tracking-widest">{b.blockCode || 'N/A'} • {b.floors} Floors</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {activePanel === 'poi' && (
        <div className="absolute top-12 right-20 z-30 w-72 max-h-[80vh] premium-card glow-effect flex flex-col rounded-2xl overflow-hidden animate-in slide-in-from-right fade-in duration-300 border border-[var(--border-color)]">
          <div className="relative flex items-center justify-between bg-transparent text-[var(--text-primary)] px-5 py-4 font-bold text-sm tracking-widest border-b border-[var(--border-color)]">
            <div className="flex items-center space-x-3">
              <Star className="w-5 h-5 text-[var(--olive-primary)]" />
              <span className="text-[var(--text-primary)]">POI FILTER</span>
            </div>
            <button onClick={() => setActivePanel(null)} className="hover:text-[var(--olive-primary)] hover:bg-[var(--bg-secondary)] p-1.5 rounded transition-colors text-[var(--text-secondary)]"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 p-4 space-y-3">
            {['Library', 'Cafeteria', 'Labs', 'Hostel', 'Parking', 'Auditorium'].map(cat => (
              <label key={cat} className="flex items-center justify-between group cursor-pointer p-2 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors border border-transparent hover:border-[var(--border-color)]">
                <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider group-hover:text-[var(--olive-primary)] transition-colors">{cat}</span>
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded text-[var(--olive-primary)] focus:ring-[var(--olive-primary)] border-[var(--border-color)]" 
                  checked={poiFilters[cat]} 
                  onChange={() => setPoiFilters({...poiFilters, [cat]: !poiFilters[cat]})} 
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {activePanel === 'routes' && (
        <div className="absolute top-12 right-20 z-30 w-80 max-h-[80vh] premium-card glow-effect flex flex-col rounded-2xl overflow-hidden animate-in slide-in-from-right fade-in duration-300 border border-[var(--border-color)]">
          <div className="relative flex items-center justify-between bg-transparent text-[var(--text-primary)] px-5 py-4 font-bold text-sm tracking-widest border-b border-[var(--border-color)]">
            <div className="flex items-center space-x-3">
              <Map className="w-5 h-5 text-[var(--olive-primary)]" />
              <span className="text-[var(--text-primary)]">ROUTE PLANNER</span>
            </div>
            <button onClick={() => setActivePanel(null)} className="hover:text-[var(--olive-primary)] hover:bg-[var(--bg-secondary)] p-1.5 rounded transition-colors text-[var(--text-secondary)]"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 p-5 space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Select From</label>
              <select value={routeStart} onChange={(e) => setRouteStart(e.target.value)} className="w-full glass-editorial text-[var(--text-primary)] text-xs py-3 px-3 rounded-lg focus:outline-none focus:border-[var(--olive-primary)]/30 border border-[var(--border-color)] appearance-none cursor-pointer">
                <option value="">Current Location (Fountain)</option>
                {BUILDINGS_DATA.map(b => <option key={`from-${b.id}`} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Select To</label>
              <select value={routeEnd} onChange={(e) => setRouteEnd(e.target.value)} className="w-full glass-editorial text-[var(--text-primary)] text-xs py-3 px-3 rounded-lg focus:outline-none focus:border-[var(--olive-primary)]/30 border border-[var(--border-color)] appearance-none cursor-pointer">
                <option value="">Select Destination...</option>
                {BUILDINGS_DATA.map(b => <option key={`to-${b.id}`} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <button 
              disabled={!routeEnd}
              onClick={() => {
                if (routeEnd) {
                  // Re-use handleTriggerRoute logic
                  const dest = BUILDINGS_DATA.find(b => b.id === routeEnd);
                  onClearRoute(); // Clear existing route
                  setTimeout(() => {
                    document.getElementById('nav-status-bar').style.opacity = '1';
                    document.getElementById('nav-progress-fill').style.width = '100%';
                    document.getElementById('nav-status-bar').querySelector('span').innerText = 'Navigating Route...';
                    onSelectBuilding(dest);
                  }, 100);
                  setActivePanel(null);
                }
              }}
              className={`w-full py-3 mt-2 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-editorial ${routeEnd ? 'bg-[var(--olive-primary)] hover:bg-[var(--olive-hover)]' : 'bg-[var(--border-color)] text-[var(--text-secondary)] cursor-not-allowed'}`}
            >
              Find Route
            </button>
          </div>
        </div>
      )}

      {activePanel === 'tours' && (
        <div className="absolute top-12 right-20 z-30 w-72 max-h-[80vh] premium-card glow-effect flex flex-col rounded-2xl overflow-hidden animate-in slide-in-from-right fade-in duration-300 border border-[var(--border-color)]">
          <div className="relative flex items-center justify-between bg-transparent text-[var(--text-primary)] px-5 py-4 font-bold text-sm tracking-widest border-b border-[var(--border-color)]">
            <div className="flex items-center space-x-3">
              <Play className="w-5 h-5 text-[var(--olive-primary)]" />
              <span className="text-[var(--text-primary)]">CAMPUS TOURS</span>
            </div>
            <button onClick={() => setActivePanel(null)} className="hover:text-[var(--olive-primary)] hover:bg-[var(--bg-secondary)] p-1.5 rounded transition-colors text-[var(--text-secondary)]"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 p-3 space-y-2 custom-scrollbar overflow-y-auto">
            {['Main Building Tour', 'Freshers Tour', 'Academic Tour', 'Placement Tour', 'Sports Tour'].map(tour => (
              <button key={tour} onClick={() => startTour(tour)} className="w-full text-left px-4 py-4 hover:bg-[var(--bg-secondary)] rounded-xl flex items-center justify-between transition-all group border border-transparent hover:border-[var(--border-color)]">
                <span className="text-[var(--text-primary)] text-xs font-bold uppercase tracking-wider group-hover:text-[var(--olive-primary)] transition-colors">{tour}</span>
                <Play className="w-4 h-4 text-[var(--olive-primary)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Right Vertical Toolbar */}
      <div className="absolute top-28 right-4 z-20 flex flex-col space-y-4">
        <div className="flex flex-col items-center group cursor-pointer" onClick={handleResetCamera}>
          <div className="w-12 h-12 glass-editorial rounded-full flex items-center justify-center shadow-editorial hover:bg-[var(--olive-primary)] hover:text-[#FFFFFF] text-[var(--olive-primary)] transition-all group-hover:-translate-y-0.5">
            <Home className="w-5 h-5" />
          </div>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-primary)] glass-editorial px-2 py-0.5 rounded shadow-editorial opacity-0 group-hover:opacity-100 transition-opacity">Home View</span>
        </div>
        <div className="flex flex-col items-center group cursor-pointer" onClick={() => setActivePanel(activePanel === 'flyTo' ? null : 'flyTo')}>
          <div className={`w-12 h-12 ${activePanel === 'flyTo' ? 'bg-[var(--olive-primary)] text-[#FFFFFF]' : 'glass-editorial text-[var(--olive-primary)]'} rounded-full flex items-center justify-center shadow-editorial transition-all group-hover:-translate-y-0.5 hover:bg-[var(--olive-primary)] hover:text-white`}>
            <Send className="w-5 h-5" />
          </div>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-primary)] glass-editorial px-2 py-0.5 rounded shadow-editorial opacity-0 group-hover:opacity-100 transition-opacity">Fly To</span>
        </div>
        <div className="flex flex-col items-center group cursor-pointer" onClick={() => setActivePanel(activePanel === 'buildings' ? null : 'buildings')}>
          <div className={`w-12 h-12 ${activePanel === 'buildings' ? 'bg-[var(--olive-primary)] text-[#FFFFFF]' : 'glass-editorial text-[var(--olive-primary)]'} rounded-full flex items-center justify-center shadow-editorial transition-all group-hover:-translate-y-0.5 hover:bg-[var(--olive-primary)] hover:text-white`}>
            <Building2 className="w-5 h-5" />
          </div>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-primary)] glass-editorial px-2 py-0.5 rounded shadow-editorial opacity-0 group-hover:opacity-100 transition-opacity">Buildings</span>
        </div>
        <div className="flex flex-col items-center group cursor-pointer" onClick={() => setActivePanel(activePanel === 'poi' ? null : 'poi')}>
          <div className={`w-12 h-12 ${activePanel === 'poi' ? 'bg-[var(--olive-primary)] text-[#FFFFFF]' : 'glass-editorial text-[var(--olive-primary)]'} rounded-full flex items-center justify-center shadow-editorial transition-all group-hover:-translate-y-0.5 hover:bg-[var(--olive-primary)] hover:text-white`}>
            <Star className="w-5 h-5" />
          </div>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-primary)] glass-editorial px-2 py-0.5 rounded shadow-editorial opacity-0 group-hover:opacity-100 transition-opacity">POI</span>
        </div>
        <div className="flex flex-col items-center group cursor-pointer" onClick={() => setActivePanel(activePanel === 'routes' ? null : 'routes')}>
          <div className={`w-12 h-12 ${activePanel === 'routes' ? 'bg-[var(--olive-primary)] text-[#FFFFFF]' : 'glass-editorial text-[var(--olive-primary)]'} rounded-full flex items-center justify-center shadow-editorial transition-all group-hover:-translate-y-0.5 hover:bg-[var(--olive-primary)] hover:text-white`}>
            <Map className="w-5 h-5" />
          </div>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-primary)] glass-editorial px-2 py-0.5 rounded shadow-editorial opacity-0 group-hover:opacity-100 transition-opacity">Routes</span>
        </div>
        <div className="flex flex-col items-center group cursor-pointer" onClick={() => setActivePanel(activePanel === 'tours' ? null : 'tours')}>
          <div className={`w-12 h-12 ${activePanel === 'tours' ? 'bg-[var(--olive-primary)] text-[#FFFFFF]' : 'glass-editorial text-[var(--olive-primary)]'} rounded-full flex items-center justify-center shadow-editorial transition-all group-hover:-translate-y-0.5 hover:bg-[var(--olive-primary)] hover:text-white`}>
            <Play className="w-5 h-5" />
          </div>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-primary)] glass-editorial px-2 py-0.5 rounded shadow-editorial opacity-0 group-hover:opacity-100 transition-opacity">Tours</span>
        </div>
        <div className="flex flex-col items-center group cursor-pointer" onClick={() => toggleDigitalTwin('isFull3DMode')}>
          <div className={`w-12 h-12 ${digitalTwin.isFull3DMode ? 'bg-[var(--olive-primary)] text-[#FFFFFF]' : 'glass-editorial text-[var(--olive-primary)]'} rounded-full flex items-center justify-center shadow-editorial transition-all group-hover:-translate-y-0.5 hover:bg-[var(--olive-primary)] hover:text-white`}>
            <Maximize2 className="w-5 h-5" />
          </div>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-primary)] glass-editorial px-2 py-0.5 rounded shadow-editorial opacity-0 group-hover:opacity-100 transition-opacity">{digitalTwin.isFull3DMode ? 'Exit Full' : 'Full 3D'}</span>
        </div>
      </div>

      {/* Full 3D Mode Exit Banner */}
      {digitalTwin.isFull3DMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in duration-300">
          <button
            onClick={() => toggleDigitalTwin('isFull3DMode')}
            className="flex items-center gap-2 px-5 py-2.5 glass-editorial rounded-full border border-[var(--olive-primary)]/40 text-[var(--text-primary)] text-xs font-extrabold uppercase tracking-widest shadow-editorial hover:bg-[var(--olive-primary)] hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
            Exit Immersive Mode (Esc)
          </button>
        </div>
      )}


      {/* Bottom Floating Controls */}
      <div className="absolute bottom-[5rem] md:bottom-6 right-6 z-20 flex flex-col md:flex-row items-end md:items-center space-y-3 md:space-y-0 md:space-x-3">
        
        {/* Layer Visibility Panel */}
        {activeBottomPanel === 'layers' && (
          <div className="absolute bottom-full right-0 mb-4 md:mb-16 w-64 premium-card glow-effect rounded-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300 border border-[var(--border-color)]">
            <div className="relative flex items-center justify-between bg-transparent text-[var(--text-primary)] px-5 py-4 font-bold text-sm tracking-widest border-b border-[var(--border-color)]">
              <div className="flex items-center space-x-3">
                <Layers className="w-5 h-5 text-[var(--olive-primary)]" />
                <span>VISIBILITY</span>
              </div>
              <button onClick={() => setActiveBottomPanel(null)} className="hover:text-[var(--olive-primary)] transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4 space-y-3">
              {[
                { key: 'showLabels',      label: 'Labels' },
                { key: 'showHeatmap',     label: 'Heatmap' },
                { key: 'showRoads',       label: 'Roads' },
                { key: 'showTrees',       label: 'Trees' },
                { key: 'showPOIs',        label: 'POIs' },
                { key: 'showDecorations', label: 'Decorations' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center justify-between group cursor-pointer p-2 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors border border-transparent hover:border-[var(--border-color)]">
                  <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider group-hover:text-[var(--olive-primary)] transition-colors">
                    {label}
                  </span>
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded text-[var(--olive-primary)] focus:ring-[var(--olive-primary)] border-[var(--border-color)]" 
                    checked={digitalTwin[key]} 
                    onChange={() => toggleDigitalTwin(key)} 
                  />
                </label>
              ))}
            </div>
          </div>
        )}


        {/* AI Quick Actions Panel */}
        {activeBottomPanel === 'ai' && (
          <div className="absolute bottom-full right-0 md:right-16 mb-4 md:mb-16 w-64 premium-card glow-effect rounded-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300 border border-[var(--border-color)]">
            <div className="relative flex items-center justify-between bg-transparent text-[var(--text-primary)] px-5 py-4 font-bold text-sm tracking-widest border-b border-[var(--border-color)]">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-[var(--olive-primary)]" />
                <span>AI ASSIST</span>
              </div>
              <button onClick={() => setActiveBottomPanel(null)} className="hover:text-[var(--olive-primary)] transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-3 space-y-2">
              {[
                { label: 'Find Library', action: () => onSelectBuilding(BUILDINGS_DATA.find(b => b.id === 'central_library')) },
                { label: 'Find Hostel', action: () => onSelectBuilding(BUILDINGS_DATA.find(b => b.id === 'hostels')) },
                { label: "Show Today's Classes", action: () => onSelectBuilding(BUILDINGS_DATA.find(b => b.id === 'kalam_block')) }, // Demo target
                { label: 'Navigate to Cafeteria', action: () => {
                  onClearRoute();
                  setTimeout(() => {
                    document.getElementById('nav-status-bar').style.opacity = '1';
                    document.getElementById('nav-progress-fill').style.width = '100%';
                    document.getElementById('nav-status-bar').querySelector('span').innerText = 'Navigating Route...';
                    onSelectBuilding(BUILDINGS_DATA.find(b => b.id === 'cafeteria'));
                  }, 100);
                }},
                { label: 'Show Nearest Lab', action: () => onSelectBuilding(BUILDINGS_DATA.find(b => b.id === 'main_building')) }, // Demo target
                { label: 'Emergency Help', action: () => onSelectBuilding(BUILDINGS_DATA.find(b => b.id === 'main_building')) } // Demo target
              ].map((item, idx) => (
                <button 
                  key={idx}
                  onClick={() => { item.action(); setActiveBottomPanel(null); }}
                  className="w-full text-left px-4 py-3 hover:bg-[var(--bg-secondary)] rounded-xl text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider transition-colors hover:text-[var(--olive-primary)]"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* The 3 Floating Action Buttons */}
        <button 
          onClick={() => setActiveBottomPanel(activeBottomPanel === 'layers' ? null : 'layers')}
          className="p-4 glass-editorial hover:bg-[var(--olive-primary)] hover:text-[#FFFFFF] text-[var(--olive-primary)] transition-all rounded-full shadow-editorial group hover:-translate-y-0.5 focus:scale-95 duration-200"
        >
          <Layers className="w-6 h-6" />
        </button>
        
        <button 
          onClick={() => setActiveBottomPanel(activeBottomPanel === 'ai' ? null : 'ai')}
          className="p-4 glass-editorial hover:bg-[var(--olive-primary)] hover:text-[#FFFFFF] text-[var(--olive-primary)] transition-all rounded-full shadow-editorial group hover:-translate-y-0.5 focus:scale-95 duration-200"
        >
          <Sparkles className="w-6 h-6" />
        </button>
        
        <button 
          onClick={() => {
            handleResetCamera();
            setActiveBottomPanel(null);
          }}
          className="p-4 glass-editorial hover:bg-[var(--olive-primary)] hover:text-[#FFFFFF] text-[var(--olive-primary)] transition-all rounded-full shadow-editorial group hover:-translate-y-0.5 focus:scale-95 duration-200"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      {/* Selected Building Info Panel (Google Maps Style) */}
      {selectedBuilding && showInfoPanel && (
        <div className="absolute top-12 right-[4.5rem] z-40 w-[360px] max-h-[80vh] premium-card glow-effect rounded-2xl overflow-hidden animate-in slide-in-from-right fade-in duration-300 flex flex-col">
          <div className="relative h-52 shrink-0">
            <img src={selectedBuilding.image} alt={selectedBuilding.name} className="w-full h-full object-cover opacity-90 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-[var(--bg-card)] to-transparent" />
            <button onClick={() => setShowInfoPanel(false)} className="absolute top-4 left-4 p-2 glass-editorial hover:bg-[var(--bg-secondary)] text-[var(--olive-primary)] rounded-full transition-all shadow-editorial">
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-4 left-6 pr-4">
              {selectedBuilding.blockCode && (
                <div className="text-[var(--text-primary)] text-[10px] font-bold tracking-widest uppercase mb-2 glass-editorial inline-block px-2 py-1 rounded-md shadow-editorial">
                  {selectedBuilding.blockCode}
                </div>
              )}
              <h3 className="text-xl font-bold text-[var(--text-primary)] uppercase tracking-wider leading-tight">{selectedBuilding.name}</h3>
            </div>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col">
            <p className="mb-6 text-[var(--text-secondary)] text-sm leading-relaxed">{selectedBuilding.description}</p>
            
            <div className="mb-6">
              <h4 className="text-[var(--olive-primary)] text-xs font-bold uppercase tracking-widest mb-3 flex items-center"><MapPin className="w-4 h-4 mr-2" /> Key Locations</h4>
              <ul className="space-y-2">
                {selectedBuilding.keyLocations.map((loc, i) => (
                  <li key={i} className="text-[var(--text-primary)] text-xs flex items-center before:content-[''] before:w-1.5 before:h-1.5 before:bg-[var(--olive-primary)] before:rounded-full before:mr-3">{loc}</li>
                ))}
              </ul>
            </div>

            <div className="mt-auto pt-4 space-y-3">
              <button 
                onClick={() => onAskAI && onAskAI(selectedBuilding)}
                className="w-full flex items-center justify-center space-x-2 bg-[var(--olive-primary)] border-none text-white px-4 py-3 rounded-xl hover:bg-[var(--olive-hover)] hover:-translate-y-0.5 transition-all font-bold text-xs uppercase tracking-wider shadow-editorial group"
              >
                <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Ask CampusAI</span>
              </button>
              <button className="w-full flex items-center justify-center space-x-2 glass-editorial text-[var(--text-primary)] px-4 py-3 rounded-xl hover:bg-[var(--bg-secondary)] transition-all font-bold text-xs uppercase tracking-wider shadow-editorial group hover:-translate-y-0.5">
                <Navigation className="w-4 h-4 group-hover:text-[var(--olive-primary)]" />
                <span>Navigate Route</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
