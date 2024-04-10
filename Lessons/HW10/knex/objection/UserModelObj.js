import {Model} from 'objection';
import UrlModelObj from "./UrlModelObj.js";

class UserModelObj extends Model {
    static get tableName() {
        return 'users';
    }

    static get idColumn() {
        return 'id'; // Assuming the identifier column is 'id'
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['user_id', 'name', 'password'], // Assuming these are required fields
            properties: {
                id: {type: 'integer'},
                user_id: {type: 'integer'}, // Assuming this is the user identifier
                name: {type: 'string'},
                password: {type: 'string'},
                created_at: {type: 'string', format: 'date-time'} // Assuming created_at is a timestamp
            }
        };
    }

    static get relationMappings() {
        return {
            links: {
                relation: Model.HasManyRelation,
                modelClass: UrlModelObj,
                join: {
                    from: 'users.user_id',
                    to: 'url_shorter.user_id'
                }
            }
        };
    }
}

export default UserModelObj;
