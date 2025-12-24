import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
} from "react-native";
import SafeScreen from "../../components/SafeScreen";
import { API } from "../../utils/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const res = await API.post(`/me/${userId}`);
      setUser(res.data);
    } catch (error) {
      console.log("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  if (loading) {
    return (
      <SafeScreen style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome 👋</Text>
        <Text style={styles.username}>{user.name}</Text>
      </View>

      {/* PROFILE CARD */}
      <View style={styles.card}>
        <View style={styles.profileRow}>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.role}>{user.role}</Text>
          </View>

          <Image
            source={{ uri: user.image }}
            style={styles.avatar}
          />
        </View>

        <View style={styles.divider} />

        <InfoRow icon="id-card-outline" label="ID" value={user.employeeId} />
        <InfoRow icon="call-outline" label="Phone" value={user.number} />
        <InfoRow icon="person-outline" label="Username" value={user.username} />
        <InfoRow icon="mail-outline" label="Email" value={user.email} />
        <InfoRow icon="briefcase-outline" label="Role" value={user.role} />
      </View>
    </SafeScreen>
  );
}

/* REUSABLE INFO ROW */
const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={20} color="#2563EB" />
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8FAFC",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#555",
  },

  header: {
    marginBottom: 18,
  },

  welcome: {
    fontSize: 16,
    color: "#64748B",
    fontWeight: "600",
  },

  username: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  profileInfo: {
    flex: 1,
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },

  role: {
    marginTop: 4,
    fontSize: 14,
    color: "#64748B",
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#E5E7EB",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  infoLabel: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "600",
    width: 90,
    color: "#334155",
  },

  infoValue: {
    fontSize: 15,
    color: "#0F172A",
    flex: 1,
  },
});
