const oracledb = require('../db');

class Product{
    constructor(product_id,product_name,product_description,category_id,weight_class,
        warranty_period,supplier_id,product_status,list_price,min_price,catalog_url){
            this.product_id = product_id;
            this.product_name  = product_name;
            this.product_description = product_description;
            this.category_id = category_id;
            this.weight_class = weight_class;
            this.warranty_period = warranty_period;
            this.supplier_id = supplier_id;
            this.product_status = product_status;
            this.list_price = list_price;
            this.min_price = min_price;
            this.catalog_url = catalog_url;
        }

    static async findAll(){
        let conn;
        try{
            conn = await oracledb.connectToDatabase();
            const result = await conn.execute('SELECT product_id, product_name, product_description, category_id, weight_class, TO_CHAR(warranty_period), supplier_id, product_status, list_price, min_price, catalog_url FROM products');
            return result.rows.map(row=>{
                return{
                    product_id:row[0],
                    product_name:row[1],
                    product_description:row[2],
                    category_id:row[3],
                    weight_class:row[4],
                    warranty_period:row[5],
                    supplier_id:row[6],
                    product_status:row[7],
                    list_price:row[8],
                    min_price:row[9],
                    catalog_url:row[10],
                }
            })
        }catch(err){
            throw err;
        }finally{
            if (conn){
                await oracledb.closeConnection(conn);
            }
        }
    }

    static async findById(id){
        let conn;
        try{
            conn = await oracledb.connectToDatabase();
            const result = await conn.execute('SELECT product_id, product_name, product_description, category_id, weight_class, TO_CHAR(warranty_period), supplier_id, product_status, list_price, min_price, catalog_url FROM products WHERE product_id = :id', [id]);
            if(result.rows.length>0){
                const row = result.rows[0];
                return{
                    product_id:row[0],
                    product_name:row[1],
                    product_description:row[2],
                    category_id:row[3],
                    weight_class:row[4],
                    warranty_period:row[5],
                    supplier_id:row[6],
                    product_status:row[7],
                    list_price:row[8],
                    min_price:row[9],
                    catalog_url:row[10],
                }
            }else{
                return 'producto no encontrado';
            }
        }catch(err){
            throw err;
        }finally{
            if (conn){
                await oracledb.closeConnection();
            }
        }
    }

    static async destroy(product_id){
        let conn;
        try{
            conn = await oracledb.connectToDatabase();
            await conn.execute('DELETE from products WHERE product_id = :product_id',[product_id]);
            await conn.execute('COMMIT');
            return 'Deleted';
        }catch(err){
            throw err;
        }finally{
            if (conn){
                await oracledb.closeConnection();
            }
        }
    }
    
    async save() {
        let conn;
        try {
            conn = await oracledb.connectToDatabase();
            await conn.execute(
                `INSERT INTO PRODUCT_INFORMATION (
                    PRODUCT_ID, 
                    PRODUCT_NAME, 
                    PRODUCT_DESCRIPTION, 
                    CATEGORY_ID, 
                    WEIGHT_CLASS, 
                    WARRANTY_PERIOD, 
                    SUPPLIER_ID, 
                    PRODUCT_STATUS, 
                    LIST_PRICE, 
                    MIN_PRICE, 
                    CATALOG_URL
                ) VALUES (
                    :product_id, 
                    :product_name, 
                    :product_description, 
                    :category_id, 
                    :weight_class, 
                    :warranty_period, 
                    :supplier_id, 
                    :product_status, 
                    :list_price, 
                    :min_price, 
                    :catalog_url
                )`, 
                [
                    this.product_id, 
                    this.product_name, 
                    this.product_description, 
                    this.category_id, 
                    this.weight_class, 
                    this.warranty_period, // Asegúrate de que esté en el formato correcto para Oracle
                    this.supplier_id, 
                    this.product_status, 
                    this.list_price, 
                    this.min_price, 
                    this.catalog_url
                ]
            );
            console.log('product created');
            await conn.execute('COMMIT');
        } catch(err) {
            console.error(err);
            await conn.execute('ROLLBACK');
            throw err;
        } finally {
            if (conn) {
                await oracledb.closeConnection();
            }
        }   
    }
   

    async update() {
        let conn;
        try {
            conn = await oracledb.connectToDatabase();
            await conn.execute(
                `BEGIN 
                    update_product_information(
                        :product_id, 
                        :product_name, 
                        :product_description, 
                        :category_id, 
                        :weight_class, 
                        :warranty_period, 
                        :supplier_id, 
                        :product_status, 
                        :list_price, 
                        :min_price, 
                        :catalog_url
                    ); 
                 END;`,
                {
                    product_id: this.product_id,
                    product_name: this.product_name,
                    product_description: this.product_description,
                    category_id: this.category_id,
                    weight_class: this.weight_class,
                    warranty_period: this.warranty_period, // Corregido aquí
                    supplier_id: this.supplier_id,
                    product_status: this.product_status,
                    list_price: this.list_price,
                    min_price: this.min_price,
                    catalog_url: this.catalog_url
                }
            );
            console.log('product updated');
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

module.exports = Product;