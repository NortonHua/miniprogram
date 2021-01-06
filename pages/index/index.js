import {Cart} from "../../models/cart";
import {Http} from '../../utils/http'
import {CartItem} from "../../models/cart-item";

// fixed首次打开不显示标题的bug
const cart = new Cart()
Page({
    data: {
        peisongType: 'zq', // zq 自取，kd 配送
        showCartPop: false, // 是否显示购物车列表
        showGoodsDetailPOP: false, // 是否显示商品详情

    },
    onLoad: function (e) {
        // 设置标题
        const mallName = 'Sweet Day'
        if (mallName) {
            wx.setNavigationBarTitle({
                title: mallName
            })
        }
        // 读取默认配送方式
        let peisongType = wx.getStorageSync('peisongType')
        if (!peisongType) {
            peisongType = 'zq'
            wx.setStorageSync('peisongType', peisongType)
        }
        this.setData({
            peisongType
        })
    },

    onShow: function () {
        this.categories()
        this.activities()
        this.shippingCarInfo()
    },

    changePeisongType(e) {
        const peisongType = e.currentTarget.dataset.type
        this.setData({
            peisongType
        })
        wx.setStorage({
            data: peisongType,
            key: 'peisongType',
        })
    },
    // 获取分类
    async categories() {
        const res = await Http.request({
            url: `/category/categories`
        })
        this.setData({
            categories: res,
            categorySelected: res[0]
        })
        this.getGoodsList()
    },
    onGotoSearch(event) {
        wx.navigateTo({
            url: `/pages/search/search`
        })
    },
    async getGoodsList() {
        wx.showLoading({
            title: '',
        })

        const res2 = await Http.request({
            url: `/spu/getByCategoryId`,
            data: {
                id: this.data.categorySelected.id
            }
        })
        // console.log(res2)
        wx.hideLoading()
        this.setData({
            goods: res2
        })
    },
    categoryClick(e) {
        const index = e.currentTarget.dataset.idx
        const categorySelected = this.data.categories[index]
        this.setData({
            categorySelected,
            scrolltop: 0
        })
        this.getGoodsList()
    },
    async shippingCarInfo() {
        const res = wx.getStorageSync('cart')
        if (res && res.items.length > 0) {
            this.setData({
                shippingCarInfo: res
            })
        } else {
            this.setData({
                shippingCarInfo: null,
                showCartPop: false
            })
        }
    },
    showCartPop() {
        this.setData({
            showCartPop: !this.data.showCartPop
        })
    },
    hideCartPop() {
        this.setData({
            showCartPop: false
        })
    },
    async addCart1(e) {
        //const token = wx.getStorageSync('token')
        const index = e.currentTarget.dataset.idx
        const item = this.data.goods[index]
        wx.showLoading({
            title: '',
        })
        const cartItem = new CartItem(item, 1);
        cart.addItem(cartItem)

        wx.hideLoading()
        // console.log(cart._getCartData())

        this.setData({
            shippingCarInfo: wx.getStorageSync('cart')
        })
    },
    async cartStepChange(e) {
        //const token = wx.getStorageSync('token')
        const index = e.currentTarget.dataset.idx
        const item = this.data.shippingCarInfo.items[index]
        // console.log(item)
        //         // console.log(e.detail)
        if (e.detail < 1) {
            // 删除商品
            wx.showLoading({
                title: '',
            })
            cart.removeOneItem(index)
            wx.hideLoading()
            this.shippingCarInfo()
        } else {
            // 修改数量
            wx.showLoading({
                title: '',
            })

            cart.changeItemCount(index, e.detail)

            wx.hideLoading()
            this.shippingCarInfo()
        }
    },
    goodsStepChange(e) {
        const curGoodsMap = this.data.curGoodsMap
        curGoodsMap.number = e.detail
        this.setData({
            curGoodsMap
        })
    },
    async clearCart() {
        wx.showLoading({
            title: '',
        })
        cart.clearCart()
        wx.hideLoading()
        this.shippingCarInfo()
    },

    goPay() {
        wx.navigateTo({
            url: '/pages/pay/index',
        })
    },

    processLogin(e) {
        if (!e.detail.userInfo) {
            wx.showToast({
                title: '已取消',
                icon: 'none',
            })
            return;
        }
    },

    goNotice(e) {
        const id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/notice/detail',
        })
    },

    async activities() {
        const res2 = await Http.request({
            url: `/activity/activities`
        })
        this.setData({
            banners: res2
        })
    },
    tapBanner(e) {
        const url = e.currentTarget.dataset.url
        if (url) {
            wx.navigateTo({
                url
            })
        }
    }
})
