import initApp from "./server";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT;
import http from 'http'
import fs from 'fs'
import https from 'https'


initApp().then((app) => {
    if(process.env.NODE_ENV !== 'production') {
      console.log('developmnet')
    http.createServer(app).listen(process.env.PORT);
    }
    const option= {
      key: fs.readFileSync('/home/st111/traveler-server/client-key.pem'),
      cert: fs.readFileSync('/home/st111/traveler-server/client-cert.pem')
    };
    https.createServer(option, app).listen(process.env.PORT);
  });
    
