import React, { useState } from 'react';
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
import EnhancedPanoramaViewer from '../components/EnhancedPanoramaViewer';

const { width } = Dimensions.get('window');

export default function HabitatDetailScreen({ route, navigation }) {
  const { habitatId } = route.params || { habitatId: 'rainforest' };
  
  // Sample habitat data - in a real app, this would come from an API or database
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
      description: 'Savannas are mixed woodland-grassland ecosystems characterized by trees spaced widely enough to allow sunlight to reach the ground. The African savanna is one of the most iconic and wildlife-rich habitats on Earth.',
      climate: 'Distinct wet and dry seasons, with annual rainfall of 500-1300mm. Temperatures range from 20-30°C.',
      threats: ['Climate change', 'Overgrazing', 'Agricultural expansion', 'Poaching'],
      conservation: 'Conservation includes anti-poaching efforts, community-based conservation, and sustainable land management practices.',
      facts: [
        'The savanna is home to the largest land migration on Earth - the Great Wildebeest Migration',
        'Savanna trees have flat tops to maximize sun exposure',
        'Termite mounds can be over 30 feet tall and house millions of termites'
      ],
      animals: ['lion', 'elephant', 'giraffe', 'zebra', 'cheetah'],
      plants: ['acacia trees', 'baobab trees', 'elephant grass', 'whistling thorn'],
      image: 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      color: '#ff9800',
      panoramaUrl: 'https://source.unsplash.com/random/?savanna,panorama',
      panoramaWidth: width * 3,
      hotspots: [
        { 
          id: 'grassland', 
          position: { x: width * 0.5, y: 250 }, 
          title: 'Open Grassland', 
          description: 'Wide-open spaces with tall grasses that support large herds of grazing animals.',
          icon: 'seedling',
          discovered: false
        },
        { 
          id: 'waterhole', 
          position: { x: width * 1.5, y: 300 }, 
          title: 'Waterhole', 
          description: 'Critical water sources where many animals gather, especially during dry seasons.',
          icon: 'water',
          discovered: false
        },
        { 
          id: 'acaciatree', 
          position: { x: width * 2.2, y: 200 }, 
          title: 'Acacia Tree', 
          description: 'Iconic trees of the savanna with umbrella-shaped canopies, providing shade and food.',
          icon: 'tree',
          discovered: false
        }
      ]
    },
    'arctic': {
      id: 'arctic',
      name: 'Arctic Tundra',
      description: 'The Arctic tundra is a vast, treeless polar desert found in the high latitudes of the northern hemisphere. Despite the harsh conditions, it\'s home to a variety of specially adapted wildlife.',
      climate: 'Extremely cold year-round with winter temperatures of -30°C to -50°C. Short summers can reach 10°C. Low precipitation, mostly as snow.',
      threats: ['Climate change', 'Oil and gas development', 'Mining', 'Tourism impact'],
      conservation: 'Conservation focuses on establishing protected areas, international agreements to limit development, and climate change mitigation.',
      facts: [
        'The word "tundra" comes from the Finnish word "tunturi" meaning treeless plain',
        'Permafrost can be up to 1,500 feet deep in some areas',
        'During summer, the top layer of soil thaws, creating thousands of shallow lakes'
      ],
      animals: ['polar bear', 'arctic fox', 'musk ox', 'caribou', 'snowy owl'],
      plants: ['arctic moss', 'lichen', 'dwarf shrubs', 'cotton grass'],
      image: 'https://images.unsplash.com/photo-1517783999520-f068d7431a60?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      color: '#42a5f5',
      panoramaUrl: 'https://source.unsplash.com/random/?arctic,tundra,panorama',
      panoramaWidth: width * 3,
      hotspots: [
        { 
          id: 'permafrost', 
          position: { x: width * 0.7, y: 220 }, 
          title: 'Permafrost Layer', 
          description: 'Permanently frozen soil that can be hundreds of meters deep in some areas.',
          icon: 'snowflake',
          discovered: false
        },
        { 
          id: 'arctic_fox', 
          position: { x: width * 1.4, y: 320 }, 
          title: 'Arctic Fox Den', 
          description: 'Arctic foxes dig complex den systems that help protect them from the harsh weather.',
          icon: 'paw',
          discovered: false
        },
        { 
          id: 'tundra_plants', 
          position: { x: width * 2.2, y: 250 }, 
          title: 'Tundra Vegetation', 
          description: 'Low-growing plants that survive the cold by staying close to the ground.',
          icon: 'leaf',
          discovered: false
        }
      ]
    }
  };

  const habitat = habitatData[habitatId];
  
  const [showPanorama, setShowPanorama] = useState(false);
  const [discoveredHotspots, setDiscoveredHotspots] = useState([]);
  const [currentDiscovery, setCurrentDiscovery] = useState(null);
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);
  
  const togglePanoramaMode = () => {
    setShowPanorama(prev => !prev);
  };
  
  const handleHotspotDiscovery = (hotspot) => {
    if (!discoveredHotspots.includes(hotspot.id)) {
      setDiscoveredHotspots(prev => [...prev, hotspot.id]);
      setCurrentDiscovery(hotspot);
      setShowDiscoveryModal(true);
      // Here you would also update user profile, award XP, etc.
    }
  };
  
  const closeDiscoveryModal = () => {
    setShowDiscoveryModal(false);
    setCurrentDiscovery(null);
  };
  
  const renderAnimalCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.animalCard}
      onPress={() => navigation.navigate('AnimalDetail', { animalType: item })}
    >
      <Image
        source={{ uri: `https://source.unsplash.com/200x150/?${item}` }}
        style={styles.animalCardImage}
      />
      <View style={styles.animalCardOverlay}>
        <Text style={styles.animalCardText}>{item.charAt(0).toUpperCase() + item.slice(1)}</Text>
      </View>
    </TouchableOpacity>
  );
  
  const navigateToEncyclopedia = () => {
    navigation.navigate('Encyclopedia', { initialCategory: habitat.id });
  };
  
  const navigateToConservation = () => {
    navigation.navigate('Conservation', { habitatId: habitat.id });
  };
  
  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header with image */}
      <View style={styles.header}>
        <ImageBackground
          source={{ uri: habitat.image }}
          style={styles.headerImage}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']}
            style={styles.headerGradient}
          >
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <FontAwesome5 name="arrow-left" size={18} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
              <Text style={styles.habitatName}>{habitat.name}</Text>
              <View style={styles.habitatLocation}>
                <FontAwesome5 name="map-marker-alt" size={14} color="#fff" style={styles.locationIcon} />
                <Text style={styles.locationText}>Global {habitat.id} regions</Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
      
      {/* Content */}
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
            onPress={navigateToConservation}
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
              <FontAwesome5 name="star" size={16} color={habitat.color} style={{ marginRight: 10, marginTop: 3 }} />
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
        
        {/* Add after Explore button */}
        {habitat.hotspots && (
          <View style={styles.discoveryProgress}>
            <Text style={styles.discoveryTitle}>Exploration Progress</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${(discoveredHotspots.length / habitat.hotspots.length) * 100}%`,
                    backgroundColor: habitat.color 
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressDetails}>
              {discoveredHotspots.length}/{habitat.hotspots.length} points of interest discovered
            </Text>
          </View>
        )}
      </ScrollView>
      
      {/* Panorama Viewer */}
      {showPanorama && (
        <View style={StyleSheet.absoluteFill}>
          <EnhancedPanoramaViewer
            panoramaUrl={habitat.panoramaUrl}
            hotspots={habitat.hotspots || []}
            onHotspotDiscovered={handleHotspotDiscovery}
            onClose={() => setShowPanorama(false)}
            habitatName={habitat.name}
          />
        </View>
      )}
      
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
    fontSize: 15,
    color: '#444',
    flex: 1,
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
  discoveryModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  discoveryContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  discoveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  discoveryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  discoveryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  discoveryDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  discoveryReward: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 199, 79, 0.2)',
    padding: 8,
    borderRadius: 20,
    marginVertical: 16,
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
    marginTop: 8,
  },
  discoveryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  discoveryProgress: {
    marginBottom: 24,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
  },
  discoveryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressDetails: {
    fontSize: 14,
    color: '#666',
  },
}); 