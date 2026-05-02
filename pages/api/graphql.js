import { ApolloServer, gql } from 'apollo-server-micro';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { resolver } from '../../lib/resolver';

const typeDefs = gql`
    type HourlyWeather {
        time: String
        min_temp: Float
        max_temp: Float
        description: String
        icon: String
    }

    type DailyWeather {
        date: String
        hourlyWeather: [HourlyWeather] 
    }

    type CurrentWeather {
        date: String
        temp: Float
        feels_like: Float
        description: String
        wind_speed: Float
        humidity: Int
        icon: String
    }

    type WeatherPageData {
        currentWeather: CurrentWeather
        dailyWeather: [DailyWeather]
        city: String
        country: String
        population: Int
    }

    type Query {
        weatherPageData(city: String!): WeatherPageData 
    }
`;


const resolvers = {
  Query: {
    weatherPageData: async (_, { city }) => {
      return await resolver(city);
    }
  }
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
});
const startServer = apolloServer.start();

export default async function handler(req, res) {
  await startServer;
  await apolloServer.createHandler({ path: '/api/graphql' })(req, res);
}


export const config = {
  api: {
    bodyParser: false,
  },
};