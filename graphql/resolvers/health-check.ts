export const HealthCheckResolver = {
  Query: {
    health: async (_parent, _args, _ctx) => {
      return {
        status: "OK",
      };
    },
  },
};
