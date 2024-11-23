import React, { useState } from 'react'
import { QuatEstimateContextProvider } from '../../src';
import QuatEstimateDevice from './components/QuatEstimateDevice';
import { ThreeFiberQuaternion } from './components/ThreeFiberQuaternion';

function App() {
  const [connected, setConnected] = useState(false);
  const [quaternion, setQuaternion] = useState({ x: 0.0, y: 0.0, z: 0.0, w: 1.0 })

  return (
    <div className="App">
      <QuatEstimateContextProvider connectionName='QuatEstimator' bluetooth={window.navigator.bluetooth}>
        <QuatEstimateDevice onConnected={setConnected} onQuaternionChanged={setQuaternion} />
      </QuatEstimateContextProvider>
      <ThreeFiberQuaternion
        demo={!connected}
        qw={quaternion.w}
        qx={quaternion.x} qy={quaternion.y} qz={quaternion.z} />
    </div>
  );
}

export default App;
