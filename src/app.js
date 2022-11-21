import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from 'uuid';
import dayjs from 'dayjs';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

const dataInSchema = joi.object({
	description: joi.string().required(),
    data: joi.string().required(),
    valor: joi.number().required(),
    isEntrada: joi.boolean().required()
});


try {
await mongoClient.connect();
} catch (err) {
console.log("Erro no mongo.connect", err.message);
}

db = mongoClient.db("dataBaseMyWallet");
/* const talCollection = db.collection("COLLECTIONNNNN"); */


async function userExists(userName){
	const userExists = await dbUol
	.collection("participants")
	.findOne({name:userName});

	/* console.log("userExists", userExists); */

	if(userExists){
		return true;
	}
}



app.post('/entradaSaida', async (req, res) => {
	const dataIn = req.body;
	const user = req.header.user;

	if(await userExists(userName)){
		res.status(409).send('UserName já está logado!');
		return;
	};

    //>>>>>>>>>>>>>>>>>>>>>>>>>

    //PAREI DE EDITAR AQUI
    
    //<<<<<<<<<<<<<<<<<<<<<<<<<

/* 	const userExists = await dbUol
	.collection("participants")
	.findOne({name:req.body.name});

	if(userExists){
		res.status(409).send('UserName já está logado!');
		return;
	} */

	

/* 	const {error} = participantSchema.validate(participantes, { abortEarly: true });

	if(error){
		res.sendStatus(422);
		return
	} */

	const validation = participantSchema.validate(participantes, { abortEarly: true });

	if (validation.error) {
		res.sendStatus(422);
		return
	}

	try {
		await dbUol.collection('participants')
		.insertOne({ ...participantes, lastStatus: Date.now() })
		res.sendStatus(201);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
});


// ROTAS:
app.get("/rota",(req,res)=>{
    //req.body req.header 
})

const port = 5000;
app.listen(port, () => console.log(`Server running in port: ${port}`));