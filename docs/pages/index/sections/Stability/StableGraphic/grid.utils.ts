export type VikeComponentSize = 'big' | 'small'
export type VikeEcoComponentCategory = 'framework' | 'api' | 'deploy' | 'server'

export const ecoComponentCategoryNames: Record<VikeEcoComponentCategory, string> = {
  framework: 'UI Framework',
  api: 'API',
  deploy: 'Deployment',
  server: 'Server',
}

export type VikeComponent = {
  name: string
  link: string
  size: VikeComponentSize
}

export const estimateWidth = (component: VikeComponent) =>
  component.name.replaceAll('`', '').length + (component.size === 'big' ? 8 : 6)

export const splitIntoRows = (items: VikeComponent[], targetRowCount: number) => {
  if (items.length <= targetRowCount) {
    return items.map((item) => [item])
  }

  const widths = items.map(estimateWidth)
  const totalWidth = widths.reduce((sum, width) => sum + width, 0)
  const targetWidth = totalWidth / targetRowCount

  let bestRows: VikeComponent[][] = [items]
  let bestScore = Number.POSITIVE_INFINITY

  const buildRows = (splitIndexes: number[]) => {
    const rows: VikeComponent[][] = []
    let startIndex = 0

    splitIndexes.forEach((endIndex) => {
      rows.push(items.slice(startIndex, endIndex))
      startIndex = endIndex
    })

    return rows
  }

  const scoreRows = (rows: VikeComponent[][]) =>
    rows.reduce((score, row) => {
      const rowWidth = row.reduce((sum, item) => sum + estimateWidth(item), 0)
      const singleItemPenalty = row.length === 1 ? targetWidth * 10 : 0
      const shortRowPenalty = row.length === 2 ? targetWidth * 1.5 : 0

      return score + Math.abs(rowWidth - targetWidth) + singleItemPenalty + shortRowPenalty
    }, 0)

  const search = (startIndex: number, rowsLeft: number, splitIndexes: number[]) => {
    if (rowsLeft === 1) {
      const rows = buildRows([...splitIndexes, items.length])
      const score = scoreRows(rows)

      if (score < bestScore) {
        bestScore = score
        bestRows = rows
      }

      return
    }

    const minSplitIndex = startIndex + 1
    const maxSplitIndex = items.length - (rowsLeft - 1)

    for (let splitIndex = minSplitIndex; splitIndex <= maxSplitIndex; splitIndex++) {
      search(splitIndex, rowsLeft - 1, [...splitIndexes, splitIndex])
    }
  }

  search(0, targetRowCount, [])

  return bestRows
}
