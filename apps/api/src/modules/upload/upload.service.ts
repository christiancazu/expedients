import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

@Injectable()
export class UploadService {
  constructor(private _configService: ConfigService) {}

  private readonly _s3Client = new S3Client({
    region: this._configService.get<string>('AWS_BUCKET_REGION'),
    credentials: {
      accessKeyId: this._configService.get<string>('AWS_PUBLIC_KEY')!,
      secretAccessKey: this._configService.get<string>('AWS_SECRECT_KEY')!
    }
  })

  private readonly bucketName =
    this._configService.get<string>('AWS_BUCKET_NAME')

  async put(file: Express.Multer.File, key?: string) {
    const Key = key ?? uuidv4()

    try {
      const result = await this._s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key,
          Body: file.buffer,
          ContentType: file.mimetype,
          Metadata: {
            fileName: file.originalname
          }
        })
      )

      return {
        ...result,
        key: Key
      }
    } catch (error) {
      throw new UnprocessableEntityException(error)
    }
  }

  async findOne(Key: string) {
    return getSignedUrl(
      this._s3Client,
      new GetObjectCommand({
        Bucket: this.bucketName,
        Key
      }),
      {
        expiresIn: 60
      }
    )
  }
}
