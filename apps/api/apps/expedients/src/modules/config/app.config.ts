import { registerAs } from '@nestjs/config'
import { rootPath } from './dotenv'

export const { MEDIA_FOLDER } = process.env
export const ROOT_FOLDER = rootPath

const appConfig = registerAs('path', async () => ({
	root: ROOT_FOLDER,
	media: MEDIA_FOLDER,
}))

export default appConfig
