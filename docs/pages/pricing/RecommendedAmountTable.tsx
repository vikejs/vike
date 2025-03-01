import React from 'react';

const amounts = [
  ['0-50', '50-100', '100-200'],  // Small organization amounts for Small use case
  ['50-100', '100-200', '200-500'], // Medium use case
  ['100-200', '200-500', '500-2000'],// Large use case
];

const columns = ['Small organization', 'Medium organization', 'Large organization'];
const specialRows = ['<=2 regular committers', 'Hobby use case'];
const normalRows = ['Small use case', 'Medium use case', 'Large use case'];
const rows = specialRows.concat(normalRows);

function RecommendedAmountTable() {
  return (
    <table style={styles.table}>
      <tbody>
        {getArray(rows.length + 1).map((i) => (
          <tr key={i}>
            {getArray(columns.length + 1).map((j) => {
              let content: string | React.JSX.Element = '';

              if (i === 0 && j > 0) {
                // Column headers.
                content = columns[j - 1];
              } else if (j === 0 && i > 0) {
                // Row labels (first column, prevent line breaks)
                content = rows[i - 1];
              } else if (i > 0 && j > 0) {
                const rowLabel = rows[i - 1];
                if (specialRows.includes(rowLabel)) {
                  content = <b>Free</b>;
                } else {
                  // Adjust index for normal rows.
                  const normalRowIndex = i - specialRows.length - 1;
                  content = formatAmount(amounts[normalRowIndex][j - 1]);
                }
              }

              return (
                <td key={j} style={{ 
                  ...styles.cell, 
                  ...(j === 0 ? styles.noWrap : {}), // No wrapping for first column
                  ...(i === 0 ? styles.wrap : {}) // Allow wrapping for the first row
                }}>
                  {content}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function formatAmount(value: string) {
  if (isNumericRange(value)) return <b>{`${value}$`}</b>;
  return value;
}

function isNumericRange(value: string): boolean {
  return /^\d+(-\d+)?$/.test(value);
}

function getArray(length: number): number[] {
  return Array.from({ length }, (_, i) => i);
}

const styles = {
  table: {
    borderCollapse: 'collapse',
    width: '100%',
    maxWidth: '500px',
    margin: '20px auto',
    textAlign: 'center' as const,
    fontFamily: 'Arial, sans-serif',
    border: '1px solid #ddd',
  },
  cell: {
    padding: '10px 15px',
    border: '1px solid #ddd',
  },
  noWrap: {
    whiteSpace: 'nowrap', // Prevent line breaks in first column
  },
  wrap: {
    whiteSpace: 'normal', // Allow line breaks in first row
  },
};

export { RecommendedAmountTable };

