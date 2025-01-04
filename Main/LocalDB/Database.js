import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseAsync('matzapich.db');

const CreateDatabase = async () => {
    try {
        const db = await SQLite.openDatabaseAsync('matzapich.db');
        
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            profile_picture_url TEXT NULL
            );
        `);
        
        console.log('Table created successfully.');

    } catch (e) {
        console.error('Error setting up the database:', error);
        return false;
    }
}

const insertUserData = async (id, name, email, img) => {
    try {
        await db.insertAsync('users', ['id', 'name', 'email', 'profile_picture_url'], [id, name, email, img]);
        console.log('Data inserted successfully.');
    } catch (error) {
        console.error('Error Insert => ', error); 
    }
}
const selectUserData = async () => {
    try {
        const res = await db.getAllAsync('SELECT * FROM users');
        console.log("LocalDB => ", res);
    } catch (error) {
        console.error('Error Select => ', error);
    }
    
}
