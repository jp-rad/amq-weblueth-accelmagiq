import React from 'react';
import { WbBoundCallback } from '@weblueth/statemachine';
import { WbxCustomEventCallback, WbxServiceProps, WbxServices } from '@weblueth/react';
import { Services } from './QuatEstimateContextProvider';
import { Quaternion, QuatEstimateService } from '../services/QuatEstimateService';

interface Props extends WbxServiceProps<QuatEstimateService> {
    onQuatEstimateChanged?: WbxCustomEventCallback<Quaternion>;
}

const quatEstimateChanged = 'quatEstimateChanged';

export function QuatEstimate(props: Props) {
    const onServicesBound: WbBoundCallback<Services> = bound => {
        const target = bound.target.quatEstimateService;
        if (target) {
            if (bound.binding) {
                if (props.onQuatEstimateChanged) {
                    target.addEventListener(quatEstimateChanged, props.onQuatEstimateChanged);
                }
            } else {
                if (props.onQuatEstimateChanged) {
                    target.removeEventListener(quatEstimateChanged, props.onQuatEstimateChanged);
                }
            }
            if (props.onServiceBound) {
                props.onServiceBound({ ...bound, target });
            }
        }
    };

    return (
        <WbxServices onServicesBound={onServicesBound} />
    );
}
