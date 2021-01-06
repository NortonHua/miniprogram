const AuthAddress={
    DENY:'deny',
    NOT_AUTH:'not_auth',
    AUTHORIZED:'authorized'
}

const OrderStatus={
    ALL: 0,
    UNPAID: 1,
    PAID: 2,
    DELIVERED: 3,
    FINISHED: 4,
    CANCELED: 5,
}

const OrderExceptionType = {
    BEYOND_STOCK: 'beyond_stock',
    BEYOND_SKU_MAX_COUNT: 'beyond_sku_max_count',
    BEYOND_ITEM_MAX_COUNT: 'beyond_item_max_count',
    SOLD_OUT: 'sold_out',
    NOT_ON_SALE: 'not_on_sale',
    EMPTY: 'empty'
}

export {
    AuthAddress,
    OrderStatus,
    OrderExceptionType
}