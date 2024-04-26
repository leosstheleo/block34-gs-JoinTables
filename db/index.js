const pg = require('pg');
const uuid = require('uuid');
const client = new pg.Client(`postgres://localhost/${process.env.DB_NAME}`);

const createTables = async () => {
    const SQL = /*sql*/ `
        DROP TABLE IF EXISTS vacations;
        DROP TABLE IF EXISTS places;
        DROP TABLE IF EXISTS users;

        CREATE TABLE users (
            id UUID PRIMARY KEY,
            name VARCHAR(100) NOT NULL
        );

        CREATE TABLE places (
            id UUID PRIMARY KEY,
            name VARCHAR(100) NOT NULL
        );

        CREATE TABLE vacations (
            id UUID PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            user_id UUID REFERENCES users(id) NOT NULL,
            place_id UUID REFERENCES places(id) NOT NULL
        );
    `;
    await client.query(SQL);
}

const createUser = async (name) => {
    const SQL = /*sql*/ `
        INSERT INTO users (id, name) VALUES ($1, $2) 
        RETURNING *;
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    console.log('response-users', response.rows[0]);
    return response.rows[0];
}

const createPlace = async (name) => {
    const SQL = /*sql*/ `
        INSERT INTO places (id, name) VALUES ($1, $2) 
        RETURNING *;
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    console.log('response-places', response.rows[0]);
    return response.rows[0];
}

const createVacation = async ({ name, user_id, place_id }) => {
    console.log('Creating vacation with name:', name); // Add this line for debugging
    const SQL = `
      INSERT INTO vacations(id, name, user_id, place_id) VALUES($1, $2, $3, $4) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), name, user_id, place_id]);
    return response.rows[0];
};




  

const seed = async () => {
    await createTables();
    
    await Promise.all([
        createUser('meg'),
        createUser('jeff'),
        createPlace('France'),
        createPlace('Monaco'),
        createPlace('Charles House'),
    ]);

    const users = await fetchUsers()
    console.log('Users are ', await fetchUsers())
    const places = await fetchPlaces()
    console.log('Places are ', await fetchPlaces())

    await Promise.all([
      createVacation ({
        name: 'Vacation name: To Monaco Baby with Charles',
        user_id: users[0].id,
        place_id: places[1].id
      }),
      createVacation ({
        name: 'Paris or Paree you said?',
        user_id: users[1].id,
        place_id: places[0].id
      }),
    ]);

console.log('Vacations are: ', await fetchVacations())
};

const fetchUsers = async () => { // Corrected typo in function definition
    const SQL = /*sql*/`
        SELECT * from users;
    `;
    const response = await client.query(SQL);
    return response.rows;
};

const fetchPlaces = async () => { // Corrected typo in function definition
    const SQL = /*sql*/`
        SELECT * from places;
    `;
    const response = await client.query(SQL);
    return response.rows;
};


const fetchVacations = async()=> {
const SQL = /*sql*/ `SELECT * FROM vacations;`
    const response = await client.query(SQL);
    return response.rows;
  };
  
module.exports = {
    client,
    createTables,
    createUser,
    createPlace,
    fetchPlaces,
    fetchUsers,
    fetchVacations,
    seed
};
