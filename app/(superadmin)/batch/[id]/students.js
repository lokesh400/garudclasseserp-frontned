import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import SafeScreen from "../../../../components/SafeScreen";
import { API } from "../../../../utils/api";

export default function BatchStudents() {
  const { id: batchId } = useLocalSearchParams();
  const router = useRouter();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingStudentId, setFetchingStudentId] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await API.get(`/api/batch/admin/users/batch/${batchId}`);
      setStudents(res.data.users || []);
    } catch (err) {
      console.log("Failed to fetch batch students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const openStudent = async (studentId) => {
    try {
      setFetchingStudentId(studentId);

      // 🔥 FETCH STUDENT FIRST
      const res = await API.get(`/api/batch/admin/users/${studentId}`);

      // 🔥 THEN NAVIGATE WITH DATA
      router.push({
        pathname: "/batch/student/[id]",
        params: {
          id: studentId,
          student: JSON.stringify(res.data.user),
        },
      });
    } catch (err) {
      console.log("Failed to fetch student:", err);
    } finally {
      setFetchingStudentId(null);
    }
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
      <Text style={styles.title}>Students</Text>

      <FlatList
        data={students}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => openStudent(item._id)}
            disabled={fetchingStudentId === item._id}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>Roll: {item.rollNumber || "—"}</Text>
            <Text style={styles.meta}>Username: {item.username}</Text>

            {fetchingStudentId === item._id && (
              <ActivityIndicator size="small" style={{ marginTop: 8 }} />
            )}
          </TouchableOpacity>
        )}
      />
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

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 15,
    color: "#0F172A",
  },

  card: {
    backgroundColor: "#FFFFFF",
    // borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },

  meta: {
    marginTop: 4,
    fontSize: 14,
    color: "#475569",
  },

  role: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
  },
});
