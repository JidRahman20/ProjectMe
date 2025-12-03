declare module 'prisma/config' {
  type DatasourceConfig = {
    url: string
  }

  type MigrationsConfig = {
    path?: string
  }

  type PrismaProjectConfig = {
    schema?: string
    migrations?: MigrationsConfig
    datasource?: DatasourceConfig
  }

  export function defineConfig(config: PrismaProjectConfig): PrismaProjectConfig
  export function env(key: string): string | undefined
}
