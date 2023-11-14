const express = require('express');
const Order = require('../models/order');
const Redis = require('../redisclient');


async function list(req,res,next){ 
    let redis;
    try{
        redis = await Redis.create_connection();
        const cachedOrders = await redis.get('orders');
        if(cachedOrders){
            console.log('Datos obtendios de redis');
            res.status(200).json(JSON.parse(cachedOrders));
        }
        else{
            const orders = await Order.findAll();
            await redis.set('orders',JSON.stringify(orders));
            res.status(200).json(orders);
        }
    }catch(err){
        console.log(err);
        res.status(500).send('Error al obtener los orders');
    }finally{
        if(redis){
            await Redis.close_conection(redis);
        }
    }
};

async function get(req,res,next){
    let redis;
    let order_id = req.params.id;
    try{
        redis = await Redis.create_connection();
        const cachedOrderId = await redis.get(`orders/${order_id}`);
        if(cachedOrderId){
            res.status(200).json(JSON.parse(cachedOrderId));    
        }else{
            const order = await Order.findById(order_id);
            await redis.set(`orders/${order_id}`,JSON.stringify(order));
            res.status(200).json(order);
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
    let order_id = req.params.id;
    try{
        redis = await Redis.create_connection();
        await redis.del('orders');
        await redis.del(`orders/${order_id}`);

        await Order.destroy(order_id);
        
        const orders = await Order.findAll();
        await redis.set('orders',JSON.stringify(orders));
        res.status(200).send('Orden Eliminada');
    
    }catch(err){
        console.log(err);
        res.status(500).send('Error al eliminar la orden');
    }finally{
        if(redis){
            await Redis.close_conection(redis);
        }
    }
}

async function create(req,res,next){
    let redis;
    const {order_id, order_mode, customer_id, 
           order_status, order_total, sales_rep_id, promotion_id} = req.body;
           
    
    const order_date = new Date(Date.now());
    order = new Order(order_id, order_date, order_mode, customer_id,order_status, order_total, sales_rep_id, promotion_id);
    
    order.save().then( async ()=>{
        redis = await Redis.create_connection();
        await redis.del('orders');
        await redis.del(`orders/${order_id}`);
        const orders = await Order.findAll();
        await redis.set('orders',JSON.stringify(orders));
        res.status(200).send('Orden creada exitosamente');
    }).catch(async (err)=>{
        console.log(err);
        if(redis){
            await Redis.close_conection(redis);
        }
        res.status(406).json({
            message:'Error al crear la orden',
            error:err
        });
    });
}

async function update(req,res,next){
    let redis;
    let order_id = req.params.id;
    const order_date = new Date(Date.now());
    const {order_mode, customer_id, order_status, order_total, sales_rep_id, promotion_id} = req.body;

    const order = new Order(order_id, order_date, order_mode, customer_id, 
        order_status, order_total, sales_rep_id, promotion_id);

    order.update().then( async ()=>{
        redis = await Redis.create_connection();
        await redis.del('orders');
        await redis.del(`orders/${order_id}`);
        const orders = await Order.findAll();
        await redis.set('orders',JSON.stringify(orders));
        res.status(200).send('Orden actualizada exitosamente');
    }).catch(async (err)=>{
        console.log(err);
        if(redis){
            await Redis.close_conection(redis);
        }
        res.status(406).json({
            message:'Error al actualizar la orden',
            error:err
        });
    });
}


module.exports = { list, get, create, update, destroy };