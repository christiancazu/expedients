import mime from 'mime'

export const utils = {
	getMimeExtension: (mimetype: string) => {
		return mime.getExtension(mimetype)
	},
}
