import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Chewy_400Regular } from '@expo-google-fonts/chewy/400Regular';
import { useFonts } from 'expo-font';
export interface QrHistoryItemProps {
    data: string;
    image?: string;
    date: string;
    onDelete?: () => void;
}

export const QrHistoryItem: React.FC<QrHistoryItemProps> = ({ data, date, onDelete }) => {
    const [loaded] = useFonts({
        Chewy_400Regular,
    });
    if (!loaded) {
        return null;
    }
    return (
        <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={{ marginRight: 20 }}>
                    <MaterialIcons name="qr-code" size={40} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.data}>{data.substring(0, 30) + (data.length > 30 ? "..." : "")}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.label}>Data</Text>
                        <Text style={styles.date}>{date}</Text>

                    </View>
                </View>

                {onDelete && (
                    <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
                        <MaterialIcons name="delete-outline" size={24} color="#FDB623" />
                    </TouchableOpacity>
                )}


            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#262626',
        borderRadius: 12,
        padding: 10,
        marginBottom: 14,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        fontFamily: 'Chewy_400Regular',
    },
    data: {
        color: '#fff', fontWeight: '500', fontSize: 16,
        fontFamily: 'Chewy_400Regular',

    },
    label: {
        color: '#aaa', fontSize: 11, marginTop: 2,
        fontFamily: 'Chewy_400Regular',

    },
    date: {
        color: '#bbb', fontSize: 11, marginLeft: 10,
        fontFamily: 'Chewy_400Regular',

    },
    deleteBtn: {
        marginLeft: 10, padding: 5,
        fontFamily: 'Chewy_400Regular',

    },
});
