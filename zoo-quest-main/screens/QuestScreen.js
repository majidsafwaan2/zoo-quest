import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ScrollView 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Sample quest data - in a real app, this would come from a database or API
const sampleQuests = [
  {
    id: '1',
    title: 'Conservation Champion',
    description: 'Learn about 5 endangered species and the efforts to protect them',
    difficulty: 'Medium',
    xpReward: 100,
    progress: 3,
    total: 5,
    icon: 'shield-alt',
    color: '#4caf50',
    animals: ['tiger', 'panda', 'rhino', 'gorilla', 'sea-turtle']
  },
  {
    id: '2',
    title: 'Habitat Explorer',
    description: 'Discover animals from each major biome on Earth',
    difficulty: 'Hard',
    xpReward: 200,
    progress: 2,
    total: 7,
    icon: 'globe-americas',
    color: '#2196f3',
    biomes: ['savanna', 'rainforest', 'desert', 'arctic', 'ocean', 'grassland', 'forest']
  },
  {
    id: '3',
    title: 'Animal Expert',
    description: 'Chat with 10 different animals and learn their facts',
    difficulty: 'Easy',
    xpReward: 50,
    progress: 4,
    total: 10,
    icon: 'comments',
    color: '#ff9800'
  },
  {
    id: '4',
    title: 'Conservation Action',
    description: 'Complete 3 real-world conservation activities',
    difficulty: 'Challenge',
    xpReward: 300,
    progress: 0,
    total: 3,
    icon: 'hands-helping',
    color: '#9c27b0',
    activities: ['Reduce plastic use', 'Plant native species', 'Support conservation org']
  },
];

export default function QuestScreen({ navigation }) {
  const [quests, setQuests] = useState(sampleQuests);
  const [userLevel, setUserLevel] = useState(3);
  const [userXp, setUserXp] = useState(275);
  const [maxXp, setMaxXp] = useState(500);

  // Calculate overall progress
  const totalCompleted = quests.reduce((acc, quest) => acc + quest.progress, 0);
  const totalRequired = quests.reduce((acc, quest) => acc + quest.total, 0);
  const overallProgress = Math.round((totalCompleted / totalRequired) * 100);

  const renderQuestItem = ({ item }) => {
    const progressPercent = (item.progress / item.total) * 100;
    const isComplete = item.progress === item.total;
    
    return (
      <TouchableOpacity 
        style={[styles.questCard, isComplete && styles.questComplete]}
        onPress={() => navigation.navigate('QuestDetail', { questId: item.id })}
      >
        <View style={[styles.questIcon, { backgroundColor: item.color }]}>
          <FontAwesome5 name={item.icon} size={24} color="#fff" />
        </View>
        
        <View style={styles.questContent}>
          <View style={styles.questHeader}>
            <Text style={styles.questTitle}>{item.title}</Text>
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>{item.difficulty}</Text>
            </View>
          </View>
          
          <Text style={styles.questDescription}>{item.description}</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progressPercent}%`, backgroundColor: item.color }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{item.progress}/{item.total}</Text>
          </View>
          
          <View style={styles.rewardContainer}>
            <FontAwesome5 name="star" size={14} color="#ffc107" />
            <Text style={styles.rewardText}>{item.xpReward} XP</Text>
          </View>
        </View>
        
        {isComplete && (
          <View style={styles.completeBadge}>
            <FontAwesome5 name="check-circle" size={20} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#1d4e31', '#2c7a4c']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Conservation Quests</Text>
        
        <View style={styles.profileContainer}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{userLevel}</Text>
          </View>
          
          <View style={styles.xpContainer}>
            <View style={styles.xpBar}>
              <View 
                style={[
                  styles.xpFill, 
                  { width: `${(userXp / maxXp) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.xpText}>{userXp}/{maxXp} XP</Text>
          </View>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{overallProgress}%</Text>
            <Text style={styles.statLabel}>Complete</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{quests.filter(q => q.progress === q.total).length}</Text>
            <Text style={styles.statLabel}>Quests Completed</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{quests.length - quests.filter(q => q.progress === q.total).length}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
        </View>
      </LinearGradient>
      
      <FlatList
        data={quests}
        renderItem={renderQuestItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.questList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    color: '#1d4e31',
  },
  xpContainer: {
    flex: 1,
  },
  xpBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#f9c74f',
    borderRadius: 4,
  },
  xpText: {
    fontSize: 12,
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  questList: {
    padding: 16,
  },
  questCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  questComplete: {
    opacity: 0.7,
  },
  questIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  questContent: {
    flex: 1,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  difficultyBadge: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  difficultyText: {
    fontSize: 10,
    color: '#666',
  },
  questDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  completeBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 