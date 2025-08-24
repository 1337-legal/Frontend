import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';

import { Canvas, useFrame } from '@react-three/fiber';

import type { RootState } from '@react-three/fiber';

const GlowSphere: React.FC = () => {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((state: RootState) => {
        const t = state.clock.getElapsedTime();
        if (ref.current) {
            ref.current.rotation.y = t * 0.12;
            ref.current.rotation.x = Math.sin(t * 0.3) * 0.2;
            const s = 1.6 + Math.sin(t * 0.9) * 0.05;
            ref.current.scale.setScalar(s);
        }
    });
    return (
        <mesh ref={ref}>
            <icosahedronGeometry args={[1.4, 3]} />
            <meshPhongMaterial
                color={'#ffb366'}
                emissive={'#ff9d42'}
                emissiveIntensity={0.55}
                wireframe
                opacity={0.35}
                transparent
            />
        </mesh>
    );
};

const Ribbons: React.FC = () => {
    const group = useRef<THREE.Group>(null);
    const lines = useMemo(() => {
        const arr: { points: THREE.Vector3[]; color: THREE.Color }[] = [];
        for (let i = 0; i < 6; i++) {
            const pts: THREE.Vector3[] = [];
            const radius = 2 + i * 0.25;
            for (let a = 0; a <= Math.PI * 2; a += 0.25) {
                const y = Math.sin(a * 2 + i) * 0.25;
                pts.push(new THREE.Vector3(Math.cos(a) * radius, y, Math.sin(a) * radius));
            }
            const c = new THREE.Color().setHSL(0.07 + i * 0.015, 0.9, 0.55);
            arr.push({ points: pts, color: c });
        }
        return arr;
    }, []);
    useFrame((state: RootState) => {
        if (group.current) group.current.rotation.y = state.clock.getElapsedTime() * 0.06;
    });
    return (
        <group ref={group}>
            {lines.map((l, i) => (
                <line key={i}>
                    <bufferGeometry attach="geometry" attributes={{}}>
                        <bufferAttribute attach="attributes-position" args={[new Float32Array(l.points.flatMap(p => [p.x, p.y, p.z])), 3]} />
                    </bufferGeometry>
                    <lineBasicMaterial color={l.color} transparent opacity={0.35 - i * 0.03} />
                </line>
            ))}
        </group>
    );
};

const Dust: React.FC = () => {
    const ref = useRef<THREE.Points>(null);
    const { positions, colors } = useMemo(() => {
        const count = 1600;
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 4.5 * Math.pow(Math.random(), 0.6);
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            pos.set([x, y, z], i * 3);
            const c = new THREE.Color().setHSL(0.06 + Math.random() * 0.05, 0.85, 0.55 + Math.random() * 0.25);
            col.set([c.r, c.g, c.b], i * 3);
        }
        return { positions: pos, colors: col };
    }, []);
    useFrame((state: RootState) => { if (ref.current) ref.current.rotation.y = state.clock.getElapsedTime() * 0.02; });
    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.024} vertexColors transparent opacity={0.75} depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
    );
};

export const AuthNebulaScene: React.FC = () => (
    <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}>
        <color attach="background" args={[0, 0, 0]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 6, 8]} intensity={1.1} color={'#ffb26b'} />
        <directionalLight position={[-6, -4, -8]} intensity={0.45} color={'#ff8c3b'} />
        <Dust />
        <Ribbons />
        <GlowSphere />
    </Canvas>
);

export default AuthNebulaScene;