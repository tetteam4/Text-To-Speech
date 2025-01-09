// client/src/components/ui/Table.jsx
import React from "react";

function Table({ columns, data, emptyMessage = "No data available" }) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full divide-y divide-gray-200 border-collapse w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data && data.length > 0 ? (
            data.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 "
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
