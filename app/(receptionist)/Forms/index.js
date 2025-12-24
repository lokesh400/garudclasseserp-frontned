import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Share,
} from "react-native";
import { useEffect, useState } from "react";
import SafeScreen from "../../../components/SafeScreen";
import { API } from "../../../utils/api";

export default function ReceptionistForms() {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    API.get("/api/form/admin/forms").then((res) => {
      setForms(res.data.forms || []);
    });
  }, []);

  const shareForm = async (formId) => {
    try {
      await Share.share({
        message: `Please fill this form:\nhttps://garudclasseserp.onrender.com/forms/fill/${formId}`,
      });
    } catch (error) {
      console.log("Share failed:", error);
    }
  };

  return (
    <SafeScreen style={styles.container}>
      <Text style={styles.title}>Forms</Text>

      <FlatList
        data={forms}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.title}</Text>

            {item.description ? (
              <Text style={styles.desc}>{item.description}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.shareBtn}
              onPress={() => shareForm(item._id)}
            >
              <Text style={styles.shareText}>Share Form</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeScreen>
  );
}

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

  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },

  desc: {
    fontSize: 14,
    color: "#475569",
    marginTop: 4,
  },

  shareBtn: {
    marginTop: 10,
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    borderRadius: 12,
  },

  shareText: {
    color: "#FFFFFF",
    fontWeight: "700",
    textAlign: "center",
  },
});
