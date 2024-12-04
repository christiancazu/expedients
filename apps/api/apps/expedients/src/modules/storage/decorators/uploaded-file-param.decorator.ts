import { HttpStatus, ParseFilePipeBuilder, UploadedFile } from '@nestjs/common'

export function UploadedFileParam() {
  return UploadedFile(
    new ParseFilePipeBuilder()
      .addMaxSizeValidator({ maxSize: 10485760 /* 10MB */ })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
      })
  )
}
