import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { registerTypeOrm } from './config/typeorm'
import { UsersModule } from './modules/users/users.module'
import { ExpedientsModule } from './modules/expedients/expedients.module'
import { PartsModule } from './modules/parts/parts.module'
import { ReviewsModule } from './modules/reviews/reviews.module'
import { DocumentsModule } from './modules/documents/documents.module'
import { AuthModule } from './modules/auth/auth.module'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './modules/auth/guards/auth.guard'
import { UploadModule } from './modules/upload/upload.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [registerTypeOrm],
      envFilePath: ['../../../.env']
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api*']
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm') as TypeOrmModuleOptions
    }),
    UsersModule,
    ExpedientsModule,
    PartsModule,
    ReviewsModule,
    DocumentsModule,
    AuthModule,
    UploadModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ]
})
export class AppModule {}
