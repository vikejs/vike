import React from 'react'
import './table.css'

const amounts = [
  ['1$ - 50$',  '1$ - 100$',  '1$ - 200$'],   // For "Small organization"
  ['50$ - 100$', '100$ - 200$', '200$ - 500$'], // For "Midsize organization"
  ['100$ - 200$', '200$ - 500$', '500$ - 2000$'] // For "Large organization"
]

// Split "organization" onto two lines, remove any "|"
const columns = [
  'Small<br/>organization',
  'Midsize<br/>organization',
  'Large<br/>organization'
]

const specialRows = ['≤2 regular committers', 'Hobby use case']
const normalRows = ['Small use case', 'Midsize use case', 'Large use case']
const rows = specialRows.concat(normalRows)

function RecommendedAmountTable() {
  return (
    <table className="table">
      <tbody>
        {/* rowIndex 0 = header row */}
        {getArray(rows.length + 1).map((rowIndex) => (
          <tr key={rowIndex}>
            {getArray(columns.length + 1).map((colIndex) => {
              let content: string | React.ReactNode = ''
              let className = 'cell'

              // Header row
              if (rowIndex === 0 && colIndex > 0) {
                return (
                  <td
                    key={colIndex}
                    className={className}
                    // Allow <br/> in the column titles
                    dangerouslySetInnerHTML={{ __html: columns[colIndex - 1] }}
                  />
                )
              }
              // First column (row labels)
              else if (colIndex === 0 && rowIndex > 0) {
                const rowLabel = rows[rowIndex - 1]
                content = (
                  <>
                    {rowLabel}
                    {rowLabel !== '≤2 regular committers' && (
                      <div className="subtext">≥3 regular committers</div>
                    )}
                  </>
                )
                return (
                  <td key={colIndex} className={className}>
                    {content}
                  </td>
                )
              }
              // Table body cells
              else if (rowIndex > 0 && colIndex > 0) {
                const rowLabel = rows[rowIndex - 1]
                if (specialRows.includes(rowLabel)) {
                  // "Free" tier
                  content = <b>Free</b>
                } else {
                  // Normal row with recommended amounts
                  const normalRowIndex = rowIndex - specialRows.length - 1
                  if (normalRowIndex >= 0 && normalRowIndex < amounts.length) {
                    const amount = amounts[normalRowIndex][colIndex - 1]
                    content = (
                      <>
                        <div className="priceContainer">
                          {/* Keep price range on one line */}
                          <span className="priceAmount">{amount}</span>
                          {/* / month might wrap on small screens */}
                          <span className="priceSubtext">/ month</span>
                        </div>
                        <div className="recommendation">Recommendation</div>
                      </>
                    )
                  }
                }
              }

              return (
                <td key={colIndex} className={className}>
                  {content}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function getArray(length: number): number[] {
  return Array.from({ length }, (_, i) => i)
}

export { RecommendedAmountTable }
