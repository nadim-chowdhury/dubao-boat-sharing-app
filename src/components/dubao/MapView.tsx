import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useAppState } from '@/context/AppContext';

// Real Geographical coordinates for Dhaka locations
export const LOCATION_COORDS: Record<string, [number, number]> = {
  'Dhanmondi 27 (Water Port)': [23.7542, 90.3762],
  'Farmgate Flyover Pier': [23.7561, 90.3872],
  'Mirpur 10 Waterfalls': [23.8069, 90.3687],
  'Gulshan Lake Extension (Road 11)': [23.7937, 90.4078],
  'Banani Canal Harbor': [23.7937, 90.4033],
  'Kawran Bazar Canal Terminal': [23.7516, 90.3943],
  'Motijheel Sea Basin': [23.7330, 90.4172],
  'Uttara Sector 11 Coastline': [23.8759, 90.3795],
  'Mohakhali Flyover (Underpass Canal)': [23.7788, 90.4005],
  'Badda Link Road Swamps': [23.7806, 90.4227],
  'Baily Road Tea Harbor': [23.7431, 90.4079],
  'Azimpur Red Sea': [23.7317, 90.3846],
  'Shahbagh Flower Lagoon': [23.7383, 90.3958],
  'Puran Dhaka Biryani Bay': [23.7126, 90.3995],
  'Rampura Bridge Port': [23.7667, 90.4255],
  'Gabtoli Sandal Coast': [23.7842, 90.3444],
};

