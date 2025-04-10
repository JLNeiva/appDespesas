// components/Header.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  userName?: string;
}

export default function Header({ userName = 'Usuário' }: Props) {
  const router = useRouter();

  const handleMenu = () => {
    // Futuramente pode abrir um drawer/menu lateral
    console.log('Menu pressionado');
  };

  const handleUserOptions = () => {
    // Navegar para uma tela com opções como "Configurações" e "Sair"
    router.push('../configuracoes');
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleMenu}>
        <Ionicons name="menu" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>App Despesas</Text>
      <TouchableOpacity onPress={handleUserOptions} style={styles.userArea}>
        <Text style={styles.userName}>{userName}</Text>
        <Ionicons name="person-circle-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  userArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    color: '#fff',
    fontSize: 14,
  },
});
