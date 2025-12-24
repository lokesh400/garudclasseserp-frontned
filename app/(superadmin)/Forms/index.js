import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import SafeScreen from "../../../components/SafeScreen";
import { API } from "../../../utils/api";

export default function AdminForms() {
  const [forms, setForms] = useState([]);
  const router = useRouter();

  useEffect(() => {
    API.get("/api/form/admin/forms").then((res) => {
      setForms(res.data.forms || []);
    });
  }, []);

  return (
    <SafeScreen style={styles.container}>
      <Text style={styles.title}>All Forms</Text>

      <FlatList
        data={forms}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/Forms/${item._id}`)}
          >
            <Text style={styles.name}>{item.title}</Text>
            <Text style={styles.desc}>{item.description}</Text>
            <Text style={styles.meta}>
              Created: {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8FAFC" },
  title: { fontSize: 26, fontWeight: "800", marginBottom: 10 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  name: { fontSize: 18, fontWeight: "700" },
  desc: { fontSize: 14, color: "#475569" },
  meta: { fontSize: 12, color: "#64748B", marginTop: 4 },
});
