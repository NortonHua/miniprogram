import {Cart} from "../../models/cart";
import {CartItem} from "../../models/cart-item";

const cart = new Cart()
Component({
    properties: {
        data: Object
    },
    observers: {
        data: function (data) {
            if (!data) {
                return
            }
            const cartItem = cart.findEqualItem(data.id)
            this.setData({
                item: data,
                cartItem,
                id: data.id
            })
        }
    },

    methods: {
        onImgLoad(event) {
            const {width, height} = event.detail
            this.setData({
                w: 340,
                h: 340 * height / width
            })
        },
        // onItemTap(event){
        //   const pid = event.currentTarget.dataset.pid
        //   wx.navigateTo({
        //     url:`/pages/detail/detail?pid=${pid}`
        //   })
        // }

        cartStepChange(e) {
            const index = cart.findEqualItemIndex(this.data.id)
            if (index === -1) {
                const newItem = new CartItem(this.data.item, 1)
                cart.addItem(newItem)
                this.setData({
                    cartItem: newItem
                })
                return
            }
            if (e.detail < 1) {
                // 删除商品
                wx.showLoading({
                    title: '',
                })
                cart.removeOneItem(index)
                wx.hideLoading()
            } else {
                // 修改数量
                wx.showLoading({
                    title: '',
                })

                cart.changeItemCount(index, e.detail)
                // console.log(cart._getCartData().items)
                wx.hideLoading()
                //this.shippingCarInfo()
            }

            this.setData({
                cartItem: cart.findEqualItem(this.data.id)
            })
        }
    }
})
