import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { EntriesProvider } from "@/hooks/use-entries";
import { ThemeProvider, useTheme } from "@/hooks/use-theme";
import { UserProvider } from "@/hooks/use-user";
import { ThreadsProvider } from "@/hooks/use-threads";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { theme, colorScheme } = useTheme();
  
  return (
    <>
      <StatusBar 
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <Stack 
        screenOptions={{ 
          headerBackTitle: "Back",
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: theme.fontWeight.light,
            fontSize: theme.fontSize.lg,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="new-entry" 
          options={{ 
            title: "New Entry",
            presentation: "modal",
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerTintColor: theme.colors.text,
          }} 
        />
        <Stack.Screen 
          name="entry/[id]" 
          options={{ 
            title: "Entry Details",
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerTintColor: theme.colors.text,
          }} 
        />
        <Stack.Screen 
          name="create-thread" 
          options={{ 
            title: "Create Thread",
            presentation: "modal",
            headerShown: false,
          }} 
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UserProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <EntriesProvider>
              <ThreadsProvider>
                <RootLayoutNav />
              </ThreadsProvider>
            </EntriesProvider>
          </GestureHandlerRootView>
        </UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}