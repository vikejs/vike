export { RecommendedAmountTable }

import React from 'react'

const amounts = ['50-200', '200-500', '500-2000']
const columns = ['Small company', 'Medium-sized company', 'Large company']
const rows = ['Small app', 'Medium-sized app', 'Large app']

function RecommendedAmountTable() {
  return (
    <table>
      {getArray(amounts.length + 1).map((i) => (
        <tr>
          {getArray(amounts.length + 1).map((j) => (
            <td>
              {(() => {
                if (i === 0) {
                  return j === 0 ? '' : columns[j]
                }
                if (j === 0) {
                  return i === 0 ? rows : amounts[(i + j) / 2]
                }
              })()}
            </td>
          ))}
        </tr>
      ))}
    </table>
  )
}

function getArray(length: number): number[] {
  return Array(length)
    .fill(null)
    .map((_, i) => i)
}
