import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ReactNode } from "react";
import { router } from "expo-router";
import { Chewy_400Regular } from '@expo-google-fonts/chewy/400Regular';
import { useFonts } from 'expo-font';
interface QRCardsProps {
  name: string;
  icon: ReactNode;
}

const QRCards = ({ name, icon }: QRCardsProps) => {
  const [loaded] = useFonts({
    Chewy_400Regular,
  });
  if (!loaded) {
    return null;
  }
  return (


    <TouchableOpacity activeOpacity={0.7}
      onPress={() => {
        router.push({ pathname: "/(stack)/generateQR", params: { name: name } })
      }}
    >
      <View style={styles.container}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{name}</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.iconWrapper}>{icon}</View>
        </View>
      </View>
    </TouchableOpacity>

  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    margin: 15,
  },
  badge: {
    position: "absolute",
    zIndex: 2,
    backgroundColor: "#FDB623",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#232323",
    fontWeight: "bold",
    fontSize: 9,
    fontFamily: "Chewy_400Regular",
  },
  card: {
    backgroundColor: "#232323",
    borderRadius: 18,
    borderWidth: 3,
    borderColor: "#FDB623",
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default QRCards;
