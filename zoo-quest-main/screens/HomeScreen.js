import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const animals = [
  { name: 'lion', emoji: '🦁' },
  { name: 'penguin', emoji: '🐧' },
  { name: 'elephant', emoji: '🐘' },
  { name: 'monkey', emoji: '🐒' },
  { name: 'tiger', emoji: '🐯' },
  { name: 'zebra', emoji: '🦓' },
  { name: 'panda', emoji: '🐼' },
  { name: 'frog', emoji: '🐸' },
  { name: 'giraffe', emoji: '🦒' },
  { name: 'bear', emoji: '🐻' },
  { name: 'hippo', emoji: '🦛' },
  { name: 'rhino', emoji: '🦏' },
  { name: 'crocodile', emoji: '🐊' },
  { name: 'koala', emoji: '🐨' },
  { name: 'kangaroo', emoji: '🦘' },
  { name: 'camel', emoji: '🐫' }
];

export default function HomeScreen({ navigation }) {
  const handlePress = (animal) => {
    navigation.navigate('Chat', { selectedAnimal: animal });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select an Animal to Chat With</Text>
      <FlatList
        data={animals}
        numColumns={4}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.grid}
        scrollEnabled={false}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handlePress(item.name)}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 10,
    backgroundColor: '#1d4e31'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10
  },
  grid: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10
  },
  row: {
    justifyContent: 'space-around',
    marginBottom: 6
  },
  card: {
    backgroundColor: '#2f6b47',
    borderRadius: 10,
    padding: 12,
    margin: 6,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70
  },
  emoji: {
    fontSize: 24
  }
});
