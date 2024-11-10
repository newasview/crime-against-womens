import React, { useMemo, useState } from "react";
import { Link } from 'react-router-dom';
import { useTable, useSortBy } from "react-table";

const SortableTable = ({ data }) => {
  // Table columns definition
  const columns = useMemo(
    () => [
      {
        Header: ()=> <><div>State</div><div className="th-head">Name of the State/UT</div></>,
        accessor: "state", // The field name in the data
        Cell: ({ value }) => (
          <Link to={`/state/${value}`}>
          {value}
        </Link>
        ), // Custom link for the state
      },
      {
        Header: ()=> <><div>Year</div><div className="th-head">Year the crimes recorded</div></>,
        accessor: "year",
        Cell: ({ value }) => <span>{value}</span>, // Format crime rate
      },
      {
        Header: ()=> <><div>Rape</div><div className="th-head">No. Of Rape Cases</div></>,
        accessor: "rape",
        Cell: ({ value }) => <span>{value}</span>, // Format crime rate
      },
      {
        Header: ()=> <><div>DD</div><div className="th-head">Dowry Deaths</div></>,
        accessor: "dd",
        Cell: ({ value }) => <span>{value}</span>, // Format crime rate
      },
      {
        Header: ()=> <><div>AoW</div><div className="th-head">Assault against Women</div></>,
        accessor: "aow",
        Cell: ({ value }) => <span>{value}</span>, // Format crime rate
      },
      {
        Header: ()=> <><div>AoM</div><div className="th-head">Assault against Modesty of Women</div></>,
        accessor: "aom",
        Cell: ({ value }) => <span>{value}</span>, // Format crime rate
      },
      {
        Header: ()=> <><div>DV</div><div className="th-head">Domestic Violence</div></>,
        accessor: "dv",
        Cell: ({ value }) => <span>{value}</span>, // Format crime rate
      },
      {
        Header: ()=> <><div>WT</div><div className="th-head">Women Trafficking</div></>,
        accessor: "wt",
        Cell: ({ value }) => <span>{value}</span>, // Format crime rate
      },
    ],
    []
  );

  // Sorting table data
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { sortBy },
    setSortBy,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy // Hook for sorting
  );

  return (
    <div>
      <table {...getTableProps()} className='crime-table'>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={{
                    border: "1px solid black",
                    padding: "10px",
                    cursor: "pointer",
                    backgroundColor: sortBy.some(s => s.id === column.id && s.desc)
                      ? "#f4f4f4"
                      : "",
                  }}
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      border: "1px solid black",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    {cell.render("Cell")}
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

export default SortableTable;