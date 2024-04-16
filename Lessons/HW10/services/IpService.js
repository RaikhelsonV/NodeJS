import appLogger from "appLogger";
import IpRepository from "../repository/IpRepository.js";
import IpModel from "../models/IpModel.js";

const log = appLogger.getLogger('UserService.js');

export default class IpService {
    constructor() {
        this.ipRepository = new IpRepository();
    }

    async saveUserIPAddress(user_id, ip_address) {
        console.log("IIIIPPPPPPPPPPPPPPPP!!!!!!!!! " + ip_address)
        try {
            const ip = new IpModel(user_id, ip_address);
            await this.ipRepository.add(ip);
            return ip;
        } catch (error) {
            console.error('Error adding IP address:', error);
            throw error;
        }
    }


    async removeIpAddress(user_id, ip_address) {
        try {
            await this.ipRepository.deleteIpAddress(user_id, ip_address);
        } catch (error) {
            console.error('Error removing IP address:', error);
            throw error;
        }
    }

    async getUserIpAddresses(user_id) {
        try {
            const ipAddresses = await this.ipRepository.getIpAddressesByUserId(user_id);
            return ipAddresses;
        } catch (error) {
            console.error('Error getting user IP addresses:', error);
            throw error;
        }
    }
}