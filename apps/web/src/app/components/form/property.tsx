import { PropertyAttributes } from "@/app/lib/db";
import { Form } from "antd-mobile";

export type IPropertyForm = PropertyAttributes & { amount: number };

export const useFormData = (property: PropertyAttributes) => {
  const [form] = Form.useForm<IPropertyForm>();

  const onFinish = async (values: IPropertyForm) => {
    const d = {
      ...property,
      ...values,
    };
    await fetch(`/api/property`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(d),
    });
  };

  return {
    form: form as ReturnType<typeof Form.useForm<IPropertyForm>>[0],
    onFinish,
  };
};
