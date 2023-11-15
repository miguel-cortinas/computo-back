create or replace NONEDITIONABLE PROCEDURE create_customer (
    p_customer_id IN CUSTOMERS.CUSTOMER_ID%TYPE,
    p_cust_first_name IN CUSTOMERS.CUST_FIRST_NAME%TYPE,
    p_cust_last_name IN CUSTOMERS.CUST_LAST_NAME%TYPE,
    p_credit_limit IN CUSTOMERS.CREDIT_LIMIT%TYPE,
    p_cust_email IN CUSTOMERS.CUST_EMAIL%TYPE,
    p_income_level IN CUSTOMERS.INCOME_LEVEL%TYPE,
    p_region IN CUSTOMERS.REGION%TYPE
) AS
BEGIN
    CASE p_region
        WHEN 'A' THEN
            INSERT INTO customers_a (customer_id, cust_first_name, cust_last_name, credit_limit, cust_email, income_level, region)
            VALUES (p_customer_id, p_cust_first_name, p_cust_last_name, p_credit_limit, p_cust_email, p_income_level, p_region);
        WHEN 'B' THEN
            INSERT INTO customers_b (customer_id, cust_first_name, cust_last_name, credit_limit, cust_email, income_level, region)
            VALUES (p_customer_id, p_cust_first_name, p_cust_last_name, p_credit_limit, p_cust_email, p_income_level, p_region);
        WHEN 'C' THEN
            INSERT INTO customers_c (customer_id, cust_first_name, cust_last_name, credit_limit, cust_email, income_level, region)
            VALUES (p_customer_id, p_cust_first_name, p_cust_last_name, p_credit_limit, p_cust_email, p_income_level, p_region);
        WHEN 'D' THEN
            INSERT INTO customers_d (customer_id, cust_first_name, cust_last_name, credit_limit, cust_email, income_level, region)
            VALUES (p_customer_id, p_cust_first_name, p_cust_last_name, p_credit_limit, p_cust_email, p_income_level, p_region);
        ELSE
            RAISE_APPLICATION_ERROR(-20001, 'Región no válida');
    END CASE;
END;


create or replace NONEDITIONABLE PROCEDURE create_order (
    p_order_id IN ORDERS.ORDER_ID%TYPE,
    p_order_date IN ORDERS.ORDER_DATE%TYPE,
    p_order_mode IN ORDERS.ORDER_MODE%TYPE,
    p_customer_id IN ORDERS.CUSTOMER_ID%TYPE,
    p_order_status IN ORDERS.ORDER_STATUS%TYPE,
    p_order_total IN ORDERS.ORDER_TOTAL%TYPE,
    p_sales_rep_id IN ORDERS.SALES_REP_ID%TYPE,
    p_promotion_id IN ORDERS.PROMOTION_ID%TYPE
) AS
    l_region CUSTOMERS.REGION%TYPE;
BEGIN
    SELECT REGION INTO l_region FROM CUSTOMERS WHERE CUSTOMER_ID = p_customer_id;

    CASE l_region
        WHEN 'A' THEN
            INSERT INTO orders_a (order_id, order_date, order_mode, customer_id, order_status, order_total, sales_rep_id, promotion_id)
            VALUES (p_order_id, p_order_date, p_order_mode, p_customer_id, p_order_status, p_order_total, p_sales_rep_id, p_promotion_id);
        WHEN 'B' THEN
            INSERT INTO orders_b (order_id, order_date, order_mode, customer_id, order_status, order_total, sales_rep_id, promotion_id)
            VALUES (p_order_id, p_order_date, p_order_mode, p_customer_id, p_order_status, p_order_total, p_sales_rep_id, p_promotion_id);
        WHEN 'C' THEN
            INSERT INTO orders_c (order_id, order_date, order_mode, customer_id, order_status, order_total, sales_rep_id, promotion_id)
            VALUES (p_order_id, p_order_date, p_order_mode, p_customer_id, p_order_status, p_order_total, p_sales_rep_id, p_promotion_id);
        WHEN 'D' THEN
            INSERT INTO orders_d (order_id, order_date, order_mode, customer_id, order_status, order_total, sales_rep_id, promotion_id)
            VALUES (p_order_id, p_order_date, p_order_mode, p_customer_id, p_order_status, p_order_total, p_sales_rep_id, p_promotion_id);
        ELSE
            RAISE_APPLICATION_ERROR(-20001, 'Región no válida o cliente no encontrado');
    END CASE;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20002, 'Cliente no encontrado');
