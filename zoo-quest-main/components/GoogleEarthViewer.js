import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function GoogleEarthViewer({ 
  habitatId, 
  hotspots = [], 
  onHotspotDiscovered, 
  onClose,
  habitatName 
}) {
  const webViewRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [discoveredHotspots, setDiscoveredHotspots] = useState([]);
  
  // Location coordinates for each habitat type
  const habitatCoordinates = {
    rainforest: { lat: -3.4653, lng: -62.2159, zoom: 10 }, // Amazon Rainforest
    savanna: { lat: -2.153, lng: 34.685, zoom: 8 },       // Serengeti
    arctic: { lat: 78.2232, lng: -103.5263, zoom: 7 }     // Arctic tundra
  };
  
  const coordinates = habitatCoordinates[habitatId] || habitatCoordinates.rainforest;
  
  // Create the HTML with Google Earth API
  const generateGoogleEarthHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <script src="https://www.gstatic.com/external_hosted/earth/earth_api_min.js"></script>
          <style>
            html, body {
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: hidden;
            }
            #map {
              height: 100%;
              width: 100%;
            }
            .hotspot {
              position: absolute;
              width: 30px;
              height: 30px;
              background-color: rgba(255, 255, 255, 0.8);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            let map;
            let hotspots = ${JSON.stringify(hotspots)};
            let markers = [];
            
            function initMap() {
              // Initialize Google Earth
              google.earth.createInstance('map', initSuccess, initFailure);
            }
            
            function initSuccess(earthInstance) {
              map = earthInstance;
              map.getWindow().setVisibility(true);
              
              // Set initial view
              const lookAt = map.createLookAt('');
              lookAt.setLatitude(${coordinates.lat});
              lookAt.setLongitude(${coordinates.lng});
              lookAt.setRange(${coordinates.zoom * 10000}); // Adjust range for zoom level
              map.getView().setAbstractView(lookAt);
              
              // Add hotspots as placemarks
              hotspots.forEach(hotspot => {
                addHotspot(hotspot);
              }); 
              
              // Tell React Native that the map is ready
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapReady' }));
            }
            
            function initFailure(error) {
              console.error('Failed to initialize Google Earth: ' + error);
              window.ReactNativeWebView.postMessage(JSON.stringify({ 
                type: 'error', 
                message: 'Failed to initialize Google Earth: ' + error 
              }));
            }
            
            function addHotspot(hotspot) {
              // Create placemark
              const placemark = map.createPlacemark('');
              placemark.setName(hotspot.title);
              
              // Create icon
              const icon = map.createIcon('');
              icon.setHref('https://maps.google.com/mapfiles/kml/paddle/red-circle.png');
              
              // Create style for placemark
              const style = map.createStyle('');
              style.getIconStyle().setIcon(icon);
              style.getIconStyle().setScale(1.0);
              placemark.setStyleSelector(style);
              
              // Position placemark - we'll use the normalized x,y positions to create lat/lng offsets
              const point = map.createPoint('');
              point.setLatitude(${coordinates.lat} + (hotspot.position.y - ${height/2}) / ${height} * 0.5);
              point.setLongitude(${coordinates.lng} + (hotspot.position.x - ${width/2}) / ${width} * 0.5);
              placemark.setGeometry(point);
              
              // Add click listener
              google.earth.addEventListener(placemark, 'click', function() {
                window.ReactNativeWebView.postMessage(JSON.stringify({ 
                  type: 'hotspotClicked', 
                  hotspotId: hotspot.id 
                }));
              });
              
              // Add to map
              map.getFeatures().appendChild(placemark);
              markers.push(placemark);
            }
            
            // Start initialization when page loads
            google.earth.addEventListener(window, 'load', initMap);
          </script>
        </body>
      </html>
    `;
  };
  
  // Handle messages from WebView (hotspot clicks)
  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'hotspotClicked') {
        const hotspot = hotspots.find(h => h.id === data.hotspotId);
        if (hotspot && !discoveredHotspots.includes(hotspot.id)) {
          setDiscoveredHotspots(prev => [...prev, hotspot.id]);
          if (onHotspotDiscovered) {
            onHotspotDiscovered(hotspot);
          }
        }
      } else if (data.type === 'mapReady') {
        setIsLoading(false);
      } else if (data.type === 'error') {
        console.error('Google Earth API error:', data.message);
      }
    } catch (error) {
      console.error('Error parsing message from WebView:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <FontAwesome5 name="times" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{habitatName} - Earth Explorer</Text>
        <Text style={styles.progressText}>
          {discoveredHotspots.length}/{hotspots.length} Discovered
        </Text>
      </View>
      
      <WebView
        ref={webViewRef}
        source={{ html: generateGoogleEarthHTML() }}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={['*']}
        bounces={false}
      />
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <FontAwesome5 name="globe-americas" size={32} color="#2f6b47" style={styles.spinner} />
          <Text style={styles.loadingText}>Loading Earth view...</Text>
        </View>
      )}
      
      <View style={styles.instructions}>
        <FontAwesome5 name="hand-point-up" size={16} color="#f9c74f" />
        <Text style={styles.instructionText}>Tap and drag to navigate • Tap on markers to explore</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressText: {
    color: '#fff',
    fontSize: 14,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginBottom: 16,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
  instructions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  instructionText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
}); 