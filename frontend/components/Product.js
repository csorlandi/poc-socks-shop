const Product = ({ product }) => {
  return (
    <section class="m-1 flex flex-col md:flex-row py-10 px-5 bg-white rounded-md shadow-lg">
      <div class="text-indigo-500 flex flex-col justify-between">
        <img src={product.data.featured_image.url} alt={product.data.featured_image?.alt} />
      </div>
      <div class="text-indigo-500">
        <small class="uppercase">technology</small>
        <h3 class="uppercase text-black text-2xl font-medium">{product.data.name}</h3>
        <h3 class="text-2xl font-semibold mb-7">$ {product.data.price}</h3>
        <div class="flex gap-0.5 mt-4">
          <button id="addToCartButton" class="bg-indigo-600 hover:bg-indigo-500 focus:outline-none transition px-8 py-3 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Product;
