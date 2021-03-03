import Prismic from 'prismic-javascript';

function Index({ products }) {
  return (
    <div className="h-screen bg-gray-100">
      <h1>Socks Shop</h1>
      <main class="flex flex-row flex-wrap">
        {products.map(product => (
          <section class="m-1 flex flex-col md:flex-row py-10 px-5 bg-white rounded-md shadow-lg w-1/3">
            <div class="text-indigo-500 flex flex-col justify-between">
              <img src={product.data.featured_image.url} alt={product.data.featured_image?.alt} />
            </div>
            <div class="text-indigo-500">
              <small class="uppercase">technology</small>
              <h3 class="uppercase text-black text-2xl font-medium">{product.data.name}</h3>
              <h3 class="text-2xl font-semibold mb-7">$ {product.data.price}</h3>
              <div class="flex gap-0.5 mt-4">
                <button id="addToCartButton" class="bg-indigo-600 hover:bg-indigo-500 focus:outline-none transition text-white uppercase px-8 py-3">add to cart</button>
              </div>
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}

export async function getServerSideProps({ res }) {
  const client = Prismic.client('https://socksshop.cdn.prismic.io/api/v2');

  const products = await client.query(Prismic.Predicates.at('document.type', 'product'));

  return {
    props: {
      date: Date.now(),
      products: products.results,
    }
  }
}

export default Index;