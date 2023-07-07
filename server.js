import { build } from './src/app.js'
import { getConfig, initializeConfig } from "./src/config.js";
import https from "https"
import http from "http"
import fs from "fs"
import logger from "./src/utils/logger.js";

const run = async () => {
  await initializeConfig()
  const { port, enableHttpsForDev } = getConfig();

  const app = await build();
  
  if (enableHttpsForDev) {
    https
      .createServer(
        {
          key: fs.readFileSync("server-dev-only.key"),
          cert: fs.readFileSync("server-dev-only.cert")
        },
        app
      ).listen(port, () => logger.info(`Server started and running on port ${port} with https`))
  } else {
    http
      .createServer(app).listen(port, () => logger.info(`Server started and running on port ${port} with http`))
      

  }
};

run();




