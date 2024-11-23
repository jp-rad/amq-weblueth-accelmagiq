import { TypedDispatcher, EventDispatcher, ServiceHelper } from "@weblueth/gattbuilder";


// UUID:
//      BASE = {b9db0000-cada-42b6-a36e-eda54d006627}
//   Service = {b9db3d01-cada-42b6-a36e-eda54d006627}
// Data Char = {b9db3d40-cada-42b6-a36e-eda54d006627}
const UUID_SERVICE = 'b9db3d01-cada-42b6-a36e-eda54d006627';
const UUID_CHAR_DATA = 'b9db3d40-cada-42b6-a36e-eda54d006627';

export type Quaternion = {
    w: number;
    x: number;
    y: number;
    z: number;
}

/**
 * @hidden
 */
export enum QuatEstimateCharacteristic {
    QuatEstimate = UUID_CHAR_DATA,
}

/**
 * Events raised by the QuatEstimate service
 */
export interface QuatEstimateEvents {
    /**
     * @hidden
     */
    newListener: keyof QuatEstimateEvents;
    /**
     * @hidden
     */
    removeListener: keyof QuatEstimateEvents;
    /**
     * QuatEstimate changed event
     */
    quatEstimateChanged: Quaternion;
}

const quatEstimateChanged = 'quatEstimateChanged';

/**
 * QuatEstimate Service
 */
export class QuatEstimateService extends (EventDispatcher as new () => TypedDispatcher<QuatEstimateEvents>) {

    /**
     * @hidden
     */
    public static uuid = UUID_SERVICE;
    /**
     * @hidden
     */
    public static async create(service: BluetoothRemoteGATTService): Promise<QuatEstimateService> {
        const bluetoothService = new QuatEstimateService(service);
        await bluetoothService.init();
        return bluetoothService;
    }

    private helper: ServiceHelper;

    /**
     * @hidden
     */
    constructor(service: BluetoothRemoteGATTService) {
        super();
        this.helper = new ServiceHelper(service, this as any);
    }

    private async init() {
        await this.helper.handleListener(
            quatEstimateChanged,
            QuatEstimateCharacteristic.QuatEstimate,
            this.QuatEstimateHandler.bind(this)
        );
    }

    /**
     * Event handler: QuatEstimate changed
     */
    private QuatEstimateHandler(event: Event) {
        const view = (event.target as BluetoothRemoteGATTCharacteristic).value!;
        this.dispatchEvent(quatEstimateChanged, parseQuatEstimateChanged(view));
    }

    /**
     * Read QuatEstimate
     */
    public async readQuatEstimate(): Promise<Quaternion> {
        const view = await this.helper.getCharacteristicValue(QuatEstimateCharacteristic.QuatEstimate);
        return parseQuatEstimateChanged(view);
    }

}

function parseQuatEstimateChanged(data: DataView) {
    return {
        w: data.getInt16(0, true) / 10000.0,
        x: data.getInt16(2, true) / 10000.0,
        y: data.getInt16(4, true) / 10000.0,
        z: data.getInt16(6, true) / 10000.0
    };
}
