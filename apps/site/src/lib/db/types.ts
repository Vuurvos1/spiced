import type { userTable } from './schema';
import { type InferSelectModel } from 'drizzle-orm';

export type DatabaseUser = InferSelectModel<typeof userTable>;
