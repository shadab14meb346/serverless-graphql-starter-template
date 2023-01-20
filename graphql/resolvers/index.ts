import merge from "lodash.merge";
import { HealthCheckResolver } from "./health-check";

import { UserResolver } from "./user";

const resolvers = merge(UserResolver, HealthCheckResolver);

export default resolvers;
