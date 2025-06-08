import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  TouchableOpacity, 
  ScrollView,
  FlatList,
  Image,
  Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import HabitatPanoramaView from '../components/HabitatPanoramaView';
import { getUserProfile, updateUserProfile } from '../utils/userProfile';
import { updateQuestProgress } from '../utils/questSystem';
import SimplePanoramaViewer from '../components/SimplePanoramaViewer';

const { width } = Dimensions.get('window');

// Enhanced habitat data with panorama support
const habitatData = {
  'rainforest': {
    id: 'rainforest',
    name: 'Tropical Rainforest',
    description: 'Rainforests are Earth\'s oldest living ecosystems, with some surviving in their present form for at least 70 million years. They are incredibly diverse and complex, home to more than half of the world\'s plant and animal species—even though they cover just 6% of Earth\'s surface.',
    climate: 'Hot and humid year-round, with average temperatures of 25-28°C and annual rainfall of 2000-10000mm',
    threats: ['Deforestation', 'Climate change', 'Agriculture expansion', 'Illegal logging'],
    conservation: 'Conservation efforts include establishing protected areas, sustainable forestry practices, and community-based conservation programs.',
    facts: [
      'Rainforests produce about 20% of our oxygen',
      'A single rainforest can have more species of trees than all of North America',
      'A 4-square-mile patch of rainforest can contain up to 1,500 flowering plants and 750 species of trees'
    ],
    animals: ['jaguar', 'toucan', 'sloth', 'poison dart frog', 'howler monkey'],
    plants: ['orchids', 'bromeliads', 'ferns', 'vines', 'giant trees'],
    image: 'https://images.unsplash.com/photo-1536147210925-5cb7a7a4f9fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    color: '#2e7d32',
    panoramaUrl: 'https://source.unsplash.com/random/?rainforest,panorama',
    panoramaWidth: width * 3,
    hotspots: [
      { 
        id: 'canopy', 
        position: { x: width * 0.6, y: 200 }, 
        title: 'Canopy Layer', 
        description: 'This layer of the rainforest is home to many birds, monkeys, and insects.',
        icon: 'tree',
        discovered: false
      },
      { 
        id: 'waterfall', 
        position: { x: width * 1.7, y: 350 }, 
        title: 'Waterfall', 
        description: 'Provides essential water sources and creates microhabitats within the forest.',
        icon: 'water',
        discovered: false
      },
      { 
        id: 'understory', 
        position: { x: width * 2.3, y: 280 }, 
        title: 'Understory', 
        description: 'A dark, humid environment where plants have adapted to low light conditions.',
        icon: 'leaf',
        discovered: false
      }
    ]
  },
  'savanna': {
    id: 'savanna',
    name: 'African Savanna',
    description: 'Savannas are mixed woodland-grassland ecosystems characterized by trees spaced far enough apart that the canopy doesn\'t close. They cover about 20% of the Earth\'s land area and support a rich diversity of wildlife.',
    climate: 'Distinct wet and dry seasons, with temperatures ranging from 20-30°C. Annual rainfall is between 500-1300mm, mostly during the wet season.',
    threats: ['Land conversion', 'Climate change', 'Poaching', 'Human development'],
    conservation: 'Conservation focuses on establishing wildlife corridors, anti-poaching efforts, and sustainable land management practices.',
    facts: [
      'The savanna biome is home to some of the fastest land animals',
      'Fires are a natural and necessary part of savanna ecosystems',
      'Savannas are found on all continents except Antarctica'
    ],
    animals: ['lion', 'elephant', 'giraffe', 'zebra', 'cheetah'],
    plants: ['acacia trees', 'baobab trees', 'grasses', 'shrubs'],
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    color: '#f9a825',
    panoramaUrl: 'https://source.unsplash.com/random/?savanna,panorama',
    panoramaWidth: width * 3,
    hotspots: [
      { 
        id: 'acaciatree', 
        position: { x: width * 0.5, y: 300 }, 
        title: 'Acacia Trees', 
        description: 'These iconic trees provide food and shelter for many animals in the savanna.',
        icon: 'tree',
        discovered: false
      },
      { 
        id: 'waterhole', 
        position: { x: width * 1.5, y: 350 }, 
        title: 'Watering Hole', 
        description: 'Essential water sources where many different species gather, especially during dry seasons.',
        icon: 'water',
        discovered: false
      },
      { 
        id: 'termites', 
        position: { x: width * 2.2, y: 250 }, 
        title: 'Termite Mounds', 
        description: 'These structures can be used as lookout points for predators and homes for various animals.',
        icon: 'mountain',
        discovered: false
      }
    ]
  },
  'arctic': {
    id: 'arctic',
    name: 'Arctic Tundra',
    description: 'The Arctic tundra is a vast, treeless landscape characterized by frozen soil, low temperatures, and a short growing season. Despite harsh conditions, it supports unique wildlife adapted to extreme cold.',
    climate: 'Extremely cold winters with temperatures below -50°C, short cool summers. Annual precipitation is very low, making it a cold desert.',
    threats: ['Climate change', 'Oil drilling', 'Mining', 'Pollution'],
    conservation: 'Conservation efforts focus on climate change mitigation, protected area establishment, and sustainable resource extraction practices.',
    facts: [
      'The Arctic tundra soil remains permanently frozen (permafrost) below the surface',
      'The growing season is only 50-60 days long',
      'The word "tundra" comes from a Finnish word meaning "treeless plain"'
    ],
    animals: ['polar bear', 'arctic fox', 'caribou', 'snowy owl', 'musk ox'],
    plants: ['lichens', 'mosses', 'sedges', 'dwarf shrubs'],
    image: 'https://images.unsplash.com/photo-1520169303542-af7c779dd8f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    color: '#0288d1',
    panoramaUrl: 'https://source.unsplash.com/random/?arctic,tundra,panorama',
    panoramaWidth: width * 3,
    hotspots: [
      { 
        id: 'permafrost', 
        position: { x: width * 0.7, y: 320 }, 
        title: 'Permafrost', 
        description: 'Permanently frozen soil that supports the unique ecosystem of the tundra.',
        icon: 'snowflake',
        discovered: false
      },
      { 
        id: 'polarsea', 
        position: { x: width * 1.6, y: 200 }, 
        title: 'Polar Sea Ice', 
        description: 'Frozen seawater that serves as hunting ground for many Arctic predators.',
        icon: 'water',
        discovered: false
      },
      { 
        id: 'tundraveg', 
        position: { x: width * 2.4, y: 300 }, 
        title: 'Tundra Vegetation', 
        description: 'Low-growing plants adapted to harsh conditions and a short growing season.',
        icon: 'seedling',
        discovered: false
      }
    ]
  }
};

