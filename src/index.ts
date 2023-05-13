import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get("/bands", async (req: Request, res: Response) => {
    
    try {
        const result = await db.raw(`
        SELECT * FROM bands;
        `)
        
        if(result.length < 1){
            res.status(400)
            throw new Error("Não existem bandas cadastradas.");
        }

        res.status(200).send({result})
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.post("/bands", async (req: Request, res: Response) => {

    try {
        
        const id = Date.now()
        const name = req.body.name

        if(!name){
            res.status(400)
            throw new Error("É obrigatório colocar um nome para cadastrar a banda.")
        }

        await db.raw(`
        INSERT INTO bands VALUES( "${id}", "${name}" )
        `)

        res.status(200).send("Banda criada com sucesso")

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }

})

app.put("/bands/:id", async (req: Request, res: Response) => {

    try {
        
        const id = req.params.id
        const newName = req.body.newName

        if(!newName){
            res.status(400)
            throw new Error("Nome da banda não foi alterado.")
        }

        const [band] = await db.raw(`
        SELECT * FROM bands 
        WHERE id = "${id}";
        `)

        if(band){
            await db.raw(`
            UPDATE bands
            SET name = "${newName}"
            WHERE id = "${id}"
            `)
        } else {
            res.status(404)
            throw new Error("Banda não encontrada.")
        }

        console.log(band)

        res.status(200).send("Nome da banda alterado com sucesso")

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }

})

app.get("/songs", async (req: Request, res: Response) => {
    try {

        const result = await db.raw(`
        SELECT * FROM songs;
        `)

        if(result.length < 1){
            res.status(400)
            throw new Error("Não existem songs cadastrados.");
        }
        res.status(200).send(result)


    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.post("/songs", async (req: Request, res: Response) => {
    try {

        const id = Date.now()
        const name = req.body.name
        const band_id = req.body.band_id

        if(!name){
            res.status(400)
            throw new Error("É obrigatório colocar um nome para cadastrar o song.")
        }

        await db.raw(`
        INSERT INTO songs VALUES("${id}", "${name}", "${band_id}")
        `)
        res.status(200).send("Song cadastrado com sucesso.")


    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.put("/songs/:id", async (req: Request, res: Response) => {

    try {
        
        const id = req.params.id
        const newName = req.body.newName

        if(!newName){
            res.status(400)
            throw new Error("Nome do song não foi alterado.")
        }

        const [band] = await db.raw(`
        SELECT * FROM bands 
        WHERE id = "${id}";
        `)

        if(band){
            await db.raw(`
            UPDATE bands
            SET name = "${newName}"
            WHERE id = "${id}"
            `)
        } else {
            res.status(404)
            throw new Error("Banda não encontrada.")
        }

        console.log(band)

        res.status(200).send("Nome da banda alterado com sucesso")

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }

})