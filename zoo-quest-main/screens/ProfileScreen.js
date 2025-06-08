import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { getUserProfile } from '../utils/userProfile';
import { getActiveQuests } from '../utils/questSystem';

export default function ProfileScreen({ navigation }) {
  const [userProfile, setUserProfile] = useState(null);
  const [quests, setQuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function loadProfileData() {
      setIsLoading(true);
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
        
        const activeQuests = await getActiveQuests();
        setQuests(activeQuests);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadProfileData();
  }, []);
  
  if (isLoading || !userProfile) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }
  
  // Calculate level progress
  const levelProgress = (userProfile.experience % 100) / 100;
  const nextLevel = userProfile.level + 1;
  
  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#1d4e31', '#2f6b47']}
        style={styles.header}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {userProfile.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{userProfile.name}</Text>
            <Text style={styles.userTitle}>Wildlife Explorer</Text>
          </View>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userProfile.level}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userProfile.experience}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {userProfile.learnedFacts?.length || 0}
            </Text>
            <Text style={styles.statLabel}>Facts</Text>
          </View>
        </View>
        
        <View style={styles.levelContainer}>
          <Text style={styles.levelText}>
            Level {userProfile.level} • {Math.floor(levelProgress * 100)}% to Level {nextLevel}
          </Text>
          <View style={styles.levelProgressBar}>
            <View 
              style={[
                styles.levelProgressFill, 
                { width: `${levelProgress * 100}%` }
              ]} 
            />
          </View>
        </View>
      </LinearGradient>
      
      <View style={styles.badgesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Badges Earned</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.badgesContainer}
        >
          {userProfile.badges && userProfile.badges.length > 0 ? (
            userProfile.badges.map((badge, index) => (
              <View key={index} style={styles.badgeCard}>
                <View style={styles.badgeIcon}>
                  <FontAwesome5 
                    name={badge.icon || "medal"} 
                    size={24} 
                    color="#f9c74f" 
                  />
                </View>
                <Text style={styles.badgeName}>{badge.title}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyBadges}>
              <FontAwesome5 name="trophy" size={24} color="#666" />
              <Text style={styles.emptyText}>
                Complete quests to earn badges!
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
      
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('QuestList')}
          >
            <FontAwesome5 name="tasks" size={24} color="#f9c74f" />
            <Text style={styles.actionText}>View Quests</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Conservation')}
          >
            <FontAwesome5 name="hand-holding-heart" size={24} color="#f9c74f" />
            <Text style={styles.actionText}>Donate Points</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Encyclopedia')}
          >
            <FontAwesome5 name="book-open" size={24} color="#f9c74f" />
            <Text style={styles.actionText}>Encyclopedia</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Habitat')}
          >
            <FontAwesome5 name="mountain" size={24} color="#f9c74f" />
            <Text style={styles.actionText}>Visit Habitats</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('ConservationActions')}
          >
            <FontAwesome5 name="leaf" size={24} color="#f9c74f" />
            <Text style={styles.actionText}>Take Action</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.recentActivitySection}>
        <Text style={styles.sectionTitle}>Active Quests</Text>
        
        {quests.length > 0 ? (
          quests.slice(0, 3).map(quest => (
            <TouchableOpacity 
              key={quest.id} 
              style={styles.questCard}
              onPress={() => navigation.navigate('QuestDetail', { questId: quest.id })}
            >
              <FontAwesome5 name="star" size={24} color="#f9c74f" style={styles.questIcon} />
              <View style={styles.questInfo}>
                <Text style={styles.questTitle}>{quest.title}</Text>
                <View style={styles.questProgress}>
                  <View style={styles.questProgressBar}>
                    <View 
                      style={[
                        styles.questProgressFill, 
                        { width: `${quest.progressPercent}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.questProgressText}>
                    {quest.progress}/{quest.targetCount}
                  </Text>
                </View>
              </View>
              <FontAwesome5 name="chevron-right" size={16} color="#fff" />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>No active quests found</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
  header: {
    padding: 20,
    paddingTop: 50,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f9c74f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1d4e31',
  },
  profileInfo: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  userTitle: {
    fontSize: 16,
    color: '#f9c74f',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  statCard: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#ddd',
    marginTop: 4,
  },
  levelContainer: {
    marginTop: 24,
  },
  levelText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  levelProgressBar: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  levelProgressFill: {
    height: '100%',
    backgroundColor: '#f9c74f',
  },
  badgesSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  badgesContainer: {
    paddingBottom: 8,
  },
  badgeCard: {
    alignItems: 'center',
    marginRight: 16,
  },
  badgeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(47, 107, 71, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeName: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 80,
  },
  emptyBadges: {
    backgroundColor: 'rgba(47, 107, 71, 0.2)',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
  },
  emptyText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  actionsSection: {
    padding: 20,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    marginHorizontal: -8,
  },
  actionCard: {
    backgroundColor: 'rgba(47, 107, 71, 0.6)',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: '46%',
    marginHorizontal: '2%',
    marginBottom: 16,
  },
  actionText: {
    color: '#fff',
    marginTop: 8,
    fontWeight: '500',
  },
  recentActivitySection: {
    padding: 20,
    paddingBottom: 40,
  },
  questCard: {
    backgroundColor: 'rgba(47, 107, 71, 0.3)',
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
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
    marginBottom: 8,
  },
  questProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 8,
  },
  questProgressFill: {
    height: '100%',
    backgroundColor: '#f9c74f',
  },
  questProgressText: {
    fontSize: 12,
    color: '#ddd',
    minWidth: 40,
    textAlign: 'right',
  },
}); 