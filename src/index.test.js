// @ts-ignore
import { describe, expect, test } from '@jest/globals'
import { connectToDatabase } from './database';


describe('Connect DB', () => {
  test('connect', async () => {
    const db = connectToDatabase();
    expect(!!db).toBe(true);
  });
})
