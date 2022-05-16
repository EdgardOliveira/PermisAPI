import {NextApiRequest, NextApiResponse} from "next";
import {IUsuario} from "../../../lib/interfaces";
import {hashSync} from 'bcryptjs';
import {prisma} from "../../../lib/db";
import {autenticado} from "../../../lib/autenticado";


export default autenticado(async function usuarios(req: NextApiRequest, res: NextApiResponse) {
    const metodo = req.method;

    switch (metodo) {
        case 'POST':
            cadastrar(req, res);
            break;
        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Método: ${metodo} não é permitido para esta rota`);
    }
});

export async function cadastrar(req: NextApiRequest, res: NextApiResponse) {
    const usuario: IUsuario = req.body;

    try {
        //verificando se foram fornecidos os dados
        if (!usuario) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'É necessário fornecer todos os dados'
            });
        }

        //verificando se o usuário já existe
        const consulta = await prisma.usuario.findUnique({
            where: {
                gid: usuario.gid
            }
        });

        if (!consulta) {
            //usuário não existe... criptografa a senha e cadastra no banco de dados
            const resultado = await prisma.usuario.create({
                    data: {
                        gid: usuario.gid,
                        nome: usuario.nome,
                        sobrenome: usuario.sobrenome,
                        email: usuario.email,
                        senha: hashSync(usuario.senha, 12),
                        grupo: {
                            connectOrCreate: {
                                where: {
                                    nome: usuario.grupo.nome
                                },
                                create: {
                                    nome: usuario.grupo.nome
                                }
                            }
                        },
                    },
                }
            );

            //retornando o resultado
            res.status(201).json({
                sucesso: true,
                mensagem: "Registro inserido com sucesso!",
                usuario: resultado,
            });
        } else {
            res.status(200).json({
                sucesso: true,
                mensagem: "Médico já possui cadastro!",
                usuario: consulta,
            });
        }
    } catch
        (e) {
        if (e instanceof Error) {
            res.status(500).json({
                sucesso: false,
                mensagem: 'Não conseguimos salvar o registro',
                erro: e.message
            });
        }
    }
}