import React from 'react';
import { createServiceBuilder, DeviceInformationService } from '@weblueth/gattbuilder';
import { WbxContextProvider } from '@weblueth/react';
import { QuatEstimateService } from '../services/QuatEstimateService'

const requestQuatEstimator = async (bluetooth: Bluetooth): Promise<BluetoothDevice | undefined> => {
    return await bluetooth.requestDevice({
        filters: [{ namePrefix: 'BBC micro:bit'}],
        optionalServices: [QuatEstimateService.uuid, 'device_information']
    });
};

export type Services = {
    quatEstimateService?: QuatEstimateService;
    deviceInformationService?: DeviceInformationService
}

const retrieveServices = async (device: BluetoothDevice): Promise<Services> => {
    if (!device || !device.gatt) {
        return {};
    }

    if (!device.gatt.connected) {
        await device.gatt.connect();
    }
    const services = await device.gatt.getPrimaryServices();
    const builder = createServiceBuilder(services);
    const quatEstimateService = await builder.createService(QuatEstimateService);
    const deviceInformationService = await builder.createService(DeviceInformationService);
    return { quatEstimateService, deviceInformationService };
};

type Props = {
    children: any;
    bluetooth?: Bluetooth;
    connectionName?: string;
}

export function QuatEstimateContextProvider(props: Props) {
    const connectionName = props.connectionName ?? "QuatEstimator";
    return (
        <WbxContextProvider
            retrieveServices={retrieveServices} requestDevice={requestQuatEstimator}
            bluetooth={props.bluetooth} connectionName={connectionName}>
            {props.children}
        </WbxContextProvider>
    );
}
