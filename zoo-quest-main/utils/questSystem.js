import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile, updateUserProfile } from './userProfile';

// Quest types and definitions
const questTemplates = {
  chat_with_animals: {
    title: 'Animal Conversations',
    description: 'Chat with different animals to learn about them',
    levels: [
      { count: 1, reward: 10, title: 'First Contact' },
      { count: 5, reward: 50, title: 'Friendly Explorer' },
      { count: 10, reward: 100, title: 'Animal Whisperer' },
    ]
  },
  learn_facts: {
    title: 'Knowledge Collector',
    description: 'Learn interesting facts about animals',
    levels: [
      { count: 3, reward: 15, title: 'Curious Mind' },
      { count: 10, reward: 60, title: 'Fact Finder' },
      { count: 25, reward: 150, title: 'Wildlife Scholar' },
    ]
  },
  endangered_awareness: {
    title: 'Conservation Champion',
    description: 'Learn about endangered species and conservation',
    levels: [
      { count: 2, reward: 20, title: 'Conservation Aware' },
      { count: 5, reward: 75, title: 'Habitat Protector' },
      { count: 10, reward: 200, title: 'Conservation Hero' },
    ]
  },
  biome_explorer: {
    title: 'Biome Explorer',
    description: 'Discover animals from different habitats around the world',
    levels: [
      { count: 2, reward: 20, title: 'Habitat Visitor' },
      { count: 4, reward: 80, title: 'Ecosystem Explorer' },
      { count: 6, reward: 180, title: 'Global Naturalist' },
    ]
  }
};

// Initialize quests for a new user
export async function initializeQuests() {
  try {
    const existingQuests = await AsyncStorage.getItem('userQuests');
    if (existingQuests) return JSON.parse(existingQuests);
    
    // Create a new quest tracking object
    const newQuests = Object.entries(questTemplates).reduce((acc, [questType, template]) => {
      // Initialize each quest type with level 0 (not started)
      acc[questType] = {
        type: questType,
        currentLevel: 0,
        progress: 0,
        completedLevels: [],
        lastUpdated: new Date().toISOString(),
        ...template
      };
      return acc;
    }, {});
    
    await AsyncStorage.setItem('userQuests', JSON.stringify(newQuests));
    return newQuests;
  } catch (error) {
    console.error('Error initializing quests:', error);
    return {};
  }
}

// Update quest progress
export async function updateQuestProgress(questType, increment = 1) {
  try {
    const userQuests = await AsyncStorage.getItem('userQuests') || '{}';
    const quests = JSON.parse(userQuests);
    
    // If quest doesn't exist, initialize quests first
    if (!quests[questType]) {
      await initializeQuests();
      return updateQuestProgress(questType, increment);
    }
    
    const quest = quests[questType];
    const newProgress = quest.progress + increment;
    const currentLevelIndex = quest.currentLevel;
    const levels = quest.levels;
    
    // Check if this progress completes the current level
    let experienceGained = 0;
    let leveledUp = false;
    let newBadge = null;
    
    if (currentLevelIndex < levels.length && 
        newProgress >= levels[currentLevelIndex].count) {
      // Level up!
      leveledUp = true;
      experienceGained = levels[currentLevelIndex].reward;
      newBadge = {
        id: `badge_${questType}_${currentLevelIndex}`,
        name: levels[currentLevelIndex].title,
        description: `${quest.title} - Level ${currentLevelIndex + 1}`,
        questType,
        level: currentLevelIndex + 1,
        earnedAt: new Date().toISOString()
      };
      
      // Update user profile with XP and badge
      const userProfile = await getUserProfile();
      await updateUserProfile({
        experience: userProfile.experience + experienceGained,
        badges: [...userProfile.badges, newBadge]
      });
      
      // Update quest state
      quests[questType] = {
        ...quest,
        currentLevel: currentLevelIndex + 1,
        progress: newProgress,
        completedLevels: [
          ...quest.completedLevels,
          {
            level: currentLevelIndex + 1,
            completedAt: new Date().toISOString()
          }
        ],
        lastUpdated: new Date().toISOString()
      };
    } else {
      // Just update progress
      quests[questType] = {
        ...quest,
        progress: newProgress,
        lastUpdated: new Date().toISOString()
      };
    }
    
    await AsyncStorage.setItem('userQuests', JSON.stringify(quests));
    
    return {
      questType,
      newProgress,
      leveledUp,
      experienceGained,
      newBadge
    };
  } catch (error) {
    console.error('Error updating quest progress:', error);
    return { error: error.message };
  }
}

// Get all active quests with their progress
export async function getActiveQuests() {
  try {
    const quests = await initializeQuests();
    
    return Object.values(quests)
      .filter(quest => quest.currentLevel < quest.levels.length)
      .map(quest => {
        const currentLevel = quest.levels[quest.currentLevel] || { count: 0 };
        const progressPercent = currentLevel.count > 0 
          ? Math.min(Math.round((quest.progress / currentLevel.count) * 100), 100)
          : 100;
          
        return {
          ...quest,
          targetCount: currentLevel.count,
          progressPercent,
          nextReward: currentLevel.reward,
          nextTitle: currentLevel.title
        };
      });
  } catch (error) {
    console.error('Error getting active quests:', error);
    return [];
  }
} 