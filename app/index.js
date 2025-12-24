import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API } from "../utils/api";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get("/auth/check", { timeout: 10000 });

        if (res.data?.loggedIn && res.data?.userId) {
          await AsyncStorage.setItem(
            "userId",
            String(res.data.userId)
          );
          setLoggedIn(true);
          setRole(res.data.role || "");
        } else {
          await AsyncStorage.removeItem("userId");
          setLoggedIn(false);
          setRole("");
        }
      } catch (err) {
        console.log("AUTH CHECK FAILED:", err);

        const userId = await AsyncStorage.getItem("userId");
        setLoggedIn(!!userId);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!loggedIn) {
    return <Redirect href="/login" />;
  }

  if (role === "superadmin") {
    return <Redirect href="/(superadmin)/dashboard"/>;
  } else if (role === "receptionist") {
    return <Redirect href="/(receptionist)/dashboard"/>;
  }

  return <Redirect href="/login" />;
}
