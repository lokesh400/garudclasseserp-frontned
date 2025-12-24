import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    /* ---------------- FETCH LEAD ---------------- */
    API.get(`/api/query/admin/query/${id}`).then((r) =>
      setLead(r.data.lead)
    );

    /* ---------------- FETCH FOLLOWUPS ---------------- */
    API.get(`/api/query/admin/query/${id}/followups`).then((r) =>
      setFollowups(r.data.followups || [])
    );
  }, [id]);

  /* ---------------- ADD FOLLOW-UP ---------------- */
  const addFollowUp = async () => {
    if (!note.trim()) return;

    try {
      setSaving(true);

      const res = await API.post(
        `/api/query/admin/queries/${id}/followups`,
        { note }
      );

      // add on top (latest first)
      setFollowups((prev) => [
        res.data.followup,
        ...prev,
      ]);

      setNote("");
    } catch (err) {
      console.log("Failed to add follow-up:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!lead) return null;

  return (
    <SafeScreen style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <Text style={styles.title}>{lead.studentName}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>📞 {lead.mobileNumber}</Text>
          <Text style={styles.infoText}>{lead.description}</Text>
        </View>

        {/* ADD FOLLOW-UP */}
        <Text style={styles.section}>Add Follow-up</Text>

        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Type follow-up note..."
          multiline
          style={styles.input}
        />

        <TouchableOpacity
          style={[
            styles.addBtn,
            saving && { opacity: 0.6 },
          ]}
          onPress={addFollowUp}
          disabled={saving}
        >
          <Text style={styles.addText}>
            {saving ? "Saving..." : "Add Follow-up"}
          </Text>
        </TouchableOpacity>

        {/* FOLLOW-UP LIST */}
        <Text style={styles.section}>Follow-ups</Text>

        <FlatList
          data={followups || []}
          keyExtractor={(item, index) =>
            item?._id || index.toString()
          }
          renderItem={({ item }) => {
            if (!item) return null;

            return (
              <View style={styles.followupCard}>
                <Text style={styles.followupNote}>
                  {item.note}
                </Text>
                <Text style={styles.followupTime}>
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
              </View>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No follow-ups yet
            </Text>
          }
        />
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8FAFC",
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 10,
    color: "#0F172A",
  },

  infoBox: {
    backgroundColor: "#F1F5F9",
    padding: 14,
    borderRadius: 14,
    marginBottom: 15,
  },

  infoText: {
    fontSize: 14,
    color: "#334155",
    marginBottom: 4,
  },

  section: {
    fontSize: 20,
    fontWeight: "800",
    marginVertical: 10,
    color: "#0F172A",
  },

  input: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 12,
    minHeight: 70,
    textAlignVertical: "top",
    marginBottom: 10,
  },

  addBtn: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },

  addText: {
    color: "#FFFFFF",
    fontWeight: "700",
    textAlign: "center",
  },

  followupCard: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#2563EB",
  },

  followupNote: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },

  followupTime: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 6,
  },

  empty: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 10,
  },
});
