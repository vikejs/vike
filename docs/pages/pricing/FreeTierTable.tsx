import React from 'react';

function FreeTierTable() {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={{ ...styles.subheader, ...styles.wideColumn }}>
      <div style={styles.caption}>
        Regular Committers
        <br />
        <span style={styles.subtext}>in the last 3 months</span>
      </div>
    </th>
          <th style={{ ...styles.subheader, ...styles.narrowColumn }}>Price</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td style={styles.cell}>&le; 2</td>
          <td style={styles.cell}><b>Free</b></td>
        </tr>
        <tr>
          <td style={styles.cell}>&ge; 3</td>
          <td style={styles.cell}><b>&gt;0$</b></td>
        </tr>
      </tbody>
    </table>
  );
}

const styles: Record<string, React.CSSProperties> = {
  table: {
    borderCollapse: 'collapse',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    border: '1px solid #ddd',
    tableLayout: 'fixed', // Lets you fix column widths
    margin: '0 auto',     // Centers table horizontally
  },
  caption: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  subheader: {
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    padding: '12px',
    border: '1px solid #ddd',
  },
  subtext: {
    fontSize: '13px',
    color: '#666',
    fontWeight: 'normal',
  },
  cell: {
    padding: '12px',
    border: '1px solid #ddd',
  },
  wideColumn: {
    width: '60%',
  },
  narrowColumn: {
    width: '40%',
  },
};

export { FreeTierTable };

