import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Switch,
  TextInput,
  Modal,
  ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getUserProfile, updateUserProfile } from '../utils/userProfile';
import { updateQuestProgress } from '../utils/questSystem';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Real-world conservation actions
const conservationActions = [
  {
    id: 'plastic',
    title: 'Reduce Plastic Use',
    description: 'Track your plastic reduction goals and see your impact on ocean life.',
    icon: 'trash-alt',
    color: '#2196f3',
    tasks: [
      { id: 'reusable-bottle', text: 'Use a reusable water bottle', points: 10 },
      { id: 'reusable-bags', text: 'Shop with reusable bags', points: 10 },
      { id: 'plastic-free-day', text: 'Have a plastic-free day', points: 20 },
      { id: 'beach-cleanup', text: 'Participate in a beach cleanup', points: 50 }
    ],
    impact: 'Reducing plastic waste helps prevent ocean pollution that affects marine animals like sea turtles, dolphins, and fish.',
    factoid: 'Over 8 million tons of plastic enter our oceans each year, threatening marine life.'
  },
  {
    id: 'plants',
    title: 'Plant for Wildlife',
    description: 'Plant native species to support local wildlife and biodiversity.',
    icon: 'seedling',
    color: '#4caf50',
    tasks: [
      { id: 'native-plant', text: 'Plant a native species', points: 30 },
      { id: 'pollinator-garden', text: 'Create a pollinator garden', points: 40 },
      { id: 'bird-feeder', text: 'Install a bird feeder', points: 15 },
      { id: 'tree-planting', text: 'Join a community tree planting event', points: 50 }
    ],
    impact: 'Native plants provide essential habitat and food for local wildlife, including birds, butterflies, and other pollinators.',
    factoid: 'Native oak trees can support over 500 species of caterpillars, which are essential food for birds.'
  },
  {
    id: 'water',
    title: 'Water Conservation',
    description: 'Track your water usage and reduce waste to help wildlife habitats.',
    icon: 'water',
    color: '#03a9f4',
    tasks: [
      { id: 'shorter-shower', text: 'Take a shorter shower', points: 10 },
      { id: 'fix-leaks', text: 'Fix a leaky faucet', points: 25 },
      { id: 'rain-barrel', text: 'Install a rain barrel', points: 40 },
      { id: 'irrigation', text: 'Use efficient irrigation for plants', points: 20 }
    ],
    impact: 'Conserving water helps maintain natural water sources that wildlife depends on, especially in drought-prone areas.',
    factoid: 'A single leaky faucet can waste up to 3,000 gallons of water per year.'
  },
  {
    id: 'awareness',
    title: 'Spread Awareness',
    description: 'Share conservation knowledge with friends and family.',
    icon: 'bullhorn',
    color: '#ff9800',
    tasks: [
      { id: 'social-post', text: 'Share a conservation post on social media', points: 15 },
      { id: 'teach-others', text: 'Teach someone about an endangered species', points: 20 },
      { id: 'documentary', text: 'Watch a nature documentary with others', points: 25 },
      { id: 'petition', text: 'Sign and share a conservation petition', points: 30 }
    ],
    impact: 'Raising awareness helps build community support for conservation initiatives and can lead to policy changes.',
    factoid: 'Environmental education programs have been shown to increase pro-conservation behaviors by up to 50%.'
  }
];

