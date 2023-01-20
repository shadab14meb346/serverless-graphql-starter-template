import knex from "knex";

class SingletonDB {
  static db: any = null;

  static getInstance() {
    if (!SingletonDB.db) {
      SingletonDB.db = knex({
        client: "pg",
        connection: process.env.DATABASE_URL,
        pool: {
          min: 50,
          max: 100,
          createRetryIntervalMillis: 200,
          idleTimeoutMillis: 1000, //1 sec
          acquireTimeoutMillis: 10000, // 10 sec
          createTimeoutMillis: 10000, // 10 sec
        },
      });
    }
    return SingletonDB.db;
  }
}

export const DB = () => SingletonDB.getInstance();

export enum Table {
  USERS = "users",
  ADDRESS = "address",
  ZIP_CODE = "zip_code",
  ORDER = "orders",
  ORDER_TO_PRODUCT = "order_to_product",
  SCHEDULE = "schedules",
  STRIPE_SESSION = "stripe_session",
}

export * as PostGrace from "./db-connection";
