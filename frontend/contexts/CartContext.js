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
    if (Object.keys(cart).length) window.localStorage.setItem('@SocksShop:cart', JSON.stringify(cart));
  }, [cart])

  function addToCart (product) {
    setCart(previousState => {
      let productQuantity = 1;

      if (previousState[product.id]) {
        productQuantity = previousState[product.id].quantity + 1;
      }

      return {
        ...previousState,
        [product.id]: {
          ...product,
          quantity: productQuantity,
        },
      };
    });
  }

  function removeFromCart(productId) {
    setCart(previousState => {
      const cartWithoutProduct = {};

      Object.keys(previousState).forEach(id => {
        if (id !== productId) cartWithoutProduct[id] = previousState[id]
      })

      return cartWithoutProduct;
    })
  }

  function updateProductQuantity(productId, newQuantity) {
    setCart(previousState => {
      const newQuantityAsNumber = Number(newQuantity);
      const cartWithUpdatedQuantity = {};

      Object.keys(previousState).forEach(id => {
        const updatedProduct = { ...previousState[id] };

        if (id === productId) updatedProduct.quantity = newQuantityAsNumber;

        cartWithUpdatedQuantity[id] = updatedProduct;
      })

      return cartWithUpdatedQuantity;
    })
  }

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateProductQuantity,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const cart = useContext(CartContext);

  return cart;
}