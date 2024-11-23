import React, { useCallback, useState } from 'react';
import { WbBoundCallback } from '@weblueth/statemachine';
import { DeviceInformation } from '@weblueth/gattbuilder';
import { useWbxActor, WbxCustomEventCallback, WbxDevice, WbxServices } from '@weblueth/react';
import { Quaternion, QuatEstimate, QuatEstimateService, Services } from '../../../src';

const defaultName = "(none)";

interface QuatEstimateDeviceProps {
    onConnected?: (connected: boolean) => void;
    onQuaternionChanged?: (q: { x: number, y: number, z: number, w: number }) => void;
}

export default function QuatEstimateDevice(props: QuatEstimateDeviceProps) {
    /**
     * State machine (xstate)
     */
    const [state, send] = useWbxActor();
    const connectionName = state.context.conn.name;

    // xstate actions
    // const reset = () => send("RESET");
    const request = () => send("REQUEST");
    // const connect = () => send("CONNECT");
    const disconnect = () => send("DISCONNECT");

    // rejectedReason
    if (state.context.rejectedReason.type !== "NONE") {
        console.log("rejectedReason:", state.context.rejectedReason.message);
    }

    // disconnectedReason
    if (state.context.disconnectedReason.type !== "NONE") {
        console.log("disconnectedReason:", state.context.disconnectedReason.message);
    }

    /**
     * Device
     */
    const [name, setName] = useState<string>(defaultName);
    const onDeviceBound: WbBoundCallback<BluetoothDevice> = bound => {
        if (bound.binding) {
            setName(bound.target.name!);
        } else {
            setName(defaultName);
        }
    }

    /**
     * DeviceInformation service
     */
    const [deviceInfo, setDeviceInfo] = useState<DeviceInformation | undefined>();

    const onServicesBound: WbBoundCallback<Services> = async bound => {
        if (bound.binding) {
            console.log(bound.target);
            const info = await bound.target.deviceInformationService?.readDeviceInformation();
            console.log(info);
            setDeviceInfo(info)
        } else {
            setDeviceInfo(undefined);
        }
    };

    /**
     * QuatEstimate service
     */
    const [qw, setQw] = useState<number>(1.0);
    const [qx, setQx] = useState<number>(0.0);
    const [qy, setQy] = useState<number>(0.0);
    const [qz, setQz] = useState<number>(0.0);
    const onQuatEstimateBound: WbBoundCallback<QuatEstimateService> = async bound => {
        if (bound.binding) {
            // bound
            if (props.onConnected) {
                props.onConnected(true);
            }
        } else {
            // unbound
            if (props.onConnected) {
                props.onConnected(false);
            }
        }
    };
    const onQuatEstimateChanged: WbxCustomEventCallback<Quaternion> = async event => {
        const w = event.detail.w;
        const x = event.detail.x;
        const y = event.detail.y;
        const z = event.detail.z;
        setQw(w);
        setQx(x);
        setQy(y);
        setQz(z);
        if (props.onQuaternionChanged)
            props.onQuaternionChanged({ x, y, z, w })
    };

    return (
        <div className='quatestimate-device'>
            <WbxDevice onDeviceBound={onDeviceBound} />
            <WbxServices onServicesBound={onServicesBound} />
            <QuatEstimate onServiceBound={onQuatEstimateBound} onQuatEstimateChanged={onQuatEstimateChanged} />
            <a href='https://makecode.microbit.org/_8oMUYM32rRzd' rel='nofollow noopener' target='_blank'>Install AccelMagiQ-Demo for micro:bit.</a>
            <br />
            {connectionName + ": [" + state.toStrings() + "]"}
            <br />
            <button onClick={request}>CONNECT</button>
            <button onClick={disconnect}>DISCONNECT</button>
            <br />
            Name: {name}
            <br />
            Quat: {qw}, {qx}, {qy}, {qz}
        </div>
    );
}
