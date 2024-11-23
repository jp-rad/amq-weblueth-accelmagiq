import * as THREE from 'three'
import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, ThreeElements, MeshProps } from '@react-three/fiber'
import { Euler, Quaternion, Vector3 } from 'three'

interface DemoMeshProps extends MeshProps {
    demo?: boolean;
}

function Box(props: DemoMeshProps /** ThreeElements['mesh'] */) {
    const ref = useRef<THREE.Mesh>(null!)
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    useFrame((_, delta) => {
        if (props.demo) {
            ref.current.rotation.z += delta;
        }
    })
    return (
        <mesh
            {...props}
            ref={ref}
            scale={hovered ? 1.5 : 1}
            onPointerOver={(event) => hover(true)}
            onPointerOut={(event) => hover(false)}>
            <boxGeometry args={[1.0, 1.5, 0.2]} />
            <meshBasicMaterial attach="material-0" color="pink" />
            <meshBasicMaterial attach="material-1" color="yellow" />
            <meshBasicMaterial attach="material-2" color="red" />
            <meshBasicMaterial attach="material-3" color="darkgreen" />
            <meshBasicMaterial attach="material-4" color="darkblue" />
            <meshBasicMaterial attach="material-5" color="darkgray" />
        </mesh>
    )
}

interface ThreeFiberQuaternionProps {
    qw: number;
    qx: number;
    qy: number;
    qz: number;
    demo?: boolean;
}

export const ThreeFiberQuaternion = (props: ThreeFiberQuaternionProps) => {
    const quaternion = new Quaternion(props.qx, props.qy, props.qz, props.qw);
    const position = new Vector3(-3.0, 0.0, 0.0);
    const rotation = new Euler(-Math.atan2(position.x, position.z), 0.0, -Math.PI / 2, "ZYX");
    return (
        <div className='canvas-container'>
            <Canvas camera={{ position, rotation }}>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Box position={[0.0, 0.0, 0.0]} quaternion={quaternion} demo={props.demo} />
            </Canvas>
        </div>
    )
}
