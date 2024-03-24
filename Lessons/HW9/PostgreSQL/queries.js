export const queries = {
    INSERT_USER:
        'INSERT INTO users (user_id, name, password, created_at) VALUES ($1, $2, $3, $4)',
    SELECT_USER_BY_ID: 'SELECT * FROM users WHERE user_id = $1',
};
