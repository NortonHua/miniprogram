import {Cart} from "../../models/cart";
import {OrderPost} from "../../models/order-post";
import {Order} from "../../models/order";
import {Http} from "../../utils/http";

const APP = getApp()
APP.configLoadOK = () => {

}
const cart = new Cart()
Page({
    data: {
        wxlogin: true,
        switch1: true, //switch开关

        totalScoreToPay: 0,
        goodsList: [],
        goodsJsonStr: "",

        peisongType: 'zq', // 配送方式 kd,zq 分别表示快递/到店自取
        remark: ''
    },
    onShow() {
        this.setData({
            peisongType: wx.getStorageSync('peisongType'),
            cartData: wx.getStorageSync('cart')
        })
    },


    onLoad(e) {
        let _data = {}
        if (e.orderType) {
            _data.orderType = e.orderType
        }
        if (e.pingtuanOpenId) {
            _data.pingtuanOpenId = e.pingtuanOpenId
        }
        this.setData(_data)
    },
    selected(e) {
        const peisongType = e.currentTarget.dataset.pstype
        this.setData({
            peisongType
        })
        wx.setStorageSync('peisongType', peisongType)
    },

    getDistrictId: function (obj, aaa) {
        if (!obj) {
            return "";
        }
        if (!aaa) {
            return "";
        }
        return aaa;
    },
    // 备注
    remarkChange(e) {
        this.data.remark = e.detail.value
    },
    async goCreateOrder() {
        const mobile = this.data.mobile
        if (this.data.peisongType == 'zq' && !mobile) {
            wx.showToast({
                title: '请输入手机号码',
                icon: 'none'
            })
            return
        }


        if (this.data.peisongType == 'zq' && !(/^1[3456789]\d{9}$/.test(mobile))) {
            wx.showToast({
                title: '手机号格式错误！',
                icon: 'none'
            })
            return
        }

        const address = this.data.address
        if (this.data.peisongType == 'kd' && !address) {
            wx.showToast({
                title: '请选择收货地址',
                icon: 'none'
            })
            return
        }
        this.disableSubmitBtn()
        const remark = this.data.remark; // 备注信息
        const phone = this.data.mobile ? this.data.mobile : ''
        const postAddress = this.data.address ? this.data.address : ''
        const cartData = cart._getCartData()
        const totalprice = cartData.totalprice
        const totalcount = cartData.items.length
        const postOrderItems = cartData.items.map(item => {
            return {
                id: item.id,
                count: item.count,
                cart_item_price: item.cart_item_price,
                title: item.sku.title,
                img: item.sku.img
            }
        })
        const orderPost = new OrderPost(cartData.totalprice,
            this.data.peisongType, phone, remark, cartData.items.length,
            postOrderItems, postAddress, cartData.items[0].sku.img, cartData.items[0].sku.title)

        // console.log(orderPost)
        // console.log('我要创建订单啦')
        const oid = await this.postOrder(orderPost)
        if (!oid) {
            wx.showToast({
                title: '服务器调用失败'
            })
            this.enableSubmitBtn()
            return
        }

        cart.clearCart()

        wx.showModal({
            title: '微信支付',
            content: '本次购买' + totalcount + '种商品,需支付' + totalprice + '元',
            success(res) {
                if (res.confirm) {
                    wx.showToast({
                        title: '支付成功',
                        icon: 'success',
                        duration: 2000
                    })
                    //修改订单状态为已支付
                    Http.request({
                        url: `/wx-order/updatePaid/${oid}`,

                    })
                    // console.log('修改订单状态成功！')

                    wx.redirectTo({
                        url: `/pages/pay-success/pay-success?oid=${oid}`
                    })
                } else if (res.cancel) {
                    //发送订单加入延迟队列的请求
                    Http.request({
                        url: `/mq/push/${oid}`
                    })
                    // console.log('订单加入延迟队列！')
                    wx.redirectTo({
                        url: `/pages/my-order/my-order?key=${1}`
                    })
                }
            }
        })
    },

    mobileChange(e) {
        this.setData({
            mobile: e.detail
        })
    },

    onChooseAddress(e) {
        const address = e.detail.address
        this.data.address = address
    },
    async postOrder(orderPost) {
        try {
            const serverOrder = await Order.postOrderToServer(orderPost)
            if (serverOrder) {
                // console.log(serverOrder)
                return serverOrder.id
            }
        } catch (e) {
            this.setData({
                orderFail: true,
                orderFailMsg: e.message
            })
        }
    },
    enableSubmitBtn() {
        this.setData({
            submitBtnDisable: true
        })
    },
    disableSubmitBtn() {
        this.setData({
            submitBtnDisable: false
        })
    }
})