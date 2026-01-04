import { Queue } from "bullmq";
import { redis } from "./redisconnection";


export const multilingualQueue = new Queue("multilingual-process", {
  connection: redis,
});