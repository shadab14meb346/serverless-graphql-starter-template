import { gql } from "apollo-server-lambda";

const healthCheckTypeDef = gql`
  type Query {
    health: HealthCheckResponse
  }

  type HealthCheckResponse {
    status: String
  }
`;

export default healthCheckTypeDef;