// HTML Template loaded ONCE on mount
const MAP_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    html, body, #map {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
      background: #0B0F19;
    }
    .leaflet-popup-content-wrapper {
      background: #0F172A !important;
      color: #E2E8F0 !important;
      border: 1px solid #334155 !important;
      border-radius: 8px !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 11px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
    }
    .leaflet-popup-tip {
      background: #0F172A !important;
    }
    .harbor-dot {
      width: 8px !important;
      height: 8px !important;
      border-radius: 50% !important;
      background: #475569 !important;
      border: 2px solid #1E293B !important;
      box-shadow: 0 0 4px rgba(0,0,0,0.6) !important;
    }
    .pickup-dot {
      width: 12px !important;
      height: 12px !important;
      border-radius: 50% !important;
      background: #10B981 !important;
      border: 2px solid #ffffff !important;
      box-shadow: 0 0 8px rgba(16,185,129,0.8) !important;
    }
    .dest-dot {
      width: 12px !important;
      height: 12px !important;
      border-radius: 50% !important;
      background: #EF4444 !important;
      border: 2px solid #ffffff !important;
      box-shadow: 0 0 8px rgba(239,68,68,0.8) !important;
    }
    .active-pointer {
      width: 24px !important;
      height: 24px !important;
      border-radius: 50% !important;
      background: #00B4D8 !important;
      border: 2px solid #ffffff !important;
      box-shadow: 0 0 10px #00B4D8 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: transform 0.4s ease;
    }
    .pointer-svg {
      width: 12px;
      height: 12px;
      fill: #ffffff;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    // Initialize map centered on Dhaka
    const map = L.map('map', {
      zoomControl: false,
      attributionControl: false
    }).setView([23.777176, 90.399452], 12);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    const coords = ${JSON.stringify(LOCATION_COORDS)};
    const harborMarkers = {};
    
    // Draw initial harbors
    Object.keys(coords).forEach(name => {
      const pos = coords[name];
      const divIcon = L.divIcon({
        className: 'harbor-dot',
        iconSize: [8, 8]
      });
      const marker = L.marker(pos, { icon: divIcon }).addTo(map);
      marker.bindPopup(name.split(' ')[0]);
      harborMarkers[name] = marker;
    });

    let routeLine = null;
    let boatMarker = null;
    let pickupMarker = null;
    let destMarker = null;
    let currentPickup = null;
    let currentDest = null;

    function updateRide(pickup, dest, progress, appState, captainName) {
      const pickupCoords = coords[pickup];
      const destCoords = coords[dest];

      // If route changed, rebuild elements
      if (pickup !== currentPickup || dest !== currentDest) {
        currentPickup = pickup;
        currentDest = dest;

        if (routeLine) { map.removeLayer(routeLine); routeLine = null; }
        if (boatMarker) { map.removeLayer(boatMarker); boatMarker = null; }
        if (pickupMarker) { map.removeLayer(pickupMarker); pickupMarker = null; }
        if (destMarker) { map.removeLayer(destMarker); destMarker = null; }

        if (pickupCoords && destCoords) {
          pickupMarker = L.marker(pickupCoords, {
            icon: L.divIcon({ className: 'pickup-dot', iconSize: [12, 12] })
          }).addTo(map);
          
          destMarker = L.marker(destCoords, {
            icon: L.divIcon({ className: 'dest-dot', iconSize: [12, 12] })
          }).addTo(map);

          routeLine = L.polyline([pickupCoords, destCoords], {
            color: '#00b4d8',
            weight: 3.5,
            opacity: 0.8,
            dashArray: '6, 6'
          }).addTo(map);

          const bounds = L.latLngBounds([pickupCoords, destCoords]);
          map.fitBounds(bounds, { padding: [40, 40] });

          const boatIconHtml = \`
            <div class="active-pointer">
              <svg class="pointer-svg" viewBox="0 0 24 24">
                <path d="M12 2L2 22L12 17L22 22L12 2Z" />
              </svg>
            </div>
          \`;

          boatMarker = L.marker(pickupCoords, {
            icon: L.divIcon({
              className: '',
              html: boatIconHtml,
              iconSize: [24, 24]
            })
          }).addTo(map);

          boatMarker.bindPopup('Captain: ' + (captainName || 'Rowing')).openPopup();
        } else {
          map.setView([23.777176, 90.399452], 12);
        }
      }

      // Update position smoothly if markers are active
      if (boatMarker && pickupCoords && destCoords) {
        let boatLat = pickupCoords[0];
        let boatLng = pickupCoords[1];

        if (appState === 'accepted') {
          boatLat = pickupCoords[0] - 0.002;
          boatLng = pickupCoords[1] + 0.002;
        } else if (appState === 'ride') {
          const fraction = progress / 100;
          boatLat = pickupCoords[0] + (destCoords[0] - pickupCoords[0]) * fraction;
          boatLng = pickupCoords[1] + (destCoords[1] - pickupCoords[1]) * fraction;
        }

        // Set position without reconstructing marker to keep popup open
        boatMarker.setLatLng([boatLat, boatLng]);
        
        // Update popup text if changed
        boatMarker.setPopupContent('Captain: ' + (captainName || 'Rowing'));
      }
    }

    // Notify parent that map is loaded and ready
    window.parent.postMessage({ type: 'MAP_READY' }, '*');

    window.addEventListener('message', event => {
      const data = event.data;
      if (data.type === 'SYNC') {
        updateRide(
          data.pickup,
          data.destination,
          data.progress,
          data.appState,
          data.captainName
        );
      }
    });
  </script>
</body>
</html>
`;

export const MapView: React.FC = () => {
  const { appState, activeRide, pickupLocation, destinationLocation } = useAppState();
  const iframeRef = useRef<any>(null);
  
  // Track synchronization state
  const mapReadyRef = useRef(false);
  const pendingSyncRef = useRef<any>(null);

  // Synchronize state changes to Leaflet iframe
  const syncState = () => {
    const payload = {
      type: 'SYNC',
      pickup: pickupLocation,
      destination: destinationLocation,
      progress: activeRide ? activeRide.progress : 0,
      appState,
      captainName: activeRide ? activeRide.captain.name : null,
    };

    if (mapReadyRef.current && iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(payload, '*');
    } else {
      pendingSyncRef.current = payload;
    }
  };

  // Sync when state values change
  useEffect(() => {
    syncState();
  }, [appState, activeRide?.progress, pickupLocation, destinationLocation]);

  // Handle initialization message from Leaflet
  useEffect(() => {
    const handleMessage = (event: any) => {
      if (event.data && event.data.type === 'MAP_READY') {
        mapReadyRef.current = true;
        // Deliver pending sync immediately on load
        if (pendingSyncRef.current && iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage(pendingSyncRef.current, '*');
          pendingSyncRef.current = null;
        }
      }
    };

    if (Platform.OS === 'web') {
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, []);

  return (
    <View style={styles.mapFrame}>
      {Platform.OS === 'web' ? (
        <iframe
          ref={iframeRef}
          srcDoc={MAP_HTML}
          style={styles.webFrame}
          title="Fictional Dhaka Waterways Map"
        />
      ) : (
        <View style={styles.mobileFallback} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mapFrame: {
    height: 250,
    backgroundColor: '#0B0F19',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E293B',
    marginVertical: 12,
  },
  webFrame: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
    overflow: 'hidden',
  },
  mobileFallback: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
});
