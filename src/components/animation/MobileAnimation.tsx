import React, { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  Mesh,
  Texture,
  TextureLoader,
  Box3,
  Vector3,
  Group,
  PCFSoftShadowMap,
  Material,
} from "three";
import { getModelUrl } from "@/lib/client/actions";

interface MobileModelProps {
  modelUrl: string;
}

const MobileModel: React.FC<MobileModelProps> = ({ modelUrl }) => {
  const group = useRef<Group>(null);
  const { scene } = useGLTF(modelUrl);
  const { size } = useThree();
  const [screenTex, setScreenTex] = useState<Texture | null>(null);

  useEffect(() => {
    const loader = new TextureLoader();
    loader.load("/models/mobile-screen.png", (tex) => {
      tex.flipY = false;
      tex.center.set(0.5, 0.5);
      tex.rotation = Math.PI / -2;
      setScreenTex(tex);
    });
  }, []);

  useEffect(() => {
    if (!group.current || !screenTex) return;

    const model = scene.clone();
    model.position.set(0, 0, 0);
    model.rotation.set(0, 0, 0);
    model.scale.set(1, 1, 1);

    // Telefonen kigger lige ud med en lille skævhed for dynamik
    model.rotation.set(-0.08, Math.PI + 0.15, 0.01);
    model.position.y += 0.22;
    model.position.z += 0.12;

    // Center model ved bunden
    const box = new Box3().setFromObject(model);
    const diag = box.getSize(new Vector3()).length();
    const center = box.getCenter(new Vector3());
    model.position.sub(center);
    model.position.y += -box.min.y;

    // Skaler efter viewport
    let pct = 100;
    if (size.width < 400) pct = 60;
    else if (size.width < 600) pct = 65;
    else if (size.width < 768) pct = 80;
    else if (size.width < 1024) pct = 90;
    model.scale.setScalar((10 * pct) / 100 / diag);

    // Justering for små skærme
    if (size.width < 600) model.position.y += 0.5;

    model.traverse((child) => {
      if (child instanceof Mesh) {
        const mats = Array.isArray(child.material)
          ? child.material
          : [child.material];
        mats.forEach((mat) => {
          // Brug det tomme navn til skærmen
          if (mat.name === "") {
            mat.map = screenTex;
            mat.emissiveMap = screenTex;
            mat.emissiveIntensity = 0.4;
            mat.needsUpdate = true;
          }
        });
      }
    });

    group.current.clear();
    group.current.add(model);
  }, [scene, screenTex, size.width]);

  return <group ref={group} position={[0, -1.2, 0]} />;
};

const MobileAnimation: React.FC = () => {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const url = await getModelUrl("mobile.glb");
        setModelUrl(url);
      } catch (err) {
        console.error("Failed to load model URL:", err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    const cb = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", cb);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener("change", cb);
  }, []);

  if (!modelUrl || isMobile) return null;

  return (
    <Canvas
      shadows
      camera={{ position: [0.4, 4.2, 6.7], fov: 70 }}
      dpr={Math.min(window.devicePixelRatio, 2)}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = PCFSoftShadowMap;
      }}
    >
      <ambientLight intensity={1} />
      <directionalLight
        intensity={5}
        position={[5, 15, 7.5]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0005}
        shadow-normalBias={0.05}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <React.Suspense fallback={null}>
        <MobileModel modelUrl={modelUrl} />
      </React.Suspense>
    </Canvas>
  );
};

export default MobileAnimation;
