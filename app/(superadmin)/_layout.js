import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2563EB",
      }}
    >
      {/* DASHBOARD */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="view-dashboard"
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* FEE */}
      <Tabs.Screen
        name="Fee"
        options={{
          title: "Fee",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="cash-multiple"
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* LEAD */}
      <Tabs.Screen
        name="Lead"
        options={{
          title: "Lead",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-group"
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* FORMS */}
      <Tabs.Screen
        name="Forms"
        options={{
          title: "Forms",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="clipboard-text"
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* BATCH */}
      <Tabs.Screen
        name="batch"
        options={{
          title: "Batch",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-multiple-outline"
              size={26}
              color={color}
            />
          ),
        }}
      />
    </Tabs>

  );
}
