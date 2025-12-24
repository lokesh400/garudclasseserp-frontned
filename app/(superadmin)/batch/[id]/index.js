import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import SafeScreen from "../../../../components/SafeScreen";
import { API } from "../../../../utils/api";

export default function AllBatches() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // ✅ REQUIRED

  const fetchBatches = async () => {
    try {
      const res = await API.get("/api/batch/admin");
      setBatches(res.data);
    } catch (err) {
      console.log("Failed to fetch batches:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  if (loading) {
    return (
      <SafeScreen style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading batches...</Text>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen style={styles.container}>
      <Text style={styles.title}>All Batches</Text>

      <FlatList
        data={batches}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
          <BatchCard batch={item} router={router} />
        )}
      />
    </SafeScreen>
  );
}

/* ---------------- BATCH CARD ---------------- */

const BatchCard = ({ batch, router }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.batchName}>{batch.name}</Text>
        <Text style={styles.course}>{batch.courseType}</Text>
      </View>

      <Text style={styles.year}>Academic Year: {batch.year}</Text>

      <View style={styles.actions}>
        <ActionButton
          icon="people-outline"
          label="All Students"
          onPress={() =>
            router.push(`/batch/${batch._id}/students`)
          }
        />
        <ActionButton
          icon="document-text-outline"
          label="All Tests"
          onPress={() =>
            router.push(`/batch/${batch._id}/tests`)
          }
        />
      </View>
    </View>
  );
};

/* ---------------- BUTTON ---------------- */

const ActionButton = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Ionicons name={icon} size={18} color="#2563EB" />
    <Text style={styles.buttonText}>{label}</Text>
  </TouchableOpacity>
);

/* ---------------- STYLES ---------------- */

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

  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 15,
    color: "#0F172A",
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  batchName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },

  course: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  year: {
    marginTop: 6,
    fontSize: 14,
    color: "#64748B",
  },

  actions: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "space-between",
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },

  buttonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#2563EB",
  },
});
