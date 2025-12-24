import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import SafeScreen from "../../../../components/SafeScreen";

export default function StudentDetails() {
  const { student } = useLocalSearchParams();

  // 🔥 PARSE DATA PASSED FROM PREVIOUS SCREEN
  const data = student ? JSON.parse(student) : null;

  if (!data) {
    return (
      <SafeScreen style={styles.center}>
        <Text>No student data</Text>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profile}>
          {data.image ? (
            <Image source={{ uri: data.image }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>
                {data.name.charAt(0)}
              </Text>
            </View>
          )}

          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.role}>{data.role}</Text>
        </View>

        <Info label="Username" value={data.username} />
        <Info label="Email" value={data.email} />
        <Info label="Phone" value={data.number} />
        <Info label="Roll Number" value={data.rollNumber} />
        <Info label="Father Name" value={data.fatherName} />
        <Info label="Mother Name" value={data.motherName} />
        <Info label="Address" value={data.address} />

        {data.batch && (
          <>
            <Info label="Batch" value={data.batch.name} />
            <Info
              label="Course"
              value={`${data.batch.courseType} ${data.batch.year}`}
            />
          </>
        )}
      </ScrollView>
    </SafeScreen>
  );
}

/* ---------------- INFO ---------------- */

const Info = ({ label, value }) => {
  if (!value) return null;
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

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

  profile: {
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },

  avatarFallback: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  avatarText: {
    fontSize: 40,
    color: "#fff",
    fontWeight: "800",
  },

  name: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },

  role: {
    fontSize: 14,
    color: "#64748B",
  },

  infoRow: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },

  label: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    marginTop: 2,
  },
});