import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import React, { useState, useRef, useEffect } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View, Platform, Modal, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Clipboard from 'expo-clipboard';
import { MaterialIcons, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';



const saveScans = async (data_: string) => {
  const now = new Date();

  const formatted = now.toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  //console.log(formatted)
  const old = (await AsyncStorage.getItem('qr_saved')) ?? '[]';
  const history = JSON.parse(old);
  history.push({ data: data_, date: formatted });
  //console.log(history)
  await AsyncStorage.setItem('qr_saved', JSON.stringify(history));

}

export default function Scan() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [copied, setCopied] = useState(false);



  const scanAnim = useRef(new Animated.Value(0)).current;
  const FRAME_SIZE = 260;

  const scanLineTranslateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, FRAME_SIZE - 8],
  });
  useEffect(() => {
    let animation: Animated.CompositeAnimation | undefined;
    if (!scanned) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, {
            toValue: 1,
            duration: 1400,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnim, {
            toValue: 0,
            duration: 1400,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else {
      scanAnim.stopAnimation();
    }
    return () => {
      animation?.stop();
    };
  }, [scanned]);

  if (!permission) return <View />;
  if (!permission.granted)
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionBtn}>
          <Text style={{ color: '#FDB623', fontWeight: 'bold', fontSize: 16 }}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    if (!scanned) {
      setScanned(true);
      setQrData(result.data);
      setModalVisible(true);
      saveScans(result.data)

    }
  };

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const asset = result.assets[0];
      const localUri = asset.uri;
      const filename = localUri.split('/').pop();
      if (!filename) {
        alert('Could not determine file name from the selected image.');
        return;
      }
      const fileType = filename.split('.').pop();

      const formData = new FormData();
      formData.append('image', {
        uri: localUri,
        name: filename,
        type: `image/${fileType}`,
      } as any);

      try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/scan`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const qrData = response.data.qrCode;
        if (!qrData) {
          alert('No QR code found in image!');
          return;
        }
        saveScans(qrData)
        setQrData(qrData);
        setModalVisible(true);
        setScanned(true);
      } catch (err) {
        console.error('Upload error:', err);
        let errorMessage = 'Unknown error';
        if (err && typeof err === 'object' && 'message' in err) {
          errorMessage = (err as { message: string }).message;
        }
        alert('Error uploading or scanning image: ' + errorMessage);
      }
    }
  };

  const isURL = (text: string | null) => {
    if (!text) return false;
    try {
      const url = new URL(text);
      return url.protocol.startsWith('http') || url.protocol.startsWith('https') || url.protocol.startsWith("www.");
    } catch (e) {
      return false;
    }
  };

  const handleCopy = async () => {
    if (!qrData) return;
    await Clipboard.setStringAsync(qrData);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const renderFrameOverlay = () => (
    <View style={styles.overlayContainer} pointerEvents="none">
      <View style={styles.frame}>
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />
        {!scanned && (
          <Animated.View
            style={[
              styles.scanLine,
              {
                transform: [{ translateY: scanLineTranslateY }],
              },
            ]}
          />
        )}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#111' }}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topBtn} onPress={handlePickImage}>
          <MaterialIcons name="image" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.topBtn}
          onPress={() => setFlash(f => (f === 'on' ? 'off' : 'on'))}

        >
          <Ionicons name={flash === 'on' ? 'flash' : 'flash-off'} size={24} color="#FDB623" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.topBtn} onPress={() => setFacing(f => (f === 'back' ? 'front' : 'back'))}>
          <Feather name="refresh-cw" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <CameraView
        style={styles.camera}
        facing={facing}
        enableTorch={flash === 'on'}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        {renderFrameOverlay()}
      </CameraView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setModalVisible(false);
          setScanned(false);
          setQrData(null);
        }}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <MaterialCommunityIcons name="qrcode-scan" size={44} color="#FDB623" style={{ marginBottom: 12 }} />
            <Text style={styles.modalTitle}>QR Scan Result</Text>
            <Text
              selectable
              style={styles.modalResult}
              numberOfLines={8}
            >
              {qrData}
            </Text>
            {isURL(qrData) && (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => Linking.openURL(qrData!)}
              >
                <Text style={styles.actionBtnText}>Open in Browser</Text>
              </TouchableOpacity>

            )}


            <View style={{ flexDirection: 'row', gap: 16 }}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={handleCopy}
              >
                <Text style={styles.actionBtnText}>{copied ? "Copied!" : "Copy"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: '#eee', borderColor: '#FDB623' }]}
                onPress={() => {
                  setModalVisible(false);
                  setScanned(false);
                  setQrData(null);
                }}
              >
                <Text style={[styles.actionBtnText, { color: '#FDB623' }]}>Scan Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const FRAME_SIZE = 260;
const CORNER_SIZE = 44;
const CORNER_THICKNESS = 8;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
  },
  message: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    marginBottom: 24,
  },
  permissionBtn: {
    backgroundColor: '#333',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  camera: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  topBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 58 : 28,
    alignSelf: 'center',
    backgroundColor: '#444a',
    flexDirection: 'row',
    borderRadius: 18,
    padding: 4,
    zIndex: 50,
    minWidth: 170,
    justifyContent: 'space-between',
  },
  topBtn: {
    marginHorizontal: 18,
    padding: 8,
  },
  overlayContainer: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderColor: 'rgba(0,0,0,0.04)',
    borderWidth: 0,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: '#FDB623',
  },
  cornerTL: {
    top: 0, left: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderTopLeftRadius: 20,
  },
  cornerTR: {
    top: 0, right: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderTopRightRadius: 20,
  },
  cornerBL: {
    bottom: 0, left: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderBottomLeftRadius: 20,
  },
  cornerBR: {
    bottom: 0, right: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderBottomRightRadius: 20,
  },
  scanLine: {
    position: 'absolute',
    left: 8,
    right: 8,
    height: 8,
    backgroundColor: '#FDB623',
    borderRadius: 2,
    shadowColor: '#FDB623',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 7,
  },
  modalBg: {
    flex: 1,
    backgroundColor: '#0008',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContent: {
    backgroundColor: '#333333',
    borderRadius: 20,
    padding: 26,
    alignItems: 'center',
    minWidth: 280,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 15,
  },
  modalTitle: {
    fontWeight: 'bold',
    color: '#FDB623',
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalResult: {
    color: 'white',
    fontSize: 15,
    marginBottom: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  actionBtn: {
    backgroundColor: '#FDB623',
    borderRadius: 8,
    paddingHorizontal: 22,
    paddingVertical: 12,
    marginTop: 3,
    borderWidth: 1,
    borderColor: '#FDB623',
    minWidth: 120,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
