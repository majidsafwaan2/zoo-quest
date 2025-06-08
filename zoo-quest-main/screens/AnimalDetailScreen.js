import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  StatusBar,
  Linking
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { animalProfiles } from '../utils/animalProfiles';
import { trackLearnedFact } from '../utils/userProfile';
import { enhancedAskGPT } from '../utils/enhancedGpt';

const { width } = Dimensions.get('window');

export default function AnimalDetailScreen({ route, navigation }) {
  const { animalType } = route.params;
  const [animal, setAnimal] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [factLearned, setFactLearned] = useState(null);
  
  // Get animal data and setup
  useEffect(() => {
    const animalData = animalProfiles[animalType];
    if (animalData) {
      setAnimal(animalData);
    } else {
      navigation.goBack();
    }
  }, [animalType]);
  
  // Record when user views animal detail
  useEffect(() => {
    async function recordAnimalView() {
      if (animal) {
        // Select a random fact to mark as learned
        const factIndex = Math.floor(Math.random() * animal.funFacts.length);
        const fact = animal.funFacts[factIndex];
        
        // Record fact as learned
        const result = await trackLearnedFact(fact, animalType);
        
        if (result.isFactNew && result.experienceGained > 0) {
          setFactLearned({
            fact,
            xp: result.experienceGained,
            levelUp: result.didLevelUp
          });
        }
      }
    }
    
    recordAnimalView();
  }, [animal]);
  
  const handleAskAI = async () => {
    setIsLoading(true);
    setAiResponse('');
    
    try {
      const questions = [
        `What makes ${animal.name}s unique among ${animal.category}s?`,
        `What's the most interesting thing about ${animal.name}s?`,
        `Why are ${animal.conservationStatus === 'Least Concern' ? 'some animals' : animal.name + 's'} ${animal.conservationStatus.toLowerCase()}?`,
        `What would happen if ${animal.name}s disappeared from their habitat?`
      ];
      
      // Pick a random question
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      
      const response = await enhancedAskGPT(randomQuestion, animalType);
      setAiResponse(response);
      
      // Track this as a fact learned too
      await trackLearnedFact(response.slice(0, 120) + "...", animalType);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      setAiResponse('Sorry, I could not get more information right now. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!animal) return null;
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header Image Section */}
      <ScrollView 
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: animal.imageUrls?.profile || `https://source.unsplash.com/random/?${animal.name}` }}
            style={styles.headerImage}
          />
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.imageFade}
          />
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome5 name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.animalEmoji}>{animal.emoji}</Text>
            <Text style={styles.animalName}>{animal.name}</Text>
            <Text style={styles.scientificName}>{animal.scientificName}</Text>
            
            <View style={styles.tags}>
              <View style={[styles.tag, { backgroundColor: getConservationColor(animal.conservationStatus) }]}>
                <Text style={styles.tagText}>{animal.conservationStatus}</Text>
              </View>
              
              <View style={[styles.tag, { backgroundColor: '#555' }]}>
                <Text style={styles.tagText}>{animal.category}</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabScroll}
          >
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
              onPress={() => setActiveTab('overview')}
            >
              <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>Overview</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'habitat' && styles.activeTab]}
              onPress={() => setActiveTab('habitat')}
            >
              <Text style={[styles.tabText, activeTab === 'habitat' && styles.activeTabText]}>Habitat</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'facts' && styles.activeTab]}
              onPress={() => setActiveTab('facts')}
            >
              <Text style={[styles.tabText, activeTab === 'facts' && styles.activeTabText]}>Fun Facts</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'conservation' && styles.activeTab]}
              onPress={() => setActiveTab('conservation')}
            >
              <Text style={[styles.tabText, activeTab === 'conservation' && styles.activeTabText]}>Conservation</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        
        {/* Tab Content */}
        <View style={styles.contentContainer}>
          {activeTab === 'overview' && (
            <View style={styles.tabContent}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <FontAwesome5 name="weight" size={20} color="#f9c74f" />
                  <Text style={styles.statValue}>{animal.size?.weight} kg</Text>
                  <Text style={styles.statLabel}>Weight</Text>
                </View>
                
                <View style={styles.statItem}>
                  <FontAwesome5 name="ruler-vertical" size={20} color="#f9c74f" />
                  <Text style={styles.statValue}>{animal.size?.height} m</Text>
                  <Text style={styles.statLabel}>Height</Text>
                </View>
                
                <View style={styles.statItem}>
                  <FontAwesome5 name="birthday-cake" size={20} color="#f9c74f" />
                  <Text style={styles.statValue}>{animal.lifespan} yrs</Text>
                  <Text style={styles.statLabel}>Lifespan</Text>
                </View>
              </View>
              
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.sectionText}>
                  The {animal.name} is a {animal.dietType} {animal.category}. They are known for their
                  {animal.specialAbilities.map(ability => ` ${ability},`)} and can live up to {animal.lifespan} years in the wild.
                </Text>
              </View>
              
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Personality</Text>
                <Text style={styles.sectionText}>
                  {animal.name}s are typically {animal.personalityTraits.join(', ')}.
                  When they communicate, they sound {animal.voiceCharacteristics}.
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.aiButton}
                onPress={handleAskAI}
                disabled={isLoading}
              >
                <Text style={styles.aiButtonText}>
                  {isLoading ? 'Thinking...' : 'Ask AI About This Animal'}
                </Text>
              </TouchableOpacity>
              
              {aiResponse ? (
                <View style={styles.aiResponseContainer}>
                  <Text style={styles.aiResponseText}>{aiResponse}</Text>
                </View>
              ) : null}
            </View>
          )}
          
          {activeTab === 'habitat' && (
            <View style={styles.tabContent}>
              <Image
                source={{ uri: animal.imageUrls?.habitat || `https://source.unsplash.com/random/?${animal.nativeBiomes[0]}` }}
                style={styles.habitatImage}
              />
              
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Native Habitat</Text>
                <Text style={styles.sectionText}>
                  {animal.habitatDescription}
                </Text>
              </View>
              
              <View style={styles.biomeContainer}>
                <Text style={styles.sectionTitle}>Found In</Text>
                <View style={styles.biomeList}>
                  {animal.nativeBiomes.map((biome, index) => (
                    <View key={index} style={styles.biomeTag}>
                      <Text style={styles.biomeText}>{biome}</Text>
                    </View>
                  ))}
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.explorerButton}
                onPress={() => navigation.navigate('Habitat', { biomeType: animal.nativeBiomes[0], animalName: animal.name })}
              >
                <FontAwesome5 name="mountain" size={16} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.explorerButtonText}>Explore {animal.nativeBiomes[0]} Habitat</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {activeTab === 'facts' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>Interesting Facts</Text>
              
              {animal.funFacts.map((fact, index) => (
                <View key={index} style={styles.factCard}>
                  <Text style={styles.factNumber}>{index + 1}</Text>
                  <Text style={styles.factText}>{fact}</Text>
                </View>
              ))}
              
              <View style={styles.relatedContainer}>
                <Text style={styles.sectionTitle}>Related Species</Text>
                <View style={styles.relatedList}>
                  {animal.relatedSpecies.map((species, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={styles.relatedTag}
                      onPress={() => {
                        if (animalProfiles[species]) {
                          navigation.push('AnimalDetail', { animalType: species });
                        }
                      }}
                    >
                      <Text style={styles.relatedText}>{species}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}
          
          {activeTab === 'conservation' && (
            <View style={styles.tabContent}>
              <View style={[styles.conservationStatus, { backgroundColor: getConservationColor(animal.conservationStatus) }]}>
                <Text style={styles.conservationStatusTitle}>Current Status: {animal.conservationStatus}</Text>
                <Text style={styles.conservationStatusDescription}>
                  {getConservationDescription(animal.conservationStatus)}
                </Text>
              </View>
              
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Conservation Challenges</Text>
                {animal.conservationChallenges.map((challenge, index) => (
                  <View key={index} style={styles.challengeItem}>
                    <FontAwesome5 name="exclamation-triangle" size={14} color="#f9c74f" style={{ marginRight: 8 }} />
                    <Text style={styles.challengeText}>{challenge}</Text>
                  </View>
                ))}
              </View>
              
              <TouchableOpacity 
                style={styles.donateButton}
                onPress={() => navigation.navigate('Conservation')}
              >
                <FontAwesome5 name="hand-holding-heart" size={16} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.donateButtonText}>Support Conservation Efforts</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.learnMoreButton}
                onPress={() => Linking.openURL(`https://www.iucnredlist.org/search?query=${animal.name}`)}
              >
                <Text style={styles.learnMoreText}>Learn more on IUCN Red List</Text>
                <FontAwesome5 name="external-link-alt" size={14} color="#f9c74f" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Fact learned notification */}
      {factLearned && (
        <View style={styles.factLearnedContainer}>
          <LinearGradient
            colors={['#2f6b47', '#1d4e31']}
            style={styles.factLearnedContent}
          >
            <FontAwesome5 name="lightbulb" size={24} color="#f9c74f" />
            <View style={styles.factLearnedInfo}>
              <Text style={styles.factLearnedTitle}>New Fact Learned!</Text>
              <Text style={styles.factLearnedXP}>+{factLearned.xp} XP</Text>
            </View>
            <TouchableOpacity 
              style={styles.factLearnedClose}
              onPress={() => setFactLearned(null)}
            >
              <FontAwesome5 name="times" size={16} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}
    </View>
  );
}

// Helper functions
function getConservationColor(status) {
  switch(status) {
    case 'Least Concern': return '#4caf50';
    case 'Near Threatened': return '#8bc34a';
    case 'Vulnerable': return '#ffc107';
    case 'Endangered': return '#ff9800';
    case 'Critically Endangered': return '#f44336';
    case 'Extinct in the Wild': return '#9c27b0';
    case 'Extinct': return '#000000';
    default: return '#808080';
  }
}

function getConservationDescription(status) {
  switch(status) {
    case 'Least Concern': 
      return 'Species evaluated as not being a focus of species conservation. They do not qualify as threatened or near threatened.';
    case 'Near Threatened': 
      return 'Species close to qualifying for a threatened category in the near future.';
    case 'Vulnerable': 
      return 'Species considered to be facing a high risk of extinction in the wild.';
    case 'Endangered': 
      return 'Species considered to be facing a very high risk of extinction in the wild.';
    case 'Critically Endangered': 
      return 'Species considered to be facing an extremely high risk of extinction in the wild.';
    case 'Extinct in the Wild': 
      return 'Species known only to survive in cultivation, in captivity or as a naturalized population well outside its historical range.';
    case 'Extinct': 
      return 'There is no reasonable doubt that the last individual of this species has died.';
    default: 
      return 'Conservation status unknown.';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d4e31',
  },
  imageContainer: {
    height: 350,
    width: '100%',
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  headerContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  animalEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  animalName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'capitalize',
  },
  scientificName: {
    fontSize: 16,
    color: '#ddd',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  tagText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  tabContainer: {
    backgroundColor: '#2f6b47',
  },
  tabScroll: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#f9c74f',
  },
  tabText: {
    color: '#fff',
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#f9c74f',
  },
  contentContainer: {
    minHeight: 600,
    backgroundColor: '#1d4e31',
  },
  tabContent: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#aaa',
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: '#ddd',
    lineHeight: 24,
  },
  habitatImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  biomeContainer: {
    marginBottom: 24,
  },
  biomeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  biomeTag: {
    backgroundColor: '#2f6b47',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  biomeText: {
    color: '#fff',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  factCard: {
    backgroundColor: '#2f6b47',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
  },
  factNumber: {
    color: '#f9c74f',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 12,
  },
  factText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    lineHeight: 24,
  },
  relatedContainer: {
    marginTop: 20,
  },
  relatedList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  relatedTag: {
    backgroundColor: '#2f6b47',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  relatedText: {
    color: '#fff',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  conservationStatus: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  conservationStatusTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  conservationStatusDescription: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 22,
  },
  challengeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeText: {
    color: '#ddd',
    fontSize: 16,
    flex: 1,
  },
  donateButton: {
    backgroundColor: '#f44336',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  donateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  explorerButton: {
    backgroundColor: '#2196f3',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  explorerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  learnMoreText: {
    color: '#f9c74f',
    marginRight: 8,
  },
  aiButton: {
    backgroundColor: '#9c27b0',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 20,
  },
  aiButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  aiResponseContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  aiResponseText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  factLearnedContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  factLearnedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 16,
  },
  factLearnedInfo: {
    flex: 1,
    marginLeft: 12,
  },
  factLearnedTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  factLearnedXP: {
    color: '#f9c74f',
    fontSize: 14,
  },
  factLearnedClose: {
    padding: 8,
  }
}); 