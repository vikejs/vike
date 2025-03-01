import React from 'react';

// Amounts for the normal rows (for Small, Medium and Large use cases)
const amounts = [
  ['0-50', '50-100', '100-200'],  // Small company amounts for Small use case
  ['50-100', '100-200', '200-500'], // Small company amounts for Medium use case
  ['100-200', '200-500', '500-2000'],// Small company amounts for Large use case
];

const columns = ['Small company', 'Medium company', 'Large company'];

// Define special rows and normal rows separately.
const specialRows = ['<=2 regular committers', 'Hobby use case'];
const normalRows = ['Small use case', 'Medium use case', 'Large use case'];

// Combined rows: first the special ones, then the normal ones.
const rows = specialRows.concat(normalRows);

function RecommendedAmountTable() {
  return (
    <table>
      <tbody>
        {/* Build rows including a header row */}
        {getArray(rows.length + 1).map((i) => (
          <tr key={i}>
            {getArray(columns.length + 1).map((j) => {
              let content: string | React.JSX.Element = '';

              // Top-left cell remains empty; top row renders column headers.
              if (i === 0 && j > 0) {
                content = columns[j - 1];
              }
              // First column of every non-header row renders the row label.
              else if (j === 0 && i > 0) {
                content = rows[i - 1];
              }
              // For data cells (i>0, j>0)
              else if (i > 0 && j > 0) {
                const rowLabel = rows[i - 1];
                // For special rows, always show "Free"
                if (specialRows.includes(rowLabel)) {
                  content = <b>Free</b>;
                } else {
                  // For normal rows, calculate the index within amounts.
                  // Since specialRows occupy the first positions,
                  // the normal row index = (current row index - number of special rows - 1)
                  const normalRowIndex = i - specialRows.length - 1;
                  content = formatAmount(amounts[normalRowIndex][j - 1]);
                }
              }

              return <td key={j}>{content}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function formatAmount(value: string) {
  // If the value is a numeric range, append '$' and bold it.
  if (isNumericRange(value)) return <b>{`${value}$`}</b>;
  return value;
}

function isNumericRange(value: string): boolean {
  return /^\d+(-\d+)?$/.test(value);
}

function getArray(length: number): number[] {
  return Array.from({ length }, (_, i) => i);
}

export { RecommendedAmountTable };

