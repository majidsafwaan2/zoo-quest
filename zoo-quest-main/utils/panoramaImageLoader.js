/**
 * This utility provides access to high-quality panorama images
 * using URLs that will reliably load in our 360° viewer
 */

// Define high-quality panorama images for each habitat
const panoramaImages = {
  rainforest: [
    'https://i.imgur.com/G4S6vrc.jpg', // Alternative: Use direct image hosting service
    'https://images.pexels.com/photos/38136/pexels-photo-38136.jpeg',
    'https://images.unsplash.com/photo-1597699401474-ad30e6f2cf04'
  ],
  savanna: [
    'https://i.imgur.com/JKRoGSJ.jpg',
    'https://images.pexels.com/photos/259411/pexels-photo-259411.jpeg',
    'https://images.unsplash.com/photo-1560159846-747dfb1f42d9'
  ],
  arctic: [
    'https://i.imgur.com/Td3KRcg.jpg',
    'https://images.pexels.com/photos/326152/pexels-photo-326152.jpeg',
    'https://images.unsplash.com/photo-1482859454996-522a1eb77de2'
  ]
};

// Select a high-quality panorama based on habitat ID
export function getPanoramaImage(habitatId) {
  const images = panoramaImages[habitatId] || [];
  if (images.length === 0) {
    // Fallback to a reliable 360° panorama source
    return `https://source.unsplash.com/1600x900/?${habitatId},panorama,landscape,360`;
  }
  return images[0]; // Return the first (primary) image
}

export function getMultiplePanoramas(habitatId, count = 3) {
  const images = panoramaImages[habitatId] || [];
  if (images.length === 0) {
    // Create multiple fallbacks
    return Array(count).fill().map((_, i) => 
      `https://source.unsplash.com/1600x900/?${habitatId},panorama,landscape,360,nature${i}`
    );
  }
  return images.slice(0, count);
} 