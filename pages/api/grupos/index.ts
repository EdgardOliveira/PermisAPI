import {NextApiRequest, NextApiResponse} from "next";
import {autenticado} from "../../../lib/autenticado";
import {prisma} from "../../../lib/db";

export default autenticado(async function grupos(req: NextApiRequest, res: NextApiResponse) {
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
    const { nome, status } = req.body;

    try {
        //verificando se os campos foram fornecidos
        if (!nome && !status) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'É necessário fornecer todos os dados'
            });
        }

        const grupo = await prisma.grupo.findUnique({
            where: {
                nome
            }
        });

        if (grupo != null){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'O grupo já existe'
            });
        }else{
            const resultado = await prisma.grupo.create({
                data: {
                    nome,
                    status
                }
            });

            //retornando o resultado
            return res.status(201).json({
                sucesso: true,
                mensagem: "Registro inserido com sucesso!",
                grupo: resultado,
            });
        }
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