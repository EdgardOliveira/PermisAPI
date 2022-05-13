import {autenticado} from "../../../lib/autenticado";
import {NextApiRequest, NextApiResponse} from "next";
// import {verify} from "jsonwebtoken";

export default autenticado(async function permissoes(req: NextApiRequest, res: NextApiResponse) {
    const metodo = req.method;

    switch (metodo) {
        case 'GET':
            obterTodas(req, res);
            break;
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Método: ${metodo} não é permitido para esta rota`);
    }
});

export async function obterTodas(req: NextApiRequest, res: NextApiResponse) {
    const token: string | undefined = req.headers.authorization;

    // let usuarioId: string | undefined;

    try {
        if (!token) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Um token precisa ser fornecido'
            });
        }else{
            // verify(token, String(process.env.JWT_SECRET), function(err, decoded) {
            //     // usuarioId = decoded?.sub
            // });
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