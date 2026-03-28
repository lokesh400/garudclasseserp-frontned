import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Image } from "react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  StyleSheet,
} from "react-native";
import SafeScreen from "../../components/SafeScreen";
import { API } from "../../utils/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

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

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      await API.get("/auth/logout");
    } catch (error) {
      console.log("LOGOUT ERROR:", error);
    } finally {
      await AsyncStorage.removeItem("userId");
      setLoggingOut(false);
      router.replace("/login");
    }
  };

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
      <View style={styles.backgroundGlowTop} />
      <View style={styles.backgroundGlowBottom} />

      <View style={styles.topBar}>
        <View>
          <Text style={styles.brand}>Garud Classes Admin</Text>
          <Text style={styles.welcome}>Welcome back</Text>
          <Text style={styles.username}>{user?.name || "User"}</Text>
        </View>
        <Pressable
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={loggingOut}
        >
          <Ionicons name="log-out-outline" size={18} color="#FFFFFF" />
          <Text style={styles.logoutText}>{loggingOut ? "..." : "Logout"}</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <View style={styles.profileRow}>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user?.name || "-"}</Text>
            <Text style={styles.role}>{user?.role || "-"}</Text>
          </View>

          {user?.image ? (
            <Image
              source={{ uri: user.image }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Ionicons name="person" size={30} color="#6781A6" />
            </View>
          )}
        </View>

        <View style={styles.divider} />

        <InfoRow icon="id-card-outline" label="ID" value={user?.employeeId} />
        <InfoRow icon="call-outline" label="Phone" value={user?.number} />
        <InfoRow icon="person-outline" label="Username" value={user?.username} />
        <InfoRow icon="mail-outline" label="Email" value={user?.email} />
        <InfoRow icon="briefcase-outline" label="Role" value={user?.role} />
      </View>
    </SafeScreen>
  );
}

/* REUSABLE INFO ROW */
const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIconWrap}>
      <Ionicons name={icon} size={18} color="#0A5FA8" />
    </View>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || "-"}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: "#F0F6FF",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#415069",
  },

  backgroundGlowTop: {
    position: "absolute",
    top: -65,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#9BD4FF",
    opacity: 0.46,
  },

  backgroundGlowBottom: {
    position: "absolute",
    bottom: -95,
    left: -85,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#B6F0D2",
    opacity: 0.4,
  },

  topBar: {
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  brand: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0B6FBF",
    letterSpacing: 0.7,
    textTransform: "uppercase",
    marginBottom: 4,
  },

  welcome: {
    fontSize: 14,
    color: "#4C5F7A",
    fontWeight: "700",
  },

  username: {
    fontSize: 28,
    fontWeight: "800",
    color: "#112846",
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#0B6FBF",
    borderRadius: 12,
  },

  logoutText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#DFE9F5",
    shadowColor: "#173257",
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
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
    fontWeight: "800",
    color: "#13243C",
  },

  role: {
    marginTop: 4,
    fontSize: 14,
    color: "#4E6280",
    textTransform: "capitalize",
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#DFE7F0",
    borderWidth: 2,
    borderColor: "#D2DEEE",
  },

  avatarFallback: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#DFE7F0",
    borderWidth: 2,
    borderColor: "#D2DEEE",
    alignItems: "center",
    justifyContent: "center",
  },

  divider: {
    height: 1,
    backgroundColor: "#E3ECF8",
    marginVertical: 16,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  infoIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E8F4FF",
    alignItems: "center",
    justifyContent: "center",
  },

  infoLabel: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "600",
    width: 90,
    color: "#3D4E66",
  },

  infoValue: {
    fontSize: 15,
    color: "#162842",
    flex: 1,
  },
});
