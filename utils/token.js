import {config} from "../config/config";
import {promisic} from "./util";

class Token {
    constructor() {
        this.tokenUrl=config.apiBaseUrl+'/wx-token'
        this.verifyUrl=config.apiBaseUrl+'/wx-token/verify'
    }

    async verify() {
        const token = wx.getStorageSync('token')
        if (!token) {
            await this.getTokenFromServer()
            console.log(wx.getStorageSync('token'))
        } else {
            await this._verifyFromServer(token)
        }
    }

    async getTokenFromServer() {
        // code
        const r = await wx.login()
        const code = r.code

        const res = await promisic(wx.request)({
            url: this.tokenUrl,
            method: 'POST',
            data: {
                account: code,
                type: 0
            },
        })
        wx.setStorageSync('token', res.data.token)
        return res.data.token
    }

    async _verifyFromServer(token) {
        const res = await promisic(wx.request)({
            url: this.verifyUrl,
            method: 'POST',
            data: {
                token
            }
        })

        const valid = res.data.is_valid
        if (!valid) {
            return this.getTokenFromServer()
        }
    }
}

export {
    Token
}