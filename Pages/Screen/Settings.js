import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [darkMode, setDarkMode] = useState(true);

  const renderSettingItem = (icon, title, value, onValueChange, type = 'switch') => (
    <View style={styles.settingItem}>
      <View style={styles.settingItemLeft}>
        <Ionicons name={icon} size={24} color="#339bfd" style={styles.icon} />
        <Text style={styles.settingItemText}>{title}</Text>
      </View>
      {type === 'switch' ? (
        <Switch
          trackColor={{ false: "#767577", true: "#339bfd" }}
          thumbColor={value ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={onValueChange}
          value={value}
        />
      ) : (
        <Ionicons name="chevron-forward" size={24} color="#339bfd" />
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="settings" size={24} color="#4A90E2" />
        <Text style={styles.headerText}>Settings</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Account</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          {renderSettingItem('person-outline', 'Edit Profile', null, null, 'navigate')}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ChangePassword')}>
          {renderSettingItem('lock-closed-outline', 'Change Password', null, null, 'navigate')}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Preferences</Text>
        {renderSettingItem('moon-outline', 'Dark Mode', darkMode, setDarkMode)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Support</Text>
        <TouchableOpacity onPress={() => navigation.navigate('HelpCenter')}>
          {renderSettingItem('help-circle-outline', 'Help Center', null, null, 'navigate')}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
          {renderSettingItem('shield-checkmark-outline', 'Privacy Policy', null, null, 'navigate')}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('TermsOfService')}>
          {renderSettingItem('document-text-outline', 'Terms of Service', null, null, 'navigate')}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#162a40',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 10,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#339bfd',
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  settingItemText: {
    fontSize: 16,
    color: '#FFF',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#339bfd',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default SettingsScreen;
