import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import SafeScreen from "../../../../components/SafeScreen";
import { API } from "../../../../utils/api";

export default function TestAnalytics() {
  const { batchId, examType,examTitle} = useLocalSearchParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await API.get(
        `/api/batch/admin/marks/batch/${batchId}/${examType}/${examTitle}`,
      );
      setData(res.data.data);
    } catch (err) {
      console.log("Failed to fetch test analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <SafeScreen style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading test analytics...</Text>
      </SafeScreen>
    );
  }

  if (!data) {
    return (
      <SafeScreen style={styles.center}>
        <Text>No data found</Text>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{examTitle}</Text>
        <Text style={styles.subtitle}>{examType}</Text>

        {/* STATS */}
        <View style={styles.statsGrid}>
          <Stat label="Students" value={data.totalStudents} />
          <Stat label="Highest" value={data.highestMarks} />
          <Stat label="Lowest" value={data.lowestMarks} />
          <Stat label="Average" value={data.averageMarks} />
          <Stat label="Median" value={data.medianMarks} />
        </View>

        {/* RANK LIST */}
        <Text style={styles.rankTitle}>Rank List</Text>

        <FlatList
          data={data.students}
          keyExtractor={(item) => item.rank.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <RankRow student={item} examType={examType} />
          )}
        />
      </ScrollView>
    </SafeScreen>
  );
}

/* ---------------- STAT BOX ---------------- */

const Stat = ({ label, value }) => (
  <View style={styles.statBox}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

/* ---------------- RANK ROW ---------------- */

const RankRow = ({ student, examType }) => {
  return (
    <View style={styles.rankRow}>
      <Text style={styles.rank}>{student.rank}</Text>

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{student.student}</Text>
        <Text style={styles.roll}>Roll: {student.rollNo || "—"}</Text>
      </View>

      <View style={styles.marks}>
        <Text style={styles.total}>{student.totalMarks}</Text>
        <Text style={styles.subjects}>
          {examType === "JEE"
            ? `P:${student.physics} C:${student.chemistry} M:${student.math}`
            : `P:${student.physics} C:${student.chemistry} B:${student.botany} Z:${student.zoology}`}
        </Text>
      </View>
    </View>
  );
};

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
    color: "#0F172A",
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 15,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  statBox: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
  },

  statLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },

  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 4,
  },

  rankTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 10,
    color: "#0F172A",
  },

  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 14,
    marginBottom: 10,
    elevation: 1,
  },

  rank: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2563EB",
    width: 30,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },

  roll: {
    fontSize: 12,
    color: "#64748B",
  },

  marks: {
    alignItems: "flex-end",
  },

  total: {
    fontSize: 18,
    fontWeight: "800",
    color: "#16A34A",
  },

  subjects: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
});
