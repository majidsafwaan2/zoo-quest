// Animal categories and conservation status enums
const AnimalCategory = {
  MAMMAL: 'mammal',
  BIRD: 'bird',
  REPTILE: 'reptile',
  AMPHIBIAN: 'amphibian',
  FISH: 'fish',
  INVERTEBRATE: 'invertebrate'
};

const ConservationStatus = {
  LEAST_CONCERN: 'Least Concern',
  NEAR_THREATENED: 'Near Threatened',
  VULNERABLE: 'Vulnerable',
  ENDANGERED: 'Endangered',
  CRITICALLY_ENDANGERED: 'Critically Endangered',
  EXTINCT_IN_WILD: 'Extinct in the Wild',
  EXTINCT: 'Extinct'
};

const Biome = {
  SAVANNA: 'savanna',
  RAINFOREST: 'rainforest',
  DESERT: 'desert',
  ARCTIC: 'arctic',
  OCEAN: 'ocean',
  GRASSLAND: 'grassland',
  WETLAND: 'wetland',
  MOUNTAIN: 'mountain',
  FOREST: 'forest'
};

export const animalProfiles = {
  lion: {
    id: 'lion-1',
    name: 'Lion',
    scientificName: 'Panthera leo',
    emoji: '🦁',
    color: '#f9c74f',
    category: AnimalCategory.MAMMAL,
    conservationStatus: ConservationStatus.VULNERABLE,
    nativeBiomes: [Biome.SAVANNA, Biome.GRASSLAND],
    dietType: 'carnivore',
    lifespan: 15,
    size: { height: 1.2, weight: 190 },
    funFacts: [
      "Male lions have magnificent manes that can be up to 16cm long",
      "Lions can sleep for up to 20 hours a day",
      "A lion's roar can be heard from up to 8km away"
    ],
    voiceCharacteristics: 'deep, regal, confident',
    personalityTraits: ['confident', 'protective', 'social', 'territorial'],
    specialAbilities: ['powerful roar', 'night vision', 'collaborative hunting'],
    imageUrls: {
      profile: '/assets/animals/lion/profile.jpg',
      habitat: '/assets/animals/lion/habitat.jpg',
      thumbnails: ['/assets/animals/lion/thumb1.jpg', '/assets/animals/lion/thumb2.jpg']
    },
    habitatDescription: 'African savanna grasslands with scattered acacia trees and water sources',
    conservationChallenges: [
      'Habitat loss from human expansion',
      'Poaching for traditional medicine',
      'Human-wildlife conflict'
    ],
    relatedSpecies: ['tiger', 'jaguar', 'leopard']
  },
  elephant: {
    id: 'elephant-1',
    name: 'Elephant',
    scientificName: 'Loxodonta africana',
    emoji: '🐘',
    color: '#b0bec5',
    category: AnimalCategory.MAMMAL,
    conservationStatus: ConservationStatus.VULNERABLE,
    nativeBiomes: [Biome.SAVANNA, Biome.FOREST],
    dietType: 'herbivore',
    lifespan: 70,
    size: { height: 3.3, weight: 6000 },
    funFacts: [
      "Elephants can recognize themselves in mirrors - a sign of self-awareness",
      "They communicate through low-frequency sounds that can travel up to 10km",
      "An elephant's trunk has over 40,000 muscles and can lift up to 350kg"
    ],
    voiceCharacteristics: 'gentle, wise, thoughtful',
    personalityTraits: ['intelligent', 'emotional', 'nurturing', 'resilient'],
    specialAbilities: ['incredible memory', 'infrasonic communication', 'trunk dexterity'],
    imageUrls: {
      profile: '/assets/animals/elephant/profile.jpg',
      habitat: '/assets/animals/elephant/habitat.jpg',
      thumbnails: ['/assets/animals/elephant/thumb1.jpg', '/assets/animals/elephant/thumb2.jpg']
    },
    habitatDescription: 'Varied landscapes including savannas, forests, deserts, and marshes',
    conservationChallenges: [
      'Ivory poaching',
      'Habitat fragmentation',
      'Human-elephant conflict over resources'
    ],
    relatedSpecies: ['mammoth', 'mastodon']
  },
  // Add other detailed animal profiles...
}; 