import { applyDecorators, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { v4 as uuidv4 } from 'uuid'

export function FileUploadInterceptor() {
  return applyDecorators(
    UseInterceptors(FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.STORAGE_MEDIA_PATH,
        filename: (req, file, cb) => {
          const extension = file.mimetype.split('/').pop()
          cb(null, `${uuidv4()}.${extension}`)
        }
      })
    }))
  )
}
