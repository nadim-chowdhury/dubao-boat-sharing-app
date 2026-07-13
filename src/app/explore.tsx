import { Platform, ScrollView, StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { getVesselIcon } from '@/components/dubao/VesselIcons';

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
      style={[styles.scrollView, { backgroundColor: '#0B0F19' }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <ThemedView style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>Dhaka Flood Manual</Text>
          <Text style={styles.subtitle}>
            Standard Operating Procedures for Commuting Waterlogged Routes.
          </Text>
        </View>

        <View style={styles.sectionsWrapper}>
          <Collapsible title="Monsoon Navigation Safety Protocols">
            <View style={styles.collapsibleContent}>
              <Text style={styles.bulletText}>
                • <Text style={styles.boldText}>Sandal Custody:</Text> Carry footwear securely by hand. Sandals have a high risk of being swept away by street currents.
              </Text>
              <Text style={styles.bulletText}>
                • <Text style={styles.boldText}>Mirpur Rapids:</Text> Avoid Mirpur 10 zone unless utilizing a heavy commuter vessel. High water currents can destabilize light boats.
              </Text>
              <Text style={styles.bulletText}>
                • <Text style={styles.boldText}>Large Vessel Wake:</Text> Maintain a firm grip when double-decker launches pass. Wake waves present significant turbulence.
              </Text>
              <Text style={styles.bulletText}>
                • <Text style={styles.boldText}>Umbrella Clearance:</Text> Maintain vertical clearance. Careless positioning decreases passenger satisfaction indices.
              </Text>
            </View>
          </Collapsible>

          <Collapsible title="Vessel Classifications">
            <View style={styles.collapsibleContent}>
              <View style={styles.boatRow}>
                <View style={styles.boatIconWrapper}>
                  {getVesselIcon('mini', '#00B4D8', 24)}
                </View>
                <View style={styles.boatText}>
                  <Text style={styles.boatName}>Dubao Mini</Text>
                  <Text style={styles.boatDesc}>Fits two slightly soaked passengers. Captain row speed: Moderate.</Text>
                </View>
              </View>

              <View style={styles.boatRow}>
                <View style={styles.boatIconWrapper}>
                  {getVesselIcon('launch', '#00B4D8', 24)}
                </View>
                <View style={styles.boatText}>
                  <Text style={styles.boatName}>Dubao Launch</Text>
                  <Text style={styles.boatDesc}>For large commuter groups. Capable of navigating through heavy currents.</Text>
                </View>
              </View>

              <View style={styles.boatRow}>
                <View style={styles.boatIconWrapper}>
                  {getVesselIcon('vip', '#00B4D8', 24)}
                </View>
                <View style={styles.boatText}>
                  <Text style={styles.boatName}>Dubao VIP</Text>
                  <Text style={styles.boatDesc}>Equipped with premium umbrella holster and tea service. Subject to umbrella tax.</Text>
                </View>
              </View>

              <View style={styles.boatRow}>
                <View style={styles.boatIconWrapper}>
                  {getVesselIcon('titanic', '#00B4D8', 24)}
                </View>
                <View style={styles.boatText}>
                  <Text style={styles.boatName}>Dubao Titanic</Text>
                  <Text style={styles.boatDesc}>Highest capacity. Budget friendly. Safety confidence rating: Variable.</Text>
                </View>
              </View>
            </View>
          </Collapsible>

          <Collapsible title="Achievements Index">
            <View style={styles.collapsibleContent}>
              <Text style={styles.bulletText}>
                • <Text style={styles.boldText}>Survived Mirpur Rainfall:</Text> Awarded for completing transits passing through Mirpur Waterfalls.
              </Text>
              <Text style={styles.bulletText}>
                • <Text style={styles.boldText}>Professional Umbrella Holder:</Text> Awarded for choosing VIP class transport.
              </Text>
              <Text style={styles.bulletText}>
                • <Text style={styles.boldText}>Waterproof Commuter:</Text> Awarded for rating captain 5 stars after wave exposure.
              </Text>
              <Text style={styles.bulletText}>
                • <Text style={styles.boldText}>Fastest Transit Booking:</Text> Awarded for booking transit before road water levels rise.
              </Text>
            </View>
          </Collapsible>

          <Collapsible title="Disclaimer & Project Notes">
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
    backgroundColor: '#0B0F19',
    paddingBottom: 40,
  },
  titleContainer: {
    gap: Spacing.three,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00B4D8',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 4,
  },
  sectionsWrapper: {
    gap: Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  collapsibleContent: {
    padding: 14,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginTop: 6,
  },
  bulletText: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#00B4D8',
  },
  disclaimerText: {
    color: '#64748B',
    fontSize: 11,
    lineHeight: 18,
    marginBottom: 8,
  },
  boatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  boatIconWrapper: {
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
    color: '#CBD5E1',
    fontSize: 11,
    marginTop: 2,
  },
});
