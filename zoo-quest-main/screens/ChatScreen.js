import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import ChatBubble from '../components/ChatBubble';
import InputBar from '../components/InputBar';
import { askGPT } from '../utils/gpt';
import { getMessages, setMessages } from '../utils/chatStore';

const animalStyles = {
  Lion: { emoji: '🦁', color: '#f9c74f' },
  Penguin: { emoji: '🐧', color: '#90caf9' },
  Elephant: { emoji: '🐘', color: '#b0bec5' },
  Monkey: { emoji: '🐒', color: '#d7ccc8' },
  Tiger: { emoji: '🐯', color: '#ffb74d' },
  Zebra: { emoji: '🦓', color: '#eeeeee' },
  Panda: { emoji: '🐼', color: '#cfd8dc' },
  Frog: { emoji: '🐸', color: '#a5d6a7' },
  Giraffe: { emoji: '🦒', color: '#ffe082' },
  Bear: { emoji: '🐻', color: '#a1887f' },
  Hippo: { emoji: '🦛', color: '#9575cd' },
  Rhino: { emoji: '🦏', color: '#90a4ae' },
  Crocodile: { emoji: '🐊', color: '#81c784' },
  Koala: { emoji: '🐨', color: '#b0bec5' },
  Kangaroo: { emoji: '🦘', color: '#ffcc80' },
  Camel: { emoji: '🐫', color: '#ffe0b2' }
};

export default function ChatScreen({ route }) {
  const { selectedAnimal } = route.params;
  const capitalizedAnimal = selectedAnimal.charAt(0).toUpperCase() + selectedAnimal.slice(1);
  const animal = animalStyles[capitalizedAnimal] || { emoji: '', color: '#e0e0e0' };
  const botName = `${animal.emoji} ${capitalizedAnimal}`;

  const [messages, setMessagesState] = useState(() => {
    const saved = getMessages(selectedAnimal);
    return saved.length > 0
      ? saved
      : [{ sender: botName, text: `Hi! I am your zoo buddy ${capitalizedAnimal}. Ask me anything!` }];
  });

  const [isLoading, setIsLoading] = useState(false);

  const updateMessages = (newMessage) => {
    setMessagesState((prev) => {
      const updated = [...prev, newMessage];
      setMessages(selectedAnimal, updated);
      return updated;
    });
  };

  const handleSend = async (input) => {
    if (!input.trim()) return;

    const userMessage = { sender: 'You', text: input };
    updateMessages(userMessage);
    setIsLoading(true);

    try {
      const reply = await askGPT(input, selectedAnimal);
      const botMessage = { sender: botName, text: reply };
      updateMessages(botMessage);
    } catch (error) {
      const errorMessage = { sender: botName, text: 'Oops! Something went wrong.' };
      updateMessages(errorMessage);
      console.error('GPT Error:', error);
    }

    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`Chatting with ${botName}`}</Text>

      <ScrollView style={styles.chat}>
        {messages.map((msg, index) => (
          <ChatBubble
            key={index}
            sender={msg.sender}
            text={msg.text}
            isBot={msg.sender === botName}
            botColor={animal.color}
          />
        ))}
        {isLoading && <Text style={{ fontStyle: 'italic', color: '#ccc' }}>{`${capitalizedAnimal} is thinking...`}</Text>}
      </ScrollView>

      <InputBar onSend={handleSend} botColor={animal.color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#121212'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#ffffff'
  },
  chat: {
    flex: 1,
    marginBottom: 10
  }
});