END;

create or replace NONEDITIONABLE PROCEDURE create_order_item (
    p_order_id IN ORDER_ITEMS.ORDER_ID%TYPE,
    p_line_item_id IN ORDER_ITEMS.LINE_ITEM_ID%TYPE,
    p_product_id IN ORDER_ITEMS.PRODUCT_ID%TYPE,
    p_unit_price IN ORDER_ITEMS.UNIT_PRICE%TYPE,
    p_quantity IN ORDER_ITEMS.QUANTITY%TYPE
) AS
    l_region CUSTOMERS.REGION%TYPE;
BEGIN

    SELECT REGION INTO l_region FROM CUSTOMERS WHERE CUSTOMER_ID = (SELECT CUSTOMER_ID FROM ORDERS WHERE ORDER_ID = p_order_id);

    CASE l_region
        WHEN 'A' THEN
            INSERT INTO order_items_a (ORDER_ID, LINE_ITEM_ID, PRODUCT_ID, UNIT_PRICE, QUANTITY)
            VALUES (p_order_id, p_line_item_id, p_product_id, p_unit_price, p_quantity);
        WHEN 'B' THEN
            INSERT INTO order_items_b (ORDER_ID, LINE_ITEM_ID, PRODUCT_ID, UNIT_PRICE, QUANTITY)
            VALUES (p_order_id, p_line_item_id, p_product_id, p_unit_price, p_quantity);
        WHEN 'C' THEN
            INSERT INTO order_items_c (ORDER_ID, LINE_ITEM_ID, PRODUCT_ID, UNIT_PRICE, QUANTITY)
            VALUES (p_order_id, p_line_item_id, p_product_id, p_unit_price, p_quantity);
        WHEN 'D' THEN
            INSERT INTO order_items_d (ORDER_ID, LINE_ITEM_ID, PRODUCT_ID, UNIT_PRICE, QUANTITY)
            VALUES (p_order_id, p_line_item_id, p_product_id, p_unit_price, p_quantity);
        ELSE
            RAISE_APPLICATION_ERROR(-20001, 'Región no válida o cliente no encontrado');
    END CASE;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20002, 'Orden o Cliente no encontrado');
END;

create or replace NONEDITIONABLE PROCEDURE delete_customer (
    p_customer_id IN CUSTOMERS.CUSTOMER_ID%TYPE,
    p_region IN CUSTOMERS.REGION%TYPE
) AS
BEGIN
    CASE p_region
        WHEN 'A' THEN
            DELETE FROM customers_a WHERE customer_id = p_customer_id;
        WHEN 'B' THEN
            DELETE FROM customers_b WHERE customer_id = p_customer_id;
        WHEN 'C' THEN
            DELETE FROM customers_c WHERE customer_id = p_customer_id;
        WHEN 'D' THEN
            DELETE FROM customers_d WHERE customer_id = p_customer_id;
        ELSE
            RAISE_APPLICATION_ERROR(-20001, 'Región no válida');
    END CASE;
END;

create or replace NONEDITIONABLE PROCEDURE delete_order (
    p_order_id IN ORDERS.ORDER_ID%TYPE
) AS
    l_region CUSTOMERS.REGION%TYPE;
