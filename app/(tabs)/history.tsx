import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { QrHistoryItem } from '@/components/QrHistoryItem';
import { router, useFocusEffect } from 'expo-router';
type TabType = 'scan' | 'create';


const COLOR = "#FDB623"
const getHistory = async (key: string) => {
  const data = await AsyncStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export default function HistoryScreen() {




  const [tab, setTab] = useState<TabType>('scan');
  const [qrCreated, setQrCreated] = useState([]);
  const [qrSaved, setQrSaved] = useState([]);

  const reloadData = async () => {
    const created = await getHistory('qr_created');
    const saved = await getHistory('qr_saved');
    setQrCreated(created);
    setQrSaved(saved);
  };

  useFocusEffect(
    useCallback(() => {
      reloadData();

    }, [])
  );

  interface QrHistoryData {
    data: string;
    image?: string;
    date: string;
  }

  type QrHistoryType = 'created' | 'saved';

  const handleDelete = async (index: number, type: QrHistoryType): Promise<void> => {
    const key = type === 'created' ? 'qr_created' : 'qr_saved';
    let items: QrHistoryData[] = await getHistory(key);
    items.splice(index, 1);
    await AsyncStorage.setItem(key, JSON.stringify(items));
    reloadData();
  };



  const renderList = (list: QrHistoryData[], type: QrHistoryType): React.ReactNode => (
    list.length > 0 ? list.map((item: QrHistoryData, i: number) => (
      <TouchableOpacity key={`${item.date}-${item.image}-${i}`}
        onPress={() => {
          router.push({
            pathname: "/(stack)/openQR", params: {
              url: item.image,
              data: item.data
            }
          })
        }}
      >
        <QrHistoryItem
          data={item.data}
          image={item.image}
          date={item.date}
          onDelete={() => handleDelete(i, type)}
        />
      </TouchableOpacity>
    )) : (
      <Text style={{
        color: '#777',
        textAlign: 'center',
        marginTop: 50,
        fontFamily: "Chewy_400Regular"
      }}>
        No history yet.
      </Text>
    )
  );


  return (
    <SafeAreaView style={{
      flex: 1, backgroundColor: '#333333', padding: 30,

    }}>
      <View style={styles.headerRow}>
        <Text style={[styles.header, {
          fontFamily: "Chewy_400Regular"
        }]}>History</Text>
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
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'scan' && styles.tabBtnActive]}
          onPress={() => setTab('scan')}
        >
          <Text style={[styles.tabBtnText, tab === 'scan' && styles.tabBtnTextActive]}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'create' && styles.tabBtnActive]}
          onPress={() => setTab('create')}
        >
          <Text style={[styles.tabBtnText, tab === 'create' && styles.tabBtnTextActive]}>Create</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {tab === 'scan'
          ? renderList(qrSaved, 'saved')
          : renderList(qrCreated, 'created')}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,


  },
  header: {
    color: '#fff', fontSize: 26,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    backgroundColor: '#232323',
    paddingVertical: 10,
    marginHorizontal: 3,
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: '#FDB623',
  },
  tabBtnText: {
    color: '#aaa',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
  tabBtnTextActive: {
    color: '#232323',
  },
  scrollContainer: {
    paddingBottom: 100,
  },
});
