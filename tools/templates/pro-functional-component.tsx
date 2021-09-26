import ProForm from '@ant-design/pro-form';
import type { ProFormFieldItemProps } from '@ant-design/pro-form/lib/interface';

export interface Pro__name__Props extends ProFormFieldItemProps {
  /**
   * Nombre del input.
   */
  name: string;
  /**
   * Props para el input `SelectImage`.
   */
  fieldProps?: Partial<any>;
  /**
   * Valor inicial del input.
   */
  initialValue?: File;
}

const Pro__name__: React.FC<Pro__name__Props> = (props) => {
  return (
    <ProForm.Item {...props}>
      <div {...props.fieldProps} />
    </ProForm.Item>
  );
};

export default Pro__name__;
