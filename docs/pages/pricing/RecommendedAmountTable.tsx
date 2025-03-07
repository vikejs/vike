export { RecommendedAmountTable }

import React from 'react'
import './RecommendedAmountTable.css'

const amounts = [
  ['1$ - 50$', '1$ - 100$', '1$ - 200$'],
  ['50$ - 100$', '100$ - 200$', '200$ - 500$'],
  ['100$ - 200$', '200$ - 500$', '500$ - 1000$']
].map((row) => row.map((str) => str.replaceAll(' ', '\u00a0')))

const columns = ['Small organization', 'Midsize organization', 'Large organization']
const rowsFree = ['≤2\u00a0regular committers', 'Hobby use\u00a0case']
const rowsPaid = ['Small use\u00a0case', 'Midsize use\u00a0case', 'Large use\u00a0case']
const subText = '≥3\u00a0regular committers'

const rows = [...rowsFree, ...rowsPaid]

const RecommendedAmountTable = () => {
  return (
    <div className="table-container">
      <table className="responsive-table">
        <tbody>
          <tr>
            <td className="row-header"></td>
            {columns.map((col, index) => (
              <td key={index} className="column-header">
                {col}
              </td>
            ))}
          </tr>
          {rows.map((row, rowIndex) => {
            return (
              <tr key={rowIndex}>
                <td className="row-header">
                  {row}
                  {rowIndex > 0 && <div className="subtext">{subText}</div>}
                </td>
                {columns.map((_, colIndex) => (
                  <td key={colIndex} className="price-cell">
                    {rowIndex < rowsFree.length ? (
                      <strong>Free</strong>
                    ) : (
                      <>
                        <div className="price-container">
                          <strong>{amounts[rowIndex - rowsFree.length][colIndex]}</strong>
                          <span className="price-subtext">&nbsp;/&nbsp;month</span>
                        </div>
                        <div className="recommendation">Recommended</div>
                      </>
                    )}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
