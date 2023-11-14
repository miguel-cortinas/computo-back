const express = require('express');
const Customer = require('../models/customer');
const Redis = require('../redisclient')


async function list(req,res,next){ 
    let redis;
    try{
        redis = await Redis.create_connection();
        const cachedCustomers = await redis.get('customers');
        if(cachedCustomers){
            console.log('Datos obtendios de redis');
            res.status(200).json(JSON.parse(cachedCustomers));
        }
        else{
            const customers = await Customer.findAll();
            await redis.set('customers',JSON.stringify(customers));
            res.status(200).json(customers);
        }
    }catch(err){
        console.log(err);
        res.status(500).send('Error al obtener los clientes');
    }finally{
        if(redis){
            await Redis.close_conection(redis);
        }
    }
};

async function get(req,res,next){
    let redis;
    let customer_id = req.params.id;
    try{
        redis = await Redis.create_connection();
        const cachedCustomerId = await redis.get(`customers/${customer_id}`);
        if(cachedCustomerId){
            res.status(200).json(JSON.parse(cachedCustomerId));    
        }else{
            const customer = await Customer.findById(customer_id);
            await redis.set(`customers/${customer_id}`,JSON.stringify(customer));
            res.status(200).json(customer)
        }
    }catch(err){
        console.log(err);
        res.status(500).send('Error al obtener el cliente');
    }finally{
        if(redis){
            await Redis.close_conection(redis);
        }
    }
};

async function create(req,res,next){
    let redis;
    const {customer_id,cust_first_name,cust_last_name,credit_limit,cust_email,income_level,region} = req.body;
    const customer = new Customer(
        customer_id,
        cust_first_name,
        cust_last_name,
        credit_limit,
        cust_email,
        income_level,
        region        
    );
    customer.save().then( async ()=>{
        redis = await Redis.create_connection();
        await redis.del('customers');
        await redis.del(`customers/${customer_id}`);
        customers = await Customer.findAll();
        await redis.set('customers',JSON.stringify(customers));
        res.status(200).send('Cliente creado exitosamente');
    }).catch(async (err)=>{
        console.log(err);
        if(redis){
            await Redis.close_conection(redis);
        }
        res.status(406).json({
            message:'Error al crear el cliente',
            error:err
        })
    });
}

async function update(req,res,next){
    let redis;
    const customer_id = req.params.id;
    const {cust_first_name,cust_last_name,credit_limit,cust_email,income_level,region} = req.body;
    
    const customer = new Customer(
        customer_id,
        cust_first_name,
        cust_last_name,
        credit_limit,
        cust_email,
        income_level,
        region        
    );

    customer.update().then( async ()=>{
        redis = await Redis.create_connection();
        await redis.del('customers');
        await redis.del(`customers/${customer_id}`);
        const customers = await Customer.findAll();
        await redis.set('customers',JSON.stringify(customers));
        res.status(200).send('Cliente actualizado exitosamente')
    }).catch(async (err)=>{
        console.log(err);
        res.status(406).json({
            message:'Error al actualizar el cliente',
            error:err
        });
    }).finally(async()=>{
        if(redis){
            await Redis.close_conection(redis);
        }
    });
}

async function destroy(req,res,next){
    let redis;
    let customer_id = req.params.id;
    let region = req.params.region;
    try{
        redis = await Redis.create_connection();
        await redis.del('customers');
        await redis.del(`customers/${customer_id}`);

        await Customer.destroy(customer_id,region);
        
        const customers = await Customer.findAll();
        await redis.set('customers',JSON.stringify(customers));
        res.status(200).send('Cliente Eliminado');
    
    }catch(err){
        console.log(err);
        res.status(500).send('Error al eliminar el cliente');
    }finally{
        if(redis){
            await Redis.close_conection(redis);
        }
    }
}

module.exports = {list,get,create,update,destroy};