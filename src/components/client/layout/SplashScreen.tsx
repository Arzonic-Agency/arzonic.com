// components/SplashScreen.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@react-three/drei";

export default function SplashScreen() {
  const { progress } = useProgress();
  const [hideSplash, setHideSplash] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(max-width: 768px)");
      setIsMobile(mq.matches);
      const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
  }, []);

  useEffect(() => {
    if (isMobile) {
      setHideSplash(true);
    } else if (progress === 100) {
      const timeout = setTimeout(() => {
        setHideSplash(true);
      }, 300); // 300ms after load
      return () => clearTimeout(timeout);
    }
  }, [progress, isMobile]);

  return (
    <AnimatePresence>
      {!hideSplash && (
        <motion.div
          className="fixed inset-0 z-50 bg-base-100 flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.img
            src="/logo-arzonic.png"
            alt="Logo"
            className="w-32 h-32"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
