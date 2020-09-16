import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';

const tableConfig = {
  columns: [
    { title: 'שם', field: 'name' },
    { title: 'תפקיד', field: 'role' },
    { title: 'פעולה', field: 'operation' },
    { title: 'תאריך', field: 'date' },
    { title: 'ארגון', field: 'organization' },
  ],
  tableOptions: {
    search: true,
    actionsColumnIndex: -1,
    headerStyle: {
      color: '#000',
      fontSize: '16px',
      fontWeight: 'bold',
    },
  },
};

const Statistics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchStatistics = async () => {
    const response = await axios.get('/api/statistics');
    const { statistics } = response.data;
    setData(statistics);
    setLoading(false);
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return (
    <div className="container">
      <MaterialTable
        title="היסטוריית פעילות"
        columns={tableConfig.columns}
        data={data}
        options={tableConfig.tableOptions}
        isLoading={loading}
        onRowClick={(event, row) => {
          setSelectedRow({ selectedRow: row.tableData.id });
        }}
      />
    </div>
  );
};

export default Statistics;
