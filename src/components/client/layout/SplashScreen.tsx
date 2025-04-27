"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@react-three/drei";

const SplashScreen = () => {
  const { progress } = useProgress();
  const [hideSplash, setHideSplash] = useState(false);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        setHideSplash(true);
      }, 300); // Vent 300ms efter progress = 100 før vi skjuler
      return () => clearTimeout(timeout);
    }
  }, [progress]);

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
};

export default SplashScreen;
