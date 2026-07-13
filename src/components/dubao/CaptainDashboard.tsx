import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Vibration,
} from 'react-native';
import { useAppState, BOATS } from '@/context/AppContext';
import { MapView } from './MapView';
import { getVesselIcon } from './VesselIcons';

// Fictional trip logs
interface TripLog {
  id: string;
  route: string;
  fare: number;
  date: string;
}

const CAPTAIN_TRIP_LOGS: TripLog[] = [
  { id: '1', route: 'Dhanmondi 27 ➔ Farmgate', fare: 120, date: 'Today, 10:30 AM' },
  { id: '2', route: 'Mirpur 10 ➔ Banani Harbor', fare: 320, date: 'Yesterday, 4:15 PM' },
  { id: '3', route: 'Uttara Coastline ➔ Farmgate', fare: 480, date: 'Yesterday, 8:00 AM' },
  { id: '4', route: 'Kawran Bazar ➔ Motijheel', fare: 150, date: 'July 11, 2:30 PM' },
];

export const CaptainDashboard: React.FC = () => {
  const {
    userName,
    captainState,
    captainEarnings,
    captainBoatName,
    captainBoatCategory,
    captainBoatNumber,
    incomingRequest,
    registerBoat,
    setCaptainOnline,
    acceptIncomingRide,
    rejectIncomingRide,
    completeCaptainRide,
    logout,
  } = useAppState();

  // Registration states
  const [boatNameInput, setBoatNameInput] = useState('');
  const [boatNumberInput, setBoatNumberInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('mini');

  // Active navigation progress
  const [rowProgress, setRowProgress] = useState(0);
  const [rowStatusText, setRowStatusText] = useState('Vessel at dock.');
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    let timer: any;
    if (captainState === 'incoming_request' && incomingRequest) {
      setCountdown(15);
      try {
        Vibration.vibrate([200, 100, 200]);
      } catch (e) {}

      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            rejectIncomingRide();
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [captainState, incomingRequest]);

  // Handle manual row paddling click
  const handleRowClick = () => {
    setRowProgress((prev) => {
      const next = prev + 10;
      if (next >= 100) {
        setRowStatusText('Destination reached! Safely docked at destination harbor.');
        return 100;
      }
      const states = [
        'Propelling hard against current...',
        'Waving back at Rickshaw driver...',
        'Checking water log depth: 4.8ft',
        'Bailing water out with standard mug...',
        'Navigating past floating sandals...',
      ];
      setRowStatusText(states[Math.floor(Math.random() * states.length)]);
      return next;
    });
  };

  useEffect(() => {
    if (captainState === 'navigating') {
      setRowProgress(0);
      setRowStatusText('Departing pickup pier. Rowing towards destination!');
    }
  }, [captainState]);

  const handleRegister = () => {
    if (!boatNameInput.trim()) return;
    registerBoat(selectedCategory, boatNameInput, boatNumberInput || 'DHAKA-LNCH-01');
  };

  // 1. Vessel Registry Screen
  if (!captainBoatName) {
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>Captain License Portal</Text>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutBtnText}>Exit Registry</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardBox}>
          <Text style={styles.cardHeading}>Vessel Registration</Text>
          <Text style={styles.cardSub}>
            Register your boat and join the elite fleet keeping Dhaka moving.
          </Text>

          <View style={styles.inputFormGroup}>
            <Text style={styles.inputLabel}>Choose Vessel Class</Text>
            <View style={styles.categoryGrid}>
              {BOATS.map((boat) => {
                const isSel = selectedCategory === boat.id;
                return (
                  <TouchableOpacity
                    key={boat.id}
                    style={[
                      styles.categoryCard,
                      isSel && styles.categoryCardSel,
                    ]}
                    onPress={() => setSelectedCategory(boat.id)}
                  >
                    <View style={styles.categoryCardIconWrapper}>
                      {getVesselIcon(boat.id, isSel ? '#FB8500' : '#CBD5E1', 20)}
                    </View>
                    <Text style={styles.categoryCardName}>{boat.name.split(' ')[1]}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.inputFormGroup}>
            <Text style={styles.inputLabel}>Vessel Name (Fictional)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Sonar Tori, Mirpur Surf King"
              placeholderTextColor="#64748B"
              value={boatNameInput}
              onChangeText={setBoatNameInput}
            />
          </View>

          <View style={styles.inputFormGroup}>
            <Text style={styles.inputLabel}>Vessel Number Plate</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. DHAKA-LNCH-99"
              placeholderTextColor="#64748B"
              value={boatNumberInput}
              onChangeText={setBoatNumberInput}
            />
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleRegister}>
            <Text style={styles.submitBtnText}>Obtain Vessel License</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Console */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.topBarTitle}>Captain Console</Text>
          <Text style={styles.topBarSub}>
            Vessel: {captainBoatName} | Class: {BOATS.find(b => b.id === captainBoatCategory)?.name}
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutBtnText}>Switch Role</Text>
        </TouchableOpacity>
      </View>

      {/* Embedded Map */}
      <View style={styles.mapContainer}>
        <MapView />
      </View>

      {/* Main Console Sheet */}
      {captainState === 'offline' && (
        <ScrollView style={styles.sheetPanel}>
          {/* Earnings Analytics Grid */}
          <View style={styles.statsAnalyticsCard}>
            <View style={styles.statsHeader}>
              <Text style={styles.statsLabel}>WEEKLY EARNINGS</Text>
              <Text style={styles.statsTotalValue}>৳{captainEarnings.toLocaleString()}</Text>
            </View>

            {/* Simulated Bar Chart */}
            <View style={styles.chartWrapper}>
              <View style={styles.chartBarCol}>
                <View style={[styles.chartBarFill, { height: 40 }]} />
                <Text style={styles.chartBarLabel}>M</Text>
              </View>
              <View style={styles.chartBarCol}>
                <View style={[styles.chartBarFill, { height: 60 }]} />
                <Text style={styles.chartBarLabel}>T</Text>
              </View>
              <View style={styles.chartBarCol}>
                <View style={[styles.chartBarFill, { height: 35 }]} />
                <Text style={styles.chartBarLabel}>W</Text>
              </View>
              <View style={styles.chartBarCol}>
                <View style={[styles.chartBarFill, { height: 80 }]} />
                <Text style={styles.chartBarLabel}>T</Text>
              </View>
              <View style={styles.chartBarCol}>
                <View style={[styles.chartBarFill, { height: 95 }]} />
                <Text style={styles.chartBarLabel}>F</Text>
              </View>
              <View style={styles.chartBarCol}>
                <View style={[styles.chartBarFill, { height: 110, backgroundColor: '#FB8500' }]} />
                <Text style={styles.chartBarLabel}>S</Text>
              </View>
              <View style={styles.chartBarCol}>
                <View style={[styles.chartBarFill, { height: 20 }]} />
                <Text style={styles.chartBarLabel}>S</Text>
              </View>
            </View>
          </View>

          {/* Quick Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statGridBox}>
              <Text style={styles.statBoxTitle}>Completed</Text>
              <Text style={styles.statBoxVal}>148</Text>
            </View>
            <View style={styles.statGridBox}>
              <Text style={styles.statBoxTitle}>Accept Rate</Text>
              <Text style={styles.statBoxVal}>96.4%</Text>
            </View>
            <View style={styles.statGridBox}>
              <Text style={styles.statBoxTitle}>Rating</Text>
              <Text style={styles.statBoxVal}>4.85 ★</Text>
            </View>
          </View>

          {/* Trip Logs */}
          <Text style={styles.sectionHeading}>Weekly Row Logs</Text>
          {CAPTAIN_TRIP_LOGS.map((log) => (
            <View key={log.id} style={styles.logItemRow}>
              <View>
                <Text style={styles.logItemRoute}>{log.route}</Text>
                <Text style={styles.logItemDate}>{log.date}</Text>
              </View>
              <Text style={styles.logItemFare}>৳{log.fare}</Text>
            </View>
          ))}

          <TouchableOpacity
            style={[styles.submitBtn, styles.onlineColorBtn]}
            onPress={() => setCaptainOnline(true)}
          >
            <Text style={styles.submitBtnText}>Go Online (Find Commuters)</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {captainState === 'online' && (
        <View style={styles.sheetPanel}>
          <View style={styles.scanLayout}>
            <View style={styles.scanAnimationRingContainer}>
              <View style={styles.scanAnimationPulseRing} />
              <View style={styles.scanSpinner} />
            </View>
            <Text style={styles.onlineStatusTitle}>Online & Searching</Text>
            <Text style={styles.onlineStatusSub}>
              Checking waterlogged streets & commute requests
            </Text>
            <View style={styles.liveFeedPanel}>
              <Text style={styles.liveFeedItem}>• Rain index: Heavy rainfall in Banani Canal</Text>
              <Text style={styles.liveFeedItem}>• Commuters: High booking volume near Mirpur Waterfalls</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, styles.offlineColorBtn]}
            onPress={() => setCaptainOnline(false)}
          >
            <Text style={styles.submitBtnText}>Go Offline</Text>
          </TouchableOpacity>
        </View>
      )}

      {captainState === 'incoming_request' && incomingRequest && (
        <View style={styles.sheetPanel}>
          <View style={styles.incomingBannerAlert}>
            <Text style={styles.incomingBannerAlertText}>
              COMMUTE REQUEST RECEIVED ({countdown}s)
            </Text>
          </View>

          <View style={styles.requestOverviewCard}>
            <View style={styles.requestOverviewHeader}>
              <Text style={styles.requestBoatClass}>
                Class: {BOATS.find(b => b.id === incomingRequest.boatCategory)?.name}
              </Text>
              <Text style={styles.requestFareTotal}>৳{incomingRequest.fare}</Text>
            </View>
            {incomingRequest.surgeMultiplier > 1 && (
              <View style={styles.reqSurgeBadge}>
                <Text style={styles.reqSurgeBadgeText}>
                  Surge {incomingRequest.surgeMultiplier}x applied
                </Text>
              </View>
            )}

            <View style={styles.routeBoxItem}>
              <Text style={styles.routeBoxLabel}>PICKUP PORT</Text>
              <Text style={styles.routeBoxVal}>{incomingRequest.pickup}</Text>
            </View>

            <View style={styles.routeBoxItem}>
              <Text style={styles.routeBoxLabel}>DESTINATION PORT</Text>
              <Text style={styles.routeBoxVal}>{incomingRequest.destination}</Text>
            </View>

            <View style={styles.metricBriefRow}>
              <Text style={styles.metricBriefText}>Vessel Distance: {incomingRequest.distanceKm} km</Text>
              <Text style={styles.metricBriefText}>Row Time: {incomingRequest.etaMinutes} mins</Text>
            </View>
          </View>

          <View style={styles.splitBtnRow}>
            <TouchableOpacity
              style={[styles.splitBtn, styles.declineRequestBtn]}
              onPress={rejectIncomingRide}
            >
              <Text style={styles.splitBtnText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.splitBtn, styles.acceptRequestBtn]}
              onPress={acceptIncomingRide}
            >
              <Text style={styles.splitBtnText}>Accept Row</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {captainState === 'navigating' && incomingRequest && (
        <View style={styles.sheetPanel}>
          <Text style={styles.activeRowTitle}>Navigation Console</Text>
          <Text style={styles.activeRowRouteSub}>
            Destination: {incomingRequest.destination}
          </Text>

          <View style={styles.funnyNavigationActivityCard}>
            <Text style={styles.funnyNavStatusText}>" {rowStatusText} "</Text>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressLineTrack}>
              <View style={[styles.progressLineFill, { width: `${rowProgress}%` }]} />
            </View>
            <Text style={styles.progressStatusLabel}>Paddling progress: {rowProgress}%</Text>
          </View>

          {rowProgress < 100 ? (
            <TouchableOpacity style={styles.paddlingWheelBtn} onPress={handleRowClick}>
              <Text style={styles.paddlingWheelBtnText}>Row Aggressively</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.submitBtn, styles.onlineColorBtn]}
              onPress={completeCaptainRide}
            >
              <Text style={styles.submitBtnText}>Tie up at Harbor & Collect Fare</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {captainState === 'completed' && incomingRequest && (
        <View style={styles.sheetPanel}>
          <View style={styles.completeFareBox}>
            <Text style={styles.completeFareTitle}>Commute Complete</Text>
            <Text style={styles.completeFareValue}>+ ৳{incomingRequest.fare}</Text>
            <Text style={styles.completeFareSub}>
              Fare credited directly to your Dry Wallet.
            </Text>
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={completeCaptainRide}>
            <Text style={styles.submitBtnText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#0B0F19',
    justifyContent: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#0B0F19',
    borderBottomWidth: 1,
    borderColor: '#1E293B',
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00B4D8',
    letterSpacing: 0.5,
  },
  topBarSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: '#1E293B',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  logoutBtnText: {
    color: '#E2E8F0',
    fontSize: 9,
    fontWeight: 'bold',
  },
  cardBox: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 24,
    padding: 24,
    marginTop: 10,
  },
  cardHeading: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardSub: {
    color: '#64748B',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  inputFormGroup: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  categoryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryCard: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  categoryCardSel: {
    borderColor: '#FB8500',
  },
  categoryCardIconWrapper: {
    marginBottom: 4,
  },
  categoryCardEmoji: {
    fontSize: 20,
  },
  categoryCardName: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: 'bold',
    marginTop: 4,
  },
  textInput: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#ffffff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  submitBtn: {
    backgroundColor: '#FB8500',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  onlineColorBtn: {
    backgroundColor: '#2A9D8F',
  },
  offlineColorBtn: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  mapContainer: {
    paddingHorizontal: 16,
    marginTop: 6,
  },
  sheetPanel: {
    flex: 1,
    backgroundColor: '#0B0F19',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
    marginTop: -12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderTopWidth: 1,
    borderColor: '#1E293B',
  },
  statsAnalyticsCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 20,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  statsTotalValue: {
    color: '#00B4D8',
    fontSize: 24,
    fontWeight: 'bold',
  },
  chartWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: 10,
  },
  chartBarCol: {
    alignItems: 'center',
    flex: 1,
  },
  chartBarFill: {
    width: 10,
    backgroundColor: '#1E293B',
    borderRadius: 5,
  },
  chartBarLabel: {
    color: '#64748B',
    fontSize: 8,
    fontWeight: 'bold',
    marginTop: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statGridBox: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  statBoxTitle: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: 'bold',
  },
  statBoxVal: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 4,
  },
  sectionHeading: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  logItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  logItemRoute: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  logItemDate: {
    color: '#64748B',
    fontSize: 9,
    marginTop: 2,
  },
  logItemFare: {
    color: '#00B4D8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  scanLayout: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginVertical: 12,
  },
  scanAnimationRingContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#0F172A',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  scanAnimationPulseRing: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#2A9D8F',
    opacity: 0.3,
  },
  scanSpinner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2A9D8F',
    borderTopColor: 'transparent',
  },
  onlineStatusTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  onlineStatusSub: {
    color: '#64748B',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
  liveFeedPanel: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 12,
    width: '100%',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  liveFeedItem: {
    color: '#CBD5E1',
    fontSize: 11,
    marginBottom: 6,
    lineHeight: 16,
  },
  incomingBannerAlert: {
    backgroundColor: '#FB8500',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  incomingBannerAlertText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  requestOverviewCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 16,
  },
  requestOverviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestBoatClass: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  requestFareTotal: {
    color: '#00B4D8',
    fontSize: 22,
    fontWeight: 'bold',
  },
  reqSurgeBadge: {
    backgroundColor: 'rgba(251, 133, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(251, 133, 0, 0.25)',
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    marginTop: 6,
    marginBottom: 12,
  },
  reqSurgeBadgeText: {
    color: '#FB8500',
    fontSize: 8,
    fontWeight: 'bold',
  },
  routeBoxItem: {
    marginBottom: 12,
  },
  routeBoxLabel: {
    color: '#64748B',
    fontSize: 8,
    fontWeight: 'bold',
  },
  routeBoxVal: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  metricBriefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: '#1E293B',
    paddingTop: 12,
    marginTop: 4,
  },
  metricBriefText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: 'bold',
  },
  splitBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  splitBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  declineRequestBtn: {
    backgroundColor: '#EF4444',
  },
  acceptRequestBtn: {
    backgroundColor: '#2A9D8F',
  },
  splitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeRowTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  activeRowRouteSub: {
    color: '#00B4D8',
    fontSize: 12,
    fontWeight: 'bold',
    marginVertical: 6,
  },
  funnyNavigationActivityCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    alignItems: 'center',
  },
  funnyNavStatusText: {
    color: '#FB8500',
    fontSize: 13,
    fontStyle: 'italic',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progressSection: {
    marginVertical: 16,
  },
  progressLineTrack: {
    height: 6,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressLineFill: {
    height: '100%',
    backgroundColor: '#00B4D8',
    borderRadius: 3,
  },
  progressStatusLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  paddlingWheelBtn: {
    backgroundColor: '#FB8500',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
  },
  paddlingWheelBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  completeFareBox: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginVertical: 20,
  },
  completeFareTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  completeFareValue: {
    color: '#2A9D8F',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  completeFareSub: {
    color: '#64748B',
    fontSize: 11,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 16,
  },
});
