import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { Canvas, useFrame } from '@react-three/fiber';

import type { RootState } from '@react-three/fiber';

type SceneToggles = { compact?: boolean; reducedMotion?: boolean };

const Core: React.FC<SceneToggles> = ({ compact, reducedMotion }) => {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((s: RootState) => {
        const t = s.clock.getElapsedTime();
        if (ref.current) {
            const slow = reducedMotion ? 0.05 : 1;
            ref.current.rotation.y = t * 0.2 * slow;
            ref.current.rotation.x = Math.sin(t * 0.4 * slow) * 0.3;
            const scale = 1 + Math.sin(t * 1.6 * slow) * (compact ? 0.03 : 0.05);
            ref.current.scale.setScalar(scale);
        }
    });
    return (
        <mesh ref={ref}>
            <icosahedronGeometry args={[1.1, 2]} />
            <meshStandardMaterial color={'#ffb366'} emissive={'#ff962e'} emissiveIntensity={0.6} roughness={0.3} metalness={0.4} wireframe opacity={0.4} transparent />
        </mesh>
    );
};

const HaloRings: React.FC<SceneToggles> = ({ reducedMotion }) => {
    const group = useRef<THREE.Group>(null);
    useFrame((s: RootState) => { if (group.current) group.current.rotation.y = s.clock.getElapsedTime() * 0.05 * (reducedMotion ? 0.3 : 1); });
    return (
        <group ref={group}>
            {new Array(5).fill(0).map((_, i) => (
                <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[1.6 + i * 0.45, 0.012 + i * 0.004, 16, 128]} />
                    <meshBasicMaterial color={'#ff9d42'} transparent opacity={0.18 - i * 0.025} blending={THREE.AdditiveBlending} />
                </mesh>
            ))}
        </group>
    );
};

const Sparks: React.FC<SceneToggles> = ({ compact, reducedMotion }) => {
    const ref = useRef<THREE.Points>(null);
    const { positions, colors } = useMemo(() => {
        const count = reducedMotion ? 300 : compact ? 700 : 2000; // reduce on mobile / reduced motion
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 7 * Math.pow(Math.random(), 0.55); // extend radius
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            pos.set([x, y, z], i * 3);
            const c = new THREE.Color().setHSL(0.06 + Math.random() * 0.05, 0.85, 0.5 + Math.random() * 0.3);
            col.set([c.r, c.g, c.b], i * 3);
        }
        return { positions: pos, colors: col };
    }, [compact, reducedMotion]);
    useFrame((s: RootState) => { if (ref.current) ref.current.rotation.y = s.clock.getElapsedTime() * 0.02 * (reducedMotion ? 0.2 : 1); });
    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
            </bufferGeometry>
            <pointsMaterial size={compact ? 0.016 : 0.018} vertexColors transparent opacity={0.6} depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
    );
};

const Streaks: React.FC<SceneToggles> = ({ compact, reducedMotion }) => {
    const count = reducedMotion ? 12 : compact ? 18 : 48;
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const speeds = useMemo(() => Float32Array.from({ length: count }, () => 0.4 + Math.random() * (reducedMotion ? 0.3 : 0.8)), [count, reducedMotion]);
    const offsets = useMemo(() => Float32Array.from({ length: count }, () => Math.random() * 100), [count]);
    const dirs = useMemo(() => Int8Array.from({ length: count }, () => (Math.random() > 0.5 ? 1 : -1)), [count]);
    const heights = useMemo(() => Float32Array.from({ length: count }, () => -4 + Math.random() * 8), [count]);
    const amplitudes = useMemo(() => Float32Array.from({ length: count }, () => 1 + Math.random() * (reducedMotion ? 1.2 : 2.5)), [count, reducedMotion]);
    const hueShifts = useMemo(() => Float32Array.from({ length: count }, () => Math.random() * 0.04), [count]);
    const geo = useMemo(() => new THREE.CapsuleGeometry(0.04, 0.4, 4, 8), []);
    const material = useMemo(() => new THREE.MeshBasicMaterial({ transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.85 }), []);

    const dummy = useMemo(() => new THREE.Object3D(), []);
    const color = new THREE.Color();

    useFrame((s: RootState) => {
        const t = s.clock.getElapsedTime();
        if (!meshRef.current) return;
        for (let i = 0; i < count; i++) {
            const base = ((t * speeds[i]) + offsets[i]) % 1;
            const dir = dirs[i];
            const x = dir * (6 + Math.sin(base * Math.PI * 2) * 0.6);
            const z = -8 + base * 16;
            const y = heights[i] + Math.sin(base * Math.PI * 2 + i) * amplitudes[i];
            const len = (compact ? 0.5 : 0.6) + base * (compact ? 0.9 : 1.2);
            dummy.position.set(x, y, z);
            dummy.scale.set(0.05, len, 0.05);
            dummy.rotation.z = dir > 0 ? Math.PI * 0.5 : -Math.PI * 0.5;
            dummy.rotation.y = Math.sin(t * 0.2 + i) * (reducedMotion ? 0.2 : 0.4);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
            const intensity = 0.4 + 0.6 * Math.sin(base * Math.PI);
            color.setHSL(0.07 + hueShifts[i], 0.85, 0.5 + intensity * 0.25);
            meshRef.current.setColorAt(i, color);
        }
        meshRef.current.instanceColor!.needsUpdate = true;
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[geo, material, count]} />
    );
};

const AccountNebulaScene: React.FC<SceneToggles> = ({ compact }) => {
    const [reducedMotion, setReducedMotion] = useState(false);
    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return;
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const onChange = () => setReducedMotion(!!mq.matches);
        onChange();
        mq.addEventListener?.('change', onChange);
        return () => mq.removeEventListener?.('change', onChange);
    }, []);

    return (
        <Canvas gl={{ alpha: true, antialias: !compact }} camera={{ position: [0, 0, 8], fov: 58 }} dpr={[1, compact ? 1.4 : 2]}>
            <ambientLight intensity={0.55} />
            <directionalLight position={[6, 8, 10]} intensity={1.1} color={'#ffb26b'} />
            <directionalLight position={[-6, -4, -8]} intensity={0.35} color={'#ff8c3b'} />
            <Streaks compact={compact} reducedMotion={reducedMotion} />
            <Sparks compact={compact} reducedMotion={reducedMotion} />
            <HaloRings reducedMotion={reducedMotion} />
            <Core compact={compact} reducedMotion={reducedMotion} />
        </Canvas>
    );
};

export default AccountNebulaScene;