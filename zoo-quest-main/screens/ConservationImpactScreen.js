import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { getUserProfile } from '../utils/userProfile';
import { getActiveQuests } from '../utils/questSystem';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Conservation project data
const conservationProjects = [
  {
    id: 'project1',
    name: 'African Lion Recovery',
    organization: 'Wildlife Conservation Network',
    description: 'Protecting lion habitats and reducing human-wildlife conflict in East Africa.',
    impact: 'Support ranger patrols, community education, and habitat restoration.',
    targetAmount: 10000,
    currentAmount: 7250,
    animalTypes: ['lion'],
    imageUrl: 'https://source.unsplash.com/random/?lion,conservation',
    websiteUrl: 'https://wildnet.org/',
  },
  {
    id: 'project2',
    name: 'Elephant Corridors Initiative',
    organization: 'Elephant Protection Trust',
    description: 'Creating safe passages for elephants to move between fragmented habitats.',
    impact: 'Fund land acquisition for corridors and work with local communities.',
    targetAmount: 15000,
    currentAmount: 9800,
    animalTypes: ['elephant'],
    imageUrl: 'https://source.unsplash.com/random/?elephant,conservation',
    websiteUrl: 'https://elephants.org',
  },
  {
    id: 'project3',
    name: 'Coral Reef Restoration',
    organization: 'Marine Conservation Alliance',
    description: 'Rebuilding damaged coral reefs and establishing marine protected areas.',
    impact: 'Support coral nurseries, reef monitoring, and marine conservation education.',
    targetAmount: 8000,
    currentAmount: 3200,
    animalTypes: ['fish', 'turtle'],
    imageUrl: 'https://source.unsplash.com/random/?coral,reef',
    websiteUrl: 'https://coralrestoration.org',
  },
];

