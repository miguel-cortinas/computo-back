const express = require('express');
const Product = require('../models/product');
const Redis = require('../redisclient');


async function list(req,res,next){ 
    let redis;
    try{
        redis = await Redis.create_connection();
        const cachedProducts = await redis.get('products');
        if(cachedProducts){
            console.log('Datos obtendios de redis');
            res.status(200).json(JSON.parse(cachedProducts));
        }
        else{
            const products = await Product.findAll();
            await redis.set('products',JSON.stringify(products));
            res.status(200).json(products);
        }
    }catch(err){
        console.log(err);
        res.status(500).send('Error al obtener los productos');
    }finally{
        if(redis){
            await Redis.close_conection(redis);
        }
    }
};

async function get(req,res,next){
    let redis;
    let product_id = req.params.id;
    try{
        redis = await Redis.create_connection();
        const cachedProductId = await redis.get(`product/${product_id}`);
        if(cachedProductId){
            res.status(200).json(JSON.parse(cachedProductId));    
        }else{
            const product = await Product.findById(product_id);
            await redis.set(`products/${product_id}`,JSON.stringify(product));
            res.status(200).json(product);
        }
    }catch(err){
        console.log(err);
        res.status(500).send('Error al obtener datos de la orden');
    }finally{
        if(redis){
            await Redis.close_conection(redis);
        }
    }
}

async function destroy(req,res,next){
    let redis;
    let product_id = req.params.id;
    try{
        redis = await Redis.create_connection();
        await redis.del('products');
        await redis.del(`products/${product_id}`);

        await Product.destroy(product_id);
        
        const products = await Product.findAll();
        await redis.set('products',JSON.stringify(products));
        res.status(200).send('Prouducto Eliminado');
    
    }catch(err){
        console.log(err);
        res.status(500).send('Error al eliminar el producto');
    }finally{
        if(redis){
            await Redis.close_conection(redis);
        }
    }
}

async function create(req,res,next){
    let redis;
    const {product_id,product_name,product_description,category_id,weight_class,
        warranty_period,supplier_id,product_status,list_price,min_price,catalog_url} = req.body;

    
        product = new Product(
        product_id,product_name,product_description,category_id,weight_class,
        warranty_period,supplier_id,product_status,list_price,min_price,catalog_url);
    
        product.save().then( async ()=>{
        redis = await Redis.create_connection();
        await redis.del('products');
        await redis.del(`products/${product_id}`);
        const products = await Product.findAll();
        await redis.set('products',JSON.stringify(products));
        res.status(200).send('Producto creado exitosamente');
    }).catch(async (err)=>{
        console.log(err);
        if(redis){
            await Redis.close_conection(redis);
        }
        res.status(406).json({
            message:'Error al crear el cliente',
            error:err
        });
    });
}

async function update(req,res,next){
    let redis;
    let product_id = req.params.id;
    
    const {product_name,product_description,category_id,weight_class,
    warranty_period,supplier_id,product_status,list_price,min_price,catalog_url} = req.body;
    const product = new Product(product_id,product_name,product_description,category_id,weight_class,
    warranty_period,supplier_id,product_status,list_price,min_price,catalog_url);

    product.update().then( async ()=>{
        redis = await Redis.create_connection();
        await redis.del('products');
        await redis.del(`products/${product_id}`);
        const products = await Product.findAll();
        await redis.set('products',JSON.stringify(products));
        res.status(200).send('Producto actualizado exitosamente')
    }).catch(async (err)=>{
        if(redis){
            await Redis.close_conection(redis);
        }
        console.log(err);
        res.status(406).json({
            message:'Error al actualizar el producto',
            error:err
        });
    });
}

module.exports = {list,get,destroy,create,update};