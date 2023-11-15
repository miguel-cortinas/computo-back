const oracledb = require('oracledb');

async function connectToDatabase(){
    try{
        let connection = await oracledb.getConnection({
            user:'BASTION',
            password:'12345',
            connectionString:'localhost:1522/xe'
        });
        console.log('Connection Succes');
        return connection
    }catch(err){
        console.log('Conneciton Failed',err);
    }
}

async function closeConnection(connection){
    try{
        await connection.close();
        console.log('Connection Close');
    }
    catch(err){
        console.log('Error connection close');
    }
}

module.exports = {connectToDatabase,closeConnection}