import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';

export type UserRole = 'passenger' | 'captain' | null;

export type AppState =
  | 'splash'
  | 'login'
  | 'role_selection'
  | 'home'
  | 'booking'
  | 'searching'
  | 'accepted'
  | 'ride'
  | 'summary'
  | 'rating';

export type CaptainState =
  | 'offline'
  | 'online'
  | 'incoming_request'
  | 'navigating'
  | 'completed';

export interface Boat {
  id: string;
  name: string;
  emoji: string;
  description: string;
  baseFare: number;
  perKm: number;
  umbrellaTax?: number;
  badge?: string;
  capacity: number;
}

export interface Captain {
  name: string;
  emoji: string;
  rating: string;
  bio: string;
  boatName: string;
  boatNumber: string;
  tripsCount: number;
}

export interface ChatMessage {
  id: string;
  sender: 'passenger' | 'captain' | 'system';
  text: string;
  timestamp: string;
}

export interface Ride {
  id: string;
  pickup: string;
  destination: string;
  distanceKm: number;
  boat: Boat;
  fare: number;
  umbrellaTaxApplied: boolean;
  etaMinutes: number;
  captain: Captain;
  progress: number; // 0 to 100
  funnyStatus: string;
  paymentMethod: string;
  surgeMultiplier: number;
  sosTriggered: boolean;
}

interface AppContextProps {
  // Common state
  userRole: UserRole;
  userName: string;
  userPhone: string;
  isLoggedIn: boolean;
  appState: AppState;
  funnyNotification: string | null;

  // Passenger state
  pickupLocation: string;
  destinationLocation: string;
  selectedBoatCategory: string | null;
  activeRide: Ride | null;
  completedRide: Ride | null;
  achievements: string[];
  paymentMethod: 'cash' | 'bkash' | 'sandals';
  surgeMultiplier: number;
  sosTriggered: boolean;
  chatMessages: ChatMessage[];
  locationHistory: string[];
  activePromo: { code: string; discount: number } | null;

  // Captain state
  captainState: CaptainState;
  captainEarnings: number;
  captainBoatName: string;
  captainBoatCategory: string;
  captainBoatNumber: string;
  incomingRequest: {
    pickup: string;
    destination: string;
    fare: number;
    etaMinutes: number;
    distanceKm: number;
    boatCategory: string;
    surgeMultiplier: number;
  } | null;

  // Actions
  login: (name: string, phone: string) => void;
  logout: () => void;
  selectRole: (role: UserRole) => void;
  resetToHome: () => void;
  
  // Passenger Actions
  setLocations: (pickup: string, destination: string) => void;
  selectBoat: (category: string) => void;
  requestRide: () => void;
  cancelRide: () => void;
  rateRide: (stars: number, feedback: string, tags: string[]) => void;
  setPayment: (method: 'cash' | 'bkash' | 'sandals') => void;
  triggerSOS: () => void;
  sendChatMessage: (text: string) => void;
  applyPromoCode: (code: string) => boolean;

