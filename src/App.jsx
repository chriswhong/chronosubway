import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { FileDrop } from 'react-file-drop'
import cloneDeep from 'lodash/cloneDeep';

import { readDrop } from './readfile'
import './App.css'
import Map from './Map.jsx'

const dataHelpers = {
  mergeFeatures: (features, featureCollection, src) => {
    const FC = cloneDeep(featureCollection)
    function coerceNum(feature) {
      const props = feature.properties,
        keys = Object.keys(props),
        length = keys.length;

      for (let i = 0; i < length; i++) {
        const key = keys[i];
        const value = props[key];
        feature.properties[key] = losslessNumber(value);
      }

      return feature;
    }

    function losslessNumber(x) {
      const fl = parseFloat(x);
      if (fl.toString() === x) return fl;
      else return x;
    }

    FC.features = FC.features.concat(
      features.map(coerceNum)
    );

    return FC
  }
}



function App() {

  const [featureCollection, setFeatureCollection] = useState({
    type: 'FeatureCollection',
    features: []
  })

  console.log(featureCollection)

  return (
    <div className='flex App'>
      <div className='ui-container flex-grow flex'>
        <div className='flex-grow'>
          <Map />
        </div>
      </div>
    </div>
  )
}

export default App
