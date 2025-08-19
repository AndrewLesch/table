import React, { useState } from 'react';
import { Table, Button, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import { useLocalStorage } from '../../hooks/useLocalStorage';
import SearchInput from '../SearchInput/SearchInput';
import TableModal from '../Modal/TableModal';

interface RowType {
  key: string;
  name: string;
  date: string;
  value: number;
}

const TableComponent: React.FC = () => {
  const [data, setData] = useLocalStorage<RowType[]>('tableData', []);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRow, setEditingRow] = useState<RowType | null>(null);

  const openAddModal = () => {
    setEditingRow(null);
    setModalVisible(true);
  };

  const openEditModal = (row: RowType) => {
    setEditingRow(row);
    setModalVisible(true);
  };

  const handleDelete = (key: string) => {
    setData(data.filter(d => d.key !== key));
    message.success('Row deleted');
  };

  const handleModalOk = (values: any) => {
    const newRow: RowType = {
      key: editingRow?.key || Date.now().toString(),
      name: values.name.trim(),
      date: values.date.format('YYYY-MM-DD'),
      value: values.value
    };

    if (editingRow) {
      setData(data.map(d => (d.key === editingRow.key ? newRow : d)));
      message.success('Row updated');
    } else {
      setData([...data, newRow]);
      message.success('Row added');
    }

    setModalVisible(false);
  };

  const filteredData = data.filter(row => {
    const lowerSearch = search.toLowerCase().trim();

    return Object.values(row).some(value => 
      value
        .toString() 
        .toLowerCase()
        .includes(lowerSearch)
    );
  });

  const columns: ColumnsType<RowType> = [
    { title: 'Name', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Date', dataIndex: 'date', sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() },
    { title: 'Value', dataIndex: 'value', sorter: (a, b) => a.value - b.value },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEditModal(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.key)} />
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 20 }}>
      <SearchInput value={search} onChange={setSearch} />
      <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal} style={{ marginBottom: 16 }}>
        Add
      </Button>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="key"
        scroll={{ x: 'max-content' }}
        rowClassName={() => 'fade-row'}
      />

      <TableModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleModalOk}
        initialValues={editingRow || undefined}
      />
    </div>
  );
};

export default TableComponent;
