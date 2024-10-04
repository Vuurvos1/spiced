import * as schema from './schema.js';
import { pgGenerate } from 'drizzle-dbml-generator/dist/index.cjs';

const out = './schema.dbml';
const relational = true;
pgGenerate({ schema, out, relational });
console.log('✅ Created the schema.dbml file');
console.log('⏳ Creating the erd.svg file');