export default function HabitatScreen({ route, navigation }) {
  const { habitatId = 'rainforest' } = route.params || {};
  const habitat = habitatData[habitatId] || habitatData.rainforest;
  
  const [isPanoramaMode, setIsPanoramaMode] = useState(false);
  const [discoveredHotspots, setDiscoveredHotspots] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);
  const [currentDiscovery, setCurrentDiscovery] = useState(null);
  const [showPanorama, setShowPanorama] = useState(false);
  
  // Load user profile and discovered hotspots
  useEffect(() => {
    async function loadData() {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
        
        // Get previously discovered hotspots for this habitat
        const discovered = profile.habitatDiscoveries?.[habitatId] || [];
        setDiscoveredHotspots(discovered);
        
        // Update hotspots discovered state
        const updatedHotspots = habitat.hotspots.map(hotspot => ({
          ...hotspot,
          discovered: discovered.includes(hotspot.id)
        }));
        
        // If all hotspots are discovered, update quest progress
        if (discovered.length === habitat.hotspots.length) {
          updateQuestProgress('habitat_explorer', habitatId);
        }
      } catch (error) {
        console.error('Error loading habitat data:', error);
      }
    }
    
    loadData();
  }, [habitatId]);
  
  // Handle hotspot discovery
  const handleHotspotDiscovery = (hotspot) => {
    if (!discoveredHotspots.includes(hotspot.id)) {
      // Update local state
      setDiscoveredHotspots(prev => [...prev, hotspot.id]);
      
      // Update user profile
      const updatedProfile = { ...userProfile };
      
      // Add experience points for discovery
      const xpGain = 50;
      updatedProfile.experience += xpGain;
      
      // Check for level up
      if (updatedProfile.experience >= (updatedProfile.level * 100)) {
        updatedProfile.level += 1;
        // Show level up notification
        setLevelUpVisible(true);
      }
      
      // Add to discovered hotspots in profile
      if (!updatedProfile.discoveredHotspots) {
        updatedProfile.discoveredHotspots = {};
      }
      
      if (!updatedProfile.discoveredHotspots[habitatId]) {
        updatedProfile.discoveredHotspots[habitatId] = [];
      }
      
      updatedProfile.discoveredHotspots[habitatId].push(hotspot.id);
      
      // Save updated profile
      updateUserProfile(updatedProfile);
      setUserProfile(updatedProfile);
      
      // Show discovery modal
      setCurrentDiscovery({
        title: hotspot.title,
        description: hotspot.description,
        icon: hotspot.icon || 'star'
      });
      setDiscoveryVisible(true);
      
      // Update quest progress
      updateQuestProgress('discover_habitat_feature', { 
        habitatId,
        featureId: hotspot.id,
        featureTitle: hotspot.title
      });
    }
  };
  
  // Animal card renderer
  const renderAnimalCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.animalCard}
      onPress={() => {
        // Navigate to animal detail
        navigation.navigate('AnimalDetail', { animalType: item })
      }}
    >
      <Image
        source={{ uri: `https://source.unsplash.com/200x200/?${item}` }}
        style={styles.animalCardImage}
      />
      <View style={styles.animalCardOverlay}>
        <Text style={styles.animalCardText}>{item.charAt(0).toUpperCase() + item.slice(1)}</Text>
      </View>
    </TouchableOpacity>
  );
  
  // Close discovery modal
  const closeDiscoveryModal = () => {
    setShowDiscoveryModal(false);
    setCurrentDiscovery(null);
  };
  
  // Toggle between panorama and info views
  const togglePanoramaMode = () => {
    setIsPanoramaMode(!isPanoramaMode);
    
    // Track this as an engagement event
    if (!isPanoramaMode) {
      updateQuestProgress('explore_habitat', { habitatId });
    }
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header with background image */}
      <View style={styles.header}>
        <ImageBackground
          source={{ uri: habitat.image }}
          style={styles.headerImage}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'transparent', 'rgba(0,0,0,0.8)']}
            style={styles.headerGradient}
          >
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <FontAwesome5 name="arrow-left" size={20} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
              <Text style={styles.habitatName}>{habitat.name}</Text>
              <View style={styles.habitatLocation}>
                <FontAwesome5 name="map-marker-alt" size={14} color="#fff" style={styles.locationIcon} />
                <Text style={styles.locationText}>Earth's Biomes</Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
      
      {/* Toggle button for panorama mode */}
      <TouchableOpacity 
        style={[styles.panoramaToggle, isPanoramaMode && styles.panoramaToggleActive]}
        onPress={togglePanoramaMode}
      >
        <FontAwesome5 
          name={isPanoramaMode ? "info-circle" : "panorama"} 
          size={18} 
          color="#fff" 
        />
        <Text style={styles.panoramaToggleText}>
          {isPanoramaMode ? "Show Info" : "Explore 360°"}
        </Text>
      </TouchableOpacity>
      
      {isPanoramaMode && (
        <View style={StyleSheet.absoluteFill}>
          <SimplePanoramaViewer
            habitatId={habitatId}
            hotspots={habitat.hotspots || []}
            onHotspotDiscovered={handleHotspotDiscovery}
            onClose={() => setIsPanoramaMode(false)}
            habitatName={habitat.name}
          />
        </View>
      )}
      
      {/* Information view */}
      <ScrollView style={styles.content}>
        {/* Description section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="info-circle" size={18} color={habitat.color} />
            <Text style={styles.sectionTitle}>About this Habitat</Text>
          </View>
          <Text style={styles.description}>{habitat.description}</Text>
        </View>
        
        {/* Climate section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="cloud-sun" size={18} color={habitat.color} />
            <Text style={styles.sectionTitle}>Climate</Text>
          </View>
          <Text style={styles.description}>{habitat.climate}</Text>
        </View>
        
        {/* Threats section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="exclamation-triangle" size={18} color={habitat.color} />
            <Text style={styles.sectionTitle}>Threats</Text>
          </View>
          <View style={styles.threatsList}>
            {habitat.threats.map((threat, index) => (
              <View key={index} style={styles.threatItem}>
                <FontAwesome5 name="dot-circle" size={12} color={habitat.color} />
                <Text style={styles.threatText}>{threat}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Animals section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="paw" size={18} color={habitat.color} />
            <Text style={styles.sectionTitle}>Animals</Text>
          </View>
          <FlatList
            horizontal
            data={habitat.animals}
            renderItem={renderAnimalCard}
            keyExtractor={item => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.animalList}
          />
        </View>
        
        {/* Conservation section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="hands-helping" size={18} color={habitat.color} />
            <Text style={styles.sectionTitle}>Conservation</Text>
          </View>
          <Text style={styles.description}>{habitat.conservation}</Text>
          
          <TouchableOpacity 
            style={[styles.conservationButton, { backgroundColor: habitat.color }]}
            onPress={() => navigation.navigate('Conservation')}
          >
            <FontAwesome5 name="leaf" size={16} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.conservationButtonText}>Support Conservation Efforts</Text>
          </TouchableOpacity>
        </View>
        
        {/* Fun Facts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="lightbulb" size={18} color={habitat.color} />
            <Text style={styles.sectionTitle}>Fun Facts</Text>
          </View>
          
          {habitat.facts.map((fact, index) => (
            <View key={index} style={styles.factItem}>
              <FontAwesome5 name="star" size={14} color={habitat.color} style={{ marginTop: 3, marginRight: 8 }} />
              <Text style={styles.factText}>{fact}</Text>
            </View>
          ))}
        </View>
        
        {/* Exploration button */}
        <TouchableOpacity
          style={[styles.exploreButton, { backgroundColor: habitat.color }]}
          onPress={togglePanoramaMode}
        >
          <FontAwesome5 name="vr-cardboard" size={18} color="#fff" style={{ marginRight: 10 }} />
          <Text style={styles.exploreButtonText}>Explore in 360° View</Text>
        </TouchableOpacity>
        
        {/* Progress indicator */}
        <View style={styles.discoveryProgress}>
          <Text style={styles.discoveryTitle}>Exploration Progress</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(discoveredHotspots.length / habitat.hotspots.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressDetails}>
            {discoveredHotspots.length}/{habitat.hotspots.length} points of interest discovered
          </Text>
          
          {discoveredHotspots.length === habitat.hotspots.length && (
            <View style={styles.completionBadge}>
              <FontAwesome5 name="medal" size={16} color="#FFD700" />
              <Text style={styles.completionText}>Habitat Fully Explored!</Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Discovery modal */}
      {showDiscoveryModal && currentDiscovery && (
        <View style={styles.discoveryModal}>
          <View style={styles.discoveryContent}>
            <View style={styles.discoveryHeader}>
              <FontAwesome5 name="compass" size={24} color="#f9c74f" />
              <Text style={styles.discoveryTitle}>New Discovery!</Text>
            </View>
            
            <Text style={styles.discoveryName}>{currentDiscovery.title}</Text>
            <Text style={styles.discoveryDescription}>{currentDiscovery.description}</Text>
            
            <View style={styles.discoveryReward}>
              <FontAwesome5 name="star" size={18} color="#f9c74f" />
              <Text style={styles.rewardText}>+25 XP</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.discoveryButton}
              onPress={closeDiscoveryModal}
            >
              <Text style={styles.discoveryButtonText}>Continue Exploring</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 200,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 40,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    marginBottom: 16,
  },
  habitatName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  habitatLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 6,
  },
  locationText: {
    color: '#fff',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  threatsList: {
    marginVertical: 12,
  },
  threatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  threatText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#444',
  },
  animalList: {
    paddingVertical: 12,
  },
  animalCard: {
    width: 150,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
  },
  animalCardImage: {
    width: '100%',
    height: '100%',
  },
  animalCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
  },
  animalCardText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  factItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  factText: {
    flex: 1,
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  conservationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  conservationButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  exploreButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  panoramaToggle: {
    position: 'absolute',
    top: 210,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  panoramaToggleActive: {
    backgroundColor: '#2f6b47',
  },
  panoramaToggleText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
  discoveryProgress: {
    marginBottom: 30,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  discoveryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#f9c74f',
  },
  progressDetails: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
  completionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  completionText: {
    color: '#333',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  discoveryModal: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  discoveryContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
  },
  discoveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  discoveryName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  discoveryDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 16,
  },
  discoveryReward: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 199, 79, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  rewardText: {
    color: '#333',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  discoveryButton: {
    backgroundColor: '#2f6b47',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  discoveryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
}); 