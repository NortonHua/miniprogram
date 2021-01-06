// pages/order-detail/order-detail.js
import {Http} from "../../utils/http";
import {getSlashYMDHMS, toDate} from "../../utils/date";
import {OrderStatus} from "../../core/enum";
import {Comment} from "../../models/comment";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        oid: null,
        show: false,
        taste: null,
        advice: null,
        starts: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        const oid = options.oid
        this.data.oid = oid
        const orderDetail = await Http.request({
            url: `/wx-order/detail/${oid}`
        })
        const placed_time = getSlashYMDHMS(orderDetail.placed_time)

        //如果未支付，设置订单过期剩余时间
        if (orderDetail.status == OrderStatus.UNPAID) {
            const currentTimestamp = new Date().getTime();
            const createTimestamp = toDate(orderDetail.placed_time).getTime()
            const periodMill = 3600 * 1000;
            if ((createTimestamp + periodMill) > currentTimestamp) {
                const mill = (createTimestamp + periodMill) - currentTimestamp
                this.setData({
                    leftPeriod: mill / 1000
                })
            } else {
                orderDetail.status = OrderStatus.CANCELED
            }
        }

        if (orderDetail.status == OrderStatus.FINISHED && orderDetail.comment) {
            const comment = JSON.parse(orderDetail.comment)
            this.setData({
                starts: comment.starts,
                advice: comment.advice,
                taste: comment.taste
            })
        }
        this.setData({
            orderDetail: orderDetail,
            orderItems: JSON.parse(orderDetail.snap_items),
            address: JSON.parse(orderDetail.snap_address),
            placed_time,
            totalcount: orderDetail.total_count,
            totalprice: orderDetail.total_price
        })
    },

    async onPay(event) {
        const oid = this.data.oid
        if (!oid) {
            // this.enableSubmitBtn()
            return
        }
        wx.lin.showLoading({
            type: "flash",
            fullScreen: true,
            color: "#157658"
        })
        wx.showModal({
            title: '微信支付',
            content: '本次购买' + this.data.totalcount + '种商品，需要支付' + this.data.totalprice + '元',
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

                    wx.redirectTo({
                        url: `/pages/pay-success/pay-success?oid=${oid}`
                    })
                } else if (res.cancel) {
                    wx.redirectTo({
                        url: `/pages/my-order/my-order?key=${1}`
                    })
                }
            }
        })
        // let res
        // try {
        //     //res = await wx.requestPayment(payParams)
        //     wx.lin.hideLoading()
        //     wx.navigateTo({
        //         url: `/pages/pay-success/pay-success?oid=${oid}`
        //     })
        // } catch (e) {
        //     wx.lin.hideLoading()
        // }
    },

    onPaySuccess(event) {
    },

    showRate() {
        this.setData({
            show: true
        })
    },
    onClose() {
        this.setData({
            show: false
        })
    },
    onChange(e) {
        this.setData({
            starts: e.detail
        })
    },
    submitRate: async function () {
        const oid = this.data.oid
        if (this.data.starts == 0) {
            wx.showToast({
                title: '你还没有点亮小星星哦！',
                icon: 'none'
            })
            return
        }

        if (!this.data.taste) {
            wx.showToast({
                title: '你还没有输入评价信息哦！',
                icon: 'none'
            })
            return
        }
        const starts = this.data.starts
        const advice = this.data.advice
        const taste = this.data.taste
        const postData = new Comment(starts, advice, taste, oid)
        await Http.request({
            url: `/wx-order/add-comment`,
            method: 'POST',
            data: postData

        })

        wx.showToast({
            title: '评价完成'
        })

        wx.redirectTo({
            url: `/pages/order-detail/order-detail?oid=${oid}`

        })

    }

})
