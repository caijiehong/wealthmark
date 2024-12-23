import { Form, Picker, PickerRef } from "antd-mobile";
import { PickerColumn } from "antd-mobile/es/components/picker-view";
import { RefObject } from "react";
interface FormPickerProps {
  formItemName: string;
  formItemLabel: string;
  columns: PickerColumn[];
  disabled?: boolean;
}
const FormPicker: React.FC<FormPickerProps> = ({
  formItemName,
  formItemLabel,
  columns,
  disabled,
}) => {
  return (
    <Form.Item
      rules={[{ required: true, message: `请选择${formItemLabel}` }]}
      name={formItemName}
      label={formItemLabel}
      trigger="onConfirm"
      getValueFromEvent={(v: string[]) => {
        // 这个函数会在 onFinish 的时候调用
        // 用于把 form 需要的字段值从数组结构转为单值
        return v[0];
      }}
      getValueProps={(v: string) => {
        // 这个函数会在本组件初始化的时候调用
        // 用于把上一层 Form 的 字符串单值转为数组结构
        return { value: [v] };
      }}
      onClick={(e, datePickerRef: RefObject<PickerRef>) => {
        datePickerRef.current?.open();
      }}
      disabled={disabled}
    >
      <Picker columns={columns}>
        {(value) => {
          return value && value[0] ? value[0].label : "请选择";
        }}
      </Picker>
    </Form.Item>
  );
};

export default FormPicker;
