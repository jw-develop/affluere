/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { TableRow, TableCell, TableHead, TableContainer, Table, Paper, TableBody, Button } from '@material-ui/core';
import driveClient from '../utils/driveClient';

export interface HoldingRow {
  symbol: string,
  holding: string,
  shares: string,
  price: string,
  value_current: string,
  total_change: string,
  total_perc: string,
  day_change: string,
  day_change_perc: string,
}

export default function HoldingsTable() {
  const [sheets, setSheets] = React.useState<string[]>(driveClient.getSheetNames());
  const [rows, setRows] = React.useState<HoldingRow[]>([{
    symbol: 'AZRE',
    holding: 'Azure Power Global Ltd',
    shares:	"8",
    price: "45.87",
    value_current: "358.9",
    total_change: "240.3",
    total_perc: "302.46",
    day_change: "-14.24",
    day_change_perc: "-3.82",
  }]);
  useEffect(()=>{
    updateRows()
    const interval=setInterval(()=>{
      updateRows()
     },10000)
     return()=>clearInterval(interval)
  },[]);
  function updateRows() {
    const rows = driveClient.getRows(sheets);
    if (rows) {
      setRows(rows);
      console.log("Updated");
    }
  }
  async function toggleSheet(s: string) {
    if (sheets.includes(s)) {
      setSheets(sheets.filter((x) => x !== s));
    } else {
      setSheets(sheets.concat([s]));
    }
  }
  return (
    <TableContainer component={Paper}>
      <Button onClick={() => updateRows()}>Refresh</Button>
      {driveClient.getSheetNames().map((s) => 
        <Button key={s} onClick={() => toggleSheet(s)}>{s.toLowerCase()}</Button>
      )}
      <Table aria-label="simple table" title={"Holdings Table"}>
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell align="left">Holding</TableCell>
            <TableCell align="left">Shares</TableCell>
            <TableCell align="left">Price</TableCell>
            <TableCell align="left">Current Value</TableCell>
            <TableCell align="left">Total Change</TableCell>
            <TableCell align="left">Total %</TableCell>
            <TableCell align="left">1D Change</TableCell>
            <TableCell align="left">1D %</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.filter(r => r).map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">{row.symbol}</TableCell>
              <TableCell align="left">{row.holding}</TableCell>
              <TableCell align="left">{row.shares}</TableCell>
              <TableCell align="left">{row.price}</TableCell>
              <TableCell align="left">{row.value_current}</TableCell>  
              <TableCell align="left">{row.total_change}</TableCell>
              <TableCell align="left">{row.total_perc}</TableCell>
              <TableCell align="left">{row.day_change}</TableCell>
              <TableCell align="left">{row.day_change_perc}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
