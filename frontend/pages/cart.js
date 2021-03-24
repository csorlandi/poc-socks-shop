import { useState } from 'react';
import Head from 'next/head';

import { useFormik } from 'formik';
import axios from 'axios';

import Header from '../components/Header';
import { useCart } from '../contexts/CartContext';

import { formatPrice } from '../util/format';

function Cart() {
  const [orderStatus, setOrderStatus] = useState('pre-order');
  const [qrcode, setQrcode] = useState(null);
  const { cart, removeFromCart, updateProductQuantity } = useCart();

  const form = useFormik({
    initialValues: {
      cpf: '',
      name: '',
      phone: ''
    },
    onSubmit: async (values) => {
      const items = Object.keys(cart).map((item) => {
        const formattedItem = {
          quantity: cart[item].quantity,
          price: cart[item].data.price,
          name: cart[item].data.name,
        };

        return formattedItem;
      });
      const order = { ...values, items: [...items] };

      setOrderStatus('ordering');

      const { data } = await axios.post('http://localhost:3001/create-order', order);

      setQrcode(data.qrcode);
      setOrderStatus('order-received');
    }
  });

  function handleQuantityChange(productId, newQuantity) {
    updateProductQuantity(productId, newQuantity);
  }

  const itemsCount = Object.keys(cart).reduce((previousValue, currentValue) => {
    return previousValue + cart[currentValue].quantity;
  }, 0);

  const itemsTotal = Object.keys(cart).reduce((previousValue, currentValue) => {
    return previousValue + cart[currentValue].quantity * cart[currentValue].data.price;
  }, 0);

  return (
    <>
      <Head>
        <title>SocksShop | Cart</title>
      </Head>
      <Header />

      <div className="flex justify-center my-6">
        <div className="flex flex-col w-full p-8 text-gray-800 bg-white shadow-lg pin-r pin-y md:w-4/5 lg:w-4/5">
          <div className="flex-1">
            <table className="w-full text-sm lg:text-base" cellSpacing="0">
              <thead>
                <tr className="h-12 uppercase">
                  <th className="hidden md:table-cell"></th>
                  <th className="text-left">Product</th>
                  <th className="lg:text-right text-left pl-5 lg:pl-0">
                    <span className="lg:hidden" title="Quantity">Qtd</span>
                    <span className="hidden lg:inline">Quantity</span>
                  </th>
                  <th className="hidden text-right md:table-cell">Unit price</th>
                  <th className="text-right">Total price</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(cart).map(key => {
                  const product = cart[key];

                  return (
                    <tr key={key}>
                      <td className="hidden pb-4 md:table-cell">
                        <a href="#">
                          <img src={product.data.featured_image.url} alt={product.data.featured_image?.alt} className="w-20 rounded" />
                        </a>
                      </td>
                      <td>
                        <p className="mb-2 md:ml-4">{product.data.name}</p>
                        <button
                          type="button"
                          className="text-gray-700 md:ml-4"
                          onClick={() => removeFromCart(product.id)}
                        >
                          <small>(Remove item)</small>
                        </button>
                      </td>
                      <td className="justify-center md:justify-end md:flex mt-6">
                        <div className="w-20 h-10">
                          <div className="relative flex flex-row w-full h-8">
                          <input
                            type="number"
                            defaultValue={product.quantity}
                            onChange={event => handleQuantityChange(product.id, event.target.value)}
                            className="w-full font-semibold text-center text-gray-700 bg-gray-200 outline-none focus:outline-none hover:text-black focus:text-black"
                          />
                          </div>
                        </div>
                      </td>
                      <td className="hidden text-right md:table-cell">
                        <span className="text-sm lg:text-base font-medium">
                          {formatPrice(product.data.price)}
                        </span>
                      </td>
                      <td className="text-right">
                        <span className="text-sm lg:text-base font-medium">
                        {formatPrice(product.data.price * product.quantity)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <hr className="pb-6 mt-6" />
            <div className="my-4 mt-6 -mx-2 lg:flex">
              <div className="lg:px-2 lg:w-1/2">
                <div className="p-4 bg-gray-100 rounded-full">
                  <h1 className="ml-2 font-bold uppercase">Personal Data</h1>
                </div>
                <div className="p-4">
                  <div className="justify-center">
                    { orderStatus === 'pre-order' && (
                      <form onSubmit={form.handleSubmit}>
                          <p className="mb-4 italic">Please, enter your details below to proceed.</p>
                          <div className="flex items-center w-full h-13 pl-3">
                            <label className="w-1/4">Name</label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              placeholder="Your name"
                              value={form.values.name}
                              onChange={form.handleChange}
                              className="my-2 p-4 w-3/4 bg-gray-100 outline-none appearance-none focus:outline-none active:outline-none bg-white border rounded-full"
                            />
                          </div>
                          <div className="flex items-center w-full h-13 pl-3">
                            <label className="w-1/4">CPF</label>
                            <input
                              type="text"
                              name="cpf"
                              id="cpf"
                              placeholder="Your CPF number"
                              value={form.values.cpf}
                              onChange={form.handleChange}
                              className="my-2 p-4 w-3/4 bg-gray-100 outline-none appearance-none focus:outline-none active:outline-none bg-white border rounded-full"
                            />
                          </div>
                          <div className="flex items-center w-full h-13 pl-3">
                            <label className="w-1/4">Whatsapp</label>
                            <input
                              type="text"
                              name="phone"
                              id="phone"
                              placeholder="Your whatsapp"
                              value={form.values.phone}
                              onChange={form.handleChange}
                              className="my-2 p-4 w-3/4 bg-gray-100 outline-none appearance-none focus:outline-none active:outline-none bg-white border rounded-full"
                            />
                          </div>
                          <button type="submit" className="flex justify-center w-full px-10 py-3 mt-6 font-medium text-white uppercase bg-gray-800 rounded-full shadow item-center hover:bg-gray-700 focus:shadow-outline focus:outline-none">
                            <svg aria-hidden="true" data-prefix="far" data-icon="credit-card" className="w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M527.9 32H48.1C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48.1 48h479.8c26.6 0 48.1-21.5 48.1-48V80c0-26.5-21.5-48-48.1-48zM54.1 80h467.8c3.3 0 6 2.7 6 6v42H48.1V86c0-3.3 2.7-6 6-6zm467.8 352H54.1c-3.3 0-6-2.7-6-6V256h479.8v170c0 3.3-2.7 6-6 6zM192 332v40c0 6.6-5.4 12-12 12h-72c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12zm192 0v40c0 6.6-5.4 12-12 12H236c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h136c6.6 0 12 5.4 12 12z"/></svg>
                            <span className="ml-2 mt-5px">Procceed to checkout</span>
                          </button>
                      </form>
                    )}
                    {orderStatus === 'ordering' && (
                      <p>Order being placed. Wait...</p>
                    )}
                    {orderStatus === 'order-received' && (
                      <>
                        <p>Make the payment with the QRCode below</p>
                        <img src={qrcode.imagemQrcode} />
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="lg:px-2 lg:w-1/2">
                <div className="p-4 bg-gray-100 rounded-full">
                  <h1 className="ml-2 font-bold uppercase">Order Details</h1>
                </div>
                <div className="p-4">
                  <p className="mb-6 italic">Shipping and additionnal costs are calculated based on values you have entered</p>
                  <div className="flex justify-between border-b">
                    <div className="lg:px-4 lg:py-2 m-2 text-lg lg:text-xl font-bold text-center text-gray-800">
                      Socks Quantity
                    </div>
                    <div className="lg:px-4 lg:py-2 m-2 lg:text-lg font-bold text-center text-gray-900">
                      {itemsCount} un.
                    </div>
                  </div>
                  <div className="flex justify-between pt-4 border-b">
                    <div className="lg:px-4 lg:py-2 m-2 text-lg lg:text-xl font-bold text-center text-gray-800">
                      Total
                    </div>
                    <div className="lg:px-4 lg:py-2 m-2 lg:text-lg font-bold text-center text-gray-900">
                      {formatPrice(itemsTotal)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Cart;