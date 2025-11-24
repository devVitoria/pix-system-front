export interface UserInfoProps {
    id: number,
    cpfcnpj: string,
    nome: string,
    telefone: string,
    rua: string,
    bairro: string,
    cidade: string,
    email: string,
    password: string
    token?: string
}


export interface TransactionProps {
    chave_origem: {
        chave: string
    },
    chave_destino: {
        chave: string
    },
    data_transferencia: string,
    mensagem: string,
    valor: number,
    id: number
    novoSaldo: number
}

export interface TransactionsUserProps {
    id: number,
    data_transferencia: string,
    valor: string,
    mensagem: string,
    chaveEnvio: string,
    chaveDestino: string,
    nomeDestinatario: string
}