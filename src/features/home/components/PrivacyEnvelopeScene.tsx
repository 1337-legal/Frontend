import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';

import { Canvas, useFrame } from '@react-three/fiber';

import type { RootState } from '@react-three/fiber';

const RotatingShell: React.FC = () => {
    const outerRef = useRef<THREE.Mesh>(null);
    const innerRef = useRef<THREE.Mesh>(null);
    useFrame((state: RootState) => {
        const t = state.clock.getElapsedTime();
        if (outerRef.current) {
            outerRef.current.rotation.x = t * 0.18;
            outerRef.current.rotation.y = t * 0.12;
        }
        if (innerRef.current) {
            innerRef.current.rotation.x = -t * 0.25;
            innerRef.current.rotation.y = t * 0.32;
            const s = 0.9 + Math.sin(t * 2.2) * 0.05;
            innerRef.current.scale.setScalar(s);
        }
    });
    return (
        <group>
            <mesh ref={outerRef}>
                <icosahedronGeometry args={[2.2, 2]} />
                <meshStandardMaterial color={new THREE.Color('#fb923c')} wireframe transparent opacity={0.35} />
            </mesh>
            <mesh ref={innerRef}>
                <icosahedronGeometry args={[1.2, 1]} />
                <meshPhysicalMaterial
                    color={new THREE.Color('#ffedd5')}
                    emissive={new THREE.Color('#ff9d42')}
                    emissiveIntensity={0.4}
                    roughness={0.15}
                    metalness={0.35}
                    clearcoat={1}
                    clearcoatRoughness={0.15}
                    transmission={0.6}
                    thickness={0.4}
                />
            </mesh>
        </group>
    );
};

const OrbitingBit: React.FC<{ radius: number; speed: number; size: number; offset: number }> = ({ radius, speed, size, offset }) => {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((state: RootState) => {
        const t = state.clock.getElapsedTime() * speed + offset;
        const y = Math.sin(t * 1.4) * 0.6;
        if (ref.current) {
            ref.current.position.set(Math.cos(t) * radius, y, Math.sin(t) * radius);
            ref.current.rotation.y = t * 2;
        }
    });
    return (
        <mesh ref={ref}>
            <octahedronGeometry args={[size, 0]} />
            <meshStandardMaterial color={'#ffd7a2'} emissive={'#ff9d42'} emissiveIntensity={1.2} roughness={0.4} />
        </mesh>
    );
};

const Particles: React.FC = () => {
    const ref = useRef<THREE.Points>(null);
    const { positions, colors } = useMemo(() => {
        const count = 1200;
        const pos = new Float32Array(count * 3);
        const cols = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 3.5 * Math.pow(Math.random(), 0.55);
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            pos.set([x, y, z], i * 3);
            const c = new THREE.Color().setHSL(0.08 + Math.random() * 0.05, 0.85, 0.55 + Math.random() * 0.2);
            cols.set([c.r, c.g, c.b], i * 3);
        }
        return { positions: pos, colors: cols };
    }, []);
    useFrame((state: RootState) => {
        if (ref.current) {
            ref.current.rotation.y = state.clock.getElapsedTime() * 0.04;
        }
    });
    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.025} vertexColors transparent opacity={0.85} depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
    );
};

const PulsingRings: React.FC = () => {
    const group = useRef<THREE.Group>(null);
    useFrame((state: RootState) => {
        const t = state.clock.getElapsedTime();
        if (group.current) group.current.rotation.y = t * 0.12;
    });
    return (
        <group ref={group}>
            {new Array(4).fill(0).map((_, i) => {
                const r = 1.4 + i * 0.5;
                return (
                    <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[r, 0.01 + i * 0.003, 16, 128]} />
                        <meshBasicMaterial color={'#fb923c'} transparent opacity={0.15 - i * 0.02} blending={THREE.AdditiveBlending} />
                    </mesh>
                );
            })}
        </group>
    );
};

export const PrivacyEnvelopeScene: React.FC = () => (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}>
        <color attach="background" args={[0, 0, 0]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 8]} intensity={1.2} color={'#ffb26b'} />
        <directionalLight position={[-5, -3, -6]} intensity={0.4} color={'#ff8c3b'} />
        <Particles />
        <PulsingRings />
        <RotatingShell />
        <OrbitingBit radius={2.9} speed={0.55} size={0.18} offset={0} />
        <OrbitingBit radius={2.2} speed={0.75} size={0.16} offset={Math.PI / 2} />
        <OrbitingBit radius={3.3} speed={0.42} size={0.22} offset={Math.PI / 3} />
    </Canvas>
);

export default PrivacyEnvelopeScene;
