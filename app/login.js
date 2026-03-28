import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { API } from "../utils/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [resetUsername, setResetUsername] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        username,
        password,
      });

      if (res.data?.userId) {
        await AsyncStorage.setItem(
          "userId",
          String(res.data.userId)
        );
        if (res.data.role === 'superadmin'){
          router.replace("/(superadmin)/dashboard");
        } else if (res.data.role === 'receptionist'){
          router.replace("/(receptionist)/dashboard");
        }
      } else {
        alert("Login failed");
      }
    } catch (err) {
      console.log("LOGIN ERROR:", err);
      alert("Invalid credentials");
    }
  };

  const handleOpenForgotModal = () => {
    setResetUsername(username);
    setForgotModalVisible(true);
  };

  const handleResetPassword = async () => {
    if (!resetUsername.trim()) {
      Alert.alert("Username required", "Please enter your username.");
      return;
    }

    try {
      setResetLoading(true);
      const identifier = resetUsername.trim();

      const response = await API.post("/auth/forgot-password", {
        username: identifier,
        identifier,
      });

      const sentEmail =
        response?.data?.sentEmail ||
        response?.data?.email ||
        response?.data?.sentTo;

      setForgotModalVisible(false);
      Alert.alert(
        "Request sent",
        sentEmail
          ? `Password reset link sent to ${sentEmail}`
          : "Password reset request has been submitted."
      );
    } catch (err) {
      console.log("RESET PASSWORD ERROR:", err);
      Alert.alert("Request failed", "Could not send reset request. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      <View style={styles.backgroundGlowTop} />
      <View style={styles.backgroundGlowBottom} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <View style={styles.headerWrap}>
            <Text style={styles.brandTitle}>Garud Classes Admin</Text>
            <Text style={styles.heading}>Welcome Back</Text>
            <Text style={styles.subHeading}>
              Login to continue managing leads, fees, and daily operations.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              placeholder="Enter username"
              placeholderTextColor="#7F8A9A"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              style={styles.input}
            />

            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordFieldWrap}>
              <TextInput
                placeholder="Enter password"
                placeholderTextColor="#7F8A9A"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                style={styles.passwordInput}
              />
              <Pressable
                style={styles.eyeButton}
                onPress={() => setShowPassword((prev) => !prev)}
                hitSlop={8}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#53627A"
                />
              </Pressable>
            </View>

            <TouchableOpacity
              style={styles.forgotButton}
              onPress={handleOpenForgotModal}
            >
              <Text style={styles.forgotButtonText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={forgotModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setForgotModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Reset Password</Text>
            <Text style={styles.modalMessage}>
              Enter your username to send a reset request.
            </Text>

            <TextInput
              placeholder="Username"
              placeholderTextColor="#7F8A9A"
              autoCapitalize="none"
              value={resetUsername}
              onChangeText={setResetUsername}
              style={styles.input}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setForgotModalVisible(false)}
                disabled={resetLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleResetPassword}
                disabled={resetLoading}
              >
                {resetLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.sendButtonText}>Send</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  backgroundGlowTop: {
    position: "absolute",
    top: -80,
    right: -70,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#9BD4FF",
    opacity: 0.45,
  },
  backgroundGlowBottom: {
    position: "absolute",
    bottom: -90,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#B6F0D2",
    opacity: 0.42,
  },
  headerWrap: {
    marginBottom: 22,
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0B6FBF",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  heading: {
    fontSize: 34,
    fontWeight: "800",
    color: "#13243C",
    marginBottom: 8,
  },
  subHeading: {
    fontSize: 15,
    lineHeight: 22,
    color: "#4B5A70",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5ECF4",
    shadowColor: "#173257",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 4,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#23334D",
    marginBottom: 6,
    marginTop: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D3DCE8",
    backgroundColor: "#FBFCFE",
    borderRadius: 14,
    fontSize: 16,
    color: "#111827",
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: "#D3DCE8",
    backgroundColor: "#FBFCFE",
    borderRadius: 14,
    fontSize: 16,
    color: "#111827",
    paddingVertical: 12,
    paddingLeft: 14,
    paddingRight: 46,
    marginBottom: 8,
  },
  passwordFieldWrap: {
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    right: 14,
    top: 13,
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  forgotButtonText: {
    color: "#0B6FBF",
    fontWeight: "700",
    fontSize: 13,
  },
  loginButton: {
    marginTop: 4,
    backgroundColor: "#0B6FBF",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(8, 20, 38, 0.45)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5ECF4",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#13243C",
    marginBottom: 6,
  },
  modalMessage: {
    fontSize: 14,
    color: "#4B5A70",
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancelButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBD7E6",
    paddingVertical: 10,
    paddingHorizontal: 14,
    minWidth: 92,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#2B3A53",
    fontWeight: "700",
    fontSize: 14,
  },
  sendButton: {
    borderRadius: 12,
    backgroundColor: "#0B6FBF",
    paddingVertical: 10,
    paddingHorizontal: 14,
    minWidth: 92,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
  },
});
