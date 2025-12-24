import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import SafeScreen from "../../../components/SafeScreen";
import { API } from "../../../utils/api";

export default function AllLeads() {
  const router = useRouter();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [studentName, setStudentName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchLeads = async () => {
    const res = await API.get("/api/query/admin/queries/me");
    setLeads(res.data.leads || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  /* ---------------- CREATE QUERY ---------------- */

  const createQuery = async () => {
    if (!studentName || !mobileNumber) return;

    try {
      setSaving(true);

      const res = await API.post("/api/query/admin/queries", {
        studentName,
        mobileNumber,
        description,
      });
      // add new enquiry on top
      setLeads((prev) => [res.data.query, ...prev]);
      // reset form
      setStudentName("");
      setMobileNumber("");
      setDescription("");
      setShowForm(false);
    } catch (err) {
      console.log("Create enquiry failed:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <SafeScreen style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeScreen>
    );

  return (
    <SafeScreen style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>All Leads</Text>

        <TouchableOpacity
          style={styles.newBtn}
          onPress={() => setShowForm(!showForm)}
        >
          <Text style={styles.newBtnText}>
            {showForm ? "Cancel" : "+ New Enquiry"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* CREATE ENQUIRY FORM */}
      {showForm && (
        <View style={styles.form}>
          <TextInput
            placeholder="Student Name"
            value={studentName}
            onChangeText={setStudentName}
            style={styles.input}
          />

          <TextInput
            placeholder="Mobile Number"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="phone-pad"
            style={styles.input}
          />

          <TextInput
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
            multiline
            style={[styles.input, { height: 70 }]}
          />

          <TouchableOpacity
            style={[styles.submitBtn, saving && { opacity: 0.6 }]}
            onPress={createQuery}
            disabled={saving}
          >
            <Text style={styles.submitText}>
              {saving ? "Saving..." : "Create Enquiry"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* LEADS LIST */}
      <FlatList
        data={leads}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/Lead/${item._id}`)}
          >
            <Text style={styles.name}>{item.studentName}</Text>
            <Text style={styles.meta}>📞 {item.mobileNumber}</Text>
            <Text>{item.description}</Text>

            {item.lastFollowUp && (
              <View style={styles.followupBox}>
                <Text style={styles.followupText}>{item.lastFollowUp}</Text>
                <Text style={styles.followupDate}>
                  {new Date(item.lastFollowUpAt).toLocaleString()}
                </Text>
              </View>
            )}

            <Text
              style={[
                styles.status,
                item.status === "Open" ? styles.open : styles.closed,
              ]}
            >
              {item.status}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeScreen>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8FAFC" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  title: { fontSize: 26, fontWeight: "800" },

  newBtn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },

  newBtnText: {
    color: "#fff",
    fontWeight: "700",
  },

  form: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },

  input: {
    backgroundColor: "#F1F5F9",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },

  submitBtn: {
    backgroundColor: "#16A34A",
    padding: 12,
    borderRadius: 12,
  },

  submitText: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
  },

  name: { fontSize: 18, fontWeight: "700" },
  meta: { fontSize: 14, color: "#475569" },

  status: {
    marginTop: 8,
    padding: 6,
    borderRadius: 10,
    fontWeight: "700",
  },

  open: { backgroundColor: "#DCFCE7", color: "#166534" },
  closed: { backgroundColor: "#FEE2E2", color: "#991B1B" },

  followupBox: {
    marginTop: 8,
    backgroundColor: "#F1F5F9",
    padding: 10,
    borderRadius: 10,
  },

  followupText: { fontSize: 13 },
  followupDate: { fontSize: 11, color: "#64748B" },
});
