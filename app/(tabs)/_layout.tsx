import React from 'react'
import { Tabs } from 'expo-router'
import TabBar from "@/components/TabBar"
const _layout = () => {
  return (
    <Tabs tabBar={props => <TabBar/>}
    >
      <Tabs.Screen name='generate' options={{ headerShown: false }} />
      <Tabs.Screen name='scan' options={{ headerShown: false }} />
      <Tabs.Screen name='history' options={{ headerShown: false }} />
    </Tabs>
  )
}

export default _layout