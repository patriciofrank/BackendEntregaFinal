export const getManagerMessages = async () => {
    const modelMessage = process.env.SELECTEDDB == 1 ? await import('./MongoDB/models/Message.js') :
        await import('./Postgresql/models/Message.js')
    return modelMessage
}

export const getManagerProducts = async () => {
    const modelProduct = process.env.SELECTEDDB == 1 ? await import('./MongoDB/models/Product.js') :
        await import('./Postgresql/models/Product.js')
    return modelProduct
}

export const getManagerCarts = async () => {
    const modelCart = process.env.SELECTEDDB == 1 ? await import('./MongoDB/models/Cart.js') :
        await import('./Postgresql/models/Cart.js')

    return modelCart
}

export const getManagerUsers = async () => {
    const modelUser = process.env.SELECTEDDB == 1 ? await import('./MongoDB/models/User.js') :
        await import('./Postgresql/models/User.js')

    return modelUser
}

export const getManagerTickets = async () => {
    const modelTicket = process.env.SELECTEDDB == 1 ? await import('./MongoDB/models/Ticket.js') :
        await import('./Postgresql/models/Ticket.js')

    return modelTicket
}