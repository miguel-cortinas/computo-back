const oracledb = require('../db');

class Order_Items{
    constructor(order_id,line_item_id,product_id,unit_price,quantity){
        this.order_id = order_id,
        this.line_item_id = line_item_id,
        this.product_id = product_id;
        this.unit_price = unit_price;
        this.quantity = quantity;
    }

    static async findAll(){
        let conn;
        try{
            conn = await oracledb.connectToDatabase();
            const result = await conn.execute('SELECT * FROM order_items');
            return result.rows.map(row=>{
                return{
                    order_id:row[0],
                    line_item_id:row[1],
                    product_id:row[2],
                    unit_price:row[3],
                    quantity:row[4]
                }
            });
        }catch(err){
            throw err;
        }finally{
            if (conn){
                await oracledb.closeConnection(conn);
            }
        }
    }

    static async findById(order_id){
        let conn;
        try{
            conn = await oracledb.connectToDatabase();
            const result = await conn.execute(`SELECT * FROM order_items WHERE order_id = ${order_id}`);
            if(result.rows.length>0){
                return result.rows.map(row=>{
                    return{
                        order_id:row[0],
                        line_item_id:row[1],
                        product_id:row[2],
                        unit_price:row[3],
                        quantity:row[4]
                    }
                });
            }else{
                return 'Order item no encontrado';
            }
        }catch(err){
            throw err;
        }finally{
            if (conn){
                await oracledb.closeConnection();
            }
        }
    }


    //crete
    async save(){
        let conn;
        try{
            conn = await oracledb.connectToDatabase();
            const result = await conn.execute(
                'BEGIN create_order_item(:order_id,:line_item_id,:product_id,:unit_price,:quantity);END;',
                [this.order_id,
                    this.line_item_id,
                    this.product_id,
                    this.unit_price,
                    this.quantity]
            );
            console.log('order_item created');
            await conn.execute('COMMIT');
        }catch(err){
            throw err;
        }finally{
            if(conn){
                await oracledb.closeConnection();
            }
        }
    }
    //update
    async update(){
        let conn;
        try {
            conn = await oracledb.connectToDatabase();
            await conn.execute(
                'BEGIN update_order_item(:order_id,:line_item_id,:product_id,:unit_price,:quantity);END;',
                {
                    order_id:this.order_id,
                    line_item_id:this.line_item_id,
                    product_id:this.product_id,
                    unit_price:this.unit_price,
                    quantity:this.quantity
                }
            );
            console.log('order_item updated');
            await conn.execute('COMMIT');
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            if (conn) {
                await oracledb.closeConnection(conn);
            }
        }
    }
    //delete
    static async destroy(order_id,line_item_id){
        let conn;
        try {
            conn = await oracledb.connectToDatabase();
            await conn.execute(
                `BEGIN 
                    delete_order_item(
                        :order_id,
                        :line_item_id
                    ); 
                 END;`,
                {
                    order_id:order_id,
                    line_item_id:line_item_id
                }
            );
            console.log('order_item delted');
            await conn.execute('COMMIT');
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            if (conn) {
                await oracledb.closeConnection(conn);
            }
        }
    }
}

module.exports = Order_Items;