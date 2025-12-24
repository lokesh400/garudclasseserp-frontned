import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import SafeScreen from "../../../components/SafeScreen";
import { API } from "../../../utils/api";
import { useRouter } from "expo-router";

export default function StudentFees() {
  const router = useRouter();

  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/api/fee/admin/students/fees");
      setStudents(res.data.students || []);
      setFiltered(res.data.students || []);
    } catch (e) {
      console.log("Fetch fees failed", e);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SEARCH ---------------- */
  const onSearch = (text) => {
    setSearch(text);
    if (!text) return setFiltered(students);

    setFiltered(
      students.filter((s) =>
        s.name.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  if (loading) {
    return (
      <SafeScreen style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeScreen>
    );
  }

  return (
    <SafeScreen style={styles.container}>
      <Text style={styles.title}>Student Fees</Text>

      {/* SEARCH */}
      <TextInput
        placeholder="Search student..."
        value={search}
        onChangeText={onSearch}
        style={styles.search}
      />

      {/* TABLE HEADER */}
      <View style={styles.rowHeader}>
        <Text style={styles.colName}>Name</Text>
        <Text style={styles.col}>Total</Text>
        <Text style={styles.col}>Paid</Text>
        <Text style={styles.col}>Bal</Text>
      </View>

      {/* TABLE */}
      <FlatList
        data={filtered}
        keyExtractor={(i) => i._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push(`/Fee/${item._id}`)}
          >
            <View style={styles.colName}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.batch}>{item.batchName}</Text>
            </View>

            <Text style={styles.col}>₹{item.totalFee}</Text>
            <Text style={styles.col}>₹{item.totalPaid}</Text>
            <Text style={[styles.col, styles.balance]}>
              ₹{item.balance}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeScreen>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F8FAFC" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  title: { fontSize: 26, fontWeight: "800", marginBottom: 10 },

  search: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

  rowHeader: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },

  row: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },

  colName: { flex: 2 },
  col: { flex: 1, textAlign: "right" },

  name: { fontWeight: "700" },
  batch: { fontSize: 12, color: "#64748B" },

  balance: { color: "#DC2626", fontWeight: "700" },
});
