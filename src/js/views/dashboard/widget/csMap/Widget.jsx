import React, { useEffect, useRef, useState, Fragment } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { WidgetCard } from 'Components/Cards';
import { getMarkerColor } from 'Components/MapMarkers';
import _ from 'lodash';
import moment from 'moment';
import { Map, TileLayer, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import 'leaflet/dist/images/marker-shadow.png';

const useStyles = makeStyles(theme => {
  return {
    card: {
      height: '100%',
      width: '100%',
      display: 'flex',
      paddingTop: '5px',
      flexWrap: 'wrap',
      flexDirection: 'column',
      '&:active': {
        boxShadow: theme.shadows[6],
      },
    },
    cardContent: {
      padding: '0 8px',
      minHeight: 30,
      width: '100%',
      position: 'relative',
      flex: 1,
      '&:last-child': {
        paddingBottom: 8,
      },
    },
  };
});

export default ({ id, onDelete, onPin, data, config }) => {
  const [markersCounter, setMarkersCounter] = useState({
    red: 0,
    yellow: 0,
    green: 0,
  });
  const [markers, setMarkers] = useState([]);
  const [bounds, setBounds] = useState([[0, 0]]);
  const classes = useStyles();
  const mapRef = useRef();
  const { clientHeight, clientWidth } = !mapRef.current
    ? {
        clientHeight: 0,
        clientWidth: 0,
      }
    : mapRef.current.container;

  useEffect(() => {
    mapRef.current.leafletElement.invalidateSize();
  }, [clientHeight, clientWidth]);

  const getDiffTime = time => {
    const now = moment.utc();
    const end = moment(time);
    return moment.duration(now.diff(end)).asHours();
  };

  const getMarkerColorByTime = time => {
    const hour = getDiffTime(time);
    if (hour <= 1) {
      return getMarkerColor('#008b02');
    }
    if (hour <= 24) {
      return getMarkerColor('#fccb00');
    }
    return getMarkerColor('#b80000');
  };

  const countMarkers = (time, { red, yellow, green }) => {
    const hour = getDiffTime(time);
    if (hour <= 1) {
      return {
        red,
        yellow,
        green: green + 1,
      };
    }
    if (hour <= 24) {
      return {
        red,
        yellow: yellow + 1,
        green,
      };
    }
    return {
      red: red + 1,
      yellow,
      green,
    };
  };

  useEffect(() => {
    let counter = {
      red: 0,
      yellow: 0,
      green: 0,
    };
    setMarkers(
      Object.keys(data || {}).map(key => {
        counter = countMarkers(data[key].timestamp, counter);
        return (
          <Marker
            position={data[key].value}
            icon={getMarkerColorByTime(data[key].timestamp)}
          >
            <Tooltip>
              <span>{data[key].deviceLabel}</span>
            </Tooltip>
          </Marker>
        );
      }),
    );
    setMarkersCounter(counter);
    setBounds(
      _.isEmpty(data)
        ? [[0, 0]]
        : Object.keys(data).map(key => data[key].value),
    );
  }, [data]);

  const Totalizer = () => {
    const { red, green, yellow } = markersCounter;
    const itemStyle = (color, position) => {
      let stylePosition = '0';
      let styleColor = '#EB5757';
      if (position === 'bottom') stylePosition = '0 0 6px 6px';
      if (position === 'top') stylePosition = '6px 6px 0 0';

      if (color === 'red') styleColor = '#F9CDCD';
      if (color === 'green') styleColor = '#BFE7D0';
      if (color === 'yellow') styleColor = '#FCEFCA';
      return {
        height: 28,
        width: 48,
        borderRadius: stylePosition,
        background: styleColor,
        textAlign: 'center',
        color: 'rgb(0 0 0 / 87%);',
        fontSize: 16,
        lineHeight: '28px',
      };
    };
    const titileStyle = {
      margin: '0 0 10px 0',
      fontSize: 18,
    };
    return (
      <div
        style={{
          background: 'white',
          position: 'absolute',
          bottom: 30,
          right: 20,
          zIndex: 999,
          borderRadius: 5,
          border: 'solid 1px #eaeaea',
          padding: 10,
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div style={titileStyle}>Total</div>
        <div style={itemStyle('green', 'top')}>{green}</div>
        <div style={itemStyle('yellow', 'middle')}>{yellow}</div>
        <div style={itemStyle('red', 'bottom')}>{red}</div>
      </div>
    );
  };

  return (
    <WidgetCard
      id={id}
      onDelete={onDelete}
      onPin={onPin}
      config={config}
      subHeader={null}
    >
      <Fragment className={classes.cardContent}>
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
        <Totalizer />
      </Fragment>
    </WidgetCard>
  );
};
