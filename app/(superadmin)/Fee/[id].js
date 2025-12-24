import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import SafeScreen from "../../../components/SafeScreen";
import { API } from "../../../utils/api";

export default function FeeDetail() {
  const { id } = useLocalSearchParams();
  const [fee, setFee] = useState(null);

  useEffect(() => {
    API.get(`/api/fee/admin/student/${id}/fee`).then((res) =>
      setFee(res.data.fee)
    );
  }, [id]);

  if (!fee) {
    return (
      <SafeScreen style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeScreen>
    );
  }

  return (
    <SafeScreen style={styles.container}>
      <Text style={styles.title}>Fee Details</Text>

      <Text>Admission: ₹{fee.admissionFee}</Text>
      <Text>Tuition: ₹{fee.tuitionFee}</Text>
      <Text>Transport: ₹{fee.transportFee}</Text>
      <Text>Other: ₹{fee.otherFee}</Text>

      <View style={styles.divider} />

      <Text style={styles.total}>Total: ₹{fee.totalFee}</Text>
      <Text style={styles.paid}>Paid: ₹{fee.totalPaid}</Text>
      <Text style={styles.balance}>Balance: ₹{fee.balance}</Text>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 10 },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 10 },
  total: { fontWeight: "800" },
  paid: { color: "#16A34A" },
  balance: { color: "#DC2626", fontWeight: "700" },
});
