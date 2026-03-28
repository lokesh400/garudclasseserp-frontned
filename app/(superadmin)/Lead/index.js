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
  const [userFilter, setUserFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("ALL");

  useEffect(() => {
    API.get("/api/query/admin/queries").then((res) => {
      setLeads(res.data.queries || []);
      setLoading(false);
    });
  }, []);

  const users = useMemo(() => {
    const map = new Map();
    leads.forEach((l) => {
      if (l.createdBy)
        map.set(l.createdBy._id, l.createdBy.name);
    });
    return Array.from(map.entries());
  }, [leads]);

  const filtered = useMemo(() => {
    const byUser =
      userFilter === "ALL"
        ? leads
        : leads.filter((l) => l.createdBy?._id === userFilter);

    const q = searchQuery.trim().toLowerCase();
    const bySearch = !q
      ? byUser
      : byUser.filter((l) => {
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
  }, [leads, userFilter, searchQuery, dateFilter]);

  if (loading)
    return (
      <SafeScreen style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeScreen>
    );

  return (
    <SafeScreen style={styles.container}>
      <Text style={styles.title}>All Leads</Text>

      <View style={styles.filterBar}>
        <Filter label="All" active={userFilter === "ALL"} onPress={() => setUserFilter("ALL")} />
        {users.map(([id, name]) => (
          <Filter key={id} label={name} active={userFilter === id} onPress={() => setUserFilter(id)} />
        ))}
      </View>

      <View style={styles.filterBar}>
        <Filter label="All Dates" active={dateFilter === "ALL"} onPress={() => setDateFilter("ALL")} />
        <Filter label="Today" active={dateFilter === "TODAY"} onPress={() => setDateFilter("TODAY")} />
        <Filter label="Last 7 Days" active={dateFilter === "LAST_7"} onPress={() => setDateFilter("LAST_7")} />
        <Filter label="Last 30 Days" active={dateFilter === "LAST_30"} onPress={() => setDateFilter("LAST_30")} />
      </View>

      <TextInput
        placeholder="Search by name, mobile, or description"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
        placeholderTextColor="#7A8699"
      />

      <FlatList
        data={filtered}
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8FAFC" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "800", marginBottom: 10 },
  card: { backgroundColor: "#fff", padding: 16, marginBottom: 12 },
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

  filterBar: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D5DFEA",
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  emptyText: {
    textAlign: "center",
    color: "#64748B",
    marginTop: 16,
    fontWeight: "600",
  },
  chip: { backgroundColor: "#E5E7EB", padding: 8, borderRadius: 16, marginRight: 6 },
  chipActive: { backgroundColor: "#2563EB" },
  chipText: { fontSize: 13 },
  chipTextActive: { color: "#fff" },
});

