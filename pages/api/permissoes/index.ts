import {autenticado} from "../../../lib/autenticado";
import {NextApiRequest, NextApiResponse} from "next";
import {JwtPayload, verify, VerifyErrors} from "jsonwebtoken";
import {prisma} from "../../../lib/db";
import {IPT} from "../../../lib/interfaces";
import {json} from "stream/consumers";

export default autenticado(async function permissoes(req: NextApiRequest, res: NextApiResponse) {
    const metodo = req.method;

    switch (metodo) {
        case 'GET':
            obterTodas(req, res);
            break;
        case 'POST':
            cadastrar(req, res);
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST'])
            res.status(405).end(`Método: ${metodo} não é permitido para esta rota`);
    }
});

export async function cadastrar(req: NextApiRequest, res: NextApiResponse) {
    const pt: IPT | undefined = req.body;

    console.log(JSON.stringify(pt, null, 2));

    try {
        //verificando se os campos foram fornecidos
        if (!pt) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'É necessário fornecer todos os dados'
            })
        }


        console.log("Cadastrando...")
        const resultado = await prisma.pT.create({
            data: {
                local: {
                    connectOrCreate: {
                        where: {
                            local: pt.local.local
                        },
                        create: {
                            local: pt.local.local,
                            latitude: pt.local.latitude,
                            longitude: pt.local.longitude
                        },
                    },
                },
                emitente: {
                    connectOrCreate: {
                        where: {
                            gid: pt.emitente.gid
                        },
                        create: {
                            nome: pt.emitente.nome,
                            sobrenome: pt.emitente.sobrenome,
                            empresa: pt.emitente.empresa,
                            gid: pt.emitente.gid,
                            email: pt.emitente.email,
                            senha: pt.emitente.gid,
                            telefone: pt.emitente.telefone
                        },
                    },
                },
                requisitante: {
                    connectOrCreate: {
                        where: {
                            email: pt.requisitante.email
                        },
                        create: {
                            nome: pt.requisitante.nome,
                            sobrenome: pt.requisitante.sobrenome,
                            empresa: pt.requisitante.empresa,
                            email: pt.requisitante.email,
                            senha: pt.requisitante.email,
                            telefone: pt.requisitante.telefone
                        },
                    },
                },
                executante: {
                    connectOrCreate: {
                        where: {
                            email: pt.executante.email
                        },
                        create: {
                            nome: pt.executante.nome,
                            sobrenome: pt.executante.sobrenome,
                            empresa: pt.executante.empresa,
                            email: pt.executante.email,
                            senha: pt.executante.email,
                            telefone: pt.executante.telefone
                        },
                    },
                },
                hse: {
                    connectOrCreate: {
                        where: {
                            email: pt.hse.email
                        },
                        create: {
                            nome: pt.hse.nome,
                            sobrenome: pt.hse.sobrenome,
                            empresa: pt.hse.empresa,
                            email: pt.hse.email,
                            senha: pt.hse.email,
                            telefone: pt.hse.telefone
                        },
                    },
                },
                apr: {
                    connectOrCreate: {
                        where: {
                            urlPDF: pt.apr.urlPDF
                        },
                        create: {
                            urlPDF: pt.apr.urlPDF
                        },
                    },
                },
                ordemServico: {
                    connectOrCreate: {
                        where: {
                            urlPDF: pt.ordemServico.urlPDF
                        },
                        create: {
                            urlPDF: pt.ordemServico.urlPDF
                        },
                    },
                },
                empresaTerceirizada: {
                    connectOrCreate: {
                        where: {
                            cnpj: pt.empresaTerceirizada.cnpj
                        },
                        create: {
                            nome: pt.empresaTerceirizada.nome,
                            cnpj: pt.empresaTerceirizada.cnpj,
                            contrato: pt.empresaTerceirizada.contrato
                        },
                    },
                },
                descricao: pt.descricao,
                tipoTrabalho: {
                    connectOrCreate: {
                        where: {
                            descricao: pt.tipoTrabalho.descricao
                        },
                        create: {
                            descricao: pt.tipoTrabalho.descricao
                        },
                    },
                },
                secao: {
                    connectOrCreate: {
                        where: {
                            secao: pt.secao.secao
                        },
                        create: {
                            secao: pt.secao.secao
                        },
                    },
                },
                qtdeProprios: pt.qtdeProprios,
                qtdeTerceirizados: pt.qtdeTerceirizados,
                qtdeVeiculosLeves: pt.qtdeVeiculosLeves,
                qtdeVeiculosPesados: pt.qtdeVeiculosPesados
            },
        });

        console.log("Resultado:")
        console.log(JSON.stringify(resultado, null, 2))

        //retornando o resultado
        return res.status(201).json({
            sucesso: true,
            mensagem: "Registro inserido com sucesso!",
            permissaoTrabalho: resultado,
        });

        console.log("enviando retorno...")
    } catch (e) {
        if (e instanceof Error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Não conseguimos salvar o registro',
                erro: e.message
            });
        }
    }
}

export async function obterTodas(req: NextApiRequest, res: NextApiResponse) {
    const token: string | undefined = req.headers.authorization;

    let gid: string | undefined | (() => string);

    try {
        if (!token) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Um token precisa ser fornecido'
            });
        } else {
            verify(token, String(process.env.JWT_SECRET), function (err, decoded) {
                gid = decoded?.sub
            });
        }

        const emitente = await prisma.emitente.findUnique({
            where: {
                gid: String(gid)
            }
        })

        console.log("gid")
        console.log(JSON.stringify(gid, null, 2))

        //verificando se os campos foram fornecidos
        if (emitente == null) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'É necessário fornecer o gid para recuperar os dados'
            })
        }

        const resultado = await prisma.pT.findMany({
            where: {
                emitenteId: emitente.id
            }
        });

        let feedback = {
            sucesso: false,
            mensagem: "",
            consultas: resultado
        };

        if (resultado != null) {
            feedback.sucesso = true;
            feedback.mensagem = "Registro recuperado com sucesso!";
        } else {
            feedback.sucesso = false;
            feedback.mensagem = `Nenhuma permissão de trabalho registrada para o emitente com id:${emitente.id} foi encontrado no banco de dados.`;
        }

        if (feedback.sucesso) {
            //retornando o resultado
            res.status(200).json(feedback);
        } else {
            res.status(404).json(feedback);
        }
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({
                sucesso: false,
                mensagem: 'Não conseguimos recuperar os registros',
                erro: e.message
            });
        }
    }
}