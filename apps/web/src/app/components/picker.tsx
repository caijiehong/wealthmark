import { Form, Picker, PickerRef } from "antd-mobile";
import { PickerColumn } from "antd-mobile/es/components/picker-view";
import { RefObject, useState } from "react";
interface FormPickerProps {
  formItemName: string;
  formItemLabel: string;
  columns: PickerColumn[];
}
const FormPicker: React.FC<FormPickerProps> = ({
  formItemName,
  formItemLabel,
  columns,
}) => {
  return (
    <Form.Item
      rules={[{ required: true, message: `请选择${formItemLabel}` }]}
      name={formItemName}
      label={formItemLabel}
      trigger="onConfirm"
      valuePropName="value"
      getValueFromEvent={(v) => (v ? v[0] : "")}
      getValueProps={(v) => (v ? v[0] : "")}
      onClick={(e, datePickerRef: RefObject<PickerRef>) => {
        datePickerRef.current?.open();
      }}
    >
      <Picker columns={columns}>
        {(value) => (value && value[0] ? value[0].label : "请选择")}
      </Picker>
    </Form.Item>
  );
};

export default FormPicker;
