import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UploadService } from './upload.service'

@Module({
	controllers: [],
	providers: [UploadService, ConfigService],
})
export class UploadModule {}
