import Prismic from 'prismic-javascript';

function Index(props) {
  return (
    <div>
      <h1>Socks Shop</h1>
      <p>Hello!</p>
      <pre>{JSON.stringify(props, null, 2)}</pre>
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