const express = require('express');
const { default: mongoose } = require('mongoose');
const { createProduct } = require('./controller/Product');
const server=express();
const productRouters=require('./routes/Products');
const categoriesRouter = require('./routes/Categories');
const brandsRouter = require('./routes/Brands');
const cors=require('cors')

server.use(cors({
    exposedHeaders:['X-Total-Count']
}
))
server.use(express.json());
server.use('/products',productRouters.router)
server.use('/categories', categoriesRouter.router);
server.use('/brands', brandsRouter.router);
main().catch(err=>console.log(err));

async function main(){
    await mongoose.connect('mongodb+srv://admin:Hritik%40123@cluster0.wr9ar1h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
   console.log("connection successful");
}

server.get('/',(req,res)=>{
    res.json({status:'success'})
})


server.listen(8080,()=>{
    console.log("server started");
})