export default function ConservationImpactScreen({ navigation }) {
  const [userProfile, setUserProfile] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [allocatedPoints, setAllocatedPoints] = useState({});
  const [remainingPoints, setRemainingPoints] = useState(0);
  const [quests, setQuests] = useState([]);
  
  useEffect(() => {
    async function loadUserData() {
      const profile = await getUserProfile();
      setUserProfile(profile);
      
      // Calculate available conservation points
      const totalEarnedPoints = profile.experience || 0;
      let savedAllocations = {};
      
      try {
        const savedData = await AsyncStorage.getItem('conservationAllocations');
        savedAllocations = savedData ? JSON.parse(savedData) : {};
      } catch (error) {
        console.error('Error loading allocations:', error);
        savedAllocations = {};
      }
      
      setUserPoints(totalEarnedPoints);
      setAllocatedPoints(savedAllocations);
      
      // Calculate remaining points
      const totalAllocated = Object.values(savedAllocations).reduce((sum, value) => sum + value, 0);
      setRemainingPoints(totalEarnedPoints - totalAllocated);
      
      // Load active quests that can earn more points
      const activeQuests = await getActiveQuests();
      setQuests(activeQuests);
    }
    
    loadUserData();
  }, []);
  
  const handleAllocatePoints = async (projectId, amount) => {
    if (remainingPoints < amount) {
      Alert.alert('Not enough points', 'You don\'t have enough conservation points for this donation.');
      return;
    }
    
    const newAllocations = {
      ...allocatedPoints,
      [projectId]: (allocatedPoints[projectId] || 0) + amount
    };
    
    setAllocatedPoints(newAllocations);
    setRemainingPoints(remainingPoints - amount);
    
    try {
      await AsyncStorage.setItem('conservationAllocations', JSON.stringify(newAllocations));
      
      // Show success message
      Alert.alert(
        'Thank You!',
        `You've allocated ${amount} points to this conservation project. Your virtual actions are making a real difference!`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Failed to save allocations:', error);
      Alert.alert('Error', 'Failed to save your contribution. Please try again.');
    }
  };
  
  const visitProjectWebsite = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this website.');
      }
    });
  };
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1d4e31', '#2f6b47']}
        style={styles.header}
      >
        <Text style={styles.title}>Conservation Impact</Text>
        <Text style={styles.subtitle}>Turn your learning into real-world action</Text>
        
        <View style={styles.pointsContainer}>
          <View style={styles.pointsCard}>
            <Text style={styles.pointsValue}>{userPoints}</Text>
            <Text style={styles.pointsLabel}>Total Points</Text>
          </View>
          
          <View style={styles.pointsCard}>
            <Text style={styles.pointsValue}>{remainingPoints}</Text>
            <Text style={styles.pointsLabel}>Available</Text>
          </View>
          
          <View style={styles.pointsCard}>
            <Text style={styles.pointsValue}>{userPoints - remainingPoints}</Text>
            <Text style={styles.pointsLabel}>Donated</Text>
          </View>
        </View>
      </LinearGradient>
      
      <ScrollView style={styles.projectsContainer}>
        <Text style={styles.sectionTitle}>Active Conservation Projects</Text>
        
        {conservationProjects.map(project => {
          const projectAllocated = allocatedPoints[project.id] || 0;
          const totalFunding = project.currentAmount + projectAllocated;
          const progressPercent = (totalFunding / project.targetAmount) * 100;
          
          return (
            <View key={project.id} style={styles.projectCard}>
              <Image
                source={{ uri: project.imageUrl }}
                style={styles.projectImage}
                resizeMode="cover"
              />
              
              <View style={styles.projectContent}>
                <Text style={styles.projectName}>{project.name}</Text>
                <Text style={styles.projectOrg}>{project.organization}</Text>
                <Text style={styles.projectDescription}>{project.description}</Text>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${progressPercent}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {totalFunding} / {project.targetAmount} points ({Math.round(progressPercent)}%)
                  </Text>
                </View>
                
                {projectAllocated > 0 && (
                  <Text style={styles.contributionText}>
                    You've contributed: {projectAllocated} points
                  </Text>
                )}
                
                <View style={styles.contributionContainer}>
                  <Text style={styles.contributionText}>Contribute your points:</Text>
                  <View style={styles.allocationButtons}>
                    <TouchableOpacity
                      style={[
                        styles.allocateButton,
                        remainingPoints < 10 && styles.disabledButton
                      ]}
                      onPress={() => handleAllocatePoints(project.id, 10)}
                      disabled={remainingPoints < 10}
                    >
                      <Text style={styles.allocateButtonText}>10 pts</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.allocateButton,
                        remainingPoints < 50 && styles.disabledButton
                      ]}
                      onPress={() => handleAllocatePoints(project.id, 50)}
                      disabled={remainingPoints < 50}
                    >
                      <Text style={styles.allocateButtonText}>50 pts</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.allocateButton,
                        remainingPoints < 100 && styles.disabledButton
                      ]}
                      onPress={() => handleAllocatePoints(project.id, 100)}
                      disabled={remainingPoints < 100}
                    >
                      <Text style={styles.allocateButtonText}>100 pts</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <TouchableOpacity
                  style={styles.learnMoreButton}
                  onPress={() => visitProjectWebsite(project.websiteUrl)}
                >
                  <Text style={styles.learnMoreText}>Learn More</Text>
                  <FontAwesome5 name="external-link-alt" size={14} color="#f9c74f" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
        
        <Text style={styles.sectionTitle}>Earn More Points</Text>
        <View style={styles.questsContainer}>
          {quests.slice(0, 3).map(quest => (
            <TouchableOpacity 
              key={quest.id} 
              style={styles.questCard}
              onPress={() => navigation.navigate('QuestDetail', { questId: quest.id })}
            >
              <FontAwesome5 name="star" size={24} color="#f9c74f" style={styles.questIcon} />
              <View style={styles.questInfo}>
                <Text style={styles.questTitle}>{quest.title}</Text>
                <Text style={styles.questDescription}>{quest.description}</Text>
                <Text style={styles.questReward}>Reward: +{quest.nextReward} points</Text>
              </View>
              <FontAwesome5 name="chevron-right" size={16} color="#fff" />
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('ConservationActions')}
        >
          <FontAwesome5 name="hand-paper" size={18} color="#fff" style={styles.actionButtonIcon} />
          <Text style={styles.actionButtonText}>Take Real-World Actions</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#f9c74f',
    textAlign: 'center',
    marginTop: 8,
  },
  pointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 10,
  },
  pointsCard: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#ddd',
    marginTop: 4,
  },
  projectsContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 16,
  },
  projectCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  projectImage: {
    width: '100%',
    height: 160,
  },
  projectContent: {
    padding: 16,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  projectOrg: {
    fontSize: 14,
    color: '#f9c74f',
    marginBottom: 8,
  },
  projectDescription: {
    fontSize: 14,
    color: '#ddd',
    marginBottom: 12,
  },
  progressContainer: {
    marginVertical: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
  progressText: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
    textAlign: 'right',
  },
  contributionText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  contributionContainer: {
    marginTop: 12,
  },
  allocationButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  allocateButton: {
    backgroundColor: '#2f6b47',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  allocateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: 'rgba(47, 107, 71, 0.3)',
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  learnMoreText: {
    color: '#f9c74f',
    marginRight: 8,
    fontWeight: 'bold',
  },
  questsContainer: {
    marginBottom: 30,
  },
  questCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  questIcon: {
    marginRight: 16,
  },
  questInfo: {
    flex: 1,
  },
  questTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  questDescription: {
    fontSize: 12,
    color: '#ddd',
    marginVertical: 4,
  },
  questReward: {
    fontSize: 12,
    color: '#f9c74f',
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: '#4caf50',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  actionButtonIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 