BEGIN
    SELECT REGION INTO l_region FROM CUSTOMERS WHERE CUSTOMER_ID = (SELECT CUSTOMER_ID FROM ORDERS WHERE ORDER_ID = p_order_id);
    CASE l_region
        WHEN 'A' THEN
            DELETE FROM orders_a WHERE order_id = p_order_id;
        WHEN 'B' THEN
            DELETE FROM orders_b WHERE order_id = p_order_id;
        WHEN 'C' THEN
            DELETE FROM orders_c WHERE order_id = p_order_id;
        WHEN 'D' THEN
            DELETE FROM orders_d WHERE order_id = p_order_id;
        ELSE
            RAISE_APPLICATION_ERROR(-20001, 'Región no válida o orden no encontrada');
    END CASE;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20002, 'Orden no encontrada');
END;


create or replace NONEDITIONABLE PROCEDURE delete_order_item (
    p_order_id IN ORDER_ITEMS.ORDER_ID%TYPE,
    p_line_item_id IN ORDER_ITEMS.LINE_ITEM_ID%TYPE
) AS
    l_region CUSTOMERS.REGION%TYPE;
BEGIN
    SELECT REGION INTO l_region FROM CUSTOMERS WHERE CUSTOMER_ID = (SELECT CUSTOMER_ID FROM ORDERS WHERE ORDER_ID = p_order_id);

    CASE l_region
        WHEN 'A' THEN
            DELETE FROM order_items_a WHERE ORDER_ID = p_order_id AND LINE_ITEM_ID = p_line_item_id;
        WHEN 'B' THEN
            DELETE FROM order_items_b WHERE ORDER_ID = p_order_id AND LINE_ITEM_ID = p_line_item_id;
        WHEN 'C' THEN
            DELETE FROM order_items_c WHERE ORDER_ID = p_order_id AND LINE_ITEM_ID = p_line_item_id;
        WHEN 'D' THEN
            DELETE FROM order_items_d WHERE ORDER_ID = p_order_id AND LINE_ITEM_ID = p_line_item_id;
        ELSE
            RAISE_APPLICATION_ERROR(-20001, 'Región no válida o cliente no encontrado');
    END CASE;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20002, 'Orden o Cliente no encontrado');
END;

create or replace NONEDITIONABLE PROCEDURE update_customer (
    p_customer_id IN CUSTOMERS.CUSTOMER_ID%TYPE,
    p_cust_first_name IN CUSTOMERS.CUST_FIRST_NAME%TYPE,
    p_cust_last_name IN CUSTOMERS.CUST_LAST_NAME%TYPE,
    p_credit_limit IN CUSTOMERS.CREDIT_LIMIT%TYPE,
    p_cust_email IN CUSTOMERS.CUST_EMAIL%TYPE,
    p_income_level IN CUSTOMERS.INCOME_LEVEL%TYPE,
    p_region IN CUSTOMERS.REGION%TYPE
) AS
BEGIN
    CASE p_region
        WHEN 'A' THEN
            UPDATE customers_a 
            SET cust_first_name = p_cust_first_name, 
                cust_last_name = p_cust_last_name, 
                credit_limit = p_credit_limit, 
                cust_email = p_cust_email, 
                income_level = p_income_level
            WHERE customer_id = p_customer_id;
        WHEN 'B' THEN
            UPDATE customers_b
            SET cust_first_name = p_cust_first_name, 
                cust_last_name = p_cust_last_name, 
                credit_limit = p_credit_limit, 
                cust_email = p_cust_email, 
                income_level = p_income_level
            WHERE customer_id = p_customer_id;
        WHEN 'C' THEN
            UPDATE customers_c 
            SET cust_first_name = p_cust_first_name, 
                cust_last_name = p_cust_last_name, 
                credit_limit = p_credit_limit, 
                cust_email = p_cust_email, 
                income_level = p_income_level
            WHERE customer_id = p_customer_id;
        WHEN 'D' THEN
            UPDATE customers_d 
            SET cust_first_name = p_cust_first_name, 
                cust_last_name = p_cust_last_name, 
                credit_limit = p_credit_limit, 
                cust_email = p_cust_email, 
                income_level = p_income_level
            WHERE customer_id = p_customer_id;
        ELSE
            RAISE_APPLICATION_ERROR(-20001, 'Región no válida');
    END CASE;
END;

