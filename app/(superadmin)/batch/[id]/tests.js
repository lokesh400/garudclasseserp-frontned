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

export default function BatchTests() {
  const { id: batchId } = useLocalSearchParams();
  const router = useRouter();

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTests = async () => {
    try {
      const res = await API.get(`/api/batch/admin/test/${batchId}`);
      setTests(res.data.tests || []);
    } catch (err) {
      console.log("Failed to fetch tests:", err);
    } finally {
      setLoading(false);
    }
  };

  const findTest = (item) => {
              router.push({
                pathname: "/batch/test/[id]",
                params: {
                  batchId,
                  examType:item._id.examType,
                  examTitle:item._id.testTitle,
                },
              })
            
            }

  useEffect(() => {
    fetchTests();
  }, []);

  if (loading) {
    return (
      <SafeScreen style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading tests...</Text>
      </SafeScreen>
    );
  }

  if (tests.length === 0) {
    return (
      <SafeScreen style={styles.center}>
        <Text>No tests found for this batch</Text>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen style={styles.container}>
      <Text style={styles.title}>Tests</Text>

      <FlatList
        data={tests}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TestCard
            test={item}
            onPress={() => findTest(item)}
          />
        )}
      />
    </SafeScreen>
  );
}

/* ---------------- TEST CARD ---------------- */

const TestCard = ({ test, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text style={styles.testTitle}>{test._id.testTitle}</Text>
    <Text style={styles.meta}>Exam: {test._id.examType}</Text>
    <Text style={styles.meta}>
      Students Appeared: {test.totalStudents}
    </Text>
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
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 15,
    color: "#0F172A",
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  testTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },

  meta: {
    marginTop: 4,
    fontSize: 14,
    color: "#475569",
  },
});
