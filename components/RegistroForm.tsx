// components/RegistroForm.tsx
import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard
} from 'react-native';
import { Registro } from '../app/types';
import Header from './Header'; // Add this import

export const formatDate = (date: string) => {
  // Add your date formatting logic
  return date;
};

export const isValidDate = (date: string) => {
  const timestamp = Date.parse(date);
  return !isNaN(timestamp);
};

interface Props {
  selected?: Registro;
  isNovo: boolean;
  onCancel: () => void;
  onSave: (registro: Registro) => void;
}

export default function RegistroForm({ selected, isNovo, onCancel, onSave }: Props) {
    const [data, setData] = useState(selected?.data ?? '');
    const [valor, setValor] = useState(selected?.valor.toString() ?? '');
    const [descricao, setDescricao] = useState(selected?.descricao ?? '');
    const [detalhes, setDetalhes] = useState(selected?.detalhes ?? '');
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Refs for TextInputs
    const valorRef = useRef<TextInput>(null);
    const descricaoRef = useRef<TextInput>(null);
    const detalhesRef = useRef<TextInput>(null);

  useEffect(() => {
    if (selected) {
      setData(selected.data || '');
      setValor(selected.valor?.toString() || '');
      setDescricao(selected.descricao || '');
      setDetalhes(selected.detalhes || '');
    } else {
      setData('');
      setValor('');
      setDescricao('');
      setDetalhes('');
    }
  }, [selected]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!data) newErrors.data = 'Data é obrigatória';
    if (!valor) newErrors.valor = 'Valor é obrigatório';
    if (!descricao) newErrors.descricao = 'Descrição é obrigatória';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSalvar = () => {
    if (!validateForm()) return;

    const registro: Registro = {
      id: selected?.id || `temp-${Date.now()}`,
      data,
      valor: parseFloat(valor) || 0,
      descricao,
      detalhes,
      status: selected?.status || 'aberto' // Add default status
    };

    onSave(registro);
  };

  return (
    <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
    >
        <Header userName="Jonas" />
        
        <ScrollView 
            style={styles.scrollView}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.formContainer}>
                <TextInput
                    placeholder="Data"
                    placeholderTextColor="#999"
                    style={styles.input}
                    value={data}
                    onChangeText={setData}
                    returnKeyType="next"
                    onSubmitEditing={() => valorRef.current?.focus()}
                    blurOnSubmit={false}
                />
                <TextInput
                    ref={valorRef}
                    placeholder="Valor"
                    placeholderTextColor="#999"
                    style={styles.input}
                    value={valor}
                    onChangeText={setValor}
                    keyboardType="numeric"
                    returnKeyType="next"
                    onSubmitEditing={() => descricaoRef.current?.focus()}
                    blurOnSubmit={false}
                />
                <TextInput
                    ref={descricaoRef}
                    placeholder="Descrição"
                    placeholderTextColor="#999"
                    style={styles.input}
                    value={descricao}
                    onChangeText={setDescricao}
                    returnKeyType="next"
                    onSubmitEditing={() => detalhesRef.current?.focus()}
                    blurOnSubmit={false}
                />
                <TextInput
                    ref={detalhesRef}
                    placeholder="Observações"
                    placeholderTextColor="#999"
                    style={[styles.input, styles.textArea]}
                    value={detalhes}
                    onChangeText={setDetalhes}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                />
            </View>
        </ScrollView>

        <View style={styles.actions}>
            <TouchableOpacity 
                style={styles.cancel} 
                onPress={onCancel}
            >
                <Text style={styles.text}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.save} 
                onPress={handleSalvar}
            >
                <Text style={styles.text}>Salvar</Text>
            </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
    },
    scrollView: {
        flex: 1,
        marginTop: 60, // Add margin to account for header height
        marginBottom: 140, // Add padding to ensure content doesn't hide behind buttons
    },
    formContainer: {
        padding: 16,
        backgroundColor: '#111',
        borderRadius: 8,
        margin: 16,
    },
    input: {
        backgroundColor: '#222',
        color: '#fff',
        padding: 10,
        borderRadius: 6,
        marginBottom: 10,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#111',
        borderTopWidth: 1,
        borderTopColor: '#333',
        position: 'absolute',
        bottom: 80, // Add space from bottom
        left: 0,
        right: 0,
        zIndex: 1000, // Ensure buttons stay on top
    },
    cancel: {
        backgroundColor: '#dc3545',
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginRight: 8,
    },
    save: {
        backgroundColor: '#28a745',
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginLeft: 8,
    },
    text: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});
