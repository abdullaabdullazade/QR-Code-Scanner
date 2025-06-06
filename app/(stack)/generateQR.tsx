import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
type Field = {
    label: string;
    placeholder: string;
    key: string;
    secure?: boolean;
};

const fieldMap: {
    [key: string]: {
        icon: React.ReactNode;
        fields: Field[];
    };
} = {
    Text: {
        icon: <MaterialCommunityIcons name="format-text" size={40} color="#FDB623" />,
        fields: [{ label: 'Text', placeholder: 'Enter text', key: 'text' }],
    },
    Website: {
        icon: <Entypo name="browser" size={40} color="#FDB623" />,
        fields: [{ label: 'Website URL', placeholder: 'Enter website URL', key: 'url' }],
    },
    'Wi-Fi': {
        icon: <MaterialIcons name="wifi" size={40} color="#FDB623" />,
        fields: [
            { label: 'Network', placeholder: 'Enter network name', key: 'network' },
            { label: 'Password', placeholder: 'Enter password', key: 'password', secure: true },
        ],
    },
    Event: {
        icon: <MaterialIcons name="event" size={40} color="#FDB623" />,
        fields: [
            { label: 'Event Name', placeholder: 'Enter event name', key: 'event' },
            { label: 'Start Date and Time', placeholder: 'Enter start date/time', key: 'start' },
            { label: 'End Date and Time', placeholder: 'Enter end date/time', key: 'end' },
            { label: 'Event Location', placeholder: 'Enter location', key: 'location' },
            { label: 'Description', placeholder: 'Enter description', key: 'desc' },
        ],
    },
    Contact: {
        icon: <Ionicons name="person" size={40} color="#FDB623" />,
        fields: [
            { label: 'First Name', placeholder: 'First name', key: 'fname' },
            { label: 'Last Name', placeholder: 'Last name', key: 'lname' },
            { label: 'Company', placeholder: 'Company', key: 'company' },
            { label: 'Job', placeholder: 'Job title', key: 'job' },
            { label: 'Phone', placeholder: 'Phone', key: 'phone' },
            { label: 'Email', placeholder: 'Email', key: 'email' },
            { label: 'Website', placeholder: 'Website', key: 'website' },
            { label: 'Address', placeholder: 'Address', key: 'address' },
            { label: 'Country', placeholder: 'Country', key: 'country' },
        ],
    },
    Business: {
        icon: <FontAwesome name="address-card" size={40} color="#FDB623" />,
        fields: [
            { label: 'Company Name', placeholder: 'Company name', key: 'company' },
            { label: 'Industry', placeholder: 'Industry', key: 'industry' },
            { label: 'Phone', placeholder: 'Phone', key: 'phone' },
            { label: 'Email', placeholder: 'Email', key: 'email' },
            { label: 'Website', placeholder: 'Website', key: 'website' },
            { label: 'Address', placeholder: 'Address', key: 'address' },
            { label: 'City', placeholder: 'City', key: 'city' },
            { label: 'Country', placeholder: 'Country', key: 'country' },
        ],
    },

    Twitter: {
        icon: <FontAwesome name="twitter" size={40} color="#FDB623" />,
        fields: [{ label: 'Username', placeholder: 'Enter twitter username', key: 'twitter' }],
    },
    Email: {
        icon: <MaterialIcons name="email" size={40} color="#FDB623" />,
        fields: [{ label: 'Email', placeholder: 'Enter email address', key: 'email' }],
    },
    Instagram: {
        icon: <FontAwesome name="instagram" size={40} color="#FDB623" />,
        fields: [{ label: 'Username', placeholder: 'Enter instagram username', key: 'insta' }],
    },
    Phone: {
        icon: <MaterialIcons name="phone" size={40} color="#FDB623" />,
        fields: [{ label: 'Phone Number', placeholder: 'Enter phone number', key: 'phone' }],
    },
    Location: {
        icon: <Entypo name="location-pin" size={40} color="#FDB623" />,
        fields: [
            { label: 'Address', placeholder: 'Enter address', key: 'address' },
            { label: 'City', placeholder: 'Enter city', key: 'city' },
            { label: 'Region', placeholder: 'Enter region/state', key: 'region' },
            { label: 'Country', placeholder: 'Enter country', key: 'country' },
            { label: 'Postal Code', placeholder: 'Enter postal code', key: 'postal' },
        ],
    },
    Telephone: {
        icon: <MaterialIcons name="phone-in-talk" size={40} color="#FDB623" />,
        fields: [
            { label: 'Full Name', placeholder: 'Enter full name', key: 'fullname' },
            { label: 'Phone Number', placeholder: 'Enter phone number', key: 'phone' },
            { label: 'Company (optional)', placeholder: 'Enter company', key: 'company' },
            { label: 'Label (e.g. mobile, work)', placeholder: 'Enter label', key: 'label' },
        ],
    },
    Whatsapp: {
        icon: <FontAwesome name="whatsapp" size={40} color="#FDB623" />,
        fields: [
            { label: 'WhatsApp Number', placeholder: 'Enter number', key: 'number' },
        ],
    },

};
const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/generate`;

export default function QRCodeForm() {
    const params = useLocalSearchParams();
    const name = params['name'] as string;
    const router = useRouter();

    const { icon, fields } = fieldMap[name];

    const [formData, setFormData] = useState<{ [key: string]: string }>({});

    const handleInputChange = (key: string, value: string) => {
        setFormData((prev: { [key: string]: string }) => ({ ...prev, [key]: value }));
    };

    const handleGenerateQRCode = async () => {
        const dataToSend: { [key: string]: string } = {};

        fields.forEach((f) => {
            const value = formData[f.key];
            if (value && value.trim() !== '') {
                dataToSend[f.label] = value;
            }
        });

        try {
            const response = await axios.post(API_URL, {
                data: dataToSend,
            });

            router.push({
                pathname: '/(stack)/qrCode',
                params: {
                    url: process.env.EXPO_PUBLIC_API_URL + response.data.url,
                    data: response.data.data,
                },
            });
            //console.log('QR Code generated:', response.data, dataToSend);

        } catch (error) {
            console.error('QR code generation failed:', error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#232323' }}>
            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: '#232323' }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={40}
            >
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={24} color="#fff" />
                        </TouchableOpacity>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={styles.header}>{name}</Text>
                        </View>
                    </View>

                    <View style={{ marginTop: 50, alignItems: 'center' }}>
                        <View style={styles.card}>
                            <View style={styles.iconBox}>{icon}</View>
                            {fields.map((f) => (
                                <View key={f.key} style={{ marginBottom: 16, width: '100%' }}>
                                    <Text style={styles.label}>{f.label}</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={f.placeholder}
                                        placeholderTextColor="#888"
                                        secureTextEntry={!!f.secure}
                                        onChangeText={(text) => handleInputChange(f.key, text)}
                                    />
                                </View>
                            ))}
                            <TouchableOpacity style={styles.button} onPress={handleGenerateQRCode}>
                                <Text style={styles.buttonText}>Generate QR Code</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        minHeight: '100%',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
        marginTop: 10,
    },
    backBtn: {
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#313131",
        borderRadius: 8,
    },
    header: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Chewy_400Regular',
    },

    card: {
        width: '100%',
        backgroundColor: '#282828',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#FDB623',
        padding: 24,
        alignItems: 'center',

        shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
        marginTop: 12,
    },
    iconBox: {
        marginBottom: 22,
    },
    label: {
        color: '#FDB623',
        fontSize: 14,
        marginBottom: 3,
        marginLeft: 2,
        alignSelf: 'flex-start',
        fontFamily: 'Chewy_400Regular',
    },
    input: {
        width: '100%',
        minWidth: 220,
        backgroundColor: '#313131',
        color: 'white',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#666',
        padding: 10,
        fontSize: 16,
    },
    button: {
        marginTop: 12,
        backgroundColor: '#FDB623',
        paddingVertical: 12,
        borderRadius: 8,
        width: 180,
        alignItems: 'center',
        elevation: 2,
    },
    buttonText: {
        color: '#232323',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

