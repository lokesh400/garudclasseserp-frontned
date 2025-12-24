import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import SafeScreen from "../../../components/SafeScreen";
import { API } from "../../../utils/api";

export default function FormSubmissions() {
  const { id } = useLocalSearchParams();
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    console.log(id)
    API.get(`/api/form/admin/${id}/submissions`).then((res) => {
      setSubmissions(res.data.submissions || []);
    });
  }, [id]);

  return (
    <SafeScreen style={styles.container}>
      <Text style={styles.title}>Form Submissions</Text>
      <Text style={styles.title}>Total Submissions: {submissions.length}</Text>

      <FlatList
        data={submissions}
        keyExtractor={(i) => i._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.date}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>

            <Text style={styles.json}>
              {JSON.stringify(item.data, null, 2)}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No submissions yet</Text>
        }
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8FAFC" },
  title: { fontSize: 26, fontWeight: "800", marginBottom: 10 },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  date: { fontSize: 12, color: "#64748B", marginBottom: 6 },
  json: { fontSize: 13, color: "#0F172A" },
  empty: { fontSize: 14, color: "#64748B", marginTop: 20 },
});
