import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { getUserProfile } from '../utils/userProfile';

const { width } = Dimensions.get('window');

export default function HomeDashboard({ navigation }) {
  const [userProfile, setUserProfile] = useState(null);
  const [featuredAnimals, setFeaturedAnimals] = useState([
    { id: 'lion', name: 'Lion', emoji: '🦁', color: '#e57373' },
    { id: 'elephant', name: 'Elephant', emoji: '🐘', color: '#81c784' },
    { id: 'tiger', name: 'Tiger', emoji: '🐯', color: '#ff9800' },
    { id: 'panda', name: 'Panda', emoji: '🐼', color: '#607d8b' }
  ]);
  const [featuredHabitats, setFeaturedHabitats] = useState([
    { id: 'rainforest', name: 'Rainforest', icon: 'tree', color: '#2e7d32' },
    { id: 'savanna', name: 'Savanna', icon: 'sun', color: '#f57c00' },
    { id: 'arctic', name: 'Arctic', icon: 'snowflake', color: '#42a5f5' }
  ]);
  
  useEffect(() => {
    async function loadUserData() {
      const profile = await getUserProfile();
      setUserProfile(profile);
    }
    loadUserData();
  }, []);
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#1d4e31', '#2f6b47']}
        style={styles.header}
      >
        <Text style={styles.title}>ZooQuest</Text>
        <Text style={styles.subtitle}>Learn, Explore, Conserve</Text>
        
        {userProfile && (
          <View style={styles.profileSnapshot}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{userProfile.level}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.welcomeText}>Welcome back!</Text>
              <Text style={styles.xpText}>{userProfile.experience} XP</Text>
            </View>
          </View>
        )}
      </LinearGradient>
      
      <ScrollView style={styles.content}>
        {/* Quick Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.mainAction}
            onPress={() => navigation.navigate('AnimalChat')}
          >
            <LinearGradient
              colors={['#f9a825', '#f57f17']}
              style={styles.mainActionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <FontAwesome5 name="comments" size={28} color="#fff" />
              <Text style={styles.mainActionText}>Chat with Animals</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.subActions}>
            <TouchableOpacity 
              style={styles.subAction}
              onPress={() => navigation.navigate('Encyclopedia')}
            >
              <FontAwesome5 name="book" size={24} color="#fff" />
              <Text style={styles.subActionText}>Encyclopedia</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.subAction}
              onPress={() => navigation.navigate('Quests')}
            >
              <FontAwesome5 name="tasks" size={24} color="#fff" />
              <Text style={styles.subActionText}>Quests</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Featured Animals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Animals</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Encyclopedia')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.featuredScroll}
          >
            {featuredAnimals.map(animal => (
              <TouchableOpacity 
                key={animal.id}
                style={styles.animalCard}
                onPress={() => navigation.navigate('AnimalDetail', { animalType: animal.id })}
              >
                <LinearGradient
                  colors={[animal.color, darkenColor(animal.color, 30)]}
                  style={styles.animalCardGradient}
                >
                  <Text style={styles.animalEmoji}>{animal.emoji}</Text>
                  <Text style={styles.animalName}>{animal.name}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Featured Habitats */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore Habitats</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Habitat')}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.habitatGrid}>
            {featuredHabitats.map(habitat => (
              <TouchableOpacity 
                key={habitat.id}
                style={styles.habitatCard}
                onPress={() => navigation.navigate('Habitat', { biomeType: habitat.id })}
              >
                <LinearGradient
                  colors={[habitat.color, darkenColor(habitat.color, 30)]}
                  style={styles.habitatCardGradient}
                >
                  <FontAwesome5 name={habitat.icon} size={24} color="#fff" />
                  <Text style={styles.habitatName}>{habitat.name}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Conservation Call to Action */}
        <TouchableOpacity 
          style={styles.conservationCard}
          onPress={() => navigation.navigate('Conservation')}
        >
          <LinearGradient
            colors={['#2f6b47', '#1d4e31']}
            style={styles.conservationCardGradient}
          >
            <FontAwesome5 name="leaf" size={24} color="#fff" style={styles.conservationIcon} />
            <View>
              <Text style={styles.conservationTitle}>Make a Difference</Text>
              <Text style={styles.conservationText}>
                Support real-world conservation efforts with your points
              </Text>
            </View>
            <FontAwesome5 name="chevron-right" size={16} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// Helper function to darken a color
function darkenColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = (num >> 8 & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return '#' + (
    0x1000000 +
    (R < 0 ? 0 : R) * 0x10000 +
    (G < 0 ? 0 : G) * 0x100 +
    (B < 0 ? 0 : B)
  ).toString(16).slice(1);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
  },
  profileSnapshot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  levelBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f9c74f',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  welcomeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  xpText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  actionRow: {
    flexDirection: 'row',
    marginBottom: 24,
    height: 120,
  },
  mainAction: {
    flex: 2,
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mainActionGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainActionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
  },
  subActions: {
    flex: 1,
    justifyContent: 'space-between',
  },
  subAction: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  subActionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  seeAllText: {
    color: '#f9c74f',
    fontSize: 14,
  },
  featuredScroll: {
    marginLeft: -8,
  },
  animalCard: {
    width: 120,
    height: 160,
    marginHorizontal: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  animalCardGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  animalEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  animalName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  habitatGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  habitatCard: {
    width: (width - 48) / 3,
    height: 100,
    borderRadius: 16,
    overflow: 'hidden',
  },
  habitatCardGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  habitatName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  conservationCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 30,
  },
  conservationCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  conservationIcon: {
    marginRight: 16,
  },
  conservationTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  conservationText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    width: '85%',
  },
}); 