export default function ConservationActionsScreen({ navigation }) {
  const [userProfile, setUserProfile] = useState(null);
  const [completedTasks, setCompletedTasks] = useState({});
  const [expandedAction, setExpandedAction] = useState(null);
  const [reflection, setReflection] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [recentPoints, setRecentPoints] = useState(0);
  
  useEffect(() => {
    loadUserData();
  }, []);
  
  const loadUserData = async () => {
    try {
      const profile = await getUserProfile();
      setUserProfile(profile);
      
      // Load completed conservation tasks
      const savedTasks = await AsyncStorage.getItem('completedConservationTasks');
      if (savedTasks) {
        setCompletedTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };
  
  const toggleTask = async (actionId, taskId) => {
    try {
      const newCompletedTasks = { ...completedTasks };
      
      if (!newCompletedTasks[actionId]) {
        newCompletedTasks[actionId] = [];
      }
      
      const taskIndex = newCompletedTasks[actionId].indexOf(taskId);
      
      if (taskIndex > -1) {
        // Remove task if already completed
        newCompletedTasks[actionId].splice(taskIndex, 1);
      } else {
        // Add task if not completed
        newCompletedTasks[actionId].push(taskId);
        
        // Find the task to award points
        const action = conservationActions.find(a => a.id === actionId);
        const task = action.tasks.find(t => t.id === taskId);
        
        // Update user XP
        if (userProfile && task) {
          const updatedProfile = { ...userProfile };
          updatedProfile.experience += task.points;
          
          // Check for level up
          if (updatedProfile.experience >= (updatedProfile.level * 100)) {
            updatedProfile.level++;
          }
          
          await updateUserProfile(updatedProfile);
          setUserProfile(updatedProfile);
          
          // Set recent points for UI feedback
          setRecentPoints(task.points);
          setShowSuccessModal(true);
          setTimeout(() => setShowSuccessModal(false), 2000);
        }
        
        // Update quest progress if applicable
        updateQuestProgress('conservation_action', actionId);
      }
      
      // Save completed tasks
      await AsyncStorage.setItem('completedConservationTasks', JSON.stringify(newCompletedTasks));
      setCompletedTasks(newCompletedTasks);
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };
  
  const submitReflection = async () => {
    if (!reflection.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you might send this to a server
      // For now, we'll just save it locally and award points
      
      const updatedProfile = { ...userProfile };
      updatedProfile.experience += 50; // Award 50 XP for reflecting
      
      // Check for level up
      if (updatedProfile.experience >= (updatedProfile.level * 100)) {
        updatedProfile.level++;
      }
      
      await updateUserProfile(updatedProfile);
      setUserProfile(updatedProfile);
      
      // Save the reflection
      const savedReflections = await AsyncStorage.getItem('conservationReflections') || '[]';
      const reflections = JSON.parse(savedReflections);
      reflections.push({
        id: Date.now().toString(),
        text: reflection,
        date: new Date().toISOString()
      });
      await AsyncStorage.setItem('conservationReflections', JSON.stringify(reflections));
      
      // Show success feedback
      setRecentPoints(50);
      setShowSuccessModal(true);
      
      // Clear form
      setReflection('');
      setIsSubmitting(false);
      
      // Hide success after delay
      setTimeout(() => setShowSuccessModal(false), 2000);
      
      // Update relevant quest progress
      updateQuestProgress('reflection_submitted', 'conservation');
    } catch (error) {
      console.error('Error submitting reflection:', error);
      setIsSubmitting(false);
    }
  };
  
  const calculateImpact = (actionId) => {
    if (!completedTasks[actionId]) return 0;
    
    const completedCount = completedTasks[actionId].length;
    let impactText = '';
    
    switch (actionId) {
      case 'plastic':
        return `You've potentially prevented ${completedCount * 5} pieces of plastic from entering the ocean.`;
      case 'plants':
        return `Your plantings can support up to ${completedCount * 20} local wildlife species.`;
      case 'water':
        return `You've helped conserve approximately ${completedCount * 250} gallons of water.`;
      case 'awareness':
        return `You've helped educate approximately ${completedCount * 15} people about conservation issues.`;
      default:
        return 'Your actions are making a positive impact on wildlife and habitats.';
    }
  };
  
  const getCompletionPercentage = (actionId) => {
    const action = conservationActions.find(a => a.id === actionId);
    if (!action) return 0;
    
    const tasksCompleted = completedTasks[actionId]?.length || 0;
    const totalTasks = action.tasks.length;
    
    return (tasksCompleted / totalTasks) * 100;
  };
  
  const renderTaskCheckbox = (actionId, task) => {
    const isCompleted = completedTasks[actionId]?.includes(task.id);
    
    return (
      <TouchableOpacity
        key={task.id}
        style={styles.taskRow}
        onPress={() => toggleTask(actionId, task.id)}
      >
        <View style={[styles.checkbox, isCompleted && styles.checkboxChecked]}>
          {isCompleted && <FontAwesome5 name="check" size={12} color="#fff" />}
        </View>
        <View style={styles.taskContent}>
          <Text style={styles.taskText}>{task.text}</Text>
          <Text style={styles.taskPoints}>+{task.points} points</Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#1d4e31', '#2f6b47']}
        style={styles.header}
      >
        <Text style={styles.title}>Real-world Impact</Text>
        <Text style={styles.subtitle}>
          Take conservation actions in your daily life and track your impact
        </Text>
        
        {userProfile && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>
              Conservation Points: {userProfile.experience}
            </Text>
            <Text style={styles.progressSubLabel}>
              Level {userProfile.level} Conservationist
            </Text>
          </View>
        )}
      </LinearGradient>
      
      <ScrollView style={styles.content}>
        {conservationActions.map((action) => (
          <View 
            key={action.id} 
            style={[
              styles.actionCard, 
              { borderLeftColor: action.color }
            ]}
          >
            <TouchableOpacity
              style={styles.actionHeader}
              onPress={() => setExpandedAction(expandedAction === action.id ? null : action.id)}
            >
              <View style={styles.actionIcon}>
                <FontAwesome5 name={action.icon} size={24} color={action.color} />
              </View>
              
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>
                  {action.description}
                </Text>
                
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${getCompletionPercentage(action.id)}%`,
                        backgroundColor: action.color 
                      }
                    ]} 
                  />
                </View>
              </View>
              
              <FontAwesome5 
                name={expandedAction === action.id ? "chevron-up" : "chevron-down"} 
                size={16} 
                color="#888" 
              />
            </TouchableOpacity>
            
            {expandedAction === action.id && (
              <View style={styles.actionDetails}>
                <Text style={styles.factoid}>
                  <FontAwesome5 name="info-circle" size={16} color={action.color} style={styles.factoidIcon} />
                  {action.factoid}
                </Text>
                
                <View style={styles.tasksContainer}>
                  <Text style={styles.tasksTitle}>Track Your Actions:</Text>
                  {action.tasks.map(task => renderTaskCheckbox(action.id, task))}
                </View>
                
                {completedTasks[action.id]?.length > 0 && (
                  <View style={styles.impactContainer}>
                    <Text style={styles.impactTitle}>Your Impact:</Text>
                    <Text style={styles.impactText}>
                      {calculateImpact(action.id)}
                    </Text>
                    <Text style={styles.impactDescription}>
                      {action.impact}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        ))}
        
        <View style={styles.reflectionSection}>
          <Text style={styles.reflectionTitle}>Share Your Conservation Story</Text>
          <Text style={styles.reflectionSubtitle}>
            Reflect on a conservation action you've taken and inspire others
          </Text>
          
          <TextInput
            style={styles.reflectionInput}
            placeholder="Share your experience with a conservation action..."
            placeholderTextColor="#888"
            multiline
            value={reflection}
            onChangeText={setReflection}
          />
          
          <TouchableOpacity
            style={[
              styles.submitButton, 
              (!reflection.trim() || isSubmitting) && styles.disabledButton
            ]}
            onPress={submitReflection}
            disabled={!reflection.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <FontAwesome5 name="paper-plane" size={16} color="#fff" style={styles.submitIcon} />
                <Text style={styles.submitText}>Submit Reflection (+50 points)</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.conservationLink}
          onPress={() => navigation.navigate('Conservation')}
        >
          <FontAwesome5 name="hand-holding-heart" size={16} color="#fff" style={styles.linkIcon} />
          <Text style={styles.linkText}>Donate Points to Conservation Projects</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Success Modal */}
      <Modal
        transparent
        visible={showSuccessModal}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.successModal}>
            <FontAwesome5 name="check-circle" size={32} color="#4caf50" style={styles.successIcon} />
            <Text style={styles.successTitle}>Action Recorded!</Text>
            <Text style={styles.successText}>You earned {recentPoints} conservation points</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressSubLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    height: '100%',
  },
  actionDetails: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  factoid: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    padding: 12,
    borderRadius: 6,
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  factoidIcon: {
    marginRight: 8,
  },
  tasksContainer: {
    marginBottom: 16,
  },
  tasksTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4caf50',
    borderColor: '#4caf50',
  },
  taskContent: {
    flex: 1,
  },
  taskText: {
    fontSize: 15,
    color: '#333',
  },
  taskPoints: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  impactContainer: {
    backgroundColor: 'rgba(76,175,80,0.08)',
    padding: 16,
    borderRadius: 6,
  },
  impactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  impactText: {
    fontSize: 16,
    color: '#4caf50',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  impactDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  reflectionSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reflectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  reflectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  reflectionInput: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    minHeight: 120,
    color: '#333',
    fontSize: 16,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2f6b47',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: 'rgba(47,107,71,0.5)',
  },
  submitIcon: {
    marginRight: 8,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  conservationLink: {
    backgroundColor: '#9c27b0',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  linkIcon: {
    marginRight: 8,
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    width: '80%',
    maxWidth: 300,
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  successText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 