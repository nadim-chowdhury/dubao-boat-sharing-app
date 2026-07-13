import React from 'react';
import { View, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { useAppState } from '@/context/AppContext';
import { SplashView, LoginView, RoleSelectionView } from '@/components/dubao/AuthScreens';
import { PassengerHome } from '@/components/dubao/PassengerHome';
import { CaptainDashboard } from '@/components/dubao/CaptainDashboard';

export default function HomeScreen() {
  const { isLoggedIn, appState, userRole } = useAppState();

  const renderContent = () => {
    // If splash, show Splash overlay
    if (appState === 'splash') {
      return <SplashView />;
    }

    // If not logged in, show Login card
    if (!isLoggedIn || appState === 'login') {
      return <LoginView />;
    }

    // If logged in but no role selected, show Role Selection
    if (appState === 'role_selection' || !userRole) {
      return <RoleSelectionView />;
    }

    // Role specific flows
    if (userRole === 'passenger') {
      return <PassengerHome />;
    } else {
      return <CaptainDashboard />;
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>{renderContent()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#012A4A',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    ...Platform.select({
      web: {
        maxWidth: 600,
        alignSelf: 'center',
        width: '100%',
        height: '100%',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#013A63',
      },
    }),
  },
});
