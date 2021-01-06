class CartItem {
    id = null
    count = 0
    sku = null
    cart_item_price = 0.0

    constructor(sku, count) {
        this.sku = sku
        this.id = sku.id
        this.count = count
        this.cart_item_price = sku.price * count
    }

    changeCount(count) {
        this.count = count
        this.cart_item_price = sku.price * count
    }
}

export {
    CartItem
}