import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ParentFooter() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.footer, { paddingBottom: insets.bottom + 4 }]}>
      <Text style={styles.text}>© 2025 Garud Classes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
  },
  text: {
    color: "#555",
  },
});
