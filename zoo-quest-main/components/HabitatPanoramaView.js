import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDecay
} from 'react-native-reanimated';
import { FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'expo-image';

const { width, height } = Dimensions.get('window');

export default function HabitatPanoramaView({ habitatData, onHotspotPress }) {
  const [hotspots, setHotspots] = useState(habitatData.hotspots || []);
  const [activeHotspot, setActiveHotspot] = useState(null);
  
  // Panorama scrolling
  const xOffset = useSharedValue(0);
  const panoramaWidth = habitatData.panoramaWidth || width * 3;
  
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
    if (onHotspotPress) {
      onHotspotPress(hotspot);
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
      <Text style={styles.title}>{habitatData.name} Habitat</Text>
      
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={styles.panoramaContainer}>
          <Animated.View style={[styles.panoramaScroller, panoramaStyle]}>
            <Image
              source={{ uri: habitatData.panoramaUrl }}
              style={[styles.panoramaImage, { width: panoramaWidth }]}
              contentFit="cover"
            />
            
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
                    
                    {hotspot.animalIds && hotspot.animalIds.length > 0 && (
                      <View style={styles.relatedAnimals}>
                        <Text style={styles.relatedTitle}>Related Animals:</Text>
                        <View style={styles.animalTags}>
                          {hotspot.animalIds.map(animalId => (
                            <TouchableOpacity 
                              key={animalId} 
                              style={styles.animalTag}
                              onPress={() => navigation.navigate('AnimalDetail', { animalType: animalId })}
                            >
                              <Text style={styles.animalTagText}>
                                {animalProfiles[animalId]?.name || animalId}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
      
      <View style={styles.instructions}>
        <FontAwesome5 name="hand-point-up" size={14} color="#fff" />
        <Text style={styles.instructionText}>Swipe to explore the habitat</Text>
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
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    padding: 16,
    textAlign: 'center',
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
    resizeMode: 'cover',
  },
  hotspot: {
    position: 'absolute',
    zIndex: 10,
  },
  hotspotDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeHotspot: {
    backgroundColor: '#f9c74f',
    borderColor: '#fff',
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
    marginBottom: 8,
  },
  relatedAnimals: {
    marginTop: 8,
  },
  relatedTitle: {
    color: '#f9c74f',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  animalTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  animalTag: {
    backgroundColor: '#2f6b47',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  animalTagText: {
    color: '#fff',
    fontSize: 10,
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
    width: 12,
    height: 12,
    borderRadius: 6,
  },
}); 