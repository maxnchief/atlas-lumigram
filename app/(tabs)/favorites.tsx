import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, Pressable, Dimensions } from 'react-native';
import { favoritesFeed } from '../../placeholder';

const windowWidth = Dimensions.get('window').width;

export default function FavoritesScreen() {
  const [showCaptionId, setShowCaptionId] = useState<string | null>(null);
  const lastTap = useRef<number>(0);

  const handleLongPress = (id: string) => {
    setShowCaptionId(id);
  };

  const handlePressOut = () => {
    setShowCaptionId(null);
  };

  const handleDoubleTap = (id: string) => {
    const now = Date.now();
    if (lastTap.current && (now - lastTap.current) < 300) {
      Alert.alert('Double Tap', 'Double tap detected!');
    }
    lastTap.current = now;
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Favorites</Text>
        <View style={styles.uploadIconBtn}>
          <Text style={styles.uploadIcon}>⤴️</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {favoritesFeed.map((item) => (
          <View key={item.id} style={styles.imageWrapper}>
            <Pressable
              onPress={() => handleDoubleTap(item.id)}
              onLongPress={() => handleLongPress(item.id)}
              onPressOut={handlePressOut}
              delayLongPress={250}
              style={({ pressed }) => [styles.imagePressable, pressed && { opacity: 0.95 }]}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode="cover"
              />
              {showCaptionId === item.id && (
                <View style={styles.captionOverlay}>
                  <Text style={styles.captionText}>Placeholder Caption</Text>
                </View>
              )}
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 32,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    paddingBottom: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
  },
  uploadIconBtn: {
    padding: 8,
  },
  uploadIcon: {
    fontSize: 28,
    color: '#7ed6b5',
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 18,
  },
  imagePressable: {
    width: windowWidth - 24,
    height: windowWidth - 24,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#eee',
    marginHorizontal: 12,
    marginTop: 4,
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  captionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captionText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
});
