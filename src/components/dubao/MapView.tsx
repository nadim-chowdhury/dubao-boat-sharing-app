import React, { useEffect, useRef } from 'react';
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

export const MapView: React.FC = () => {
  const { appState, activeRide, pickupLocation, destinationLocation } = useAppState();
  const iframeRef = useRef<any>(null);

  // Generate Leaflet HTML with CDN packages
  const getMapHtml = () => {
    return `
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
            background: #012a4a;
          }
          /* Custom neon popup styling */
          .leaflet-popup-content-wrapper {
            background: #013a63 !important;
            color: #ffffff !important;
            border: 1px solid #00b4d8 !important;
            border-radius: 8px !important;
            font-family: sans-serif;
            font-size: 11px;
            font-weight: bold;
          }
          .leaflet-popup-tip {
            background: #013a63 !important;
          }
          /* Custom icons */
          .emoji-marker {
            font-size: 24px;
            text-align: center;
            line-height: 24px;
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

          // Premium Dark Mode Map Tiles (CartoDB Dark Matter)
          L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19
          }).addTo(map);

          // Harbors database
          const coords = ${JSON.stringify(LOCATION_COORDS)};
          const markers = {};
          
          // Draw standard harbor pins on load
          Object.keys(coords).forEach(name => {
            const pos = coords[name];
            const divIcon = L.divIcon({
              className: 'emoji-marker',
              html: '⚓',
              iconSize: [24, 24]
            });
            const marker = L.marker(pos, { icon: divIcon }).addTo(map);
            marker.bindPopup(name.split(' ')[0]);
            markers[name] = marker;
          });

          // Active ride drawing helpers
          let routeLine = null;
          let boatMarker = null;
          let pickupMarker = null;
          let destMarker = null;

          function updateRide(pickup, dest, progress, boatEmoji, captainName, appState) {
            // Remove previous active elements
            if (routeLine) { map.removeLayer(routeLine); routeLine = null; }
            if (boatMarker) { map.removeLayer(boatMarker); boatMarker = null; }
            if (pickupMarker) { map.removeLayer(pickupMarker); pickupMarker = null; }
            if (destMarker) { map.removeLayer(destMarker); destMarker = null; }

            const pickupCoords = coords[pickup];
            const destCoords = coords[dest];

            if (pickupCoords && destCoords) {
              // Draw Glowing pickup (green) and dest (red) pins
              pickupMarker = L.marker(pickupCoords, {
                icon: L.divIcon({ className: 'emoji-marker', html: '🟢', iconSize: [24, 24] })
              }).addTo(map);
              
              destMarker = L.marker(destCoords, {
                icon: L.divIcon({ className: 'emoji-marker', html: '🔴', iconSize: [24, 24] })
              }).addTo(map);

              // Draw neon blue route path
              routeLine = L.polyline([pickupCoords, destCoords], {
                color: '#00b4d8',
                weight: 4,
                opacity: 0.8,
                dashArray: '8, 8'
              }).addTo(map);

              // Zoom and fit bounds dynamically
              const bounds = L.latLngBounds([pickupCoords, destCoords]);
              map.fitBounds(bounds, { padding: [40, 40] });

              // Calculate active boat coordinates
              let boatLat = pickupCoords[0];
              let boatLng = pickupCoords[1];

              if (appState === 'accepted') {
                // Boat starts slightly offset to simulate arriving
                boatLat = pickupCoords[0] - 0.005;
                boatLng = pickupCoords[1] + 0.004;
              } else if (appState === 'ride') {
                const fraction = progress / 100;
                boatLat = pickupCoords[0] + (destCoords[0] - pickupCoords[0]) * fraction;
                boatLng = pickupCoords[1] + (destCoords[1] - pickupCoords[1]) * fraction;
              }

              // Draw Boat Marker
              boatMarker = L.marker([boatLat, boatLng], {
                icon: L.divIcon({
                  className: 'emoji-marker',
                  html: boatEmoji || '🚣',
                  iconSize: [30, 30]
                })
              }).addTo(map);
              
              boatMarker.bindPopup('Captain: ' + (captainName || 'Rowing')).openPopup();
            } else {
              // Zoom back to default overview
              map.setView([23.777176, 90.399452], 12);
            }
          }

          // Listen for updates from parent app
          window.addEventListener('message', event => {
            const data = event.data;
            if (data.type === 'SYNC') {
              updateRide(
                data.pickup,
                data.destination,
                data.progress,
                data.boatEmoji,
                data.captainName,
                data.appState
              );
            }
          });
        </script>
      </body>
      </html>
    `;
  };

  // Sync state to Leaflet iframe
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const payload = {
        type: 'SYNC',
        pickup: pickupLocation,
        destination: destinationLocation,
        progress: activeRide ? activeRide.progress : 0,
        boatEmoji: activeRide ? activeRide.boat.emoji : null,
        captainName: activeRide ? activeRide.captain.name : null,
        appState,
      };
      iframeRef.current.contentWindow.postMessage(payload, '*');
    }
  }, [appState, activeRide, pickupLocation, destinationLocation]);

  return (
    <View style={styles.mapFrame}>
      {Platform.OS === 'web' ? (
        <iframe
          ref={iframeRef}
          srcDoc={getMapHtml()}
          style={styles.webFrame}
          title="Fictional Dhaka Waterways Map"
        />
      ) : (
        // Mobile fallback if needed
        <View style={styles.mobileFallback} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mapFrame: {
    height: 250,
    backgroundColor: '#012A4A',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#013A63',
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
    backgroundColor: '#013A63',
  },
});
