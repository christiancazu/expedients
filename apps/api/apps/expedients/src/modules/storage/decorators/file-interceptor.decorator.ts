import { UseInterceptors, applyDecorators } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { v4 as uuidv4 } from 'uuid'

export function FileUploadInterceptor() {
	return applyDecorators(
		UseInterceptors(
			FileInterceptor('file', {
				storage: diskStorage({
					destination: `${new ConfigService().get('STORAGE_MEDIA_PATH')}/media/documents`,
					filename: (req, file, cb) => {
						const extension = file.mimetype.split('/').pop()
						cb(null, `${uuidv4()}.${extension}`)
					},
				}),
			}),
		),
	)
}
