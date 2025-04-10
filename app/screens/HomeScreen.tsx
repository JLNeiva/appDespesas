import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Header from '@/components/Header';
import RegistroForm from '../../components/RegistroForm';

interface Registro {
    id: string;
    data: string;
    valor: number;
    descricao: string;
    detalhes: string;
    status: 'aberto' | 'enviado' | 'fechado';
}

const statusOpcoes = ['aberto', 'enviado', 'fechado'] as const;

export default function HomeScreen() {
    const [registros, setRegistros] = useState<Registro[]>([]);
    const [selecionados, setSelecionados] = useState<string[]>([]);
    const [modoNovo, setModoNovo] = useState(false);
    const [registroEditando, setRegistroEditando] = useState<Registro | null>(null);
    const [filtroStatus, setFiltroStatus] = useState<string[]>(['aberto']);

    const toggleSelecionado = (id: string) => {
        setSelecionados(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const toggleFiltro = (status: string) => {
        setFiltroStatus(prev =>
            prev.includes(status)
                ? prev.filter(s => s !== status)
                : [...prev, status]
        );
    };

    const registrosFiltrados = registros.filter(r => filtroStatus.includes(r.status));

    const excluirRegistro = (id: string) => {
        Alert.alert('Excluir registro', 'Deseja realmente excluir este registro?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Excluir',
                style: 'destructive',
                onPress: () => setRegistros(prev => prev.filter(r => r.id !== id)),
            },
        ]);
    };

    const renderItem = ({ item }: { item: Registro }) => (
        <View style={styles.card}>
            <TouchableOpacity onPress={() => toggleSelecionado(item.id)}>
                <Text style={styles.checkbox}>{selecionados.includes(item.id) ? '☑️' : '⬜'}</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => toggleSelecionado(item.id)}>
                    <Text style={styles.status}>{item.status.toUpperCase()}</Text>
                </TouchableOpacity>
                <Text style={styles.text}>📅 {item.data}</Text>
                <Text style={styles.text}>💰 {item.valor.toFixed(2)}</Text>
                <Text style={styles.text}>🏷️ {item.descricao}</Text>

            </View>
            <View style={{ gap: 4 }}>
                <TouchableOpacity onPress={() => {
                    setRegistroEditando(item);
                    setModoNovo(true);
                }}>
                    <Text style={styles.acaoIcone}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => excluirRegistro(item.id)}>
                    <Text style={styles.acaoIcone}>🗑️</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const handleStatusChange = (newStatus: 'aberto' | 'enviado' | 'fechado') => {
        if (selecionados.length === 0) {
            Alert.alert('Atenção', 'Selecione pelo menos um registro');
            return;
        }
    
        setRegistros(prev => prev.map(registro => 
            selecionados.includes(registro.id) 
                ? { ...registro, status: newStatus }
                : registro
        ));
        
        setSelecionados([]); // Clear selections after changing status
    };

    return (
        <View style={styles.container}>
            <Header userName="Jonas" />

            <View style={styles.filtros}>
                {statusOpcoes.map(status => (
                    <TouchableOpacity
                        key={status}
                        style={filtroStatus.includes(status) ? styles.filtroAtivo : styles.filtro}
                        onPress={() => toggleFiltro(status)}
                    >
                        <Text style={styles.filtroTexto}>
                            {filtroStatus.includes(status) ? '✅' : '⬜'} {status}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={registrosFiltrados}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.lista}
            />

            {modoNovo && (
                <RegistroForm
                    selected={registroEditando ?? undefined}
                    isNovo={modoNovo}
                    onCancel={() => {
                        setModoNovo(false);
                        setRegistroEditando(null);
                    }}
                    onSave={(registro) => {
                        if (registroEditando) {
                            // Editing existing record
                            setRegistros(prev => prev.map(r =>
                                r.id === registroEditando.id ? registro : r
                            ));
                        } else {
                            // Creating new record
                            setRegistros(prev => [...prev, {
                                ...registro,
                                id: Date.now().toString(),
                                status: 'aberto'
                            }]);
                        }
                        setModoNovo(false);
                        setRegistroEditando(null);
                    }}
                />
            )}

            <View style={styles.acoes}>
                <TouchableOpacity 
                    style={styles.acaoBotao} 
                    onPress={() => handleStatusChange('enviado')}
                >
                    <Text style={styles.botaoTexto}>📤{"\n"}Enviar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.acaoBotao} 
                    onPress={() => handleStatusChange('fechado')}
                >
                    <Text style={styles.botaoTexto}>✅{"\n"}Fechar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.acaoBotao} 
                    onPress={() => handleStatusChange('aberto')}
                >
                    <Text style={styles.botaoTexto}>🔄{"\n"}Reabrir</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.acaoBotao} 
                    onPress={() => Alert.alert('Relatório')}
                >
                    <Text style={styles.botaoTexto}>📄{"\n"}Relatório</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.acaoBotao} 
                    onPress={() => {
                        setModoNovo(true);
                        setRegistroEditando(null);
                    }}
                >
                    <Text style={styles.botaoTexto}>➕{"\n"}Novo</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    lista: { padding: 16, paddingBottom: 100, paddingTop: 8 },
    card: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#1e1e1e',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        gap: 10,
    },
    checkbox: { fontSize: 15 },
    text: { color: '#fff', fontSize: 14 },
    status: { color: '#0f0', fontSize: 12, marginTop: 4, marginBottom: 4 },
    acaoIcone: { fontSize: 18, color: '#fff', marginBottom: 6, marginTop: 6 },
    filtros: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        padding: 10,
    },
    filtro: {
        backgroundColor: '#333',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    filtroAtivo: {
        backgroundColor: '#007bff',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    filtroTexto: { color: '#fff' },
    acoes: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 12,
        borderTopWidth: 1,
        borderColor: '#333',
        backgroundColor: '#111',
    },
    acaoBotao: { alignItems: 'center', minWidth: 60 },
    botaoTexto: { color: '#f0f0f0', fontSize: 13, textAlign: 'center' },
});
