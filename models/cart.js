class Cart {
    static SKU_MAX_COUNT = 77
    static CART_ITEM_MAX_COUNT = 10
    static STORAGE_KEY = 'cart'

    _cartData = null

    constructor() {
        if (typeof Cart.instance === 'object') {
            return Cart.instance
        }
        Cart.instance = this
        return this
    }

    getAllCartItemFromLocal() {
        return this._getCartData()
    }

    _getCartData() {
        if (this._cartData!==null){
            return this._cartData
        }
        let carData=wx.getStorageSync(Cart.STORAGE_KEY);
        if (!carData){
            carData=this._initCartDataStorage()
        }
        this._cartData=carData
        return carData;
    }

    isEmpty() {
        const cartData = this._getCartData()
        return cartData.items.length === 0;
    }

    getCartItemById(id){
        if (this.isEmpty()){
            return null;
        }
        const cartData=this._getCartData()

    }


    addItem(newItem) {
        if (this.beyondMaxCartItemCount()) {
            throw new Error('超过购物车最大数量')
        }
        this._pushItem(newItem)
        this._refreshStorage()

    }

    beyondMaxCartItemCount() {
        const cartData=this._getCartData()

        return cartData.items.length>=Cart.CART_ITEM_MAX_COUNT;
    }

    _pushItem(newItem) {
        const cartData = this._getCartData()
        const oldItem = this.findEqualItem(newItem.id)
        if (!oldItem) {
            cartData.items.unshift(newItem)
        } else {
            this._combineItems(oldItem,newItem)
        }
    }

    _isSameItem(newItem,oldItem){
        let flag=true
        for (let i=0;i<oldItem.properties.values.length;i++){
            if (oldItem.properties.values[i]!==newItem.properties.values[i]){
                flag=false
                break
            }
        }
        return flag
    }



    _refreshStorage() {
        this._cartData.totalprice=this._getTotalPrice()
        wx.setStorageSync(Cart.STORAGE_KEY, this._cartData)
    }

    findEqualItem(skuId) {
        let oldItem = null
        const items = this._getCartData().items
        for (let i = 0; i < items.length; i++) {
            if (this._isEqualItem(items[i], skuId)) {
                oldItem = items[i]
                break
            }
        }
        return oldItem;
    }

    findEqualItemIndex(skuId){
        let inx=-1;
        const items=this._getCartData().items
        for (let i=0;i<items.length;i++){
            if (this._isEqualItem(items[i],skuId)){
                inx=i;
                break
            }
        }

        return inx
    }

    _combineItems(oldItem, newItem) {
        this._plusCount(oldItem, newItem.count)
    }

    _isEqualItem(item, skuId) {
        return item.id === skuId;
    }

    _plusCount(oldItem, count) {
        oldItem.count += count
        if (oldItem.count >= Cart.SKU_MAX_COUNT) {
            oldItem.count = Cart.SKU_MAX_COUNT
        }
        oldItem.cart_item_price=oldItem.sku.price * oldItem.count
    }

    _initCartDataStorage() {
        const cartData={
            totalprice: 0.0,
            items: []
        }
        wx.setStorageSync(Cart.STORAGE_KEY,cartData)
        return cartData;
    }

    _getTotalPrice(){
        const dataItems=this._getCartData().items;
        let totalprice=0.0
        for(let i=0;i<dataItems.length;i++){
            totalprice+=dataItems[i].cart_item_price
        }
        return totalprice
    }

    changeItemCount(index,count){
        const cartdata=this._getCartData()
        cartdata.items[index].count=count
        cartdata.items[index].cart_item_price=cartdata.items[index].sku.price*count
        this._refreshStorage()
    }

    removeOneItem(index){
        const cartdata=this._getCartData()
        cartdata.items.splice(index,1)
        this._refreshStorage()
    }

    clearCart(){
        const cartdata=this._getCartData()
        cartdata.items=[]
        this._refreshStorage()
    }
}

export {
    Cart
}