import createServer from './util/server';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const app = createServer(port);

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
