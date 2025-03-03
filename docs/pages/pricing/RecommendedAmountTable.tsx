import React from 'react';

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
    padding: '15px 35px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  subtext: {
    fontSize: '12px',
    fontWeight: 'normal',
    color: '#6b7280',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'baseline',
    whiteSpace: 'nowrap', // Prevents line break
    justifyContent: 'center',
    gap: '5px',
  },
  priceSubtext: {
    fontSize: '13px',
    color: '#6b7280',
  },
  recommendation: {
    fontSize: '12px',
    color: '#666',
    marginTop: '2px',
  },
};

const amounts = [
  ['0-50', '50-100', '100-200'],  // Small organization
  ['50-100', '100-200', '200-500'],  // Midsize organization
  ['100-200', '200-500', '500-2000'],  // Large organization
];

const columns = ['Small organization', 'Midsize organization', 'Large organization'];
const specialRows = ['≤2 regular committers', 'Hobby use case'];
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
              } else if (j === 0 && i > 0) {
                content = (
                  <>
                    {rows[i - 1]}
                    {/* Add "≥3 regular committers" subtext under Hobby Use Case and all "... use case" rows */}
                    {rows[i - 1] !== '≤2 regular committers' && (
                      <div style={styles.subtext}>≥3 regular committers</div>
                    )}
                  </>
                );
                style = { ...style, whiteSpace: 'nowrap', textAlign: 'left' };
              } else if (i > 0 && j > 0) {
                const rowLabel = rows[i - 1];

                if (specialRows.includes(rowLabel)) {
                  content = <b>Free</b>;
                } else {
                  const normalRowIndex = i - specialRows.length - 1;
                  if (normalRowIndex >= 0 && normalRowIndex < amounts.length) {
                    const amount = amounts[normalRowIndex][j - 1];
                    content = (
                      <>
                        <div style={styles.priceContainer}>
                          <b style={getAmountStyle(amount)}>{`${amount}$`}</b>
                          <span style={styles.priceSubtext}>/ month</span>
                        </div>
                        <div style={styles.recommendation}>Recommendation</div>
                      </>
                    );
                  }
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
  return {};
}

function getArray(length: number): number[] {
  return Array.from({ length }, (_, i) => i);
}

export { RecommendedAmountTable };

