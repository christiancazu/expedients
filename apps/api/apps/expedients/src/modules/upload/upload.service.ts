import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import type { ConfigService } from '@nestjs/config'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class UploadService {
	constructor(private _configService: ConfigService) {}

	private readonly bucketName =
		this._configService.get<string>('AWS_BUCKET_NAME')
	private readonly region = this._configService.get<string>('AWS_BUCKET_REGION')

	private readonly _s3Client = new S3Client({
		region: this.region,
		credentials: {
			accessKeyId: this._configService.get<string>('AWS_PUBLIC_KEY')!,
			secretAccessKey: this._configService.get<string>('AWS_SECRECT_KEY')!,
		},
	})

	async put(
		file: Express.Multer.File,
		fileName: string,
		extension: string,
		key?: string,
	) {
		const Key = key ?? uuidv4()

		try {
			const result = await this._s3Client.send(
				new PutObjectCommand({
					Bucket: this.bucketName,
					Key,
					Body: file.buffer,
					ContentType: file.mimetype,
					Metadata: {
						fileName,
					},
				}),
			)

			return {
				...result,
				key: Key,
			}
		} catch {
			throw new UnprocessableEntityException('error uploading file')
		}
	}

	async findOne(Key: string) {
		return getSignedUrl(
			this._s3Client,
			new GetObjectCommand({
				Bucket: this.bucketName,
				Key,
			}),
			{
				expiresIn: 300,
			},
		)
	}
}
