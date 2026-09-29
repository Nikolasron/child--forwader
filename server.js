import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
const MAIN_URL = "https://main-fowarder.onrender.com";
app.post("/api/transfer", async (req,res)=>{
 try{
  let r=await fetch(MAIN_URL+"/api/internal-transfer",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(req.body)});
  res.json(await r.json());
 }catch(e){res.status(500).json({error:e.message})}
});
app.get("/api/balance/:addr", async (req,res)=>{
 try{
  let r=await fetch(MAIN_URL+"/api/balance/"+req.params.addr);
  res.json(await r.json());
 }catch(e){res.status(500).json({error:e.message})}
});
app.listen(10000,()=>console.log("child live"));
