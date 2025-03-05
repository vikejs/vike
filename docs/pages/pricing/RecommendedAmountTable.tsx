import React from 'react';
import './RecommendedAmountTable.css';

const pricingData = [
  { 
    type: '≤2 regular committers', 
    small: 'Free', 
    midsize: 'Free', 
    large: 'Free' 
  },
  { 
    type: 'Hobby use<wbr></wbr> case ≥3 regular committers', 
    small: 'Free', 
    midsize: 'Free', 
    large: 'Free' 
  },
  { 
    type: 'Small use<wbr></wbr> case ≥3 regular committers', 
    small: '0-50$<wbr></wbr> / month', 
    midsize: '50-100$<wbr></wbr> / month', 
    large: '100-200$<wbr></wbr> / month' 
  },
  { 
    type: 'Midsize use<wbr></wbr> case ≥3 regular committers', 
    small: '50-100$<wbr></wbr> / month', 
    midsize: '100-200$<wbr></wbr> / month', 
    large: '200-500$<wbr></wbr> / month' 
  },
  { 
    type: 'Large use<wbr></wbr> case ≥3 regular committers', 
    small: '100-200$<wbr></wbr> / month', 
    midsize: '200-500$<wbr></wbr> / month', 
    large: '500-2000$<wbr></wbr> / month' 
  },
];

const RecommendedAmountTable = () => {
  return (
    <div className="table-container">
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
              <td className="row-header-cell">
                <div dangerouslySetInnerHTML={{ 
                  __html: row.type.replace(/≥3/g, '<span class="break-mobile">≥3</span>') 
                }} />
              </td>
              <td className="price-cell">
                {row.small}
                {row.small !== 'Free' && <div className="recommendation">Recommendation</div>}
              </td>
              <td className="price-cell">
                {row.midsize}
                {row.midsize !== 'Free' && <div className="recommendation">Recommendation</div>}
              </td>
              <td className="price-cell">
                {row.large}
                {row.large !== 'Free' && <div className="recommendation">Recommendation</div>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { RecommendedAmountTable };
