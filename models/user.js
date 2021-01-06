import {Http} from "../utils/http";

class User {

    static async updateUserInfo(data){
        return Http.request({
            url:`/client-user/wx_info`,
            data,
            method:'POST'
        })
    }
}

export {
    User
}