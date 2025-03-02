import React from 'react';

const amounts = [
  ['0-50', '50-100', '100-200'],  // Small organization
  ['50-100', '100-200', '200-500'],  // Midsize organization
  ['100-200', '200-500', '500-2000'],  // Large organization
];

const columns = ['Small organization', 'Midsize organization', 'Large organization'];
const specialRows = ['≤ 2 regular committers', 'Hobby use case'];
const normalRows = ['Small use case', 'Midsize use case', 'Large use case'];
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
                content = columns[j - 1];
                style = { ...style };
              } else if (j === 0 && i > 0) {
                content = rows[i - 1];
                style = { ...style, whiteSpace: 'nowrap' };
              } else if (i > 0 && j > 0) {
                const rowLabel = rows[i - 1];
                if (specialRows.includes(rowLabel)) {
                  content = <b>Free</b>;
                } else {
                  const normalRowIndex = i - specialRows.length - 1;
                  const amount = amounts[normalRowIndex][j - 1];
                  content = <b style={getAmountStyle(amount)}>{`${amount}$`}</b>;
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

function getAmountStyle(value: string) {
  return {}
  if (value === '500-2000') return { color: '#1e40af' }; // Dark Blue
  if (value === '200-500') return { color: '#1e3a8a' }; // Midsize Blue
  if (value === '100-200') return { color: '#065f46' }; // Dark Teal
  if (value === '50-100') return { color: '#0c4a6e' }; // Cyan
  if (value === '0-50') return { color: '#166534' }; // Dark Green
  return {};
}

function getArray(length: number): number[] {
  return Array.from({ length }, (_, i) => i);
}

const styles = {
  table: {
    borderCollapse: 'collapse',
    width: '100%',
    maxWidth: '600px',
    textAlign: 'center' as const,
    fontFamily: 'Arial, sans-serif',
    border: '1px solid #ddd',
  },
  cell: {
    padding: '25px 35px', // More padding for better readability
    border: '1px solid #ddd',
    fontSize: '16px',
  },
};

export { RecommendedAmountTable };

