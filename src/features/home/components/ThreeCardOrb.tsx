import { useMemo, useRef } from 'react';

import { Canvas, useFrame, useThree } from '@react-three/fiber';

import type { Points } from 'three';

function ParticleCloud({ color = '#f59e0b' }: { color?: string }) {
    const ref = useRef<Points>(null!);
    const { width: vw, height: vh } = useThree((s) => s.viewport);

    const { positions, speeds } = useMemo(() => {
        const count = 1100;
        const pos = new Float32Array(count * 3);
        const spd = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * vw;
            const y = (Math.random() - 0.5) * vh;
            const z = (Math.random() - 0.5) * 0.8;
            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;
            spd[i] = 0.15 + Math.random() * 6;
        }
        return { positions: pos, speeds: spd };
    }, [vw, vh]);

    useFrame((_state, delta) => {
        const pts = ref.current;
        if (!pts) return;
        const attr = pts.geometry.attributes.position;
        const arr = attr.array as Float32Array;
        const halfW = vw / 2;
        for (let i = 0; i < speeds.length; i++) {
            const idx = i * 3;
            arr[idx] += speeds[i] * delta;
            if (arr[idx] > halfW) {
                arr[idx] = -halfW;
            }
        }
        attr.needsUpdate = true;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                {/* @ts-expect-error - R3F attach string for BufferAttribute */}
                <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial color={color} size={0.032} sizeAttenuation depthWrite={false} transparent opacity={0.85} />
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
                    <group position={[0, 0, -0.6]}>
                        <ParticleCloud color="#ff6a00" />
                    </group>
                </group>
            </Canvas>
        </div>
    );
}