create or replace NONEDITIONABLE PROCEDURE update_order (
    p_order_id IN ORDERS.ORDER_ID%TYPE,
    p_order_date IN ORDERS.ORDER_DATE%TYPE,
    p_order_mode IN ORDERS.ORDER_MODE%TYPE,
    p_customer_id IN ORDERS.CUSTOMER_ID%TYPE,
    p_order_status IN ORDERS.ORDER_STATUS%TYPE,
    p_order_total IN ORDERS.ORDER_TOTAL%TYPE,
    p_sales_rep_id IN ORDERS.SALES_REP_ID%TYPE,
    p_promotion_id IN ORDERS.PROMOTION_ID%TYPE
) AS
    l_region CUSTOMERS.REGION%TYPE;
BEGIN
    SELECT REGION INTO l_region FROM CUSTOMERS WHERE CUSTOMER_ID = p_customer_id;
    CASE l_region
        WHEN 'A' THEN
            UPDATE orders_a 
            SET order_date = p_order_date, 
                order_mode = p_order_mode, 
                customer_id = p_customer_id, 
                order_status = p_order_status, 
                order_total = p_order_total, 
                sales_rep_id = p_sales_rep_id, 
                promotion_id = p_promotion_id
            WHERE order_id = p_order_id;
        WHEN 'B' THEN
            UPDATE orders_b
            SET order_date = p_order_date, 
                order_mode = p_order_mode, 
                customer_id = p_customer_id, 
                order_status = p_order_status, 
                order_total = p_order_total, 
                sales_rep_id = p_sales_rep_id, 
                promotion_id = p_promotion_id
            WHERE order_id = p_order_id;
        WHEN 'C' THEN
            UPDATE orders_c 
            SET order_date = p_order_date, 
                order_mode = p_order_mode, 
                customer_id = p_customer_id, 
                order_status = p_order_status, 
                order_total = p_order_total, 
                sales_rep_id = p_sales_rep_id, 
                promotion_id = p_promotion_id
            WHERE order_id = p_order_id;
        WHEN 'D' THEN
            UPDATE orders_d 
            SET order_date = p_order_date, 
                order_mode = p_order_mode, 
                customer_id = p_customer_id, 
                order_status = p_order_status, 
                order_total = p_order_total, 
                sales_rep_id = p_sales_rep_id, 
                promotion_id = p_promotion_id
            WHERE order_id = p_order_id;
        ELSE
            RAISE_APPLICATION_ERROR(-20001, 'Región no válida o cliente no encontrado');
    END CASE;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20002, 'Cliente no encontrado');
END;

create or replace NONEDITIONABLE PROCEDURE update_order_item (
    p_order_id IN ORDER_ITEMS.ORDER_ID%TYPE,
    p_line_item_id IN ORDER_ITEMS.LINE_ITEM_ID%TYPE,
    p_product_id IN ORDER_ITEMS.PRODUCT_ID%TYPE,
    p_unit_price IN ORDER_ITEMS.UNIT_PRICE%TYPE,
    p_quantity IN ORDER_ITEMS.QUANTITY%TYPE
) AS
    l_region CUSTOMERS.REGION%TYPE;
BEGIN
    -- Determinar la región basándose en el ORDER_ID
    SELECT REGION INTO l_region FROM CUSTOMERS WHERE CUSTOMER_ID = (SELECT CUSTOMER_ID FROM ORDERS WHERE ORDER_ID = p_order_id);

    CASE l_region
        WHEN 'A' THEN
            UPDATE order_items_a 
            SET PRODUCT_ID = p_product_id, 
                UNIT_PRICE = p_unit_price, 
                QUANTITY = p_quantity
            WHERE ORDER_ID = p_order_id AND LINE_ITEM_ID = p_line_item_id;
        WHEN 'B' THEN
            UPDATE order_items_b
            SET PRODUCT_ID = p_product_id, 
                UNIT_PRICE = p_unit_price, 
                QUANTITY = p_quantity
            WHERE ORDER_ID = p_order_id AND LINE_ITEM_ID = p_line_item_id;
        WHEN 'C' THEN
            UPDATE order_items_c
            SET PRODUCT_ID = p_product_id, 
                UNIT_PRICE = p_unit_price, 
                QUANTITY = p_quantity
            WHERE ORDER_ID = p_order_id AND LINE_ITEM_ID = p_line_item_id;
        WHEN 'D' THEN
            UPDATE order_items_d
            SET PRODUCT_ID = p_product_id, 
                UNIT_PRICE = p_unit_price, 
                QUANTITY = p_quantity
            WHERE ORDER_ID = p_order_id AND LINE_ITEM_ID = p_line_item_id;
        ELSE
            RAISE_APPLICATION_ERROR(-20001, 'Región no válida o cliente no encontrado');
    END CASE;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20002, 'Orden o Cliente no encontrado');
