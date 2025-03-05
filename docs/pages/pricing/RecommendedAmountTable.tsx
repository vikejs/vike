// RecommendedAmountTable.tsx
import React from 'react';
import './RecommendedAmountTable.css';

const pricingData = [
  { type: '≤2 regular committers', small: 'Free', midsize: 'Free', large: 'Free' },
  { type: 'Hobby use case ≥3 regular committers', small: 'Free', midsize: 'Free', large: 'Free' },
  { type: 'Small use case ≥3 regular committers', small: '0-50$ / month', midsize: '50-100$ / month', large: '100-200$ / month' },
  { type: 'Midsize use case ≥3 regular committers', small: '50-100$ / month', midsize: '100-200$ / month', large: '200-500$ / month' },
  { type: 'Large use case ≥3 regular committers', small: '100-200$ / month', midsize: '200-500$ / month', large: '500-2000$ / month' },
];

const RecommendedAmountTable = () => {
  return (
    <div className="pricing-table-container">
      <table className="pricing-table">
        <thead>
          <tr>
            <th className="row-header"></th>
            <th className="column-header">Small organization</th>
            <th className="column-header">Midsize organization</th>
            <th className="column-header">Large organization</th>
          </tr>
        </thead>
        <tbody>
          {pricingData.map((row, index) => (
            <tr key={index}>
              <td className="row-header-cell">{row.type}</td>
              <td className="price-cell">
                {row.small}
                {!row.small.includes('Free') && <div className="recommendation">Recommendation</div>}
              </td>
              <td className="price-cell">
                {row.midsize}
                {!row.midsize.includes('Free') && <div className="recommendation">Recommendation</div>}
              </td>
              <td className="price-cell">
                {row.large}
                {!row.large.includes('Free') && <div className="recommendation">Recommendation</div>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { RecommendedAmountTable }
