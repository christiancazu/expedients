export * from './datetime.util'
export * from './persister.util'

export enum ORDER_SPRITES {
	pdf = 1,
	docx = 2,
	doc = 3,
	xls = 4,
	xlsx = 5,
	txt = 6,
	csv = 7,
}

export function getSpritePositionX(extension: string | undefined) {
	return +(ORDER_SPRITES[extension as unknown as ORDER_SPRITES] ?? 0) * -32
}
