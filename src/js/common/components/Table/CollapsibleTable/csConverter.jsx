export const preManipulationForPowerDemand = (deviceData, rows) => {
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

  console.log(' newObj[deviceId][attr] ', newObj);
  newVet = Object.keys(newObj).map(id => {
    const normalTime = newObj[id].maxPowerDemandNormalTime
      ? newObj[id].maxPowerDemandNormalTime
      : '';
    const rushTime = newObj[id].maxPowerDemandRushTime
      ? newObj[id].maxPowerDemandRushTime
      : '';

    const pdrt = {
      ts: rushTime.ts ? rushTime.ts : 0,
      value: rushTime.value ? rushTime.value : '',
    };
    const pdnt = {
      ts: normalTime.ts ? normalTime.ts : 0,
      value: normalTime.value ? normalTime.value : '',
    };

    const line = {
      maxPowerDemandRushTime: pdrt,
      valuemaxPowerDemandRushTime: pdrt,
      maxPowerDemandNormalTime: pdnt,
      valuemaxPowerDemandNormalTime: pdnt,
      id,
      valuename: deviceData[id] ? deviceData[id].label : '',
      name: deviceData[id] ? deviceData[id].label : '',
    };
    return line;
  });
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
  return newVet;
};
