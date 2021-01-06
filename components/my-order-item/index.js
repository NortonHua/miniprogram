// components/order-sku-panel/index.js
// import {orderStatusBehavior} from "../behaviors/order-status-beh";
import {OrderStatus} from "../../core/enum";
import {toDate} from "../../utils/date";
import {Http} from "../../utils/http";
import {OrderStatusText} from "../../utils/order-status-text";

Component({
    /**
     * 组件的属性列表
     */
    externalClasses: ['l-class'],
    // behaviors: [orderStatusBehavior],
    properties: {
        item: Object,
    },

    /**
     * 组件的初始数据
     */
    data: {
        // specValuesText: null,
        // statusText: '',

        _item: Object,
        // order:Object

    },


    observers: {
        'item, currentStatus': function (item) {
            if (!item) {
                return
            }

            // console.log(item)
            //如果未支付，设置订单过期剩余时间
            if (item.status == OrderStatus.UNPAID) {
                const currentTimestamp = new Date().getTime();
                const createTimestamp = toDate(item.placed_time).getTime()
                // console.log(currentTimestamp);
                // console.log(createTimestamp);
                const periodMill = 3600 * 1000;
                if ((createTimestamp + periodMill) > currentTimestamp) {
                    const mill = (createTimestamp + periodMill) - currentTimestamp
                    this.setData({
                        leftPeriod: mill / 1000
                    })
                }
            }

            //设置订单状态文字
            item.statusText = OrderStatusText.setOrderStatusText(item.status)

            this.setData({
                _item: item,
                totalcount: item.total_count,
                totalprice: item.total_price
            })
        }
    },

    attached() {
        // console.log(this.properties.item)
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onGotoDetail(event) {
            // console.log(this.data._item)
            const oid = this.data._item.id
            wx.navigateTo({
                url: `/pages/order-detail/order-detail?oid=${oid}`
            })
        },
        // onCountdownEnd(event) {
        //   this.data._item.correctOrderStatus()
        //   this.setData({
        //     _item: this.data._item
        //   })
        // },

        async onPay(event) {
            const oid = this.data._item.id;

            if (!oid) {
                this.enableSubmitBtn()
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


        }
    }
})
