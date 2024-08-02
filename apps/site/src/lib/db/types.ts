import type { hotSauces, userTable } from './schema';
import { type InferSelectModel } from 'drizzle-orm';

export type DatabaseUser = InferSelectModel<typeof userTable>;
export type HotSauce = InferSelectModel<typeof hotSauces>;
