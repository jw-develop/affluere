/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { TableRow, TableCell, TableHead, TableContainer, Table, Paper, TableBody, Button } from '@material-ui/core';
import driveClient from '../utils/DriveClient';

interface HoldingRow {
  symbol: string,
  holding: string,
  shares: number,
  price: number,
  change: number,
  value: number
}

export default function HoldingsTable() {
  const [rows, setRows] = React.useState<HoldingRow[]>([]);
  updateRows();
  useEffect(() => {
    updateRows();
  }, [rows]);
  async function updateRows() {
    const rows: HoldingRow[] = await driveClient.list();
    setRows(rows);
  }
  return (
    <TableContainer component={Paper}>
      <Button onClick={(e) => updateRows()}>Refresh</Button>
      <Table aria-label="simple table" title={"Holdings Table"}>
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell align="left">Holding</TableCell>
            <TableCell align="left">Shares</TableCell>
            <TableCell align="left">Price</TableCell>
            <TableCell align="left">Change</TableCell>
            <TableCell align="left">Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rows || []).map((row) => (
            <TableRow key={row.symbol}>
              <TableCell component="th" scope="row">{row.symbol}</TableCell>
              <TableCell align="left">{row.holding}</TableCell>
              <TableCell align="left">{row.shares}</TableCell>
              <TableCell align="left">{row.price}</TableCell>
              <TableCell align="left">{row.change}</TableCell>
              <TableCell align="left">{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
