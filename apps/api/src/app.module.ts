import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { registerTypeOrm } from './config/typeorm';
import { UsersModule } from './modules/users/users.module';
import { ExpedientsModule } from './modules/expedients/expedients.module';
import { PartsModule } from './modules/parts/parts.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { DocumentsModule } from './modules/documents/documents.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [registerTypeOrm]
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
    DocumentsModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
