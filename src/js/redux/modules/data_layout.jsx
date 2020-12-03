const lay = [
  {
    w: 4,
    h: 8,
    x: 4,
    y: 0,
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
    h: 8,
    x: 4,
    y: 8,
    i: '7/idtable3geracao',
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
    i: '8/idsum1',
    minW: 3,
    minH: 6,
    moved: false,
    static: true,
  },
];

const sgs = {
  '7/idtable1consumo': {
    query:
      '\nquery getDeviceHistory($filter: HistoryInput!) {\n  getDeviceHistoryForDashboard(filter: $filter)\n}\n',
    variables:
      '{"filter":{"devices":[ {"deviceID":"cbc62d","attrs":["energyConsumption"]}, {"deviceID":"edd9c6","attrs":["energyConsumption"]}],"dateFrom":"","dateTo":"","operationType":0,"lastN":1}}',
    isRealTime: false,
  },

  '7/idtable2demanda': {
    query:
      '\nquery getDeviceHistory($filter: HistoryInput!) {\n  getDeviceHistoryForDashboard(filter: $filter)\n}\n',
    variables:
      '{"filter":{"devices":[ {"deviceID":"cbc62d","attrs":["maxPowerDemandRushTime","maxPowerDemandNormalTime"]}, {"deviceID":"edd9c6","attrs":["maxPowerDemandRushTime","maxPowerDemandNormalTime"]}],"dateFrom":"","dateTo":"","operationType":0,"lastN":1}}',
    isRealTime: false,
  },

  '7/idtable3geracao': {
    query:
      '\nquery getDeviceHistory($filter: HistoryInput!) {\n  getDeviceHistoryForDashboard(filter: $filter)\n}\n',
    variables:
      '{"filter":{"devices":[ {"deviceID":"cbc62d","attrs":["energyConsumption"]}, {"deviceID":"edd9c6","attrs":["energyConsumption"]}],"dateFrom":"","dateTo":"","operationType":0,"lastN":1}}',
    isRealTime: false,
  },

  '7/idtable4excedente': {
    query:
      '\nquery getDeviceHistory($filter: HistoryInput!) {\n  getDeviceHistoryForDashboard(filter: $filter)\n}\n',
    variables:
      '{"filter":{"devices":[ {"deviceID":"cbc62d","attrs":["surplusReactivePower"]}, {"deviceID":"edd9c6","attrs":["surplusReactivePower"]}],"dateFrom":"","dateTo":"","operationType":0,"lastN":1}}',
    isRealTime: false,
  },

  '8/idsum1': {
    query:
      '\nquery getDeviceHistory($filter: HistoryInput!) {\n  getDeviceHistoryForDashboard(filter: $filter)\n}\n',
    variables:
      '{"filter":{"devices":[ {"deviceID":"42956d","attrs":["sumEnergyConsumption","sumSurplusReactivePower","maxCampusPowerDemandRushTime","maxCampusPowerDemandNormalTime"]}],"dateFrom":"","dateTo":"","operationType":0,"lastN":1}}',
    isRealTime: false,
  },
};

const conf = {
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
  '7/idtable3geracao': {
    meta: {
      title: 'Geração de Energia',
      subTitle: 'Última Atualização: ',
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
  '8/idsum1': {
    meta: {
      title: 'Resumo do Mês',
      subTitle: '',
    },
    fields: [
      {
        dataKey: '42956dsumSurplusReactivePower',
        name: 'Excedente (kVArh)',
        color: '#1863C3',
      },
      {
        dataKey: '42956dsumEnergyConsumption',
        name: 'Energia (kWh)',
        color: '#E85D97',
      },
      {
        dataKey: '42956dmaxCampusPowerDemandRushTime',
        name: 'Demanda - Ponta (kW)',
        color: '#23986E',
      },
      {
        dataKey: '42956dmaxCampusPowerDemandNormalTime',
        name: 'Demanda - Fora Ponta (kW)',
        color: '#23986E',
      },
    ],
  },
};

export { lay, conf, sgs };
