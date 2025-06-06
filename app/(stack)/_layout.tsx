import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="generateQR" options={{ headerShown: false }} />
            <Stack.Screen name="qrCode" options={{ headerShown: false }} />
            <Stack.Screen name="openQR" options={{ headerShown: false }} />
        </Stack>
    )
}

export default _layout