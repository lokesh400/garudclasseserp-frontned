import { Stack, Redirect } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SuperAdminLayout() {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  return <Stack screenOptions={{ headerShown: false }} />;
}
