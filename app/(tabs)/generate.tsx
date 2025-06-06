import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import QRCards from '@/components/QRCards'
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Fontisto from '@expo/vector-icons/Fontisto';
import AntDesign from '@expo/vector-icons/AntDesign';
import Foundation from '@expo/vector-icons/Foundation';
const COLOR = "#FDB623"
const QR_CARDS = [
    {
        name: "Text",
        icon: <FontAwesome name="text-height" size={24} color={COLOR} />
    },
    {
        name: "Website",
        icon: <Feather name="globe" size={24} color={COLOR} />
    },
    {
        name: "Wi-Fi",
        icon: <Feather name="wifi" size={24} color={COLOR} />

    },
    {
        name: "Event",
        icon: <MaterialIcons name="event" size={24} color={COLOR} />
    },
    {
        name: "Contact",
        icon: <FontAwesome6 name="contact-book" size={24} color={COLOR} />
    },
    {
        name: "Business",
        icon: <Ionicons name="business-outline" size={24} color={COLOR} />
    },
    {
        name: "Location",
        icon: <EvilIcons name="location" size={24} color={COLOR} />

    },
    {
        name: "Whatsapp",
        icon: <FontAwesome5 name="whatsapp" size={24} color={COLOR} />

    },
    {
        name: "Email"
        ,
        icon: <Fontisto name="email" size={24} color={COLOR} />
    }, {
        name: "Twitter",
        icon: <AntDesign name="twitter" size={24} color={COLOR} />

    }
    , {
        name: "Instagram",
        icon: <FontAwesome5 name="instagram" size={24} color={COLOR} />
    }, {
        name: 'Telephone',
        icon: <Foundation name="telephone" size={24} color={COLOR} />
    }
]



const generate = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#232323", padding: 20 }}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingVertical: 16,
                }}>
                <Text
                    style={{
                        fontFamily: 'Chewy_400Regular',
                        color: 'white',
                        fontSize: 22,
                        letterSpacing: 0.5,
                    }}>
                    Generate QR
                </Text>

                <TouchableOpacity
                    style={{
                        backgroundColor: '#333333',
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        elevation: 8,
                        shadowColor: '#000',
                        shadowOpacity: 0.18,
                        shadowRadius: 6,
                        shadowOffset: { width: 0, height: 2 },
                    }}

                >
                    <Ionicons name="menu-outline" size={28} color={COLOR} />
                </TouchableOpacity>
            </View>
            <View style={{ flexWrap: "wrap", justifyContent: "center" }}>
                <FlatList
                    data={QR_CARDS}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => (
                        <QRCards name={item.name} icon={item.icon} />
                    )}
                    numColumns={3}
                    columnWrapperStyle={{
                        marginBottom: 20
                    }}
                />
            </View>

        </SafeAreaView >

    )
}

export default generate