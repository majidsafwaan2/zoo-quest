import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Keyboard
} from 'react-native';

export default function InputBar({ onSend, botColor }) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() !== '') {
      onSend(input);
      setInput('');
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, { borderColor: botColor || '#666', color: '#fff' }]}
        placeholder="Ask me something..."
        placeholderTextColor="#999"
        value={input}
        onChangeText={setInput}
        onSubmitEditing={handleSend}
        returnKeyType="send"
        blurOnSubmit={false}
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: botColor || '#888' }]}
        onPress={handleSend}
      >
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center'
  },
  input: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    marginRight: 10,
    fontSize: 16
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
