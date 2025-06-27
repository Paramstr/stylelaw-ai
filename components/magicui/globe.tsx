"use client";

import createGlobe, { COBEOptions } from "cobe";
import { useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

const MOVEMENT_DAMPING = 1400;

// Available regions (bright emerald)
const availableMarkers: Array<{ location: [number, number]; size: number }> = [
  // Australia - Country outline coverage
  { location: [-33.8688, 151.2093], size: 0.08 }, // Sydney
  { location: [-37.8136, 144.9631], size: 0.08 }, // Melbourne  
  { location: [-27.4698, 153.0251], size: 0.08 }, // Brisbane
  { location: [-31.9505, 115.8605], size: 0.08 }, // Perth
  { location: [-34.9285, 138.6007], size: 0.06 }, // Adelaide
  { location: [-35.2809, 149.1300], size: 0.06 }, // Canberra
  { location: [-12.4634, 130.8456], size: 0.05 }, // Darwin
  { location: [-42.8821, 147.3272], size: 0.05 }, // Hobart
  { location: [-23.6980, 133.8807], size: 0.04 }, // Alice Springs
  { location: [-20.7256, 139.4927], size: 0.04 }, // Mount Isa
  { location: [-16.2186, 145.7781], size: 0.04 }, // Cairns
  
  // New Zealand - Country coverage
  { location: [-36.8485, 174.7633], size: 0.08 }, // Auckland
  { location: [-41.2924, 174.7787], size: 0.08 }, // Wellington
  { location: [-43.5321, 172.6362], size: 0.08 }, // Christchurch
  { location: [-45.8788, 170.5028], size: 0.06 }, // Dunedin
  { location: [-37.7870, 175.2793], size: 0.06 }, // Hamilton
  { location: [-39.0579, 174.0806], size: 0.05 }, // New Plymouth
  { location: [-46.4132, 168.3538], size: 0.05 }, // Invercargill
];

// Coming soon regions (dimmer gray) 
const comingSoonMarkers: Array<{ location: [number, number]; size: number }> = [
  // United States
  { location: [40.7128, -74.006], size: 0.03 }, // New York
  { location: [34.0522, -118.2437], size: 0.03 }, // Los Angeles
  { location: [41.8781, -87.6298], size: 0.03 }, // Chicago
  { location: [29.7604, -95.3698], size: 0.03 }, // Houston
  { location: [33.4484, -112.0740], size: 0.03 }, // Phoenix
  { location: [39.9526, -75.1652], size: 0.03 }, // Philadelphia
  { location: [32.7767, -96.7970], size: 0.03 }, // Dallas
  { location: [37.7749, -122.4194], size: 0.03 }, // San Francisco
  
  // Canada
  { location: [43.6532, -79.3832], size: 0.03 }, // Toronto
  { location: [49.2827, -123.1207], size: 0.03 }, // Vancouver
  { location: [45.5017, -73.5673], size: 0.03 }, // Montreal
  { location: [51.0447, -114.0719], size: 0.03 }, // Calgary
  { location: [53.5461, -113.4938], size: 0.03 }, // Edmonton
  
  // United Kingdom
  { location: [51.5074, -0.1278], size: 0.03 }, // London
  { location: [55.9533, -3.1883], size: 0.03 }, // Edinburgh
  { location: [53.4808, -2.2426], size: 0.03 }, // Manchester
  { location: [52.4862, -1.8904], size: 0.03 }, // Birmingham
  { location: [53.8008, -1.5491], size: 0.03 }, // Leeds
  
  // Asian Markets
  { location: [1.3521, 103.8198], size: 0.03 }, // Singapore
  { location: [22.3193, 114.1694], size: 0.03 }, // Hong Kong
  { location: [35.6762, 139.6503], size: 0.03 }, // Tokyo
  { location: [37.5665, 126.9780], size: 0.03 }, // Seoul
  { location: [31.2304, 121.4737], size: 0.03 }, // Shanghai
];

const GLOBE_CONFIG: COBEOptions = {
  width: 1200,
  height: 1200,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 1,
  diffuse: 0.8,
  mapSamples: 24000,
  mapBrightness: 3,
  baseColor: [0.3, 0.3, 0.3], // Greyish globe
  markerColor: [52 / 255, 211 / 255, 153 / 255], // Green dots
  glowColor: [0.5, 0.5, 0.5],
  markers: [...availableMarkers, ...comingSoonMarkers],
};

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string;
  config?: COBEOptions;
}) {
  let phi = 0;
  let width = 0;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  const r = useMotionValue(0);
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  });

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      r.set(r.get() + delta / MOVEMENT_DAMPING);
    }
  };

  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current!, {
      ...config,
      width: width * 2,
      height: width * 2,
      onRender: (state) => {
        if (!pointerInteracting.current) phi += 0.003;
        state.phi = phi + rs.get();
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    setTimeout(() => (canvasRef.current!.style.opacity = "1"), 0);
    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [rs, config]);

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[800px]",
        className,
      )}
    >
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]",
        )}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          updatePointerInteraction(e.clientX);
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  );
}
