import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icons } from '../components/Icons';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function TrainingScreen() {
  const { user, logout } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current;
  
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

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#000000', '#2e1065']}
        locations={[0, 0.7, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Icons name="bell" size={28} color="#d8b4fe" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={toggleMenu}>
          <Icons name="menu" size={28} color="#d8b4fe" />
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
            <Icons name="user" size={24} color="#d8b4fe" />
            <Text style={styles.menuEmail}>{user?.email}</Text>
          </View>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              toggleMenu();
              logout();
            }}>
            <Icons name="log-out" size={20} color="#d8b4fe" />
            <Text style={styles.menuItemText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={styles.content}>
        <Text style={styles.text}>Training Screen</Text>
      </View>
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
    marginTop: 60,
  },
  iconButton: {
    padding: 10,
  },
  menuButton: {
    padding: 10,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#d8b4fe',
    fontSize: 18,
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
  menuEmail: {
    color: '#d8b4fe',
    fontSize: 14,
    marginLeft: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuItemText: {
    color: '#d8b4fe',
    fontSize: 16,
    marginLeft: 12,
  },
}); 