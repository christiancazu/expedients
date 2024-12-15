import { join } from 'node:path'
import { monorepoRootSync } from 'monorepo-root'

export const rootPath = monorepoRootSync()!

process.loadEnvFile(join(rootPath, '.env'))
