import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';

dotenv.config();

const esClient = new Client({
  node: process.env.ES_NODE || 'http://localhost:9200',
});

export default esClient;