END;


create or replace NONEDITIONABLE PROCEDURE update_product_information (
    p_product_id IN PRODUCT_INFORMATION.PRODUCT_ID%TYPE,
    p_product_name IN PRODUCT_INFORMATION.PRODUCT_NAME%TYPE,
    p_product_description IN PRODUCT_INFORMATION.PRODUCT_DESCRIPTION%TYPE,
    p_category_id IN PRODUCT_INFORMATION.CATEGORY_ID%TYPE,
    p_weight_class IN PRODUCT_INFORMATION.WEIGHT_CLASS%TYPE,
    p_warranty_period IN PRODUCT_INFORMATION.WARRANTY_PERIOD%TYPE,
    p_supplier_id IN PRODUCT_INFORMATION.SUPPLIER_ID%TYPE,
    p_product_status IN PRODUCT_INFORMATION.PRODUCT_STATUS%TYPE,
    p_list_price IN PRODUCT_INFORMATION.LIST_PRICE%TYPE,
    p_min_price IN PRODUCT_INFORMATION.MIN_PRICE%TYPE,
    p_catalog_url IN PRODUCT_INFORMATION.CATALOG_URL%TYPE
) AS
BEGIN
    UPDATE PRODUCT_INFORMATION
    SET
        PRODUCT_NAME = p_product_name,
        PRODUCT_DESCRIPTION = p_product_description,
        CATEGORY_ID = p_category_id,
        WEIGHT_CLASS = p_weight_class,
        WARRANTY_PERIOD = p_warranty_period,
        SUPPLIER_ID = p_supplier_id,
        PRODUCT_STATUS = p_product_status,
        LIST_PRICE = p_list_price,
        MIN_PRICE = p_min_price,
        CATALOG_URL = p_catalog_url
    WHERE PRODUCT_ID = p_product_id;

    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'No se encontró el producto con el ID proporcionado.');
    END IF;

    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;

CREATE OR REPLACE NONEDITIONABLE SYNONYM "USER_BASTION"."CUSTOMERS_A" FOR "CUSTOMERS"@"REGION_A";

DATABASE_LINKS

  CREATE DATABASE LINK "REGION_A"
   CONNECT TO "USER_REG_A" IDENTIFIED BY VALUES ':1'
   USING '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=172.17.0.2)(PORT=1521))
(CONNECT_DATA=(SERVICE_NAME=XE)))';

  CREATE DATABASE LINK "REGION_B"
   CONNECT TO "USER_REG_B" IDENTIFIED BY VALUES ':1'
   USING '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=172.17.0.3)(PORT=1521))
(CONNECT_DATA)=(SERVICE_NAME=XE)))';

  CREATE DATABASE LINK "REGION_C"
   CONNECT TO "USER_REG_C" IDENTIFIED BY VALUES ':1'
   USING '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=172.17.0.4)(PORT=1521))
(CONNECT_DATA)=(SERVICE_NAME=XE)))';

  CREATE DATABASE LINK "REGION_D"
   CONNECT TO "USER_REG_C" IDENTIFIED BY VALUES ':1'
   USING '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=172.17.0.5)(PORT=1521))
(CONNECT_DATA)=(SERVICE_NAME=XE)))';