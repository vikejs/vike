import React from 'react';

function FreeTierTable() {
  return (
    <table>
      <tbody>
        <tr>
          <td>Regular Committers
    <br/>
    in the last 3 months</td>
          <td></td>
        </tr>
        <tr>
          <td>&lt; 3</td>
          <td><b>Free</b></td>
        </tr>
        <tr>
          <td>≥ 3</td>
          <td><b>&gt;0$</b></td>
        </tr>
      </tbody>
    </table>
  );
}

export { FreeTierTable };

