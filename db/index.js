const pg = require('pg');
const uuid = require('uuid');
const client = new pg.Client(`postgres://localhost/${process.env.DB_NAME}`);

const createTables = async () => {
    const SQL = `
        DROP TABLE IF EXISTS Reservations;
        DROP TABLE IF EXISTS Restaurants;
        DROP TABLE IF EXISTS Customers;

        CREATE TABLE customers (
            id UUID PRIMARY KEY,
            name VARCHAR(100) NOT NULL
        );

        CREATE TABLE restaurants (
            id UUID PRIMARY KEY,
            name VARCHAR(100) NOT NULL
        );

        CREATE TABLE reservations (
            id UUID PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            customer_id UUID REFERENCES customers(id) NOT NULL,
            restaurant_id UUID REFERENCES restaurants(id) NOT NULL
        );
    `;
    await client.query(SQL);
}

const createCustomer = async (name) => {
    const SQL = `
        INSERT INTO customers (id, name) VALUES ($1, $2) 
        RETURNING *;
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    console.log('response-users', response.rows[0]);
    return response.rows[0];
}

const createRestaurant = async (name) => {
    const SQL = `
        INSERT INTO restaurants (id, name) VALUES ($1, $2) 
        RETURNING *;
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    console.log('response-places', response.rows[0]);
    return response.rows[0];
}

const createReservation = async ({ name, customer_id, restaurant_id }) => {
    console.log('Creating Reservation with name:', name);
    const SQL = `
      INSERT INTO reservations (id, name, customer_id, restaurant_id) VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const response = await client.query(SQL, [uuid.v4(), name, customer_id, restaurant_id]);
    return response.rows[0];
};

const seed = async () => {
    console.log('Creating tables...');
    await createTables();
    
    console.log('Creating customers and restaurants...');
    const [customer1, customer2, restaurant1, restaurant2, restaurant3] = await Promise.all([
        createCustomer('Meg'),
        createCustomer('Jeff'),
        createRestaurant('AppleBees'),
        createRestaurant('Mcdonalds'),
        createRestaurant('STK Steak House')
    ]);

    console.log('Customers:', [customer1, customer2]);
    console.log('Restaurants:', [restaurant1, restaurant2, restaurant3]);

    console.log('Creating reservations...');
    await Promise.all([
        createReservation({
            name: 'Reservation name: For Charles Storm',
            customer_id: customer1.id,
            restaurant_id: restaurant2.id
        }),
        createReservation({
            name: 'For John Smith',
            customer_id: customer2.id,
            restaurant_id: restaurant1.id
        })
    ]);

    console.log('Reservations:', await fetchReservations());
};

const fetchCustomers = async () => {
    const SQL = `SELECT * FROM customers`;
    const response = await client.query(SQL);
    return response.rows;
};

const fetchRestaurants = async () => {
    const SQL = `SELECT * FROM restaurants`;
    const response = await client.query(SQL);
    return response.rows;
};

const fetchReservations = async () => {
    const SQL = `SELECT * FROM reservations`;
    const response = await client.query(SQL);
    return response.rows;
};
  
module.exports = {
    client,
    createTables,
    createCustomer,
    createRestaurant,
    fetchRestaurants,
    fetchCustomers,
    fetchReservations,
    seed
};

