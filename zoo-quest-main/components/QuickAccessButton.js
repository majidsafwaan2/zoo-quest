import React, { useState } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Animated, 
  Dimensions 
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function QuickAccessButton() {
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const animation = React.useRef(new Animated.Value(0)).current;
  
  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    
    Animated.spring(animation, {
      toValue,
      friction: 6,
      useNativeDriver: true,
    }).start();
    
    setIsOpen(!isOpen);
  };
  
  const chatTranslate = {
    transform: [
      { scale: animation },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -80],
        }),
      },
    ],
    opacity: animation,
  };
  
  const encyclopediaTranslate = {
    transform: [
      { scale: animation },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -60],
        }),
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -60],
        }),
      },
    ],
    opacity: animation,
  };
  
  const conservationTranslate = {
    transform: [
      { scale: animation },
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -80],
        }),
      },
    ],
    opacity: animation,
  };
  
  return (
    <View style={styles.container} pointerEvents="box-none">
      <Animated.View style={[styles.buttonWrapper, chatTranslate]} pointerEvents="box-none">
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]}
          onPress={() => {
            navigation.navigate('AnimalChat');
            toggleMenu();
          }}
        >
          <FontAwesome5 name="comments" size={16} color="#fff" />
          <Text style={styles.secondaryButtonText}>Chat</Text>
        </TouchableOpacity>
      </Animated.View>
      
      <Animated.View style={[styles.buttonWrapper, encyclopediaTranslate]} pointerEvents="box-none">
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]}
          onPress={() => {
            navigation.navigate('Encyclopedia');
            toggleMenu();
          }}
        >
          <FontAwesome5 name="book" size={16} color="#fff" />
          <Text style={styles.secondaryButtonText}>Encyclopedia</Text>
        </TouchableOpacity>
      </Animated.View>
      
      <Animated.View style={[styles.buttonWrapper, conservationTranslate]} pointerEvents="box-none">
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]}
          onPress={() => {
            navigation.navigate('ConservationActions');
            toggleMenu();
          }}
        >
          <FontAwesome5 name="leaf" size={16} color="#fff" />
          <Text style={styles.secondaryButtonText}>Take Action</Text>
        </TouchableOpacity>
      </Animated.View>
      
      <TouchableOpacity 
        style={[styles.button, styles.mainButton, isOpen && styles.mainButtonActive]}
        onPress={toggleMenu}
      >
        <FontAwesome5 
          name={isOpen ? "times" : "paw"} 
          size={24} 
          color="#fff" 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    right: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrapper: {
    position: 'absolute',
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  mainButton: {
    backgroundColor: '#2f6b47',
  },
  mainButtonActive: {
    backgroundColor: '#f44336',
  },
  secondaryButton: {
    backgroundColor: '#3a8057',
    flexDirection: 'row',
    paddingHorizontal: 16,
    width: 'auto',
  },
  secondaryButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
  },
}); 