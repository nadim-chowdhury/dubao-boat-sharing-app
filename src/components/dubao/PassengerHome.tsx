import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { useAppState, BOATS, LOCATIONS, Boat } from '@/context/AppContext';
import { MapView } from './MapView';
import { getVesselIcon } from './VesselIcons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Helper to generate Captain Monograms (e.g. "Babu Mia" -> "BM")
const getMonogram = (name: string) => {
  if (!name) return 'C';
  const parts = name.split(' ');
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export const PassengerHome: React.FC = () => {
  const {
    appState,
    userName,
    pickupLocation,
    destinationLocation,
    selectedBoatCategory,
    activeRide,
    completedRide,
    achievements,
    paymentMethod,
    surgeMultiplier,
    sosTriggered,
    chatMessages,
    locationHistory,
    activePromo,
    setLocations,
    selectBoat,
    requestRide,
    cancelRide,
    rateRide,
    setPayment,
    triggerSOS,
    sendChatMessage,
    applyPromoCode,
    logout,
    resetToHome,
    funnyNotification,
  } = useAppState();

  // Search details
  const [tempPickup, setTempPickup] = useState('');
  const [tempDest, setTempDest] = useState('');
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showDestModal, setShowDestModal] = useState(false);

  // Chat window state
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatInput, setChatInput] = useState('');

  // Payment Selection Sheet
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Promo code
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState('');

  // Rating details
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [selectedCompliments, setSelectedCompliments] = useState<string[]>([]);

  // Search details step helper
  const [isSelectingRoute, setIsSelectingRoute] = useState(false);

  const toggleCompliment = (comp: string) => {
    setSelectedCompliments((prev) =>
      prev.includes(comp) ? prev.filter((c) => c !== comp) : [...prev, comp]
    );
  };

  const handleApplyPromo = () => {
    const success = applyPromoCode(promoInput);
    if (success) {
      setPromoMessage('Promo WET50 applied: ৳50 Off!');
      setPromoInput('');
    } else {
      setPromoMessage('Invalid code! Try WET50.');
    }
  };

  const handleStartBooking = () => {
    if (!tempPickup || !tempDest) return;
    if (tempPickup === tempDest) return;
    setLocations(tempPickup, tempDest);
    setIsSelectingRoute(false);
  };

  // Chat auto scroll support
  const chatListRef = useRef<FlatList>(null);
  useEffect(() => {
    if (chatMessages.length > 0) {
      setTimeout(() => chatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [chatMessages, showChatModal]);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    sendChatMessage(chatInput);
    setChatInput('');
  };

  // Get total fare calculation
  const getBoatFareTotal = (boat: Boat) => {
    const dist = activeRide ? activeRide.distanceKm : 3.4;
    const baseCost = boat.baseFare + Math.round(dist * boat.perKm);
    const tax = boat.umbrellaTax || 0;
    let total = Math.round(baseCost * surgeMultiplier) + tax;
    if (activePromo) {
      total = Math.max(20, total - activePromo.discount);
    }
    return total;
  };

  return (
    <View style={styles.container}>
      {/* App Main Header */}
      <View style={styles.topAppBar}>
        <View style={styles.brandRow}>
          <Text style={styles.appTitle}>DUBAO</Text>
          <View style={styles.badgeLive}>
            <Text style={styles.badgeLiveText}>ACTIVE MONSOON</Text>
          </View>
        </View>
        <Text style={styles.floodLevel}>Dhaka Flood Index: 4.5m | Dynamic Surge active</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutBtnText}>Switch User</Text>
        </TouchableOpacity>
      </View>

      {/* Floating Global Comical Notification */}
      {funnyNotification && (
        <View style={styles.toastBanner}>
          <Text style={styles.toastText}>{funnyNotification}</Text>
        </View>
      )}

      {/* Map Segment */}
      <View style={styles.mapContainer}>
        <MapView />
      </View>

      {/* Main Interactive Panel */}
      <View style={styles.sheetContainer}>
        {appState === 'home' && !isSelectingRoute && (
          <ScrollView contentContainerStyle={styles.scrollPanel}>
            {/* Promo banner slider mockup */}
            <View style={styles.promoCard}>
              <View style={styles.promoTextColumn}>
                <Text style={styles.promoBadge}>OFFER</Text>
                <Text style={styles.promoHeading}>Get ৳50 off your next commute</Text>
                <Text style={styles.promoDesc}>Apply code <Text style={styles.boldCode}>WET50</Text> before your shoes float away.</Text>
              </View>
              <View style={styles.promoVectorPlaceholder}>
                <View style={styles.promoVectorCircle} />
              </View>
            </View>

            {/* Quick Actions Panel */}
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity
                style={styles.quickActionBox}
                onPress={() => setIsSelectingRoute(true)}
              >
                <View style={styles.quickActionIconWrapper}>
                  {getVesselIcon('mini', '#00B4D8', 24)}
                </View>
                <Text style={styles.quickActionLabel}>Dubao Ride</Text>
                <Text style={styles.quickActionSub}>Book a vessel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionBox}
                onPress={() => {
                  setTempPickup('Gulshan Lake Extension (Road 11)');
                  setTempDest('Motijheel Sea Basin');
                  setLocations('Gulshan Lake Extension (Road 11)', 'Motijheel Sea Basin');
                  selectBoat('cargo');
                }}
              >
                <View style={styles.quickActionIconWrapper}>
                  {getVesselIcon('cargo', '#00B4D8', 24)}
                </View>
                <Text style={styles.quickActionLabel}>Cargo Delivery</Text>
                <Text style={styles.quickActionSub}>Ship goods</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionBox}
                onPress={() => {
                  setTempPickup('Dhanmondi 27 (Water Port)');
                  setTempDest('Farmgate Flyover Pier');
                  setLocations('Dhanmondi 27 (Water Port)', 'Farmgate Flyover Pier');
                  selectBoat('vip');
                }}
              >
                <View style={styles.quickActionIconWrapper}>
                  {getVesselIcon('vip', '#00B4D8', 24)}
                </View>
                <Text style={styles.quickActionLabel}>Tea Service</Text>
                <Text style={styles.quickActionSub}>Premium tea logs</Text>
              </TouchableOpacity>
            </View>

            {/* Simulated Search bar like Uber */}
            <TouchableOpacity
              style={styles.searchBarTrigger}
              onPress={() => setIsSelectingRoute(true)}
            >
              <View style={styles.searchBarDot} />
              <Text style={styles.searchBarText}>Where to, brother?</Text>
            </TouchableOpacity>

            {/* Recent Searches */}
            <Text style={styles.sectionHeader}>Saved Monsoon Harbors</Text>
            {locationHistory.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.historyRow}
                onPress={() => {
                  setTempPickup(LOCATIONS[0]);
                  setTempDest(item);
                  setLocations(LOCATIONS[0], item);
                }}
              >
                <View style={styles.historyCircle}>
                  <Text style={styles.historyCircleText}>⚓</Text>
                </View>
                <View style={styles.historyTextContainer}>
                  <Text style={styles.historyTitle}>{item.split(' ')[0]}</Text>
                  <Text style={styles.historySub}>{item}</Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* Achievements list */}
            {achievements.length > 0 && (
              <View style={styles.achievementsWrap}>
                <Text style={styles.sectionHeader}>Commuter Badges</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeScroll}>
                  {achievements.map((badge, index) => (
                    <View key={index} style={styles.achievementBadge}>
                      <Text style={styles.achievementBadgeText}>{badge}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </ScrollView>
        )}

        {/* Route Selector Modal / Sheet */}
        {isSelectingRoute && (
          <View style={styles.routeSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Set Commute Ports</Text>
              <TouchableOpacity style={styles.closeTextBtn} onPress={() => setIsSelectingRoute(false)}>
                <Text style={styles.closeText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.inputTrigger} onPress={() => setShowPickupModal(true)}>
              <View style={[styles.nodeIndicator, { backgroundColor: '#10B981' }]} />
              <Text style={styles.inputText}>
                {tempPickup || 'From: Select Pickup Harbor'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.inputTrigger} onPress={() => setShowDestModal(true)}>
              <View style={[styles.nodeIndicator, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.inputText}>
                {tempDest || 'To: Select Destination Harbor'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitBtn,
                (!tempPickup || !tempDest || tempPickup === tempDest) && styles.disabledBtn,
              ]}
              onPress={handleStartBooking}
              disabled={!tempPickup || !tempDest || tempPickup === tempDest}
            >
              <Text style={styles.submitBtnText}>Confirm Route 🧭</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Vehicle Selection Bottom Sheet */}
        {appState === 'booking' && (
          <View style={styles.bookingSheet}>
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>Vessel Categories</Text>
                <Text style={styles.routePreview}>
                  Route: {pickupLocation.split(' ')[0]} ➔ {destinationLocation.split(' ')[0]}
                </Text>
              </View>
              <TouchableOpacity style={styles.closeTextBtn} onPress={cancelRide}>
                <Text style={styles.closeText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            {/* Promo code entry inline */}
            <View style={styles.promoInputRow}>
              <TextInput
                style={styles.promoTextInput}
                placeholder="Enter Promo Code (e.g. WET50)"
                placeholderTextColor="#64748B"
                value={promoInput}
                onChangeText={setPromoInput}
              />
              <TouchableOpacity style={styles.promoApplyBtn} onPress={handleApplyPromo}>
                <Text style={styles.promoApplyText}>Apply</Text>
              </TouchableOpacity>
            </View>
            {promoMessage ? <Text style={styles.promoMsgText}>{promoMessage}</Text> : null}

            {/* Surge multiplier alert */}
            <View style={styles.surgeAlert}>
              <Text style={styles.surgeAlertText}>
                ⚡ Monsoon Surge pricing active: {surgeMultiplier}x
              </Text>
            </View>

            <ScrollView style={styles.vesselList}>
              {BOATS.map((boat) => {
                const isSelected = selectedBoatCategory === boat.id;
                const price = getBoatFareTotal(boat);
                return (
                  <TouchableOpacity
                    key={boat.id}
                    style={[
                      styles.vesselItem,
                      isSelected && styles.vesselItemSelected,
                    ]}
                    onPress={() => selectBoat(boat.id)}
                  >
                    <View style={styles.vesselIconWrapper}>
                      {getVesselIcon(boat.id, isSelected ? '#FB8500' : '#00B4D8', 36)}
                    </View>
                    <View style={styles.vesselInfo}>
                      <View style={styles.vesselTitleRow}>
                        <Text style={styles.vesselName}>{boat.name}</Text>
                        <Text style={styles.vesselCapacity}>👥 {boat.capacity}</Text>
                        {boat.badge && (
                          <View style={styles.vesselBadge}>
                            <Text style={styles.vesselBadgeText}>{boat.badge}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.vesselDesc}>{boat.description}</Text>
                    </View>
                    <View style={styles.vesselFareBox}>
                      <Text style={styles.vesselFare}>৳{price}</Text>
                      <Text style={styles.vesselDuration}>~14m</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Payment Method Selector Bar */}
            <TouchableOpacity
              style={styles.paymentBar}
              onPress={() => setShowPaymentModal(true)}
            >
              <Text style={styles.paymentLabel}>
                Payment: <Text style={styles.paymentVal}>
                  {paymentMethod === 'cash' && 'Cash (Wet Takas)'}
                  {paymentMethod === 'bkash' && 'bKash (Mobile Wallet)'}
                  {paymentMethod === 'sandals' && 'Trade Sandals'}
                </Text>
              </Text>
              <Text style={styles.paymentChange}>Change ➔</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitBtn,
                !selectedBoatCategory && styles.disabledBtn,
              ]}
              onPress={requestRide}
              disabled={!selectedBoatCategory}
            >
              <Text style={styles.submitBtnText}>
                Confirm Ride Request
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Searching Captain Sheet */}
        {appState === 'searching' && (
          <View style={styles.searchSheet}>
            <View style={styles.searchAnimBox}>
              <View style={styles.scanRipple} />
              <View style={styles.scanSpinner} />
            </View>
            <Text style={styles.searchHeader}>Matching with nearby launch captains...</Text>
            <Text style={styles.searchSub}>
              Checking waterlogged streets & waterway logs
            </Text>
            <View style={styles.funnySearchStatusCard}>
              <Text style={styles.funnySearchText}>
                " Waving to nearby captains... Evaluating dry sock levels... "
              </Text>
            </View>
            <TouchableOpacity style={styles.cancelBtn} onPress={cancelRide}>
              <Text style={styles.cancelBtnText}>Cancel Request</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Captain Accepted Sheet */}
        {appState === 'accepted' && activeRide && (
          <View style={styles.acceptedSheet}>
            <View style={styles.captainProfileBox}>
              <Text style={styles.captainMatchTitle}>Vessel Dispatched</Text>
              <View style={styles.captainCardContent}>
                <View style={styles.captainMonogramBox}>
                  <Text style={styles.captainMonogramText}>
                    {getMonogram(activeRide.captain.name)}
                  </Text>
                </View>
                <View style={styles.captainDetailsCol}>
                  <Text style={styles.captainTitleName}>
                    {activeRide.captain.name} | Rating: {activeRide.captain.rating} ({activeRide.captain.tripsCount} trips)
                  </Text>
                  <Text style={styles.captainTitleBio}>"{activeRide.captain.bio}"</Text>
                  <Text style={styles.vesselInfoLabel}>
                    Boat: {activeRide.captain.boatName} ({activeRide.captain.boatNumber})
                  </Text>
                </View>
              </View>
            </View>

            {/* Communication tools */}
            <View style={styles.communicationRow}>
              <TouchableOpacity
                style={styles.commButton}
                onPress={() => setShowChatModal(true)}
              >
                <Text style={styles.commBtnText}>Message Captain</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.commButton, styles.sosButton]}
                onPress={triggerSOS}
              >
                <Text style={styles.commBtnText}>Emergency SOS</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Ride Progress Sheet */}
        {appState === 'ride' && activeRide && (
          <View style={styles.rideProgressSheet}>
            <View style={styles.rideProgressHeader}>
              <Text style={styles.sheetTitle}>Commute in Progress</Text>
              <TouchableOpacity
                style={styles.chatBubbleTrigger}
                onPress={() => setShowChatModal(true)}
              >
                <Text style={styles.chatTriggerText}>
                  Messages ({chatMessages.filter(m => m.sender === 'captain').length})
                </Text>
              </TouchableOpacity>
            </View>

            {/* Ride Status Card */}
            <View style={styles.funnyRideStatusBox}>
              <Text style={styles.liveActivityText}>" {activeRide.funnyStatus} "</Text>
            </View>

            {/* Progress indicators */}
            <View style={styles.progressBarWrapper}>
              <View style={styles.trackBar}>
                <View style={[styles.fillBar, { width: `${activeRide.progress}%` }]} />
              </View>
              <View style={styles.barLabelRow}>
                <Text style={styles.barLabel}>Progress: {activeRide.progress}%</Text>
                <Text style={styles.barLabel}>
                  ETA:{' '}
                  {Math.max(
                    1,
                    Math.round((activeRide.etaMinutes * (100 - activeRide.progress)) / 100)
                  )}{' '}
                  min
                </Text>
              </View>
            </View>

            {/* Safety Options */}
            <View style={styles.safetyActionRow}>
              <TouchableOpacity style={styles.safetyOptionBtn} onPress={triggerSOS}>
                <Text style={styles.safetyOptionText}>Request Life Jacket</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.safetyOptionBtn} onPress={cancelRide}>
                <Text style={styles.safetyOptionText}>Cancel Trip</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Invoice Summary Sheet */}
        {appState === 'summary' && completedRide && (
          <View style={styles.summarySheet}>
            <Text style={styles.sheetTitle}>Receipt Summary</Text>
            <Text style={styles.receiptIntro}>
              Invoice details processed securely through dry wallet.
            </Text>

            <ScrollView style={styles.receiptDetailsScroll}>
              <View style={styles.invoiceRow}>
                <Text style={styles.invoiceLabel}>Pickup Point</Text>
                <Text style={styles.invoiceValue}>{completedRide.pickup.split(' ')[0]}</Text>
              </View>
              <View style={styles.invoiceRow}>
                <Text style={styles.invoiceLabel}>Destination Point</Text>
                <Text style={styles.invoiceValue}>{completedRide.destination.split(' ')[0]}</Text>
              </View>
              <View style={styles.invoiceRow}>
                <Text style={styles.invoiceLabel}>Vessel Class</Text>
                <Text style={styles.invoiceValue}>{completedRide.boat.name}</Text>
              </View>
              <View style={styles.invoiceRow}>
                <Text style={styles.invoiceLabel}>Payment</Text>
                <Text style={styles.invoiceValue}>{completedRide.paymentMethod.toUpperCase()}</Text>
              </View>
              <View style={styles.invoiceDivider} />
              <View style={styles.invoiceRow}>
                <Text style={styles.invoiceLabel}>Vessel Fare</Text>
                <Text style={styles.invoiceValue}>৳{completedRide.boat.baseFare}</Text>
              </View>
              <View style={styles.invoiceRow}>
                <Text style={styles.invoiceLabel}>Commute Distance Cost</Text>
                <Text style={styles.invoiceValue}>
                  ৳{Math.round(completedRide.distanceKm * completedRide.boat.perKm)}
                </Text>
              </View>
              {completedRide.umbrellaTaxApplied && (
                <View style={styles.invoiceRow}>
                  <Text style={styles.invoiceLabel}>Umbrella Tax</Text>
                  <Text style={styles.invoiceValue}>৳{completedRide.boat.umbrellaTax}</Text>
                </View>
              )}
              <View style={styles.invoiceRow}>
                <Text style={styles.invoiceLabel}>Monsoon Surge multiplier</Text>
                <Text style={styles.invoiceValue}>
                  ৳{Math.round(
                    (completedRide.boat.baseFare +
                      completedRide.distanceKm * completedRide.boat.perKm) *
                      (completedRide.surgeMultiplier - 1)
                  )}
                </Text>
              </View>
              {activePromo && (
                <View style={[styles.invoiceRow, styles.promoDiscountRow]}>
                  <Text style={styles.promoDiscountLabel}>Promo WET50</Text>
                  <Text style={styles.promoDiscountVal}>- ৳{activePromo.discount}</Text>
                </View>
              )}
              <View style={styles.invoiceDivider} />
              <View style={[styles.invoiceRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Amount Paid</Text>
                <Text style={styles.totalValue}>৳{completedRide.fare}</Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={() => {
                setRatingStars(5);
                setRatingComment('');
                setSelectedCompliments([]);
                rateRide(5, 'Excellent row!', []);
              }}
            >
              <Text style={styles.submitBtnText}>Confirm and Complete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Pickup Location Modal Selector */}
      <Modal visible={showPickupModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalHeaderTitle}>Select Pickup Point</Text>
            <FlatList
              data={LOCATIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalListItem,
                    tempPickup === item && styles.modalListItemActive,
                  ]}
                  onPress={() => {
                    setTempPickup(item);
                    setShowPickupModal(false);
                  }}
                >
                  <Text style={styles.modalListItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowPickupModal(false)}>
              <Text style={styles.modalCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Destination Location Modal Selector */}
      <Modal visible={showDestModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalHeaderTitle}>Select Destination Point</Text>
            <FlatList
              data={LOCATIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalListItem,
                    tempDest === item && styles.modalListItemActive,
                  ]}
                  onPress={() => {
                    setTempDest(item);
                    setShowDestModal(false);
                  }}
                >
                  <Text style={styles.modalListItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowDestModal(false)}>
              <Text style={styles.modalCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Payment Selection Modal */}
      <Modal visible={showPaymentModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalHeaderTitle}>Payment Methods</Text>
            
            <TouchableOpacity
              style={[styles.payOptionRow, paymentMethod === 'cash' && styles.payOptionActive]}
              onPress={() => {
                setPayment('cash');
                setShowPaymentModal(false);
              }}
            >
              <View style={styles.payOptionTextContainer}>
                <Text style={styles.payOptionTitle}>Cash (Wet Takas)</Text>
                <Text style={styles.payOptionDesc}>Pay physical paper money directly to captain.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.payOptionRow, paymentMethod === 'bkash' && styles.payOptionActive]}
              onPress={() => {
                setPayment('bkash');
                setShowPaymentModal(false);
              }}
            >
              <View style={styles.payOptionTextContainer}>
                <Text style={styles.payOptionTitle}>bKash (Mobile Wallet)</Text>
                <Text style={styles.payOptionDesc}>Instant safe mobile money. 100% waterproof transfer.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.payOptionRow, paymentMethod === 'sandals' && styles.payOptionActive]}
              onPress={() => {
                setPayment('sandals');
                setShowPaymentModal(false);
              }}
            >
              <View style={styles.payOptionTextContainer}>
                <Text style={styles.payOptionTitle}>Sandal Trade-in</Text>
                <Text style={styles.payOptionDesc}>Trade leather shoes for fare credit. Subject to captain check.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowPaymentModal(false)}>
              <Text style={styles.modalCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Live Chat drawer */}
      <Modal visible={showChatModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, styles.chatModalSheet]}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatHeaderTitle}>Captain Message Hub</Text>
              <TouchableOpacity onPress={() => setShowChatModal(false)}>
                <Text style={styles.chatCloseText}>Minimize</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              ref={chatListRef}
              data={chatMessages}
              keyExtractor={(item) => item.id}
              style={styles.chatList}
              renderItem={({ item }) => {
                const isUser = item.sender === 'passenger';
                const isSystem = item.sender === 'system';
                if (isSystem) {
                  return (
                    <View style={styles.chatSystemRow}>
                      <Text style={styles.chatSystemText}>{item.text}</Text>
                    </View>
                  );
                }
                return (
                  <View style={[styles.chatBubbleRow, isUser ? styles.chatRowRight : styles.chatRowLeft]}>
                    <View style={[styles.chatBubble, isUser ? styles.chatBubbleUser : styles.chatBubbleCap]}>
                      <Text style={styles.chatBubbleText}>{item.text}</Text>
                      <Text style={styles.chatBubbleTime}>{item.timestamp}</Text>
                    </View>
                  </View>
                );
              }}
            />

            <View style={styles.chatInputBar}>
              <TextInput
                style={styles.chatTextInput}
                placeholder="Send a text message..."
                placeholderTextColor="#64748B"
                value={chatInput}
                onChangeText={setChatInput}
              />
              <TouchableOpacity style={styles.chatSendBtn} onPress={handleSendChat}>
                <Text style={styles.chatSendBtnText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  topAppBar: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#0B0F19',
    borderBottomWidth: 1,
    borderColor: '#1E293B',
    position: 'relative',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00B4D8',
    letterSpacing: 1.5,
  },
  badgeLive: {
    backgroundColor: '#00B4D8',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 8,
  },
  badgeLiveText: {
    color: '#0B0F19',
    fontSize: 8,
    fontWeight: 'bold',
  },
  floodLevel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 4,
  },
  logoutBtn: {
    position: 'absolute',
    right: 20,
    top: 20,
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
  toastBanner: {
    backgroundColor: '#FB8500',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    zIndex: 100,
  },
  toastText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  mapContainer: {
    paddingHorizontal: 16,
    marginTop: 6,
  },
  sheetContainer: {
    flex: 1,
    backgroundColor: '#0B0F19',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 20,
    marginTop: -12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderTopWidth: 1,
    borderColor: '#1E293B',
  },
  scrollPanel: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  promoCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  promoTextColumn: {
    flex: 1,
    marginRight: 10,
  },
  promoBadge: {
    backgroundColor: '#00B4D8',
    color: '#0B0F19',
    fontSize: 8,
    fontWeight: 'bold',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  promoHeading: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  promoDesc: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 4,
  },
  boldCode: {
    color: '#00B4D8',
    fontWeight: 'bold',
  },
  promoVectorPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoVectorCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00B4D8',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickActionBox: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  quickActionIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickActionLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  quickActionSub: {
    color: '#64748B',
    fontSize: 9,
    marginTop: 2,
  },
  searchBarTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  searchBarDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00B4D8',
    marginRight: 12,
  },
  searchBarText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionHeader: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  historyCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  historyCircleText: {
    fontSize: 12,
  },
  historyTextContainer: {
    flex: 1,
  },
  historyTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  historySub: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  achievementsWrap: {
    marginTop: 20,
  },
  badgeScroll: {
    flexDirection: 'row',
  },
  achievementBadge: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  achievementBadgeText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: 'bold',
  },
  routeSheet: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeTextBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  closeText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: 'bold',
  },
  inputTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  nodeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  inputText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: '#FB8500',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledBtn: {
    backgroundColor: '#1E293B',
    opacity: 0.5,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bookingSheet: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  routePreview: {
    color: '#00B4D8',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
  },
  promoInputRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  promoTextInput: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#ffffff',
    fontSize: 12,
  },
  promoApplyBtn: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginLeft: 8,
  },
  promoApplyText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  promoMsgText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  surgeAlert: {
    backgroundColor: 'rgba(251, 133, 0, 0.1)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(251, 133, 0, 0.25)',
  },
  surgeAlertText: {
    color: '#FB8500',
    fontSize: 10,
    fontWeight: 'bold',
  },
  vesselList: {
    maxHeight: 200,
    marginVertical: 4,
  },
  vesselItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  vesselItemSelected: {
    borderColor: '#FB8500',
    backgroundColor: 'rgba(251, 133, 0, 0.05)',
  },
  vesselIconWrapper: {
    marginRight: 12,
  },
  vesselInfo: {
    flex: 1,
  },
  vesselTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vesselName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  vesselCapacity: {
    color: '#64748B',
    fontSize: 10,
    marginLeft: 8,
  },
  vesselBadge: {
    backgroundColor: '#1E293B',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  vesselBadgeText: {
    color: '#00B4D8',
    fontSize: 8,
    fontWeight: 'bold',
  },
  vesselDesc: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  vesselFareBox: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  vesselFare: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  vesselDuration: {
    color: '#64748B',
    fontSize: 10,
  },
  paymentBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  paymentLabel: {
    color: '#64748B',
    fontSize: 12,
  },
  paymentVal: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  paymentChange: {
    color: '#00B4D8',
    fontSize: 11,
    fontWeight: 'bold',
  },
  searchSheet: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  searchAnimBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  scanRipple: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#00B4D8',
    opacity: 0.3,
  },
  scanSpinner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#00B4D8',
    borderTopColor: 'transparent',
  },
  searchHeader: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchSub: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  funnySearchStatusCard: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 12,
    width: '100%',
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  funnySearchText: {
    color: '#FB8500',
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
  },
  cancelBtn: {
    paddingVertical: 10,
  },
  cancelBtnText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: 'bold',
  },
  acceptedSheet: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  captainProfileBox: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  captainMatchTitle: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  captainCardContent: {
    flexDirection: 'row',
  },
  captainMonogramBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  captainMonogramText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  captainDetailsCol: {
    flex: 1,
  },
  captainTitleName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  captainTitleBio: {
    color: '#64748B',
    fontSize: 11,
    fontStyle: 'italic',
    marginVertical: 4,
  },
  vesselInfoLabel: {
    color: '#00B4D8',
    fontSize: 11,
    fontWeight: 'bold',
  },
  communicationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  commButton: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sosButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: '#EF4444',
  },
  commBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rideProgressSheet: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  rideProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chatBubbleTrigger: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  chatTriggerText: {
    color: '#00B4D8',
    fontSize: 10,
    fontWeight: 'bold',
  },
  funnyRideStatusBox: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 16,
  },
  liveActivityText: {
    color: '#FB8500',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  progressBarWrapper: {
    marginBottom: 16,
  },
  trackBar: {
    height: 6,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fillBar: {
    height: '100%',
    backgroundColor: '#00B4D8',
    borderRadius: 3,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  barLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: 'bold',
  },
  safetyActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  safetyOptionBtn: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  safetyOptionText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: 'bold',
  },
  summarySheet: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  receiptIntro: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 4,
    marginBottom: 16,
  },
  receiptDetailsScroll: {
    maxHeight: 180,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  invoiceLabel: {
    color: '#64748B',
    fontSize: 11,
  },
  invoiceValue: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  invoiceDivider: {
    height: 1,
    backgroundColor: '#1E293B',
    marginVertical: 10,
  },
  promoDiscountRow: {
    marginBottom: 4,
  },
  promoDiscountLabel: {
    color: '#10B981',
    fontSize: 11,
  },
  promoDiscountVal: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: 'bold',
  },
  totalRow: {
    alignItems: 'center',
    marginVertical: 4,
  },
  totalLabel: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  totalValue: {
    color: '#00B4D8',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#0B0F19',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '70%',
    borderTopWidth: 1,
    borderColor: '#1E293B',
  },
  modalHeaderTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  modalListItem: {
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  modalListItemActive: {
    borderColor: '#FB8500',
    borderWidth: 1.5,
  },
  modalListItemText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  modalCloseBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 10,
  },
  modalCloseBtnText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: 'bold',
  },
  payOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  payOptionActive: {
    borderColor: '#FB8500',
    borderWidth: 1.5,
  },
  payOptionTextContainer: {
    flex: 1,
  },
  payOptionTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  payOptionDesc: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 2,
  },
  chatModalSheet: {
    height: '80%',
    maxHeight: '80%',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#1E293B',
    paddingBottom: 12,
    marginBottom: 10,
  },
  chatHeaderTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  chatCloseText: {
    color: '#00B4D8',
    fontSize: 13,
    fontWeight: 'bold',
  },
  chatList: {
    flex: 1,
  },
  chatBubbleRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  chatRowLeft: {
    justifyContent: 'flex-start',
  },
  chatRowRight: {
    justifyContent: 'flex-end',
  },
  chatBubble: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '80%',
  },
  chatBubbleUser: {
    backgroundColor: '#0077B6',
  },
  chatBubbleCap: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  chatBubbleText: {
    color: '#ffffff',
    fontSize: 13,
    lineHeight: 18,
  },
  chatBubbleTime: {
    color: '#64748B',
    fontSize: 8,
    textAlign: 'right',
    marginTop: 4,
  },
  chatSystemRow: {
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  chatSystemText: {
    color: '#64748B',
    fontSize: 9,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  chatInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#1E293B',
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#ffffff',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  chatSendBtn: {
    backgroundColor: '#FB8500',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginLeft: 10,
  },
  chatSendBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
