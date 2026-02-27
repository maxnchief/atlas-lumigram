import React, { useState } from "react";
import { View, Text, Image, StyleSheet, Alert } from "react-native";
import { homeFeed } from "@/placeholder";
import { FlashList } from "@shopify/flash-list";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default function HomeScreen() {
  const [showCaptionId, setShowCaptionId] = useState(null);
  const lastTap = React.useRef<number | null>(null);

  const handleDoubleTap = (id: string) => {
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < 300) {
      Alert.alert("Double Tap", "Favoriting coming soon!");
    }
    lastTap.current = now;
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#070B3A', paddingTop: 32 }}>
      <FlashList
        data={homeFeed}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback
            onLongPress={() => setShowCaptionId(item.id)}
            onPress={() => handleDoubleTap(item.id)}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.image }}
                style={styles.feedImage}
                resizeMode="cover"
              />
              {showCaptionId === item.id && (
                <View style={styles.captionOverlay}>
                  <Text style={styles.captionText}>Placeholder Caption</Text>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        )}
        estimatedItemSize={420}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1D3D47',
    position: 'relative',
    elevation: 2,
  },
  feedImage: {
    width: '100%',
    height: 400,
    borderRadius: 16,
  },
  captionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(61, 230, 193, 0.85)',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  captionText: {
    color: '#070B3A',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
