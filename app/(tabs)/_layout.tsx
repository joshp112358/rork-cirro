import { Tabs } from "expo-router";
import { Home, Clock, BarChart3, User } from "lucide-react-native";
import React from "react";
import { useTheme } from "@/hooks/use-theme";

export default function TabLayout() {
  const { theme } = useTheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopWidth: 0.5,
          borderTopColor: theme.colors.border,
          paddingTop: 8,
          height: 84,
        },
        tabBarLabelStyle: {
          fontSize: theme.fontSize.xs,
          fontWeight: theme.fontWeight.light,
          marginBottom: 4,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Today",
          tabBarIcon: ({ color, size }) => <Home size={20} color={color} strokeWidth={1.5} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Journal",
          tabBarIcon: ({ color, size }) => <Clock size={20} color={color} strokeWidth={1.5} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Insights",
          tabBarIcon: ({ color, size }) => <BarChart3 size={20} color={color} strokeWidth={1.5} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User size={20} color={color} strokeWidth={1.5} />,
        }}
      />
    </Tabs>
  );
}