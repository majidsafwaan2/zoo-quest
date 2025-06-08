const chatStore = {};

export function getMessages(animal) {
  return chatStore[animal] || [];
}

export function setMessages(animal, messages) {
  chatStore[animal] = messages;
}
