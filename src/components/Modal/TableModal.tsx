import React from 'react';
import { Modal, Form, Input, InputNumber, DatePicker } from 'antd';
import dayjs from 'dayjs';

interface TableModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  initialValues?: any;
}

const TableModal: React.FC<TableModalProps> = ({ visible, onCancel, onOk, initialValues }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue({
      ...initialValues,
      date: initialValues?.date ? dayjs(initialValues.date, 'YYYY-MM-DD') : undefined
    });
  }, [initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk(values);
      form.resetFields()
    } catch (err) {
      console.error('Validation failed:', err);
    }
  };

  return (
    <Modal
      title={initialValues ? 'Edit Row' : 'Add Row'}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      centered
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Введите имя' }, { max: 50, message: 'Слишком длинное имя' }]}
        >
          <Input placeholder="Введите имя" />
        </Form.Item>

        <Form.Item name="date" label="Date" rules={[{ required: true, message: 'Выберите дату' }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="value"
          label="Value"
          rules={[
            { required: true, message: 'Введите число' },
            { type: 'number', min: 0, max: 100000, message: 'Значение должно быть числом от 0 до 100000' }
          ]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TableModal;
