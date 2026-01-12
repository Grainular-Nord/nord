/** @format */

import { join, resolve } from 'node:path';
export const root = (...fragments: string[]) => resolve(join(process.cwd(), ...fragments));
