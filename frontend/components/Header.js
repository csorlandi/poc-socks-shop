import { useCart } from '../contexts/CartContext';

import CartIcon from './icons/CartIcon';

const Header = () => {
  const { cart } = useCart();

  const itemsCount = Object.keys(cart).reduce((previousValue, currentValue) => {
    return previousValue + cart[currentValue].quantity;
  }, 0);

  return (
    <header class="bg-white shadow">
      <nav class="container mx-auto px-6 py-3">
        <div class="flex flex-col md:flex-row md:justify-between md:items-center">
          <div class="flex justify-between items-center">
            <div class="flex items-center">
              <a class="text-gray-800 text-xl font-bold md:text-2xl hover:text-gray-700" href="#">
                <img src="/logo.png" alt="Socks Shop Logo" className="w-36" />
              </a>
            </div>
          </div>

          <div class="md:flex items-center">
            <div class="flex flex-col mt-2 md:flex-row md:mt-0 md:mx-1">
              <a class="my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 hover:underline md:mx-4 md:my-0" href="#">Home</a>
              <a class="my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 hover:underline md:mx-4 md:my-0" href="#">Contact</a>
            </div>

            <div class="flex items-center py-2 -mx-1 md:mx-0">
              <a class="flex items-center block w-1/2 px-3 py-2 mx-1 rounded text-center text-sm bg-blue-500 font-medium text-white leading-5 hover:bg-blue-600 md:mx-0 md:w-auto" href="#">
                <CartIcon />
                {itemsCount > 0 && <span class="ml-1.5 text-base">({ itemsCount })</span>}
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
