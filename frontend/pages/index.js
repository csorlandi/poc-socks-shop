import Prismic from 'prismic-javascript';

import Header from '../components/Header';
import Product from '../components/Product';

function Index({ products }) {
  return (
    <>
      <Header />
      <div className="p-6 bg-gray-100">
        <main class="grid grid-flow-col grid-cols-3 gap-2">
          {products.map(product => (
            <Product product={product} />
          ))}
        </main>
      </div>
      </>
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