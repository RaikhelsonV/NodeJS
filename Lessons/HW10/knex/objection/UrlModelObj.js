import {Model} from "objection";
import UserModelObj from "./UserModelObj.js";

class UrlModelObj extends Model {
    static get tableName() {
        return 'url_shorter';
    }

    static get idColumn() {
        return 'id'; // Assuming the identifier column is 'id'
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['code', 'name', 'url', 'created_at'],
            properties: {
                id: {type: 'integer'},
                code: {type: 'string'},
                name: {type: 'string', minLength: 1, maxLength: 50},
                url: {type: 'string'},
                created_at: {type: 'string', format: 'date-time'},
                visits: {type: 'integer'},
                user_id: {type: 'integer'}
            }
        };
    }

    static get relationMappings() {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: UserModelObj,
                join: {
                    from: 'url_shorter.user_id',
                    to: 'users.user_id'
                }
            }
        };
    }
}

export default UrlModelObj;