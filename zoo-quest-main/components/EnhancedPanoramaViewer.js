import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function EnhancedPanoramaViewer({ 
  panoramaUrl, 
  hotspots = [], 
  onHotspotDiscovered, 
  onClose,
  habitatName 
}) {
  const webViewRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [discoveredHotspots, setDiscoveredHotspots] = useState([]);
  
  // Function to handle messages from WebView (hotspot clicks)
  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'hotspotClicked') {
        handleHotspotDiscovery(data.hotspotId);
      }
    } catch (error) {
      console.error('Error parsing message from WebView:', error);
    }
  };
  
  // Handle hotspot discovery
  const handleHotspotDiscovery = (hotspotId) => {
    const hotspot = hotspots.find(h => h.id === hotspotId);
    if (hotspot && !discoveredHotspots.includes(hotspotId)) {
      setDiscoveredHotspots(prev => [...prev, hotspotId]);
      if (onHotspotDiscovered) {
        onHotspotDiscovered(hotspot);
      }
    }
  };
  
  // Generate HTML with pannellum
  const generatePannellumHtml = () => {
    const hotspotConfig = hotspots.map(hotspot => {
      return {
        id: hotspot.id,
        pitch: hotspot.position.y / height * 40 - 20, // Convert y position to pitch
        yaw: (hotspot.position.x / width * 360) % 360, // Convert x position to yaw
        type: 'info',
        text: hotspot.title,
        discovered: discoveredHotspots.includes(hotspot.id)
      };
    });
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <title>360° Panorama</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"/>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"></script>
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          #panorama {
            width: 100%;
            height: 100%;
          }
          .hotspot {
            cursor: pointer;
          }
          .hotspot-discovered {
            background-color: #4CAF50 !important;
          }
        </style>
      </head>
      <body>
        <div id="panorama"></div>
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            const viewer = pannellum.viewer('panorama', {
              type: 'equirectangular',
              panorama: '${panoramaUrl}',
              autoLoad: true,
              compass: true,
              hotSpots: ${JSON.stringify(hotspotConfig)},
              northOffset: 247.5,
              haov: 360,
              vaov: 180,
              vOffset: 0,
              minHfov: 50,
              maxHfov: 120,
              showZoomCtrl: true,
              showFullscreenCtrl: false
            });
            
            // Handle hotspot clicks
            viewer.on('click', function(event) {
              if (event.target.classList.contains('hotspot')) {
                const hotspotId = event.target.getAttribute('data-hotspot-id');
                if (hotspotId) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'hotspotClicked',
                    hotspotId: hotspotId
                  }));
                  event.target.classList.add('hotspot-discovered');
                }
              }
            });
            
            // Add hotspot-id data attribute to hotspots
            setTimeout(() => {
              const hotspots = document.querySelectorAll('.hotspot');
              hotspots.forEach((hotspot, index) => {
                const hotspotId = ${JSON.stringify(hotspotConfig)}[index].id;
                hotspot.setAttribute('data-hotspot-id', hotspotId);
                if (${JSON.stringify(hotspotConfig)}[index].discovered) {
                  hotspot.classList.add('hotspot-discovered');
                }
              });
            }, 500);
          });
        </script>
      </body>
      </html>
    `;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <FontAwesome5 name="times" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{habitatName} - 360° View</Text>
      </View>
      
      <WebView
        ref={webViewRef}
        source={{ html: generatePannellumHtml() }}
        style={styles.webview}
        onMessage={handleMessage}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={['*']}
        bounces={false}
      />
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <FontAwesome5 name="spinner" size={24} color="#2f6b47" style={styles.spinner} />
          <Text style={styles.loadingText}>Loading 360° view...</Text>
        </View>
      )}
      
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Exploration Progress: {discoveredHotspots.length}/{hotspots.length}
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(discoveredHotspots.length / hotspots.length) * 100}%` }
            ]} 
          />
        </View>
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
  webview: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
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
  progressContainer: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  progressText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#444',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
}); 