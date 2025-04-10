// types.ts
export interface Registro {
    id: string;
    data: string;
    valor: number;
    descricao: string;
    detalhes: string;
    status: 'aberto' | 'enviado' | 'fechado';
  }
  