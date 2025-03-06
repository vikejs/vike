// RecommendedAmountTable.tsx
import React from 'react';
import './RecommendedAmountTable.css';

const amounts = [
  ['15 - 50$', '15 - 100$', '15 - 200$'],
  ['50 - 100$', '100 - 200$', '200 - 500$'],
  ['100 - 200$', '200 - 500$', '500 - 2000$']
];

const columns = ['Small organization', 'Midsize organization', 'Large organization'];
const specialRows = ['≤2\u00a0regular\u00a0committers', 'Hobby\u00a0use\u00a0case'];
const normalRows = [
  'Small\u00a0use\u00a0case|≥3\u00a0regular\u00a0committers',
  'Midsize\u00a0use\u00a0case|≥3\u00a0regular\u00a0committers',
  'Large\u00a0use\u00a0case|≥3\u00a0regular\u00a0committers'
];

const rows = [...specialRows, ...normalRows];

const RecommendedAmountTable = () => {
  return (
    <div className="table-container">
      <table className="responsive-table">
        <thead>
          <tr>
            <th className="row-header"></th>
            {columns.map((col, index) => (
              <th key={index} className="column-header">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => {
            const [mainText, subText] = row.split('|');
            return (
              <tr key={rowIndex}>
                <td className="row-header">
                  <div className="main-text">{mainText}</div>
                  {subText && <div className="subtext">{subText}</div>}
                </td>
                {columns.map((_, colIndex) => (
                  <td key={colIndex} className="price-cell">
                    {rowIndex < specialRows.length ? (
                      <strong>Free</strong>
                    ) : (
                      <>
                        <div className="price-container">
                          <strong>
                            {amounts[rowIndex - specialRows.length][colIndex].replace('$', '')}
                          </strong>
                          <span className="price-subtext">/month</span>
                        </div>
                        <div className="recommendation">Recommended</div>
                      </>
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export { RecommendedAmountTable }
