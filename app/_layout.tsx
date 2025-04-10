// app/_layout.tsx
import { Stack } from 'expo-router';
import Header from '../components/Header'; 

export default function RootLayout() {
 // return <Stack screenOptions={{ 
 //   header: () => <Header userName="Jonas" />, // seu header fixo em todas as telas}} />
 //  }} />;
return <Stack screenOptions={{ headerShown: false }} />;

}
