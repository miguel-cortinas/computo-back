const redis = require('redis');

async function create_connection(){    
    const redis_con = redis.createClient({
        socket:{
            host:process.env.REDIS_HOST,
            port:process.env.REDIS_PORT
        }
    });
    redis_con.on('error',(err=>{
        console.log('Error en redis',err);
        throw err;
    }))
    await redis_con.connect();
    return redis_con;
}

async function close_conection(connection){
    try{
        if(connection && connection.isOpen){
            await connection.quit();
        }
    }catch(err){
        throw err
    }
}

module.exports = {create_connection,close_conection}