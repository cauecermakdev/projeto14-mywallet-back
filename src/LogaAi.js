import express from "express";
import { ConnectionClosedEvent, MongoClient,ObjectId} from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import cors from "cors";
import dayjs from 'dayjs';
dotenv.config();


const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

// conectando ao banco
const mongoClient = new MongoClient("mongodb://localhost:27017");
let db;

mongoClient.connect().then(() => {
	db = mongoClient.db("mywallet_db");
});


/* const app = express();
app.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect().then(() => {
	db = mongoClient.db("mywallet_db"); //O padrão é test
}); */

/*  try {
    await mongoClient.connect();
    db = new mongoClient.db("mywallet_bd");
    } catch (err) {
    console.log("Erro no mongo.connect", err.message);
} */

/* 
await mongoClient.connect;
const dbUol = mongoClient.db("mywallet_bd") */




app.post("/sign-up", async (req, res) => {
  //userName, email, password
  const user = req.body;

  const passwordHash = bcrypt.hashSync(user.password, 10);

  await db.collection("users").insertOne({ ...user, password: passwordHash });
  console.log({...user,passwordHash});

  res.sendStatus(201);
});

app.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;
  const token = uuidV4();

  const user = await db.collection("users").findOne({ email });



  if (user && bcrypt.compareSync(password, user.password)) {
    const objeto_res ={
        userName:user.userName,
        email:email,
        password:password,
        token:token
    }

    await db.collection("sessions").insertOne({
      token,
      userId: user._id,
    });
    res.send(objeto_res);
  } else {
    res.sendStatus(401);
  }
});

//só pra teste, não vou usar
app.get("/users",async (req,res)=>{
    const nomeHeader = req.headers.user;
    const users = await db.collection("users").find({}).toArray();
    
    if(users){
        res.send(users);
    }else{
        res.sendStatus(400);
    }

})

app.get("/sessions",async (req,res)=>{
    const sessionCollection = await db.collection("sessions").find({}).toArray();
    if(sessionCollection){
        res.send(sessionCollection);
    }else{
        res.sendStatus(400);
    }   

})

 app.get("/meus-dados", async (req, res) => {

  /* const { authorization, user } = req.headers; */
  const {user}  = req.headers;
  console.log("user",user);
  
/*   const token = authorization?.replace("Bearer ", "");
  console.log(res.send(token)) 
  if (!token) {
    return res.sendStatus(401);
  }
 */


  try {
    const usersCollection = await db.collection("users").find({ }).toArray();
    console.log("caue?", usersCollection);
    
    res.send(usersCollection);
    
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});


app.post("/historico", async (req,res) => {
    
    const {user} = req.headers;
    console.log("dando post no usuario",user);
    console.log(user);
    
    const data_now = dayjs().format("DD-MM-YYYY'");
    const {descricao,valor,isEntrada} = req.body;

    //validacao do usuario
    const isUser = await db.collection('users').find({ nome: user }).toArray();
    /* console.log(isUser,"isUser"); */
	
/* 	if(!isUser){
        res.sendStatus(401);
		console.log(user, "usuario nao existe");
		return;
	} */

    //objeto de postagem
    const objeto_entradaSaida = {
        userName: user,
        data: data_now,
        descricao:descricao,
        valor:valor,
        isEntrada:isEntrada
    }

    console.log(objeto_entradaSaida);

    //insere no banco de dados
    try{
        const respostaInsert = await db.collection("historico").insertOne(objeto_entradaSaida);
        console.log(respostaInsert);
        /* res.send(historicoCollection); */
        const collectionMaria  = await db.collection("historico").find({userName:user}).toArray()
        console.log("MariaCollection\n",collectionMaria);
        
        res.sendStatus(201);
    
    } catch(err){
        res.sendStatus(err);
    }

})

app.get("/historico", async (req,res) => {
    
    const {user} = req.headers;
    
    //console
    console.log("****************")
    console.log("dando get no historico do user", user);

    //validacao do usuario
    const isUser = await db.collection('users').find({ nome: user }).toArray();
    console.log(isUser?"tem usuario":"nao tem usuario");
	
	if(!isUser){
        res.sendStatus(401);
		console.log(user, "usuario nao existe na requisicao de historico do usuario");
		return;
	}

    //pega no banco de dados
    try{
        const historicoCollection = await db.collection("historico").find({userName:user.toLowerCase()}).toArray();
        console.log(historicoCollection);
        res.send(historicoCollection);
    } catch(err){
        res.send(err);
    }

})




app.listen(5000, () => {
  console.log("Server is listening on port 5000.");
});