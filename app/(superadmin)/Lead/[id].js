import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import SafeScreen from "../../../components/SafeScreen";
import { API } from "../../../utils/api";

export default function LeadDetails() {
  const { id } = useLocalSearchParams();
  const [lead, setLead] = useState(null);
  const [followups, setFollowups] = useState([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    API.get(`/api/query/admin/query/${id}`).then((r) => setLead(r.data.lead));
    API.get(`/api/query/admin/query/${id}/followups`).then((r) =>
      setFollowups(r.data.followups)
    );
  }, []);

  const addFollowUp = async () => {
    if (!note) return;
    const res = await API.post(`/admin/query/${id}/followups`, { note });
    setFollowups([res.data.followup, ...followups]);
    setNote("");
  };

  if (!lead) return null;

  return (
    <SafeScreen style={styles.container}>
      <Text style={styles.title}>{lead.studentName}</Text>
      <Text style={styles.followupBox}>{lead.mobileNumber}</Text>
      <Text style={styles.followupBox}>{lead.description}</Text>


      <Text style={styles.section}>Follow-ups</Text>

      <FlatList
        data={followups}
        keyExtractor={(i) => i._id}
        renderItem={({ item }) => (
          <View style={styles.followupCard}>
            <Text style={styles.followupNote}>{item.note}</Text>
            <Text style={styles.followupTime}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
        )}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8FAFC" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "800", marginBottom: 10 },
  card: { backgroundColor: "#fff", padding: 16, borderRadius: 16, marginBottom: 12 },
  name: { fontSize: 18, fontWeight: "700" },
  meta: { fontSize: 14, color: "#475569" },
  status: { marginTop: 8, padding: 6, borderRadius: 10, fontWeight: "700" },
  open: { backgroundColor: "#DCFCE7", color: "#166534" },
  closed: { backgroundColor: "#FEE2E2", color: "#991B1B" },

  followupBox: { marginTop: 8, backgroundColor: "#F1F5F9", padding: 10, borderRadius: 10 },
  followupText: { fontSize: 13 },
  followupDate: { fontSize: 11, color: "#64748B" },

  section: { fontSize: 20, fontWeight: "800", marginVertical: 10 },
  followupCard: { backgroundColor: "#fff", padding: 14, borderRadius: 14, marginBottom: 10 },
  followupNote: { fontSize: 15, fontWeight: "600" },
  followupTime: { fontSize: 12, color: "#64748B" },

  input: { backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 10 },
  addBtn: { backgroundColor: "#2563EB", padding: 12, borderRadius: 12 },
  addText: { color: "#fff", fontWeight: "700", textAlign: "center" },

  filterBar: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
  chip: { backgroundColor: "#E5E7EB", padding: 8, borderRadius: 16, marginRight: 6 },
  chipActive: { backgroundColor: "#2563EB" },
  chipText: { fontSize: 13 },
  chipTextActive: { color: "#fff" },
});
