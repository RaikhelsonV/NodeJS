/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema
        .createTable('users', function (table) {
            table.increments('id').primary();
            table.integer('user_id').unique();
            table.string('name');
            table.string('password');
            table.timestamp('created_at',{useTz:false});
        })
        .createTable('url_shorter', function (table) {
            table.increments('id').primary();
            table.string('code').unique();
            table.string('name');
            table.string('url');
            table.timestamp('created_at',{useTz:false});
            table.integer('visits').defaultTo(0);
            table.integer('user_id').references('user_id').inTable('users');
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable('url_shorter').dropTable('users');
};
