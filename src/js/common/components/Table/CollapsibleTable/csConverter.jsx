export const preManipulationForPowerDemand = (deviceData, rows) => {
  const newObj = {};
  rows.forEach(entry => {
    Object.keys(entry).forEach(key => {
      if (key !== 'timestamp') {
        const attributeLabel = key.includes('maxPowerDemandNormalTime')
          ? 'maxPowerDemandNormalTime'
          : 'maxPowerDemandRushTime';
        const deviceId = key.replace(attributeLabel, '');
        if (!newObj[deviceId]) {
          newObj[deviceId] = {};
        }
        newObj[deviceId][attributeLabel] = entry[key];
      }
    });
  });

  // console.log(' newObj[deviceId][attr] ', newObj);
  return Object.keys(newObj).map(id => {
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

    return {
      maxPowerDemandRushTime: pdrt,
      valuemaxPowerDemandRushTime: pdrt,
      maxPowerDemandNormalTime: pdnt,
      valuemaxPowerDemandNormalTime: pdnt,
      id,
      valuename: deviceData[id] ? deviceData[id].label : '',
      name: deviceData[id] ? deviceData[id].label : '',
    };
  });
};
