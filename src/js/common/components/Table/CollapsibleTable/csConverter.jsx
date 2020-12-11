export const preManipulationForPowerDemand = (deviceData, rows) => {
  console.log('-----------');
  console.log('maxPowerDemandNormalTime', rows);
  let newVet = [];
  const newObj = {};

  rows.forEach(vs => {
    const keyDevice = Object.keys(vs).reduce(key => {
      // console.log('key,valeu', key);
      return key !== 'timestamp' ? key : '';
    });
    const deviceId = keyDevice.substr(0, 6);
    const attr = keyDevice.substr(6);
    if (newObj[deviceId] === undefined) {
      newObj[deviceId] = {};
    }
    newObj[deviceId][attr] = vs[keyDevice];
  });

  newVet = Object.keys(newObj).map(id => {
    const line = {
      maxPowerDemandRushTime: newObj[id].maxPowerDemandRushTime,
      maxPowerDemandNormalTime: newObj[id].maxPowerDemandNormalTime,
      valuemaxPowerDemandRushTime: 0,
      valuemaxPowerDemandNormalTime: 0,
      id,
      valuename: deviceData[id] ? deviceData[id].label : '',
      name: deviceData[id] ? deviceData[id].label : '',
    };
    return line;
  });
  console.log('newVet', newVet);
  return newVet;
};

export const preManipulationForConsumption = (deviceData, rows) => {
  const currentChart = 'energyConsumption';
  console.log('energyConsumption', rows, deviceData);
  let newVet = [];
  newVet = rows.map(vs => {
    // console.log('vs', vs);
    const keyDevice = Object.keys(vs).reduce(key => {
      // console.log('key,valeu', key);
      return key !== 'timestamp' ? key : '';
    });
    //   console.log('keyDevice', keyDevice);
    const newObj = {};
    const deviceId = keyDevice.substr(0, 6);
    newObj.id = deviceId;
    newObj.name = deviceData[deviceId] ? deviceData[deviceId].label : '';
    newObj[currentChart] = vs[keyDevice];
    return newObj;
  });
  console.log('energyConsumption newVet', newVet);

  return newVet;
};

export const preManipulationForSurplus = (deviceData, rows) => {
  const currentChart = 'surplusReactivePower';
  console.log('surplusReactivePower', deviceData, rows);
  let newVet = [];
  newVet = rows.map(vs => {
    // console.log('vs', vs);
    const keyDevice = Object.keys(vs).reduce(key => {
      return key !== 'timestamp' ? key : '';
    });
    const newObj = {};
    const deviceId = keyDevice.substr(0, 6);
    newObj.id = deviceId;
    newObj.name = deviceData[deviceId] ? deviceData[deviceId].label : '';
    newObj[currentChart] = vs[keyDevice];
    return newObj;
  });
  console.log('surplusReactivePower newVet', newVet);
  return newVet;
};
