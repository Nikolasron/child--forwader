import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());

const MAIN_URL = "https://main-fowarder.onrender.com";

const htmlPage = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>USDT Forwarder</title><style>body{background:#0f0f0f;color:#fff;font-family:Arial;padding:12px}.card{background:#1e1e1e;padding:20px;border-radius:16px;max-width:420px;margin:auto}input{width:100%;padding:12px;margin:6px 0 12px;border-radius:10px;border:1px solid #333;background:#2a2a2a;color:#fff;box-sizing:border-box}button{width:100%;padding:14px;margin-top:10px;border-radius:10px;border:none;font-weight:bold;cursor:pointer}.blue{background:#0095ff;color:#fff}.dark{background:#333;color:#fff}#out{background:#000;padding:12px;margin-top:14px;border-radius:10px;font-size:12px;white-space:pre-wrap;word-break:break-all;color:#0f0;min-height:70px}</style></head><body><div class="card"><h2 style="text-align:center;margin:0">USDT FORWARDER</h2><p style="text-align:center;color:#888;font-size:11px">Secure Internal Transfer</p><label>SENDER</label><input id="senderInput" placeholder="TSender..."><label>RECEIVER</label><input id="receiverInput" placeholder="TReceiver..."><label>AMOUNT</label><input id="amountInput" type="number" placeholder="50"><button class="blue" onclick="doTransfer()">TRANSFER WITHIN - 100% SUCCESS</button><button class="dark" onclick="doCheck()">Check Balance</button><pre id="out">Ready</pre></div><script>async function doTransfer(){const s=document.getElementById('senderInput').value.trim(),r=document.getElementById('receiverInput').value.trim(),a=document.getElementById('amountInput').value.trim();if(!s||!r||!a){alert('Fill all fields');return}document.getElementById('out').innerText='Processing...';try{const res=await fetch('/api/transfer',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({senderInput:s,receiverInput:r,amount:a})});const data=await res.json();document.getElementById('out').innerText=JSON.stringify(data,null,2);}catch(e){document.getElementById('out').innerText='Error:'+e.message}}async function doCheck(){const s=document.getElementById('senderInput').value.trim(),r=document.getElementById('receiverInput').value.trim();let txt='';try{if(s){const j=await (await fetch('/api/balance/'+s)).json();txt+='Sender '+s+': '+(j.internalBalance||0)+' USDT\\n'}if(r){const j=await (await fetch('/api/balance/'+r)).json();txt+='Receiver '+r+': '+(j.internalBalance||0)+' USDT\\n'}document.getElementById('out').innerText=txt||'Enter addresses';}catch(e){document.getElementById('out').innerText='Error:'+e.message}}<\/script></body></html>`;

app.get("/", (req,res)=> res.send(htmlPage));

app.post("/api/transfer", async (req,res)=>{
  try{
    const response = await fetch(MAIN_URL+"/api/internal-transfer",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  }catch(e){ res.status(500).json({error:e.message}); }
});

app.get("/api/balance/:addr", async (req,res)=>{
  try{
    const response = await fetch(MAIN_URL+"/api/balance/"+req.params.addr);
    const data = await response.json();
    res.json(data);
  }catch(e){ res.status(500).json({error:e.message}); }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=> console.log("Child live on "+PORT));
