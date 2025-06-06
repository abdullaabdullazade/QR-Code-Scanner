import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ToastAndroid } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as MediaLibrary from 'expo-media-library';




export default function QRCodeScreen() {
    const params = useLocalSearchParams();
    const url = params['url'] as any;
    const data_ = params['data'] as string;
    const router = useRouter();
    const [isSaved, setIsSaved] = useState(false);
    const [localImage, setLocalImage] = useState<string | null>(null);

    useState(() => {
        console.log(url, data_);
    })
    const qrRef = useRef<any>(null);
    useState(async () => {
        try {
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
            const fileUri = FileSystem.documentDirectory + `qr_${Date.now()}.png`;
            const downloadRes = await FileSystem.downloadAsync(url, fileUri);

            const old = (await AsyncStorage.getItem('qr_created')) ?? '[]';
            const history = JSON.parse(old);
            history.push({ data: data_, image: downloadRes.uri, date: formatted });
            await AsyncStorage.setItem('qr_created', JSON.stringify(history));
            setLocalImage(downloadRes.uri);

        } catch (e) {
            console.error(e)
        }
    });


    const handleSave = async () => {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission required', 'Permission to access gallery is needed!');
                return;
            }

            const fileUri = FileSystem.documentDirectory + `qr_${Date.now()}.png`;
            const downloadRes = await FileSystem.downloadAsync(url, fileUri);

            await MediaLibrary.saveToLibraryAsync(downloadRes.uri);
            setIsSaved(true);
            ToastAndroid.show('Saved to gallery!', ToastAndroid.SHORT);
        } catch (e) {
            ToastAndroid.show('Failed to save QR code', ToastAndroid.SHORT);

        }
    }
    const handleShare = async () => {
        let filePath = localImage;
        if (!filePath) {
            try {
                const fileUri = FileSystem.cacheDirectory + `qr_${Date.now()}.png`;
                const downloadRes = await FileSystem.downloadAsync(url, fileUri);
                filePath = downloadRes.uri;
                setLocalImage(filePath);
            } catch (e) {
                ToastAndroid.show('Cannot download QR code for sharing', ToastAndroid.SHORT);
                return;
            }
        }
        const isAvailable = await Sharing.isAvailableAsync();
        if (!isAvailable) {
            ToastAndroid.show('Sharing is not available on this device', ToastAndroid.SHORT);
            return;
        }
        try {
            await Sharing.shareAsync(filePath!);
        } catch (error) {
            ToastAndroid.show('Sharing failed', ToastAndroid.BOTTOM);
        }
    };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#232323', }}>
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.header}>QR Code</Text>
            </View>
            <View style={{ margin: 20 }}>
                <Text style={styles.label}>Data</Text>
                <View style={styles.dataBox}>
                    <Text style={{ color: '#fff' }}>{data_}</Text>
                </View>
            </View>
            <View style={styles.centered}>
                <View style={styles.qrBox}>
                    <Image
                        ref={qrRef}
                        source={{ uri: url }}
                        style={{ width: 300, height: 300 }}
                    />
                </View>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
                        <MaterialIcons name="share" size={32} color="#232323" />
                        <Text style={styles.actionText}>Share</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={handleSave}>
                        <MaterialIcons name="save-alt" size={32} color="#232323" />
                        <Text style={styles.actionText}>{isSaved ? 'Saved!' : 'Save'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 20,
    },
    backBtn: {
        marginRight: 12,
    },
    header: {
        color: '#fff',
        fontSize: 26,
        fontWeight: 'bold',
    },
    label: {
        color: '#FDB623',
        fontSize: 16,
        marginBottom: 6,
        fontWeight: '600',
    },
    dataBox: {
        backgroundColor: '#373737',
        borderRadius: 10,
        padding: 10,
    },
    centered: {
        alignItems: 'center',
        marginTop: 10,
    },
    qrBox: {
        backgroundColor: '#FDB623',
        padding: 10,
        borderRadius: 12,
        marginBottom: 28,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 18,
    },
    actionBtn: {
        backgroundColor: '#FDB623',
        borderRadius: 10,
        padding: 14,
        marginHorizontal: 10,
        alignItems: 'center',
        width: 90,
        elevation: 2,
    },
    actionText: {
        color: '#232323',
        marginTop: 4,
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 25,
        alignSelf: 'center',
        flexDirection: 'row',
        backgroundColor: '#232323',
        borderRadius: 20,
        padding: 14,
        gap: 50,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 2,
    },
    footerText: {
        color: '#FDB623',
        fontSize: 13,
        textAlign: 'center',
    },
});
