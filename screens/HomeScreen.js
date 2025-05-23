import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icons } from '../components/Icons';
import { useAuth } from '../contexts/AuthContext';
import MessageModal from '../components/MessageModal';
import useWelcomeSequence from '../hooks/useWelcomeSequence';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current;
  const { 
    currentMessage, 
    showMessage, 
    handleNext, 
    handleAction 
  } = useWelcomeSequence(user?.uid);
  
  const toggleMenu = () => {
    const toValue = menuVisible ? width : 0;
    setMenuVisible(!menuVisible);
    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: true,
      tension: 65,
      friction: 11
    }).start();
  };

  const handleMessageInteraction = () => {
    if (currentMessage?.type === 'CONFIRM') {
      // Confirm messages are handled by the buttons
      return;
    }
    handleNext();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#000000', '#2e1065']}
        locations={[0, 0.7, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Only show header and content when not showing welcome message */}
      {!showMessage && (
        <>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => setShowMessageModal(true)}>
              <Icons name="mail" size={28} color="#60a5fa" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={toggleMenu}>
              <Icons name="menu" size={28} color="#60a5fa" />
            </TouchableOpacity>
          </View>

          {/* Sliding Menu */}
          {menuVisible && (
            <TouchableOpacity
              style={styles.overlay}
              activeOpacity={1}
              onPress={toggleMenu}
            />
          )}
          <Animated.View
            style={[
              styles.menuContainer,
              {
                transform: [{ translateX: slideAnim }]
              }
            ]}>
            <View style={styles.menuContent}>
              <View style={styles.menuHeader}>
                <Icons name="user" size={24} color="#60a5fa" />
                <View style={styles.userInfo}>
                  <Text style={styles.menuUsername}>{user?.displayName || 'User'}</Text>
                  <Text style={styles.menuEmail}>{user?.email}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  toggleMenu();
                  logout();
                }}>
                <Icons name="log-out" size={20} color="#60a5fa" />
                <Text style={styles.menuItemText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <View style={styles.trainingCard}>
            <View style={styles.dotContainer}>
              <View style={[styles.dot, { backgroundColor: '#d8b4fe' }]} />
              <View style={[styles.dot, { backgroundColor: 'rgba(216, 180, 254, 0.3)' }]} />
              <View style={[styles.dot, { backgroundColor: 'rgba(216, 180, 254, 0.3)' }]} />
              <View style={[styles.dot, { backgroundColor: 'rgba(216, 180, 254, 0.3)' }]} />
            </View>
            <Text style={styles.cardTitle}>Daily Training</Text>
            <Text style={styles.cardSubtitle}>no quests available</Text>
            <View style={styles.progressCircle}>
              <Text style={styles.progressText}>-</Text>
            </View>
          </View>

          <View style={styles.questCard}>
            <View style={styles.questHeader}>
              <Icons name="info" size={24} color="#60a5fa" />
              <Text style={styles.questTitle}>DAILY QUEST</Text>
            </View>
            <Text style={styles.questInstructions}>
              [Click below to generate your quest.]
            </Text>
            <TouchableOpacity style={styles.addButton}>
              <Icons name="plus" size={24} color="#000000" />
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Message Modal */}
      {showMessage && (
        <MessageModal
          visible={showMessage}
          message={currentMessage?.message || ''}
          type={currentMessage?.type || 'INFO'}
          highlightWords={currentMessage?.highlightWords || []}
          onAction={handleAction}
          onClose={handleMessageInteraction}
        />
      )}

      {/* Mail Message Modal */}
      <MessageModal
        visible={showMessageModal}
        onClose={() => setShowMessageModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
    marginTop: 30,
  },
  iconButton: {
    padding: 10,
  },
  menuButton: {
    padding: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width * 0.75,
    height: '100%',
    backgroundColor: '#000000',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(216, 180, 254, 0.3)',
    zIndex: 2,
    elevation: 5,
  },
  menuContent: {
    padding: 20,
    marginTop: 60,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(216, 180, 254, 0.1)',
    marginBottom: 20,
  },
  userInfo: {
    marginLeft: 12,
  },
  menuUsername: {
    color: '#60a5fa',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'PressStart2P',
  },
  menuEmail: {
    color: '#60a5fa',
    fontSize: 14,
    fontFamily: 'PressStart2P',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuItemText: {
    color: '#60a5fa',
    fontSize: 16,
    marginLeft: 12,
    fontFamily: 'PressStart2P',
  },
  trainingCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#60a5fa',
  },
  dotContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'PressStart2P',
  },
  cardSubtitle: {
    color: 'rgba(96, 165, 250, 0.6)',
    fontSize: 16,
    fontFamily: 'PressStart2P',
  },
  progressCircle: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -25 }],
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#60a5fa',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  progressText: {
    color: '#60a5fa',
    fontSize: 18,
  },
  questCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#60a5fa',
  },
  questHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  questTitle: {
    color: '#60a5fa',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  questInstructions: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#60a5fa',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 