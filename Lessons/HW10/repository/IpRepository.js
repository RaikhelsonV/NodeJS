import IpModelObj from '../knex/objection/IpModelObj.js'
import {encryptIpAddress, decryptIpAddress} from '../utils/ipEncryption.js';
import appLogger from "appLogger";

const log = appLogger.getLogger('UrlRepository.js');


export default class IpRepository {

    async add(ip) {

        console.log("REPO IIPPPP!!!! " + JSON.stringify(ip))
        try {
            ip.ip_address = encryptIpAddress(ip.ip_address);

            console.log(typeof ip.created_at);
            ip.created_at = new Date(ip.created_at).toISOString();
            console.log(typeof ip.created_at);

            await IpModelObj.query().insert(ip)
            log.debug(`IP address ${ip} added for user.`);
        } catch (error) {
            log.error('Error creating IP address:', error);
            throw error;
        }
    }

    async getIpAddressesByUserId(user_id) {
        try {
            const ip_addresses = await IpModelObj.query().where('user_id', user_id);
            const decryptedIpAddresses = ip_addresses.map(ip => ({
                    ...ip,
                    ip_address: decryptIpAddress(ip.ip_address)
                }
            ));
            decryptedIpAddresses.forEach(ip => {
                console.log(ip.ip_address);
            });

            return decryptedIpAddresses;
        } catch (error) {
            console.error('Error getting IP addresses:', error);
            throw error;
        }
    }

    async deleteIpAddressesByUserId(user_id) {
        try {
            const deleteQuery = await IpModelObj.query().delete().where('user_id', user_id);

            console.log(`All IP addresses deleted for user ${user_id}`);
        } catch (error) {
            console.error('Error deleting IP addresses:', error);
            throw error;
        }
    }

}