  // Captain Actions
  registerBoat: (category: string, name: string, number: string) => void;
  setCaptainOnline: (online: boolean) => void;
  acceptIncomingRide: () => void;
  rejectIncomingRide: () => void;
  completeCaptainRide: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// Fictional Dhaka locations
export const LOCATIONS = [
  'Dhanmondi 27 (Water Port)',
  'Farmgate Flyover Pier',
  'Mirpur 10 Waterfalls',
  'Gulshan Lake Extension (Road 11)',
  'Banani Canal Harbor',
  'Kawran Bazar Canal Terminal',
  'Motijheel Sea Basin',
  'Uttara Sector 11 Coastline',
  'Mohakhali Flyover (Underpass Canal)',
  'Badda Link Road Swamps',
  'Baily Road Tea Harbor',
  'Azimpur Red Sea',
  'Shahbagh Flower Lagoon',
  'Puran Dhaka Biryani Bay',
  'Rampura Bridge Port',
  'Gabtoli Sandal Coast',
];

// Boat categories
export const BOATS: Boat[] = [
  {
    id: 'mini',
    name: 'Dubao Mini',
    emoji: '🚣',
    description: 'Perfect for two slightly soaked passengers.',
    baseFare: 40,
    perKm: 15,
    capacity: 2,
    badge: 'Eco-Row',
  },
  {
    id: 'launch',
    name: 'Dubao Launch',
    emoji: '🚤',
    description: 'For office commuters escaping flooded traffic.',
    baseFare: 90,
    perKm: 22,
    capacity: 10,
    badge: 'Commuters Choice',
  },
  {
    id: 'vip',
    name: 'Dubao VIP',
    emoji: '☂️',
    description: 'Umbrella holder & imaginary hot tea service included.',
    baseFare: 150,
    perKm: 35,
    umbrellaTax: 25,
    capacity: 3,
    badge: 'Lux-Umbrella',
  },
  {
    id: 'cargo',
    name: 'Dubao Cargo',
    emoji: '📦',
    description: 'Designed for groceries, laptops, and abandoned sandals.',
    baseFare: 110,
    perKm: 28,
    capacity: 1,
    badge: 'Heavy Duty',
  },
  {
    id: 'titanic',
    name: 'Dubao Titanic',
    emoji: '🚢',
    description: 'Lowest fare. Highest confidence. Questionable safety.',
    baseFare: 25,
    perKm: 8,
    capacity: 50,
    badge: 'Titanic Budget',
  },
  {
    id: 'jetski',
    name: 'Dubao JetSki',
    emoji: '🚀',
    description: 'For commuters running extremely late for exams or meetings.',
    baseFare: 200,
    perKm: 50,
    capacity: 1,
    badge: 'Express Splasher',
  },
  {
    id: 'duck',
    name: 'Dubao Duck',
    emoji: '🦆',
    description: 'Inflatable duck shape. High cuteness. Zero actual speed.',
    baseFare: 50,
    perKm: 12,
    capacity: 2,
    badge: 'Cuteness Premium',
  },
  {
    id: 'airbed',
    name: 'Dubao Airbed',
    emoji: '🎈',
    description: 'Literally an inflatable mattress. Hold on to your bags.',
    baseFare: 35,
    perKm: 10,
    capacity: 2,
    badge: 'Highly Unstable',
  },
];

// Mock Captains
const CAPTAINS: Captain[] = [
  {
    name: 'Babu Mia',
    emoji: '🚣',
    rating: '4.9',
    bio: 'Rowed through the legendary 2004 floods. Speed specialist.',
    boatName: 'Jol Doshu (Water Bandit)',
    boatNumber: 'DHAKA-KORE-99',
    tripsCount: 1450,
  },
  {
    name: 'Captain Jalil',
    emoji: '🌊',
    rating: '4.8',
    bio: 'Former river launch driver. Very stable navigation.',
    boatName: 'Sonar Tori (Golden Boat)',
    boatNumber: 'DHAKA-VIBE-07',
    tripsCount: 980,
  },
  {
    name: 'Flood King Rafi',
    emoji: '⛵',
    rating: '4.7',
    bio: 'Can navigate Mirpur 10 waterfalls blindfolded.',
    boatName: 'Storm Breaker',
    boatNumber: 'DHAKA-RAIN-88',
    tripsCount: 650,
  },
  {
    name: 'Noah Bhai',
    emoji: '🛶',
    rating: '5.0',
    bio: 'Has two of every animal onboard. Highly safe and secure.',
    boatName: 'The Ark Lite',
    boatNumber: 'DHAKA-NOAH-01',
    tripsCount: 2200,
  },
  {
    name: 'Gondola Guru',
    emoji: '😎',
    rating: '4.6',
    bio: 'Brings Venetian style row-comedy. Free tea when raining.',
    boatName: 'Cha-wala Gondola',
    boatNumber: 'DHAKA-TEA-420',
    tripsCount: 310,
  },
  {
    name: 'Chanchal Majhi',
    emoji: '🛶',
    rating: '4.95',
    bio: 'Wears safety sunglasses. Rows with rhythm and plays flute.',
    boatName: 'Bhatiali Vibe',
    boatNumber: 'DHAKA-FLUTE-09',
    tripsCount: 880,
  },
  {
    name: 'Speedy Shamim',
    emoji: '🚀',
    rating: '4.5',
    bio: 'Former jet ski champion. Will splash water but you will arrive early.',
    boatName: 'Jol-Rani (Water Queen)',
    boatNumber: 'DHAKA-SPEED-55',
    tripsCount: 1200,
  },
  {
    name: 'Sultana Rower',
    emoji: '⛵',
    rating: '5.0',
    bio: 'Vessel with solar-powered charging ports. High luxury.',
    boatName: 'Nilima (Blue sky)',
    boatNumber: 'DHAKA-SOLAR-11',
    tripsCount: 770,
  },
  {
    name: 'Hasan Lifesaver',
    emoji: '🏊',
    rating: '4.8',
    bio: 'Guarantees a dry shirt. Will carry you on his shoulders to the deck.',
    boatName: 'Tori-Helper',
    boatNumber: 'DHAKA-HELP-911',
    tripsCount: 430,
  },
  {
    name: 'Mama Gondolier',
    emoji: '😎',
    rating: '4.75',
    bio: 'Calls everyone "Mama". Charges extra ৳10 for fish stories.',
    boatName: 'Mama Tori',
    boatNumber: 'DHAKA-MAMA-820',
    tripsCount: 1150,
  },
];

// Chat Messages list from Captain during matching/trip
const CAPTAIN_MOCK_CHATS = [
  'Bhai, I am near the Farmgate bridge. Please stand on a high rickshaw so I can spot you.',
  'Heavy wave incoming from an overtaking water-truck, hold on tight!',
  'Bhai, my paddle is stuck in some floating weeds, reaching in 2 mins.',
  'Please hold your umbrella high so my eyes stay safe, brother.',
  'Almost there, brother. Look for the orange launch with the Yamaha rowing motor.',
  'Bhai, I am near the floating tea stall. Do you want ginger tea?',
  'Water level is up to my waist, brother! Standing on top of a bus stand. Reach in 3 mins.',
  'Bhai, please look for the yellow floating mattress. Do not step on the green water hyacinths!',
  'Mama, rickshaws have blocked the canal intersection. Taking a shortcut through the alleyways!',
  'My vessel has a tiny leak, but I am rowing double speed, do not worry!',
];

const RIDE_STATUS_MESSAGES = [
  'Rowing aggressively to bypass a swimming rickshaw.',
  'Surge pricing active due to unexpected fish migration.',
  'Traffic jam: Two double-decker buses are floating side-by-side.',
  'Captain is currently bailing out water from the deck. Do not panic.',
  'Just navigated past a floating refrigerator. Captain saluted it.',
  'Your shoes status: Missing. (They floated away)',
  'Heavy wave detected from an overtaking water-truck.',
  'Stopped briefly to catch a fish. Captain says it is dinner.',
  'Rickshaw-boat drag race spotted on the left.',
  'Babu Mia is chanting row-row-row-your-boat in Bengali.',
  'Dodging a floating plastic chair. Captain called it a navigational hazard.',
  'Stopped to assist a cat riding a floating thermocol sheet.',
  'Surge multiplier increased: Rickshaws have officially started rowing.',
  'Water log depth: 5.2 feet. Captain suggests lifting your knees.',
  'Passed a tea stall serving tea directly to floating passengers. Speed: 2 knots.',
  'Surviving the wake of a speeding patrol launch.',
  'Rickshaw-boat traffic jam under Mohakhali flyover.',
  'Captain is chanting spiritual row songs to calm the waves.',
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [appState, setAppState] = useState<AppState>('splash');
  const [funnyNotification, setFunnyNotification] = useState<string | null>(null);

  // Passenger state
  const [pickupLocation, setPickupLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [selectedBoatCategory, setSelectedBoatCategory] = useState<string | null>(null);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [completedRide, setCompletedRide] = useState<Ride | null>(null);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bkash' | 'sandals'>('cash');
  const [surgeMultiplier, setSurgeMultiplier] = useState(2.2); // Dynamic surge multiplier
  const [sosTriggered, setSosTriggered] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [locationHistory] = useState<string[]>([
    'Dhanmondi 27 (Water Port)',
    'Gulshan Lake Extension (Road 11)',
    'Motijheel Sea Basin',
  ]);
  const [activePromo, setActivePromo] = useState<AppContextProps['activePromo']>(null);

  // Captain dashboard state
  const [captainState, setCaptainState] = useState<CaptainState>('offline');
  const [captainEarnings, setCaptainEarnings] = useState(14500);
  const [captainBoatName, setCaptainBoatName] = useState('');
  const [captainBoatCategory, setCaptainBoatCategory] = useState('mini');
  const [captainBoatNumber, setCaptainBoatNumber] = useState('');
  const [incomingRequest, setIncomingRequest] = useState<AppContextProps['incomingRequest']>(null);

  // Splash screen timeout
  useEffect(() => {
    if (appState === 'splash') {
      const timer = setTimeout(() => {
        setAppState('login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  // Set random surge based on time of day
  useEffect(() => {
    const randomSurge = parseFloat((Math.random() * 1.5 + 1.5).toFixed(1));
    setSurgeMultiplier(randomSurge);
  }, [pickupLocation, destinationLocation]);

  // Simulated Ride Progress for passenger
  useEffect(() => {
    let progressTimer: any;
    let notificationTimer: any;
    let chatTimer: any;

    if (appState === 'ride' && activeRide) {
      // Increment progress every 1.5 seconds
      progressTimer = setInterval(() => {
        setActiveRide((prev) => {
          if (!prev) return null;
          const nextProgress = prev.progress + 6;
          if (nextProgress >= 100) {
            clearInterval(progressTimer);
            clearInterval(notificationTimer);
            clearInterval(chatTimer);
            // Ride completed!
            setTimeout(() => {
              setCompletedRide({ ...prev, progress: 100 });
              setAppState('summary');
            }, 1000);
            return { ...prev, progress: 100 };
          }
          return { ...prev, progress: nextProgress };
        });
      }, 1500);

      // Random funny updates
      notificationTimer = setInterval(() => {
        const randomMsg = RIDE_STATUS_MESSAGES[Math.floor(Math.random() * RIDE_STATUS_MESSAGES.length)];
        setFunnyNotification(randomMsg);
        setActiveRide((prev) => {
          if (!prev) return null;
          return { ...prev, funnyStatus: randomMsg };
        });
        setTimeout(() => setFunnyNotification(null), 4000);
      }, 6000);

      // Random Captain chats
      chatTimer = setInterval(() => {
        const randomChat = CAPTAIN_MOCK_CHATS[Math.floor(Math.random() * CAPTAIN_MOCK_CHATS.length)];
        setChatMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'captain',
            text: randomChat,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 9000);
    }

    return () => {
      clearInterval(progressTimer);
      clearInterval(notificationTimer);
      clearInterval(chatTimer);
    };
  }, [appState]);

  // Simulated ride requests for Captain
  useEffect(() => {
    let requestTimer: any;

    if (userRole === 'captain' && captainState === 'online' && !incomingRequest) {
      const triggerRequest = () => {
        const randomPickup = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
        let randomDest = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
        while (randomDest === randomPickup) {
          randomDest = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
        }

        const randomCategory = BOATS[Math.floor(Math.random() * BOATS.length)].id;
        const distance = parseFloat((Math.random() * 5 + 1).toFixed(1));
        const boatObj = BOATS.find((b) => b.id === randomCategory) || BOATS[0];
        const multiplier = parseFloat((Math.random() * 1.2 + 1.4).toFixed(1));
        const fare = Math.round((boatObj.baseFare + Math.round(distance * boatObj.perKm)) * multiplier);

        setIncomingRequest({
          pickup: randomPickup,
          destination: randomDest,
          fare,
          etaMinutes: Math.round(distance * 3),
          distanceKm: distance,
          boatCategory: randomCategory,
          surgeMultiplier: multiplier,
        });

        setCaptainState('incoming_request');
      };

      requestTimer = setTimeout(triggerRequest, 6000);
    }

    return () => clearTimeout(requestTimer);
  }, [userRole, captainState, incomingRequest]);

  // Auth actions
  const login = (name: string, phone: string) => {
    setUserName(name || 'Abul Rower');
    setUserPhone(phone || '01712345678');
    setIsLoggedIn(true);
    setAppState('role_selection');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setAppState('login');
    setPickupLocation('');
    setDestinationLocation('');
    setSelectedBoatCategory(null);
    setActiveRide(null);
    setCompletedRide(null);
    setCaptainState('offline');
    setIncomingRequest(null);
    setChatMessages([]);
    setSosTriggered(false);
    setActivePromo(null);
  };

  const selectRole = (role: UserRole) => {
    setUserRole(role);
    setAppState('home');
    if (role === 'captain') {
      setCaptainState('offline');
    }
  };

  const resetToHome = () => {
    setAppState('home');
    setActiveRide(null);
    setCompletedRide(null);
    setPickupLocation('');
    setDestinationLocation('');
    setSelectedBoatCategory(null);
    setChatMessages([]);
    setSosTriggered(false);
  };

  // Passenger actions
  const setLocations = (pickup: string, destination: string) => {
    setPickupLocation(pickup);
    setDestinationLocation(destination);
    setAppState('booking');
  };

  const selectBoat = (category: string) => {
    setSelectedBoatCategory(category);
  };

  const requestRide = () => {
    if (!pickupLocation || !destinationLocation || !selectedBoatCategory) return;
    setAppState('searching');

    // Simulate search & assign
    setTimeout(() => {
      const selectedBoat = BOATS.find((b) => b.id === selectedBoatCategory) || BOATS[0];
      const randomCaptain = CAPTAINS[Math.floor(Math.random() * CAPTAINS.length)];
      
      const distance = parseFloat((Math.random() * 6 + 1.5).toFixed(1));
      const baseCost = selectedBoat.baseFare + Math.round(distance * selectedBoat.perKm);
      const applyUmbrellaTax = selectedBoat.id === 'vip';
      const tax = applyUmbrellaTax ? (selectedBoat.umbrellaTax || 0) : 0;
      
      let finalFare = Math.round(baseCost * surgeMultiplier) + tax;
      if (activePromo) {
        finalFare = Math.max(20, finalFare - activePromo.discount);
      }

      const newRide: Ride = {
        id: Math.random().toString(36).substring(7),
        pickup: pickupLocation,
        destination: destinationLocation,
        distanceKm: distance,
        boat: selectedBoat,
        fare: finalFare,
        umbrellaTaxApplied: applyUmbrellaTax,
        etaMinutes: Math.round(distance * 4),
        captain: randomCaptain,
        progress: 0,
        funnyStatus: 'Captain assigned! Paddling towards your location.',
        paymentMethod: paymentMethod,
        surgeMultiplier: surgeMultiplier,
        sosTriggered: false,
      };

      setChatMessages([
        {
          id: 'sys-1',
          sender: 'system',
          text: `Matched with Captain ${randomCaptain.name}. ${selectedBoat.emoji} ${selectedBoat.name} is on the way.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        {
          id: 'cap-first',
          sender: 'captain',
          text: `Assalamu Alaikum. I am rowing towards your location. Please stand on a dry spot!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);

      setActiveRide(newRide);
      setAppState('accepted');

      // Auto start ride after 4 seconds (captain arrived)
      setTimeout(() => {
        setAppState('ride');
      }, 4500);
    }, 3500);
  };

  const cancelRide = () => {
    setAppState('home');
    setActiveRide(null);
    setChatMessages([]);
  };

  const rateRide = (stars: number, feedback: string, tags: string[]) => {
    const newAchievements: string[] = [...achievements];
    
    // Add achievements based on ride context
    if (pickupLocation.includes('Mirpur') || destinationLocation.includes('Mirpur')) {
      if (!newAchievements.includes('🏆 Survived Mirpur Rainfall')) {
        newAchievements.push('🏆 Survived Mirpur Rainfall');
      }
    }
    if (selectedBoatCategory === 'vip') {
      if (!newAchievements.includes('🏆 Professional Umbrella Holder')) {
        newAchievements.push('🏆 Professional Umbrella Holder');
      }
    }
    if (stars === 5 && tags.includes('Complimentary Tea 🍵')) {
      if (!newAchievements.includes('🏆 Waterproof Passenger')) {
        newAchievements.push('🏆 Waterproof Passenger');
      }
    }
    if (!newAchievements.includes('🏆 Fastest Boat Booking')) {
      newAchievements.push('🏆 Fastest Boat Booking');
    }

    setAchievements(newAchievements);
    resetToHome();
  };

  const setPayment = (method: 'cash' | 'bkash' | 'sandals') => {
    setPaymentMethod(method);
  };

  const triggerSOS = () => {
    setSosTriggered(true);
    setFunnyNotification('SOS: Life jacket dropping requested from helicopter!');
    setActiveRide((prev) => prev ? { ...prev, sosTriggered: true } : null);
    
    setChatMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: 'system',
        text: '🚨 Emergency life jacket dispatch request broadcasted to Dhaka Navy!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);

    setTimeout(() => {
      setFunnyNotification(null);
    }, 5000);
  };

  const sendChatMessage = (text: string) => {
    if (!text.trim()) return;
    const newMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'passenger',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);

    // Simulate comical auto-reply from captain after 2 seconds
    setTimeout(() => {
      const captainReplies = [
        'Bhai, cannot text, paddling aggressively!',
        'A big water wave is coming from a passing truck, holds phone in dry bag!',
        'Got it. Look for the floating umbrella!',
        'Almost there, just rowing past Kawran Bazar water terminal.',
      ];
      const randomReply = captainReplies[Math.floor(Math.random() * captainReplies.length)];
      setChatMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'captain',
          text: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    }, 2000);
  };

  const applyPromoCode = (code: string): boolean => {
    const formattedCode = code.toUpperCase().trim();
    if (formattedCode === 'WET50' || formattedCode === 'WETVIBE') {
      setActivePromo({ code: formattedCode, discount: 50 });
      return true;
    }
    return false;
  };

  // Captain actions
  const registerBoat = (category: string, name: string, number: string) => {
    setCaptainBoatCategory(category);
    setCaptainBoatName(name || 'Bela Shesh');
    setCaptainBoatNumber(number || 'DHAKA-VIBE-01');
  };

  const setCaptainOnline = (online: boolean) => {
    if (online) {
      setCaptainState('online');
    } else {
      setCaptainState('offline');
      setIncomingRequest(null);
    }
  };

  const acceptIncomingRide = () => {
    if (!incomingRequest) return;
    setCaptainState('navigating');

    let simProgress = 0;
    const interval = setInterval(() => {
      simProgress += 10;
      if (simProgress >= 100) {
        clearInterval(interval);
        setCaptainEarnings((prev) => prev + (incomingRequest?.fare || 0));
        setCaptainState('completed');
      }
    }, 1200);
  };

  const rejectIncomingRide = () => {
    setIncomingRequest(null);
    setCaptainState('online');
  };

  const completeCaptainRide = () => {
    setIncomingRequest(null);
    setCaptainState('online');
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        userName,
        userPhone,
        isLoggedIn,
        appState,
        funnyNotification,

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

        captainState,
        captainEarnings,
        captainBoatName,
        captainBoatCategory,
        captainBoatNumber,
        incomingRequest,

        login,
        logout,
        selectRole,
        resetToHome,

        setLocations,
        selectBoat,
        requestRide,
        cancelRide,
        rateRide,
        setPayment,
        triggerSOS,
        sendChatMessage,
        applyPromoCode,

        registerBoat,
        setCaptainOnline,
        acceptIncomingRide,
        rejectIncomingRide,
        completeCaptainRide,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};
