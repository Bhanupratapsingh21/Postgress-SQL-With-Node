const db = require('./index');

const createTables = async () => {
    const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password VARCHAR(200) NOT NULL
    );
  `;

    const createTodosTable = `
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(100) NOT NULL,
      description TEXT,
      is_completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

    try {
        console.log('Creating users table...');
        await db.query(createUsersTable);
        console.log('Users table created successfully.');

        console.log('Creating todos table...');
        await db.query(createTodosTable);
        console.log('Todos table created successfully.');

        console.log('✅ Tables created successfully.');
    } catch (error) {
        console.error('❌ Error creating tables:', error);
    } finally {
        process.exit();
    }
};

createTables();
