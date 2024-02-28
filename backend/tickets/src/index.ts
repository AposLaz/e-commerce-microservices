import { initRestApi } from "./app";
import { connect } from "./config/mongodb/mongo.client";

const app = initRestApi();
const db = async () => {
  await connect();
};

db();
