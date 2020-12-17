const DEVICE_CAMPUS_ID = '86ab65';
const COMMON_TEMPLATE_ID = '4';

const lay = [
  {
    w: 8,
    h: 8,
    x: 0,
    y: 0,
    i: `9/9e3e8451-36da-410e-a925-f84df631c679`,
    minW: 4,
    minH: 6,
    moved: false,
    static: true,
  },
  {
    w: 4,
    h: 8,
    x: 4,
    y: 8,
    i: '7/idtable1consumo',
    minW: 4,
    minH: 6,
    moved: false,
    static: true,
  },
  {
    w: 4,
    h: 8,
    x: 0,
    y: 8,
    i: '7/idtable2demanda',
    minW: 3,
    minH: 6,
    moved: false,
    static: true,
  },

  {
    w: 4,
    h: 10,
    x: 8,
    y: 6,
    i: '7/idtable4excedente',
    minW: 3,
    minH: 6,
    moved: false,
    static: true,
  },
  {
    w: 4,
    h: 6,
    x: 8,
    y: 0,
    i: '10/idsum1',
    minW: 3,
    minH: 6,
    moved: false,
    static: true,
  },
];

const sgs = {
  '9/9e3e8451-36da-410e-a925-f84df631c679': {
    query:
      '\nquery getDeviceHistory($filter: HistoryInput!) {\n  getDeviceHistoryForDashboard(filter: $filter)\n}\n',
    variables: `{"filter":{"devices":[], "templates":[{"templateID":"${COMMON_TEMPLATE_ID}","attrs":["energyConsumption"], "staticAttrs":["point"]}],"dateFrom":"","dateTo":"","operationType":6,"lastN":1}}`,
    isRealTime: true,
  },
  '7/idtable1consumo': {
    query:
      '\nquery getDeviceHistory($filter: HistoryInput!) {\n  getDeviceHistoryForDashboard(filter: $filter)\n}\n',
    variables: `{"filter":{"devices":[],"templates":[{"templateID":"${COMMON_TEMPLATE_ID}","attrs":["energyConsumption"]}],"dateFrom":"","dateTo":"","operationType":7,"lastN":1}}`,
    isRealTime: true,
  },

  '7/idtable2demanda': {
    query:
      '\nquery getDeviceHistory($filter: HistoryInput!) {\n  getDeviceHistoryForDashboard(filter: $filter)\n}\n',
    variables: `{"filter":{"devices":[],"templates":[{"templateID":"${COMMON_TEMPLATE_ID}","attrs":["maxPowerDemandRushTime","maxPowerDemandNormalTime"]}],"dateFrom":"","dateTo":"","operationType":7,"lastN":1}}`,
    isRealTime: true,
  },

  '7/idtable4excedente': {
    query:
      '\nquery getDeviceHistory($filter: HistoryInput!) {\n  getDeviceHistoryForDashboard(filter: $filter)\n}\n',
    variables: `{"filter":{"devices":[],"templates":[{"templateID":"${COMMON_TEMPLATE_ID}","attrs":["surplusReactivePower"]}],"dateFrom":"","dateTo":"","operationType":7,"lastN":1}}`,
    isRealTime: true,
  },

  '10/idsum1': {
    query:
      '\nquery getDeviceHistory($filter: HistoryInput!) {\n  getDeviceHistoryForDashboard(filter: $filter)\n}\n',
    variables: `{"filter":{"devices":[ {"deviceID":"${DEVICE_CAMPUS_ID}","attrs":["sumEnergyConsumption","sumSurplusReactivePower","maxCampusPowerDemandRushTime","maxCampusPowerDemandNormalTime"]}],"dateFrom":"","dateTo":"","operationType":0,"lastN":1}}`,
    isRealTime: true,
  },
};

const conf = {
  '9/9e3e8451-36da-410e-a925-f84df631c679': {
    map: {},
    meta: {
      title: 'Medidores',
      subTitle: '',
    },
  },
  '7/idtable1consumo': {
    meta: {
      title: 'Consumo de Energia',
      subTitle: 'Atualizado em:',
      removeTimestamp: true,
      withRank: true,
      chart: 'energyConsumption',
    },
    table: [
      {
        dataKey: 'name',
        name: 'Nome',
      },
      {
        dataKey: 'energyConsumption',
        name: 'Energia (kWh)',
      },
    ],
  },
  '7/idtable2demanda': {
    meta: {
      title: 'Demanda de Potência',
      subTitle: 'Última Atualização: ',
      removeTimestamp: true,
      withRank: true,
      chart: 'PowerDemand',
    },
    table: [
      {
        dataKey: 'name',
        name: 'Nome',
      },
      {
        dataKey: 'maxPowerDemandRushTime',
        name: 'Ponta (kW)',
      },
      {
        dataKey: 'maxPowerDemandNormalTime',
        name: 'Fora Ponta (kW)',
      },
    ],
  },
  '7/idtable4excedente': {
    meta: {
      title: 'Excedente de Reativos',
      subTitle: 'Última Atualização: ',
      removeTimestamp: true,
      withRank: true,
      chart: 'surplusReactivePower',
    },
    table: [
      {
        dataKey: 'name',
        name: 'Nome',
      },
      {
        dataKey: 'surplusReactivePower',
        name: 'Excedente (kVArh)',
      },
    ],
  },
  '10/idsum1': {
    meta: {
      title: 'Resumo do Mês',
      subTitle: '',
    },
    fields: [
      {
        dataKey: `${DEVICE_CAMPUS_ID}sumSurplusReactivePower`,
        name: 'Excedente (kVArh)',
        color: '#E85D97',
      },
      {
        dataKey: `${DEVICE_CAMPUS_ID}sumEnergyConsumption`,
        name: 'Energia (mWh)',
        color: '#1863C3',
      },
      {
        dataKey: `${DEVICE_CAMPUS_ID}maxCampusPowerDemandRushTime`,
        name: 'Demanda - Ponta (mW)',
        color: '#23986E',
      },
      {
        dataKey: `${DEVICE_CAMPUS_ID}maxCampusPowerDemandNormalTime`,
        name: 'Demanda - Fora Ponta (mW)',
        color: '#23986E',
      },
    ],
  },
};

export { lay, conf, sgs };
