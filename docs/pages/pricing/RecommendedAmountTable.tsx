import React from 'react';

const amounts = [
  ['0-50', '50-100', '100-200'],  // Small organization
  ['50-100', '100-200', '200-500'],  // Medium organization
  ['100-200', '200-500', '500-2000'],  // Large organization
];

const columns = ['Small organization', 'Medium organization', 'Large organization'];
const specialRows = ['≤ 2 regular committers', 'Hobby use case'];
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
              let style = styles.cell;

              if (i === 0 && j > 0) {
                // Column headers.
                content = columns[j - 1];
                style = { ...style, fontWeight: 'bold', backgroundColor: '#f8f9fa' };
              } else if (j === 0 && i > 0) {
                // Row labels (first column, prevent line breaks)
                content = rows[i - 1];
                style = { ...style, fontWeight: 'bold', whiteSpace: 'nowrap' };
              } else if (i > 0 && j > 0) {
                const rowLabel = rows[i - 1];
                if (specialRows.includes(rowLabel)) {
                  content = <b>Free</b>;
                  style = { ...style, backgroundColor: '#d4edda', color: '#155724' };
                } else {
                  const normalRowIndex = i - specialRows.length - 1;
                  const amount = amounts[normalRowIndex][j - 1];
                  content = formatAmount(amount);
                  style = { ...style, ...getAmountStyle(amount) };
                }
              }

              return (
                <td key={j} style={style}>
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

function getAmountStyle(value: string) {
  if (value === '500-2000') {
    return { backgroundColor: '#cce5ff', color: '#004085' }; // Fully blue
  }
  if (value === 'Free') {
    return { backgroundColor: '#d4edda', color: '#155724' }; // Fully green
  }
  // Gradient between green and blue
  return {
    background: 'linear-gradient(to right, #d4edda, #cce5ff)',
    color: '#0c5460',
  };
}

function getArray(length: number): number[] {
  return Array.from({ length }, (_, i) => i);
}

const styles = {
  table: {
    borderCollapse: 'collapse',
    width: '100%',
    maxWidth: '600px',
    margin: '20px auto',
    textAlign: 'center' as const,
    fontFamily: 'Arial, sans-serif',
    border: '1px solid #ddd',
  },
  cell: {
    padding: '15px 20px', // Increased padding for better spacing
    border: '1px solid #ddd',
  },
};

export { RecommendedAmountTable };

