import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  ImageBackground 
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDecay
} from 'react-native-reanimated';
import { FontAwesome5 } from '@expo/vector-icons';
import { getPanoramaImage } from '../utils/panoramaImageLoader';

const { width, height } = Dimensions.get('window');

export default function SimplePanoramaViewer({ 
  habitatId, 
  hotspots = [], 
  onHotspotDiscovered, 
  onClose,
  habitatName 
}) {
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [discoveredHotspots, setDiscoveredHotspots] = useState([]);
  
  // Panorama scrolling
  const xOffset = useSharedValue(0);
  const panoramaWidth = width * 3;
  
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = xOffset.value;
    },
    onActive: (event, ctx) => {
      xOffset.value = ctx.startX - event.translationX;
      // Limit panorama scrolling to its width
      xOffset.value = Math.min(Math.max(0, xOffset.value), panoramaWidth - width);
    },
    onEnd: (event, ctx) => {
      xOffset.value = withDecay({
        velocity: -event.velocityX,
        clamp: [0, panoramaWidth - width]
      });
    }
  });
  
  const panoramaStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: -xOffset.value }]
    };
  });
  
  const handleHotspotPress = (hotspot) => {
    setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id);
    
    // Add to discovered hotspots if not already discovered
    if (!discoveredHotspots.includes(hotspot.id)) {
      setDiscoveredHotspots(prev => [...prev, hotspot.id]);
      if (onHotspotDiscovered) {
        onHotspotDiscovered(hotspot);
      }
    }
  };
  
  // Calculate hotspot positions based on panorama width and current scroll
  const getHotspotStyle = (position) => {
    return {
      left: (position.x / 100) * panoramaWidth,
      top: (position.y / 100) * height * 0.7,
    };
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <FontAwesome5 name="times" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{habitatName} - 360° Explorer</Text>
        <Text style={styles.progressText}>
          {discoveredHotspots.length}/{hotspots.length} Discovered
        </Text>
      </View>
      
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={styles.panoramaContainer}>
          <Animated.View style={[styles.panoramaScroller, panoramaStyle]}>
            <ImageBackground
              source={{ uri: getPanoramaImage(habitatId) }}
              style={[styles.panoramaImage, { width: panoramaWidth }]}
              resizeMode="cover"
            >
              {/* Hotspots */}
              {hotspots.map((hotspot) => (
                <TouchableOpacity
                  key={hotspot.id}
                  style={[styles.hotspot, getHotspotStyle(hotspot.position)]}
                  onPress={() => handleHotspotPress(hotspot)}
                >
                  <View 
                    style={[
                      styles.hotspotDot,
                      discoveredHotspots.includes(hotspot.id) && styles.discoveredHotspot,
                      activeHotspot === hotspot.id && styles.activeHotspot
                    ]}
                  >
                    <FontAwesome5 
                      name={hotspot.icon || "info-circle"} 
                      size={12} 
                      color="#fff" 
                    />
                  </View>
                  
                  {activeHotspot === hotspot.id && (
                    <View style={styles.hotspotInfo}>
                      <Text style={styles.hotspotTitle}>{hotspot.title}</Text>
                      <Text style={styles.hotspotDescription}>{hotspot.description}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ImageBackground>
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
      
      <View style={styles.instructions}>
        <FontAwesome5 name="hand-point-up" size={16} color="#f9c74f" />
        <Text style={styles.instructionText}>Swipe to explore • Tap on points of interest</Text>
      </View>
      
      <View style={styles.navigationDots}>
        {Array.from({ length: 3 }).map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.navDot,
              xOffset.value > (index * panoramaWidth / 3) - 50 &&
              xOffset.value < ((index + 1) * panoramaWidth / 3) + 50 &&
              styles.activeDot
            ]} 
          />
        ))}
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
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  progressText: {
    color: '#f9c74f',
    fontWeight: 'bold',
  },
  panoramaContainer: {
    height: height * 0.7,
    overflow: 'hidden',
  },
  panoramaScroller: {
    height: '100%',
    position: 'relative',
  },
  panoramaImage: {
    height: '100%',
  },
  hotspot: {
    position: 'absolute',
    zIndex: 10,
  },
  hotspotDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discoveredHotspot: {
    backgroundColor: '#4CAF50',
    borderColor: '#fff',
  },
  activeHotspot: {
    backgroundColor: '#f9c74f',
    borderColor: '#fff',
    transform: [{scale: 1.2}],
  },
  hotspotInfo: {
    position: 'absolute',
    bottom: 30,
    left: -100,
    width: 220,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f9c74f',
  },
  hotspotTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  hotspotDescription: {
    color: '#ddd',
    fontSize: 12,
  },
  instructions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  instructionText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
  navigationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  navDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#f9c74f',
    transform: [{scale: 1.2}],
  },
}); 