import { useCallback } from 'react';

import { v4 as uuidv4 } from 'uuid';

export default (addWidget, addWidgetConfig, addWidgetSaga, generateScheme) => {
  const { csMap: mapID } = __CONFIG__;

  const generateMapConfig = useCallback(state => {
    const { attributes, general: generalState } = state;

    const meta = {
      title: generalState.name || '',
      subTitle: generalState.description || '',
    };
    const attributesObj = {};
    attributes.dynamicValues.forEach(item => {
      attributesObj[item.deviceID] = {
        label: item.description || item.label,
        name: item.deviceLabel,
      };
    });

    attributes.staticValues.forEach(item => {
      attributesObj[item.deviceID] = {
        label: item.description || item.label,
        name: item.deviceLabel,
      };
    });

    return { map: attributesObj, meta };
  }, []);

  const createMapWidget = useCallback(
    attributes => {
      const widgetId = `${mapID}/${uuidv4()}`;

      const newWidget = {
        i: widgetId,
        x: 0,
        y: Infinity,
        w: 6,
        h: 10,
        minW: 3,
        minH: 6,
        static: false,
        moved: false,
      };

      addWidget(newWidget);
      addWidgetConfig({ [widgetId]: generateMapConfig(attributes) });
      addWidgetSaga({ [widgetId]: generateScheme(attributes) });
    },
    [
      addWidget,
      addWidgetConfig,
      addWidgetSaga,
      mapID,
      generateMapConfig,
      generateScheme,
    ],
  );

  return { createMapWidget };
};
