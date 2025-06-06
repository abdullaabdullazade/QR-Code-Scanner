import { View, Text, Image, TouchableOpacity, Linking, Platform } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { router } from 'expo-router';

export default function Welcome() {
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [mediaPermission, setMediaPermission] = useState<MediaLibrary.PermissionResponse | null>(null);
    const [error, setError] = useState('');
    const [showSettingsBtn, setShowSettingsBtn] = useState(false);

    const handlePermissions = async () => {
        setError('');
        setShowSettingsBtn(false);

        let cameraOK = false;
        let galleryOK = false;
        let cameraBlocked = false;
        let galleryBlocked = false;

        try {
            const camStatus = await requestCameraPermission();
            cameraOK = camStatus.granted;
            if (camStatus.status === 'denied' || camStatus.canAskAgain === false) {
                cameraBlocked = true;
            }
        } catch (e) { }

        try {
            const galStatus = await MediaLibrary.requestPermissionsAsync();
            setMediaPermission(galStatus);
            galleryOK = galStatus.status === 'granted';
            if (galStatus.status === 'denied' || galStatus.canAskAgain === false) {
                galleryBlocked = true;
            }
        } catch (e) { }

        if (!cameraOK || !galleryOK) {
            setError('To continue, camera and gallery permissions are required.');
            if (cameraBlocked || galleryBlocked) {
                setShowSettingsBtn(true);
            }
        } else {
            router.replace('/(tabs)/scan');
        }
    };

    const openSettings = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
        } else {
            Linking.openSettings();
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#333333' }}>
            <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 48 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={require('@/assets/images/splash-icon.png')}
                        style={{
                            width: 250,
                            height: 250,
                            resizeMode: 'contain',
                        }}
                    />
                </View>
                <View style={{ alignItems: 'center', width: '100%', paddingHorizontal: 16 }}>
                    {/* İcazə mesajı */}
                    {error !== '' && (
                        <>
                            <Text
                                style={{
                                    color: '#FDB623',
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    marginBottom: 12,
                                    fontSize: 16,
                                }}
                            >
                                {error}
                            </Text>
                            {showSettingsBtn && (
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: '#FDB623',
                                        paddingHorizontal: 16,
                                        paddingVertical: 10,
                                        borderRadius: 8,
                                        marginBottom: 8,
                                    }}
                                    onPress={openSettings}
                                >
                                    <Text style={{ color: '#333', fontWeight: 'bold', fontSize: 15 }}>
                                        Open App Settings
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                    <Text
                        style={{
                            color: 'white',
                            fontFamily: 'Chewy_400Regular',
                            textAlign: 'center',
                            fontSize: 16,
                            paddingHorizontal: 32,
                            marginBottom: 24,
                        }}
                    >
                        Go and enjoy our features for free and make your life easy with us.
                    </Text>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#FDB623',
                            paddingVertical: 18,
                            borderRadius: 8,
                            marginBottom: 16,
                            width: 270,
                        }}
                        activeOpacity={0.85}
                        onPress={handlePermissions}
                    >
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                        }}>
                            <Text style={{
                                color: '#333333',
                                fontSize: 16,
                                fontWeight: 'bold',
                                textAlign: 'center',
                            }}>
                                Let's Start
                            </Text>
                            <AntDesign name="arrowright" size={24} color="#333333" style={{ marginLeft: 8 }} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
