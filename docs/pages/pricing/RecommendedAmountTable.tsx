export { RecommendedAmountTable }

import React from 'react'

const amounts = [
  ['0-50', '50-100', '100-200'],  // Small company
  ['50-100', '100-200', '200-500'],  // Medium company
  ['100-200', '200-500', '500-2000'],  // Large company
]

const columns = ['Small company', 'Medium company', 'Large company']
const rows = ['Small use case', 'Medium use case', 'Large use case']

function RecommendedAmountTable() {
  return (
    <table>
      <tbody>
        {getArray(rows.length + 1).map((i) => (
          <tr key={i}>
            {getArray(columns.length + 1).map((j) => {
              let content: string | React.JSX.Element = '';

              if (i === 0 && j > 0) {
                content = columns[j - 1]; // Header row
              } else if (j === 0 && i > 0) {
                content = rows[i - 1]; // Header column
              } else if (i > 0 && j > 0) {
                content = formatAmount(amounts[i - 1][j - 1]); // Format value
              }

              return <td key={j}>{content}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function formatAmount(value: string) {
  if (value === 'Free') return <b>{value}</b>;
  if (isNumericRange(value)) return <b>{`${value}$`}</b>;
  return value;
}

function isNumericRange(value: string): boolean {
  return /^\d+(-\d+)?$/.test(value); // Matches "50", "50-100", "500-2000", etc.
}

function getArray(length: number): number[] {
  return Array.from({ length }, (_, i) => i);
}
