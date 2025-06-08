import AsyncStorage from '@react-native-async-storage/async-storage';

// User profile structure
const defaultProfile = {
  id: null,
  name: 'Guest Explorer',
  age: null,
  avatar: 'default',
  favoriteAnimals: [],
  learnedFacts: [],
  completedQuests: [],
  experience: 0,
  level: 1,
  badges: [],
  settings: {
    notificationsEnabled: true,
    parentalControlsEnabled: false,
    ageAppropriateContent: true
  },
  lastVisit: new Date().toISOString(),
  visitCount: 0
};

// Get the user profile from AsyncStorage
export async function getUserProfile() {
  try {
    const profileJson = await AsyncStorage.getItem('userProfile');
    if (!profileJson) {
      // First time user, create default profile with generated ID
      const newProfile = {
        ...defaultProfile,
        id: `user_${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      await AsyncStorage.setItem('userProfile', JSON.stringify(newProfile));
      return newProfile;
    }
    return JSON.parse(profileJson);
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    return defaultProfile;
  }
}

// Update the user profile
export async function updateUserProfile(updates) {
  try {
    const currentProfile = await getUserProfile();
    const updatedProfile = {
      ...currentProfile,
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    return updatedProfile;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
}

// Track a new animal fact that the user has learned
export async function trackLearnedFact(animalType, factCategory, factContent) {
  try {
    const profile = await getUserProfile();
    
    // Check if this fact is already tracked
    const isFactNew = !profile.learnedFacts.some(
      fact => fact.animalType === animalType && fact.content === factContent
    );
    
    if (isFactNew) {
      const updatedFacts = [
        ...profile.learnedFacts,
        {
          id: `fact_${Date.now()}`,
          animalType,
          category: factCategory,
          content: factContent,
          learnedAt: new Date().toISOString()
        }
      ];
      
      // Award experience points for learning a new fact
      const newExperience = profile.experience + 5;
      const newLevel = Math.floor(newExperience / 100) + 1;
      
      // Check if user leveled up
      const didLevelUp = newLevel > profile.level;
      
      await updateUserProfile({
        learnedFacts: updatedFacts,
        experience: newExperience,
        level: newLevel
      });
      
      return {
        isFactNew: true,
        experienceGained: 5,
        didLevelUp,
        newLevel: didLevelUp ? newLevel : null
      };
    }
    
    return {
      isFactNew: false,
      experienceGained: 0,
      didLevelUp: false
    };
  } catch (error) {
    console.error('Error tracking learned fact:', error);
    return {
      isFactNew: false,
      experienceGained: 0,
      didLevelUp: false,
      error: error.message
    };
  }
} 