import '../styles/globals.css'
import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { setContext } from '@apollo/client/link/context'


const httpLink = new HttpLink({
  uri: typeof window !== "undefined" 
    ? "/api/graphql" 
    : "http://localhost:3000/api/graphql",
})

const timezoneLink = setContext((_, { headers }) => {
  if (typeof window === "undefined" || typeof Intl === "undefined") {
    return { headers }
  }

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  if (!timeZone) {
    return { headers }
  }

  return {
    headers: {
      ...headers,
      "x-timezone": timeZone,
    },
  }
})

const client = new ApolloClient({
  link: from([timezoneLink, httpLink]),
  cache: new InMemoryCache(),
})

function MyApp({ Component, pageProps }) {
  
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

export default MyApp