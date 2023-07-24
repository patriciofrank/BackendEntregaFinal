export const getManagerMessages = async () => {
    const modelMessage =  await import('./MongoDB/models/Message.js') 
        
    return modelMessage
}

export const getManagerProducts = async () => {
    const modelProduct =  await import('./MongoDB/models/Product.js') 
       
    return modelProduct
}

export const getManagerCarts = async () => {
    const modelCart =  await import('./MongoDB/models/Cart.js') 
       

    return modelCart
}

export const getManagerUsers = async () => {
    const modelUser =  await import('./MongoDB/models/User.js') 
       

    return modelUser
}

export const getManagerTickets = async () => {
    const modelTicket =  await import('./MongoDB/models/Ticket.js') 
       

    return modelTicket
}