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
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("ALL");

  const fetchLeads = async () => {
    const res = await API.get("/api/query/admin/queries/me");
    setLeads(res.data.leads || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const bySearch = !q
      ? leads
      : leads.filter((l) => {
          const name = String(l.studentName || "").toLowerCase();
          const mobile = String(l.mobileNumber || "").toLowerCase();
          const desc = String(l.description || "").toLowerCase();
          return name.includes(q) || mobile.includes(q) || desc.includes(q);
        });

    if (dateFilter === "ALL") return bySearch;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last7Cutoff = new Date(startOfToday);
    last7Cutoff.setDate(last7Cutoff.getDate() - 6);
    const last30Cutoff = new Date(startOfToday);
    last30Cutoff.setDate(last30Cutoff.getDate() - 29);

    return bySearch.filter((l) => {
      if (!l.createdAt) return false;
      const created = new Date(l.createdAt);
      if (Number.isNaN(created.getTime())) return false;

      if (dateFilter === "TODAY") {
        return created >= startOfToday;
      }

      if (dateFilter === "LAST_7") {
        return created >= last7Cutoff;
      }

      if (dateFilter === "LAST_30") {
        return created >= last30Cutoff;
      }

      return true;
    });
  }, [leads, searchQuery, dateFilter]);

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

      <TextInput
        placeholder="Search by name, mobile, or description"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
        placeholderTextColor="#7A8699"
      />

      <View style={styles.filterBar}>
        <Filter label="All Dates" active={dateFilter === "ALL"} onPress={() => setDateFilter("ALL")} />
        <Filter label="Today" active={dateFilter === "TODAY"} onPress={() => setDateFilter("TODAY")} />
        <Filter label="Last 7 Days" active={dateFilter === "LAST_7"} onPress={() => setDateFilter("LAST_7")} />
        <Filter label="Last 30 Days" active={dateFilter === "LAST_30"} onPress={() => setDateFilter("LAST_30")} />
      </View>

      {/* LEADS LIST */}
      <FlatList
        data={filteredLeads}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No leads found for selected filters.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/Lead/${item._id}`)}
          >
            <Text style={styles.name}>{item.studentName}</Text>
            <Text style={styles.meta}>📞 {item.mobileNumber}</Text>
            <Text>{item.description}</Text>
            <Text style={styles.followupDate}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>

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

  searchInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D5DFEA",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

  filterBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
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
  emptyText: {
    textAlign: "center",
    color: "#64748B",
    marginTop: 16,
    fontWeight: "600",
  },
  chip: {
    backgroundColor: "#E5E7EB",
    padding: 8,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 6,
  },
  chipActive: { backgroundColor: "#2563EB" },
  chipText: { fontSize: 13 },
  chipTextActive: { color: "#fff" },
});

const Filter = ({ label, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.chip, active && styles.chipActive]}
  >
    <Text style={[styles.chipText, active && styles.chipTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);
