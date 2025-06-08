import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ChatBubble({ sender, text, isBot, botColor }) {
  return (
    <View
      style={[
        styles.bubble,
        isBot ? { backgroundColor: botColor, alignSelf: 'flex-start' } : styles.userBubble
      ]}
    >
      <Text style={styles.sender}>{sender}:</Text>
      <Text>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    maxWidth: '80%'
  },
  userBubble: {
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-end'
  },
  sender: {
    fontWeight: 'bold',
    marginBottom: 2
  }
});
