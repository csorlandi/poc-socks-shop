import { createContext, useContext, useEffect, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});

  useEffect(() => {
    const storedCart = window.localStorage.getItem('@SocksShop:cart');

    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem('@SocksShop:cart', JSON.stringify(cart));
  }, [cart])

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