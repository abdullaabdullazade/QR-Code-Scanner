import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ToastAndroid } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';


export default function QRCodeScreen() {
  const { url, data } = useLocalSearchParams()

  const handleShare = async () => {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      ToastAndroid.show('Sharing is not available on this device', ToastAndroid.SHORT);
      return;
    }
    try {
      await Sharing.shareAsync(url as string);
    } catch (error) {
      ToastAndroid.show('Sharing failed', ToastAndroid.BOTTOM);
    }
  };

  const handleSave = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        ToastAndroid.show('Permission to access gallery is needed!', ToastAndroid.SHORT);
        return;
      }


      await MediaLibrary.saveToLibraryAsync(url as string);
      ToastAndroid.show('Saved to gallery!', ToastAndroid.SHORT);
    } catch (e) {
      ToastAndroid.show('Failed to save QR code', ToastAndroid.SHORT);

    }
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#333333' }}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>QR Code</Text>
      </View>

      <View style={{ alignItems: 'center', marginTop: 18 }}>
        <View style={styles.dataBox}>
          <Text style={styles.dataLabel}>Data</Text>
          <Text style={styles.dataValue} selectable>
            {data}
          </Text>
        </View>

        {url ? (
          <>
            <View style={styles.qrWrapper}>
              <Image
                source={{ uri: Array.isArray(url) ? url[0] : (url as string) }}
                style={styles.qrImage}
              />
            </View>
            <View style={{ flexDirection: 'row', marginTop: 38 }}>
              <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
                <Feather name="share-2" size={28} color="#232323" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={handleSave}>
                <MaterialIcons name="save-alt" size={28} color="#232323" />
                <Text style={styles.actionText}>Save</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
      </View>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    paddingBottom: 2,
    marginTop: 30
  },
  backBtn: {
    padding: 4,
    backgroundColor: '#191919',
    borderRadius: 8,
    marginRight: 16,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontFamily: "Chewy_400Regular"
  },
  dataBox: {
    backgroundColor: '#353535',
    borderRadius: 12,
    padding: 13,
    width: 310,
    marginBottom: 18,
    alignItems: 'flex-start',

  },
  dataLabel: {
    color: '#bbb',
    fontSize: 16,
    fontFamily: "Chewy_400Regular"

  },
  dataValue: {
    color: '#fff',
    fontSize: 16,
    marginTop: 2,
  },
  qrWrapper: {
    borderRadius: 11,
    borderWidth: 4,
    borderColor: '#FDB623',
    padding: 7,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  qrImage: {
    width: 154,
    height: 154,
    borderRadius: 7,
  },
  actionBtn: {
    backgroundColor: '#FDB623',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginHorizontal: 13,
    paddingVertical: 12,
    paddingHorizontal: 22,
    minWidth: 65,
    elevation: 3,
  },
  actionText: {
    color: '#232323',
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 15,
  },
  tabbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#232323',
    padding: 20,
    position: 'absolute',
    left: 15,
    right: 15,
    bottom: 25,
    borderRadius: 22,
    elevation: 12,
  },

});
