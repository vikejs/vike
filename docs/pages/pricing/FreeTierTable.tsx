import React from 'react';

function FreeTierTable() {
  return (
    <table style={styles.table}>
      <tbody>
        <tr>
          <th style={styles.header} colSpan={2}>
            Regular Committers <br />
            <span style={styles.subtext}>in the last 3 months</span>
          </th>
        </tr>
        <tr>
          <th style={styles.subheader}>Committers</th>
          <th style={styles.subheader}>Price</th>
        </tr>
        <tr>
          <td style={styles.cell}>&lt; 3</td>
          <td style={styles.cell}><b>Free</b></td>
        </tr>
        <tr>
          <td style={styles.cell}>≥ 3</td>
          <td style={styles.cell}><b>&gt;0$</b></td>
        </tr>
      </tbody>
    </table>
  );
}

const styles = {
  table: {
    borderCollapse: 'collapse',
    width: '100%',
    maxWidth: '300px',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    border: '1px solid #ddd',
  },
  header: {
    fontSize: '16px',
    fontWeight: 'bold',
    padding: '12px',
    backgroundColor: '#f4f4f4',
    borderBottom: '2px solid #ccc',
  },
  subheader: {
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderBottom: '1px solid #ddd',
  },
  subtext: {
    fontSize: '12px',
    color: '#666',
    fontWeight: 'normal',
  },
  cell: {
    padding: '10px',
    border: '1px solid #ddd',
  },
};

export { FreeTierTable };
