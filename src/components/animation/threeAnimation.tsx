import React, { useEffect, useRef, Suspense, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Html, useProgress } from "@react-three/drei";
import {
  Mesh,
  Texture,
  TextureLoader,
  Box3,
  Vector3,
  AnimationMixer,
  PCFSoftShadowMap,
  Group,
} from "three";
import { createClient } from "@supabase/supabase-js";

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface LaptopModelProps {
  modelUrl: string;
  scrollY: number;
}

function LaptopModel({ modelUrl, scrollY }: LaptopModelProps) {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(modelUrl);
  const mixer = useRef<AnimationMixer | null>(null);
  const [screenTexture, setScreenTexture] = useState<Texture | null>(null);
  const { size } = useThree();

  // Load screen texture
  useEffect(() => {
    const loader = new TextureLoader();
    loader.load("/models/screen.png", (tex) => {
      tex.flipY = false;
      setScreenTexture(tex);
    });
  }, []);

  const clipDuration = animations[0]?.duration ?? 0;
  const maxScroll = 600;

  useEffect(() => {
    if (!group.current || !screenTexture) return;

    const model = scene.clone(); // Prevent modifying original scene
    const box = new Box3().setFromObject(model);
    const sizeVec = box.getSize(new Vector3()).length();
    const center = box.getCenter(new Vector3());
    model.position.sub(center);
    model.position.y -= new Box3().setFromObject(model).min.y;

    // 💡 Responsive scale in percentage
    let scalePercentage = 100;

    if (size.width < 400) scalePercentage = 50;
    else if (size.width < 600) scalePercentage = 65;
    else if (size.width < 768) scalePercentage = 80;
    else if (size.width < 1024) scalePercentage = 90;
    else scalePercentage = 100;

    const baseScale = 9;
    const modelScale = (baseScale * scalePercentage) / 100;
    model.scale.setScalar(modelScale / sizeVec);

    // Optional: adjust vertical position slightly on small screens
    if (size.width < 600) {
      model.position.y += 0.5;
    }

    model.traverse((child) => {
      if (child instanceof Mesh) {
        const mats = Array.isArray(child.material)
          ? child.material
          : [child.material];
        mats.forEach((mat) => {
          if (mat.name === "Screen") {
            mat.emissiveMap = screenTexture;
            mat.emissiveIntensity = 0.4;
            mat.needsUpdate = true;
          }
        });
      }
    });

    group.current.clear(); // clear previous model if re-adding
    group.current.add(model);

    // Animation
    mixer.current = new AnimationMixer(model);
    const action = mixer.current.clipAction(animations[0]);
    action.reset().play();
    mixer.current.setTime(clipDuration - 1 / 24);
  }, [scene, animations, screenTexture, clipDuration, size.width]);

  useFrame((_, delta) => {
    if (!mixer.current) return;
    const t = Math.min(1, Math.max(0, scrollY / maxScroll));
    const eased = 1 - (1 - t) ** 2;
    const newTime = (1 - eased) * (clipDuration - 1 / 24);
    mixer.current.setTime(newTime);
    mixer.current.update(delta);
  });

  return (
    <group ref={group} position={[0, 0, 0]} rotation={[0, -Math.PI / 6, 0]} />
  );
}

// Loader that lives inside the Canvas
function CanvasLoader() {
  return <Html />;
}

export default function ThreeAnimation() {
  const [scrollY, setScrollY] = useState<number>(0);
  const [modelUrl, setModelUrl] = useState<string | null>(null);

  // Fetch the GLB public URL on mount
  useEffect(() => {
    const { data } = supabase.storage.from("models").getPublicUrl("laptop.glb");
    setModelUrl(data.publicUrl);
  }, []);

  // Track scroll
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!modelUrl) return <div>Loading model…</div>;

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0.4, 4.2, 6.7], fov: 70 }}
        dpr={Math.min(window.devicePixelRatio, 2)}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        onCreated={({ gl }) => {
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
        {[0, 2, 4].map((i) => {
          const angle = (i * Math.PI * 2) / 3;
          return (
            <spotLight
              key={i}
              position={[4 * Math.cos(angle), 3, 4 * Math.sin(angle)]}
              intensity={5}
              angle={Math.PI / 6}
              penumbra={0.2}
              decay={2}
              distance={10}
              target-position={[0, 0, 0]}
              castShadow
              shadow-mapSize-width={512}
              shadow-mapSize-height={512}
              shadow-bias={-0.001}
              shadow-camera-near={1}
              shadow-camera-far={20}
            />
          );
        })}
        <Suspense fallback={<CanvasLoader />}>
          <LaptopModel modelUrl={modelUrl} scrollY={scrollY} />
        </Suspense>
      </Canvas>
    </>
  );
}
