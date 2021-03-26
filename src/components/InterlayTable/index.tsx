// @ts-nocheck
import { useTable } from 'react-table';
import clsx from 'clsx';

import styles from './interlay-table.module.css';

// TODO: should type properly (Re:https://github.com/tannerlinsley/react-table/blob/master/TYPESCRIPT.md)
const InterlayTable = ({
  className,
  columns,
  data
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns,
    data
  });

  return (
    <div
      className={clsx(
        'overflow-scroll',
        className
      )}>
      <table
        className={styles['interlay-table']}
        {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);

            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InterlayTable;