import { ApolloServer, gql } from 'apollo-server-micro';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

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
    hourlyWeather: [HourlyWeather] # 대문자로 수정하여 타입 이름 일치
    }

    type CurrentWeather {
    datetime: String
    temp: Float
    feels_like: Float
    description: String
    wind_speed: Float
    humidity: Int
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
    hello: () => 'GraphQL 서버가 정상적으로 연결되었습니다!',
    testWeather: () => '서울: 25도, 맑음 (Mock 데이터)',
    cities: () => ({ cieties: ['서울', '부산', '대구', '인천', '광주'], count: 5 })
  }
};

const apolloServer = new ApolloServer({ typeDefs, resolvers, plugins: [ApolloServerPluginLandingPageGraphQLPlayground()] });
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