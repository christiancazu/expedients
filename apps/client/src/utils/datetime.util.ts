import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)
const dateFormat = 'YYYY-MM-DD HH:mm'

export const dateUtil = {
  formatDate: (_date: Date | string) => {
    const date = new Date(_date)
    return `${dayjs(date).format(dateFormat)}`
  }
}
