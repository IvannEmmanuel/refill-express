import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useUser } from "../../Components/UserContext";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const { userProfile, loading, error } = useUser();
  const navigation = useNavigation();

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#339bfd" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No profile data available</Text>
      </View>
    );
  }

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: () => {
          navigation.navigate("LoginPage");
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person" size={24} color="#4A90E2" />
        <Text style={styles.headerText}>Profile</Text>
      </View>
      <View style={styles.profileSection}>
        <Image
          source={{ uri: userProfile.profilePicture }}
          style={styles.profilePicture}
        />
        <Text style={styles.nameText}>
          {userProfile.firstname} {userProfile.lastname}
        </Text>
        <Text style={styles.emailText}>{userProfile.email}</Text>
      </View>
      <View style={styles.infoSection}>
        <ProfileItem icon="home-outline" label="Address" value={userProfile.address} />
        <ProfileItem icon="call-outline" label="Phone" value={userProfile.phoneNumber || 'N/A'} />
        <ProfileItem icon="calendar-outline" label="Date of Birth" value={formatDate(userProfile.birthdate) || 'N/A'} />
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const ProfileItem = ({ icon, label, value }) => (
  <View style={styles.profileItem}>
    <Ionicons name={icon} size={20} color="#339bfd" style={styles.itemIcon} />
    <View style={styles.itemTextContainer}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Text style={styles.itemValue}>{value}</Text>
    </View>
  </View>
);

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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
    backgroundColor: '#1E3A5F',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2D436B',
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    color: '#A1A7B5',
  },
  infoSection: {
    marginTop: 20,
    backgroundColor: '#1E3A5F',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#2D436B',
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2D436B',
  },
  itemIcon: {
    marginRight: 15,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 12,
    color: '#A1A7B5',
  },
  itemValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
