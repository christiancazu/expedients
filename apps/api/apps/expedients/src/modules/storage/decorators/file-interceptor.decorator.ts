import { join } from 'node:path'
import { UseInterceptors, applyDecorators } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
	MEDIA_FOLDER,
	ROOT_FOLDER,
} from 'apps/expedients/src/modules/config/app.config'
import { utils } from 'apps/utils'
import { diskStorage } from 'multer'
import { v4 as uuidv4 } from 'uuid'

export function FileUploadInterceptor() {
	return applyDecorators(
		UseInterceptors(
			FileInterceptor('file', {
				storage: diskStorage({
					destination: join(ROOT_FOLDER!, MEDIA_FOLDER!, 'documents'),
					filename: (req, file, cb) => {
						const extension = utils.getMimeExtension(file.mimetype)
						cb(null, `${uuidv4()}.${extension}`)
					},
				}),
			}),
		),
	)
}
