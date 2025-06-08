import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Animated, TouchableOpacity, Platform } from 'react-native';
import { Audio } from 'expo-audio';
import * as Speech from 'expo-speech';
import { enhancedAskGPT } from '../utils/enhancedGpt';
import { trackLearnedFact } from '../utils/userProfile';
import InputBar from './InputBar';
import ChatBubble from './ChatBubble';
import { FontAwesome } from '@expo/vector-icons';
import FactReactionModal from './FactReactionModal';

export default function EnhancedChatInterface({ route, navigation }) {
  const { selectedAnimal } = route.params;
  const animalProfile = animalProfiles[selectedAnimal] || { name: selectedAnimal, emoji: '🐾', color: '#e0e0e0' };
  const botName = `${animalProfile.emoji} ${animalProfile.name}`;
  
  const [messages, setMessages] = useState([
    { id: 'welcome', sender: botName, text: `Hi! I'm ${animalProfile.name} (${animalProfile.scientificName}). I live in the ${animalProfile.nativeBiomes[0]}. What would you like to know about me?`, isRead: true }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [factDetected, setFactDetected] = useState(null);
  const [voiceRate, setVoiceRate] = useState(0.9); // Speech rate
  
  const flatListRef = useRef(null);
  const recordingRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Speech recognition setup
  useEffect(() => {
    // Request permissions for microphone
    async function setupVoiceRecording() {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need microphone permissions to make voice chat work!');
      }
    }
    
    setupVoiceRecording();
    
    return () => {
      // Cleanup
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync();
      }
      Speech.stop();
    };
  }, []);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 200);
    }
    
    // When a new message is added from the animal, check if it contains an educational fact
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === botName && !lastMessage.factChecked) {
      detectFact(lastMessage);
      
      // If voice is enabled, speak the message
      if (isVoiceEnabled) {
        const speechOptions = {
          language: 'en-US',
          pitch: animalProfile.name === 'Elephant' ? 0.8 : 
                animalProfile.name === 'Mouse' ? 1.3 : 1.0,
          rate: voiceRate,
          onDone: () => console.log('Speech finished')
        };
        
        Speech.speak(lastMessage.text, speechOptions);
      }
      
      // Mark this message as fact-checked
      setMessages(prev => prev.map((msg, i) => 
        i === prev.length - 1 ? { ...msg, factChecked: true } : msg
      ));
    }
  }, [messages]);
  
  // Detect if a message contains an educational fact that could be tracked
  const detectFact = (message) => {
    // This would be more sophisticated in a real app,
    // possibly using NLP or asking the GPT API if this contains a factual statement
    const indicators = [
      'did you know', 'fact', 'actually', 'interestingly', 
      'scientifically', 'in the wild', 'researchers found'
    ];
    
    const containsFactIndicator = indicators.some(phrase => 
      message.text.toLowerCase().includes(phrase)
    );
    
    if (containsFactIndicator) {
      // Extract the potential fact
      const sentences = message.text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const factSentence = sentences.find(sentence => 
        indicators.some(indicator => sentence.toLowerCase().includes(indicator))
      ) || sentences[0];
      
      setFactDetected({
        content: factSentence.trim(),
        animalType: selectedAnimal,
        category: 'general', // This could be more specific with better categorization
        messageId: message.id
      });
      
      // Show the "New Fact!" indicator
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.delay(3000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true
        })
      ]).start();
    }
  };
  
  const handleSend = async (text) => {
    if (!text.trim()) return;
    
    const newUserMessage = {
      id: `user-${Date.now()}`,
      sender: 'You',
      text,
      timestamp: new Date(),
      isRead: true
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    
    try {
      // Get conversation history in the format that GPT API expects
      const conversationHistory = messages.slice(-6).map(msg => ({
        role: msg.sender === botName ? 'assistant' : 'user',
        content: msg.text
      }));
      
      const reply = await enhancedAskGPT(text, selectedAnimal, {
        conversationHistory,
        userAge: 10 // This could come from the user profile
      });
      
      const newBotMessage = {
        id: `bot-${Date.now()}`,
        sender: botName,
        text: reply,
        timestamp: new Date(),
        isRead: false
      };
      
      setMessages(prev => [...prev, newBotMessage]);
    } catch (error) {
      console.error('Chat Error:', error);
      
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        sender: botName,
        text: "I'm having trouble thinking right now. Can we try again?",
        timestamp: new Date(),
        isRead: false,
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const startVoiceRecording = async () => {
    try {
      setIsRecording(true);
      
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      recordingRef.current = recording;
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsRecording(false);
    }
  };
  
  const stopVoiceRecording = async () => {
    if (!recordingRef.current) return;
    
    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      
      // Here you would send the audio file to a speech-to-text service
      // For demonstration purposes, we'll simulate a successful transcription
      
      // Simulate a delay for speech processing
      setTimeout(() => {
        const simulatedTranscription = "Tell me about where you live";
        handleSend(simulatedTranscription);
        setIsRecording(false);
      }, 1500);
      
      recordingRef.current = null;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setIsRecording(false);
    }
  };
  
  const handleFactReaction = async (reaction) => {
    if (!factDetected) return;
    
    if (reaction === 'interesting') {
      // Save this fact to the user's learned facts
      const result = await trackLearnedFact(
        factDetected.animalType,
        factDetected.category,
        factDetected.content
      );
      
      if (result.didLevelUp) {
        // Show level up celebration (this would be implemented elsewhere)
        showLevelUpCelebration(result.newLevel);
      }
    }
    
    setFactDetected(null);
  };
  
  const showLevelUpCelebration = (newLevel) => {
    // This would show a modal or animation for leveling up
    // For now, we'll just log it
    console.log(`🎉 Leveled up to ${newLevel}!`);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{`Chatting with ${animalProfile.emoji} ${animalProfile.name}`}</Text>
        
        <View style={styles.headerControls}>
          <TouchableOpacity 
            style={styles.voiceToggle}
            onPress={() => setIsVoiceEnabled(!isVoiceEnabled)}
          >
            <FontAwesome 
              name={isVoiceEnabled ? "volume-up" : "volume-off"} 
              size={22} 
              color={isVoiceEnabled ? animalProfile.color : "#666"}
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.infoButton}
            onPress={() => navigation.navigate('AnimalInfo', { animalType: selectedAnimal })}
          >
            <FontAwesome name="info-circle" size={22} color="#888" />
          </TouchableOpacity>
        </View>
      </View>
      
      <Animated.View 
        style={[
          styles.factIndicator, 
          {
            opacity: fadeAnim,
            backgroundColor: animalProfile.color
          }
        ]}
      >
        <Text style={styles.factIndicatorText}>New Fact! 🎓</Text>
      </Animated.View>
      
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatList}
        renderItem={({ item }) => (
          <ChatBubble
            sender={item.sender}
            text={item.text}
            isBot={item.sender === botName}
            botColor={animalProfile.color}
            isError={item.isError}
          />
        )}
      />
      
      {isLoading && (
        <View style={styles.thinkingIndicator}>
          <Text style={styles.thinkingText}>
            {`${animalProfile.emoji} ${animalProfile.name} is thinking...`}
          </Text>
        </View>
      )}
      
      <InputBar 
        onSend={handleSend} 
        botColor={animalProfile.color}
        onMicPress={isRecording ? stopVoiceRecording : startVoiceRecording}
        isRecording={isRecording}
      />
      
      {factDetected && (
        <FactReactionModal
          fact={factDetected.content}
          animalType={selectedAnimal}
          onReaction={handleFactReaction}
          color={animalProfile.color}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voiceToggle: {
    padding: 8,
    marginRight: 12,
  },
  infoButton: {
    padding: 8,
  },
  chatList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  thinkingIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  thinkingText: {
    color: '#888',
    fontStyle: 'italic',
  },
  factIndicator: {
    position: 'absolute',
    top: 60,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 10,
  },
  factIndicatorText: {
    color: '#fff',
    fontWeight: 'bold',
  },
}); 