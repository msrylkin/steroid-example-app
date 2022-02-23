import { parse } from '@typescript-eslint/typescript-estree';
import * as path from 'path';
import * as fs from 'fs';

const filePath = '/Users/maxmax/steroid/src/express.ts';
const file = fs.readFileSync(filePath)?.toString('utf-8');

const code = `const hello: string = 'world';`;
const ast = parse(file, {
  loc: true,
  range: true,
});

console.log('ast', ast)