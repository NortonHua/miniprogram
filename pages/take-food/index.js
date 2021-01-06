// pages/take-food/index.js
import {Http} from "../../utils/http";

Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '取餐'
        })

    },

    toIndexPage: function () {
        wx.switchTab({
            url: "/pages/index/index"
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: async function () {
        //加载店内就餐并已完成支付的订单
        const orderList = await Http.request({
            url: `/wx-order/take-food`
        })
        // console.log(orderList)
        this.setData({
            orderList
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    confirmTakeFood: async function (e) {
        const index = e.currentTarget.dataset.idx
        // console.log(index)
        // console.log(this.data.orderList[index])
        const oid = this.data.orderList[index].id;
        // console.log(oid)
        const res = await Http.request({
            url: `/wx-order/detail/${oid}`
        })

        // console.log(res)

        if (res.status !== 3) {
            wx.showToast({
                title: '餐品还在准备中，请耐心等待哦！',
                icon: 'none'
            })
            return
        }

        //将订单状态改为已收货
        await Http.request({
            url: `/wx-order/order-finish/${oid}`
        })
        wx.showToast({
            title: '取餐成功！',
            icon: 'none'
        })

        //this.sleep(2000);
        //刷新页面
        this.onShow()
    },
    sleep: function (n) {
        const start = new Date().getTime()
        while (true) {
            if (new Date().getTime() - start > n) {
                break;
            }
        }
    }
})