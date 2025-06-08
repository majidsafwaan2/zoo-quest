import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Animated,
  TextInput,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { animalProfiles } from '../utils/animalProfiles';
import { getUserProfile } from '../utils/userProfile';

export default function EncyclopediaScreen({ navigation }) {
  const [animals, setAnimals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedConservation, setSelectedConservation] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Header animation values
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [200, 60],
    extrapolate: 'clamp'
  });
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 120],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp'
  });
  
  const searchBarY = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [140, 10],
    extrapolate: 'clamp'
  });
  
  useEffect(() => {
    async function loadData() {
      // Get user profile to determine which animals they've unlocked
      const profile = await getUserProfile();
      setUserProfile(profile);
      
      // In a real app, this would check which animals the user has unlocked
      // For now, we'll simulate some unlocked and some locked animals
      const totalAnimals = Object.entries(animalProfiles).map(([key, animal]) => ({
        ...animal,
        id: key,
        isUnlocked: profile?.level > 2 || ['lion', 'elephant', 'penguin', 'giraffe', 'tiger'].includes(key)
      }));
      
      setAnimals(totalAnimals);
    }
    
    loadData();
  }, []);
  
  // Filter animals based on search and filters
  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = searchQuery === '' || 
      animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedCategory === null || 
      animal.category === selectedCategory;
      
    const matchesConservation = selectedConservation === null || 
      animal.conservationStatus === selectedConservation;
      
    return matchesSearch && matchesCategory && matchesConservation;
  });
  
  const renderAnimalCard = ({ item }) => {
    if (!item.isUnlocked) {
      // Render locked animal card
      return (
        <TouchableOpacity
          style={[styles.animalCard, styles.lockedCard]}
          onPress={() => navigation.navigate('QuestScreen')}
        >
          <View style={styles.lockedOverlay}>
            <FontAwesome5 name="lock" size={24} color="#fff" />
            <Text style={styles.lockedText}>Complete quests to unlock</Text>
          </View>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.animalImage}
            blurRadius={10}
          />
          <View style={styles.animalInfo}>
            <Text style={styles.animalName}>??? Species</Text>
            <Text style={styles.animalScientific}>Complete more quests</Text>
          </View>
        </TouchableOpacity>
      );
    }
    
    // Render unlocked animal card
    return (
      <TouchableOpacity
        style={styles.animalCard}
        onPress={() => navigation.navigate('AnimalDetail', { animalType: item.id })}
      >
        <Image
          source={{ uri: item.imageUrls?.profile || `https://source.unsplash.com/200x200/?${item.name}` }}
          style={styles.animalImage}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.cardGradient}
        />
        <View style={styles.animalInfo}>
          <Text style={styles.animalName}>{item.name}</Text>
          <Text style={styles.animalScientific}>{item.scientificName}</Text>
          
          <View style={styles.tagContainer}>
            <View style={[styles.conservationTag, getConservationColor(item.conservationStatus)]}>
              <Text style={styles.tagText}>{item.conservationStatus}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  // Helper function to get color based on conservation status
  const getConservationColor = (status) => {
    const colors = {
      'Least Concern': { backgroundColor: '#4caf50' },
      'Near Threatened': { backgroundColor: '#8bc34a' },
      'Vulnerable': { backgroundColor: '#ffc107' },
      'Endangered': { backgroundColor: '#ff9800' },
      'Critically Endangered': { backgroundColor: '#f44336' },
      'Extinct in the Wild': { backgroundColor: '#9c27b0' },
      'Extinct': { backgroundColor: '#000000' }
    };
    
    return colors[status] || { backgroundColor: '#9e9e9e' };
  };
  
  // Filter categories
  const categories = [
    { id: 'all', name: 'All', icon: 'paw' },
    { id: 'mammal', name: 'Mammals', icon: 'cat' },
    { id: 'bird', name: 'Birds', icon: 'dove' },
    { id: 'reptile', name: 'Reptiles', icon: 'dragon' },
    { id: 'amphibian', name: 'Amphibians', icon: 'frog' }
  ];
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.View style={[styles.headerContent, { opacity: headerOpacity }]}>
          <Text style={styles.headerTitle}>Animal Encyclopedia</Text>
          <Text style={styles.headerSubtitle}>
            Discover {animals.length} animal species from around the world
          </Text>
        </Animated.View>
        
        {/* Search Bar - Animated to stay visible when scrolling */}
        <Animated.View style={[styles.searchBarContainer, { transform: [{ translateY: searchBarY }] }]}>
          <View style={styles.searchBar}>
            <FontAwesome5 name="search" size={16} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search animals..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <FontAwesome5 name="times-circle" size={16} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </Animated.View>
      
      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
            >
              <FontAwesome5 
                name={category.icon} 
                size={16} 
                color={selectedCategory === category.id ? '#fff' : '#888'} 
              />
              <Text 
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Animal Grid */}
      <FlatList
        data={filteredAnimals}
        renderItem={renderAnimalCard}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.animalGrid}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome5 name="search" size={40} color="#888" />
            <Text style={styles.emptyText}>No animals found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    backgroundColor: '#1d4e31',
    overflow: 'hidden',
    paddingTop: 20,
    zIndex: 10,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginTop: 5,
  },
  searchBarContainer: {
    paddingHorizontal: 20,
    position: 'absolute',
    width: '100%',
    zIndex: 5,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#333',
    fontSize: 16,
  },
  filterContainer: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#1d4e31',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    zIndex: 5,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#2f6b47',
  },
  categoryText: {
    color: '#888',
    marginLeft: 6,
    fontSize: 14,
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  animalGrid: {
    padding: 12,
  },
  animalCard: {
    flex: 1,
    backgroundColor: '#262626',
    borderRadius: 12,
    overflow: 'hidden',
    margin: 6,
    height: 220,
  },
  lockedCard: {
    opacity: 0.7,
  },
  animalImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  animalInfo: {
    padding: 12,
    justifyContent: 'flex-end',
  },
  animalName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  animalScientific: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 2,
  },
  tagContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  conservationTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  tagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  emptySubtext: {
    color: '#888',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  }
}); 