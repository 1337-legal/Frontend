import { useMemo, useRef } from 'react';

import { Canvas, useFrame } from '@react-three/fiber';

import type { Points } from 'three';

function ParticleCloud({ color = '#f59e0b' }: { color?: string }) {
    const ref = useRef<Points>(null!);
    const positions = useMemo(() => {
        const count = 600;
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            // random in sphere
            const r = Math.cbrt(Math.random()) * 1.8;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            arr[i * 3 + 0] = x;
            arr[i * 3 + 1] = y;
            arr[i * 3 + 2] = z;
        }
        return arr;
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (ref.current) {
            ref.current.rotation.x = Math.sin(t * 0.2) * 0.2;
            ref.current.rotation.y = t * 0.18;
        }
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                {/* @ts-expect-error - R3F attach string for BufferAttribute */}
                <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial color={color} size={0.035} sizeAttenuation depthWrite={false} transparent opacity={0.85} />
        </points>
    );
}

export default function ThreeCardOrb({ className }: { className?: string }) {
    return (
        <div className={className} aria-hidden="true">
            <Canvas dpr={[1, 1.75]} camera={{ fov: 45, position: [0, 0, 6] }} gl={{ antialias: true, alpha: true }}>
                <ambientLight intensity={0.8} />
                <fog attach="fog" args={['#050505', 6, 14]} />
                <group position={[0, 0, 0]}>
                    <ParticleCloud color="#ff9d57" />
                    {/* slight parallax layer */}
                    <group position={[0, 0, -0.8]}>
                        <ParticleCloud color="#ff6a00" />
                    </group>
                </group>
            </Canvas>
        </div>
    );
}
