export interface IUsuario {
    gid: string
    nome: string
    sobrenome: string
    email: string
    senha: string
    status: string
    grupo: {
        nome: string
        status: string
    }
}

export interface ILocal {
    local: string
    latitude: number
    longitude: number
    status: string
}

export interface IEmitente {
    nome: string
    sobrenome: string
    empresa: string
    gid: string
    email: string
    telefone: string
}

export interface IRequisitante {
    nome: string
    sobrenome: string
    empresa: string
    email: string
    telefone: string
}

export interface IExecutante {
    nome: string
    sobrenome: string
    empresa: string
    email: string
    telefone: string
}

export interface IHSE {
    nome: string
    sobrenome: string
    empresa: string
    email: string
    telefone: string
}

export interface IAPR {
    urlPDF: string
}

export interface IOrdemServico {
    urlPDF: string
}

export interface IEmpresaTerceirizada {
    nome: string
    cnpj: string
    contrato: string
}

export interface ISecao {
    secao: string
}

export interface ITipoTrabalho {
    descricao: string
}

export interface IPT {
    local: ILocal
    emitente: IEmitente
    requisitante: IRequisitante
    executante: IExecutante
    hse: IHSE
    apr: IAPR
    ordemServico: IOrdemServico
    empresaTerceirizada: IEmpresaTerceirizada
    descricao: string
    tipoTrabalho: ITipoTrabalho
    secao: ISecao
    qtdeProprios: number
    qtdeTerceirizados: number
    qtdeVeiculosLeves: number
    qtdeVeiculosPesados: number
}

