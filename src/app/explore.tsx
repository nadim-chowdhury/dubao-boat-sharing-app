import { SymbolView } from 'expo-symbols';
import { Platform, Pressable, ScrollView, StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

export default function ExploreScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: '#012A4A' }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <ThemedView style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.emojiTitle}>🌧️🚣‍♂️</Text>
          <Text style={styles.mainTitle}>Dhaka Flood Manual</Text>
          <Text style={styles.subtitle}>
            Official survival instructions for waterlogged roads.
          </Text>
        </View>

        <View style={styles.sectionsWrapper}>
          <Collapsible title="⚠️ Monsoon Survival Rules">
            <View style={styles.collapsibleContent}>
              <Text style={styles.bulletText}>
                • <Text style={styles.boldText}>Sandal Care:</Text> Hold your shoes in your hand. Sandals have a 45% risk of floating to Chittagong.
              </Text>
              <Text style={styles.bulletText}>
                • <Text style={styles.boldText}>Mirpur Waterfalls:</Text> Avoid Mirpur 10 unless you are in a high-density vessel. The currents can sweep away mini boats.
              </Text>
              <Text style={styles.bulletText}>
                • <Text style={styles.boldText}>Water-Truck Wake:</Text> Hold on tight when a double-decker bus passes. The waves generated are equivalent to category 3 hurricanes.
              </Text>
              <Text style={styles.bulletText}>
                • <Text style={styles.boldText}>Umbrella Etiquette:</Text> Hold your umbrella high. Poking your fellow passenger's eyes out decreases your ride rating by 1.5 stars.
              </Text>
            </View>
          </Collapsible>

          <Collapsible title="🚣 Vessel Classifications">
            <View style={styles.collapsibleContent}>
              <View style={styles.boatRow}>
                <Text style={styles.boatEmoji}>🚣</Text>
                <View style={styles.boatText}>
                  <Text style={styles.boatName}>Dubao Mini</Text>
                  <Text style={styles.boatDesc}>Fits two slightly soaked passengers. Captain row speed: Moderate.</Text>
                </View>
              </View>

              <View style={styles.boatRow}>
                <Text style={styles.boatEmoji}>🚤</Text>
                <View style={styles.boatText}>
                  <Text style={styles.boatName}>Dubao Launch</Text>
                  <Text style={styles.boatDesc}>For large commuter gangs. Tends to create waves that wash away roadside tea stalls.</Text>
                </View>
              </View>

              <View style={styles.boatRow}>
                <Text style={styles.boatEmoji}>☂️</Text>
                <View style={styles.boatText}>
                  <Text style={styles.boatName}>Dubao VIP</Text>
                  <Text style={styles.boatDesc}>Equipped with umbrella holster & simulated tea service. Fares include an automatic umbrella tax.</Text>
                </View>
              </View>

              <View style={styles.boatRow}>
                <Text style={styles.boatEmoji}>🚢</Text>
                <View style={styles.boatText}>
                  <Text style={styles.boatName}>Dubao Titanic</Text>
                  <Text style={styles.boatDesc}>Lowest fare, highest confidence, questionable safety. Do not sit near the edges.</Text>
                </View>
              </View>
            </View>
          </Collapsible>

          <Collapsible title="🏆 Achievements Catalog">
            <View style={styles.collapsibleContent}>
              <Text style={styles.bulletText}>
                🏆 <Text style={styles.boldText}>Survived Mirpur Rainfall:</Text> Book and complete any ride starting or ending in Mirpur.
              </Text>
              <Text style={styles.bulletText}>
                🏆 <Text style={styles.boldText}>Professional Umbrella Holder:</Text> Book a VIP boat and hold your posture high.
              </Text>
              <Text style={styles.bulletText}>
                🏆 <Text style={styles.boldText}>Waterproof Passenger:</Text> Rate a ride 5 stars after getting splashed by waves.
              </Text>
              <Text style={styles.bulletText}>
                🏆 <Text style={styles.boldText}>Fastest Boat Booking:</Text> Beat the flood levels and book before streets turn to rivers.
              </Text>
            </View>
          </Collapsible>

          <Collapsible title="📜 Project Disclaimer">
            <View style={styles.collapsibleContent}>
              <Text style={styles.disclaimerText}>
                Dubao is a comedy-parody frontend application built to showcase UI design, animations, and state simulation in React Native + Expo.
              </Text>
              <Text style={styles.disclaimerText}>
                It does not coordinate real rides, process real payments, or have real captains. No sandals were harmed in the making of this project.
              </Text>
            </View>
          </Collapsible>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
    backgroundColor: '#012A4A',
    paddingBottom: 40,
  },
  titleContainer: {
    gap: Spacing.three,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  emojiTitle: {
    fontSize: 48,
    textAlign: 'center',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00B4D8',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#CBD5E1',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  sectionsWrapper: {
    gap: Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  collapsibleContent: {
    padding: 12,
    backgroundColor: '#013A63',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#01497C',
    marginTop: 6,
  },
  bulletText: {
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#00B4D8',
  },
  disclaimerText: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },
  boatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  boatEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  boatText: {
    flex: 1,
  },
  boatName: {
    color: '#00B4D8',
    fontWeight: 'bold',
    fontSize: 14,
  },
  boatDesc: {
    color: '#E2E8F0',
    fontSize: 11,
    marginTop: 2,
  },
});
