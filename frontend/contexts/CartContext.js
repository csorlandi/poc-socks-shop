import { createContext, useContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});

  function addToCart (product) {
    setCart(old => {
      let productQuantity = 1;

      if (old[product.id]) {
        productQuantity = old[product.id].quantity + 1;
      }

      return {
        ...old,
        [product.id]: {
          ...product,
          quantity: productQuantity,
        },
      };
    });
  }

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const cart = useContext(CartContext);

  return cart;
}