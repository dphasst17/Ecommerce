import { defineConfig } from 'kysely-migrate'
import { db } from './src/models/connect'

export default defineConfig({
  db,
  migrationFolder: 'src/migrations',
  codegen: { dialect: 'mysql', out: 'src/db/types.ts' },
})