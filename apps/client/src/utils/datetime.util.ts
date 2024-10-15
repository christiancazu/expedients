export const dateUtil = {
  formatDate: (_date: Date) => {
    const date = new Date(_date)

    return `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()} ${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}`
  }
}
