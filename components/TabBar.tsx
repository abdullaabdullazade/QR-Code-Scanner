import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function CustomTabBar() {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => router.push("/(tabs)/generate")}
        activeOpacity={0.8}
      >
        <MaterialIcons name="qr-code" size={28} color="#fff" />
        <Text style={styles.tabLabel}>Generate</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/(tabs)/scan")}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name="qrcode-scan" size={40} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        onPress={() => router.push("/history")}
        activeOpacity={0.8}
      >
        <MaterialIcons name="history" size={28} color="#fff" />
        <Text style={styles.tabLabel}>History</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#222',
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#FDB623',
    height: 80,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#FDB623',
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 14,
    zIndex: 10,
  },
  tab: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  fab: {
    position: "absolute",
    top: -34,
    left: "50%",
    transform: [{ translateX: -36 }],
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FDB623",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FDB623",
    shadowOpacity: 0.7,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 24,
    zIndex: 20,
  },
  tabLabel: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Chewy_400Regular",
  },
});
