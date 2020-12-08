import React, { useCallback, useEffect, useRef, useState } from 'react';

import { WidgetCard } from 'Components/Cards';
import { getMarkerColor } from 'Components/MapMarkers';
import _ from 'lodash';
import moment from 'moment';
import { Map, TileLayer, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import 'leaflet/dist/images/marker-shadow.png';

export default ({ id, onDelete, onPin, data, config }) => {
  const [totalGreen, setTotalGreen] = useState(0);
  const [totalYellow, setTotalYellow] = useState(0);
  const [totalRed, setTotalRed] = useState(0);
  // let totalGreen = 0;
  // let totalYellow = 0;
  // let totalRed = 0;
  const [markers, setMarkers] = useState([]);
  const [bounds, setBounds] = useState([[0, 0]]);

  const mapRef = useRef();
  const { clientHeight, clientWidth } = !mapRef.current
    ? { clientHeight: 0, clientWidth: 0 }
    : mapRef.current.container;

  useEffect(() => {
    mapRef.current.leafletElement.invalidateSize();
  }, [clientHeight, clientWidth]);

  const getMarkerColorByTime = time => {
    const now = moment.utc();
    const end = moment(time);
    const hour = moment.duration(now.diff(end)).asHours();
    if (hour <= 1) {
      console.log('green');
      // totalGreen += 1;
      return getMarkerColor('#008b02');
    }
    if (hour <= 2) {
      console.log('yellow');
      // totalYellow += 1;
      return getMarkerColor('#fccb00');
    }
    console.log('red');
    // totalRed += 1;
    return getMarkerColor('#b80000');
  };

  useEffect(() => {
    setMarkers(
      Object.keys(data || {}).map(key => {
        setTotalRed(totalRed + 1);
        return (
          <Marker
            position={data[key].value}
            icon={getMarkerColorByTime(data[key].timestamp)}
          >
            <Tooltip>
              <span>{config.map[key].name}</span>
            </Tooltip>
          </Marker>
        );
      }),
    );

    setBounds(
      _.isEmpty(data)
        ? [[0, 0]]
        : Object.keys(data).map(key => data[key].value),
    );
  }, [data]);

  console.log('-----------------------------');
  console.log(`totalRed: ${totalRed}`);
  console.log(`totalGreen: ${totalGreen}`);
  console.log(`totalYellow: ${totalYellow}`);
  return (
    <WidgetCard id={id} onDelete={onDelete} onPin={onPin} config={config}>
      <Map
        ref={mapRef}
        className='markercluster-map'
        bounds={bounds}
        zoom={7}
        maxZoom={18}
        minZoom={2}
        style={{
          height: '100%',
          width: '100%',
          borderRadius: 5,
          overflow: 'hidden',
        }}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers}
      </Map>
    </WidgetCard>
  );
};
