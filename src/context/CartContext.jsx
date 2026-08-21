import { createContext, useContext, useState } from "react";
import { getProductById } from "../data/products";

export const CartContext = createContext(null);

// CartProvider = Wrapping component
export default function CartProvider({ children }) {

    const [cartItems, setCartItems] = useState([]); // list of objects: {id, quantity}

    function addToCart(productId){
        const foundItem = cartItems.find( (item) => item.id === productId );
        if(foundItem){
            const currentQuantity = foundItem.quantity;
            const updatedCartItems = cartItems.map( (item) => 
                item.id === productId 
                    ? { id: productId, quantity: currentQuantity + 1 } 
                    : item );
            setCartItems(updatedCartItems);
        }else{
            
            setCartItems([...cartItems, { id: productId, quantity: 1 }]);
        }
    }
    function removeFromCart(productId){
        const updatedCartItems = cartItems.filter( item => item.id !== productId);
        setCartItems(updatedCartItems);
    }

    function getCartItemsWithProducts(){
        return cartItems.map( (item) => (
            {...item, product: getProductById(item.id)}
        )).filter(item => item.product);
    }

    function updateQuantity(productId, quantity){
        if(quantity <= 0){
            removeFromCart(productId);
            return;
        }
        const updatedCartItems = cartItems.map( (item) => 
            item.id === productId ? {...item, quantity} : item
        );
        setCartItems(updatedCartItems);
    }

    function getCartTotal(){
        const total = cartItems.reduce( (total, item) => {
            const product = getProductById(item.id);
            return total + ( product? product.price * item.quantity : 0);
        }, 0);

        return total;
    }

    function clearCart(){
        setCartItems([]);
    }
    

    return (
         <CartContext.Provider 
            value={{ cartItems, addToCart, getCartItemsWithProducts, 
                updateQuantity, removeFromCart, getCartTotal, clearCart }}
        > 
            {children} 
        </CartContext.Provider>
    );
}


export function useCart(){
    const context = useContext(CartContext);

    return context;
}