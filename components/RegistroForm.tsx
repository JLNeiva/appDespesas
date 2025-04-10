// components/RegistroForm.tsx
import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Registro } from '../app/types'

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
    <View style={styles.formContainer}>
      <TextInput
        placeholder="Data"
        placeholderTextColor="#999"
        style={styles.input}
        value={data}
        onChangeText={setData}
      />
      <TextInput
        placeholder="Valor"
        placeholderTextColor="#999"
        style={styles.input}
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Descrição"
        placeholderTextColor="#999"
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
      />
      <TextInput
        placeholder="Observações"
        placeholderTextColor="#999"
        style={[styles.input, styles.textArea]}
        value={detalhes}
        onChangeText={setDetalhes}
        multiline
        numberOfLines={4}
      />

      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancel} onPress={onCancel}>
          <Text style={styles.text}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.save} onPress={handleSalvar}>
          <Text style={styles.text}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  },
  cancel: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
  },
  save: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});
