import ProForm from '@ant-design/pro-form';
import type { ProFormFieldItemProps } from '@ant-design/pro-form/lib/interface';
import type { SelectFromModelProps } from '../../SelectFromModel';
import SelectFromModel from '../../SelectFromModel';

export interface ProSelectFromModelProps extends ProFormFieldItemProps {
  /**
   * Nombre del input.
   */
  name: string;
  /**
   * Props para el input `SelectImage`.
   */
  fieldProps?: Partial<SelectFromModelProps>;
  /**
   * Valor inicial del input.
   */
  initialValue?: File;
  /**
   * Modelo
   */
  model: Models.All;
}

const ProSelectFromModel: React.FC<ProSelectFromModelProps> = (props) => {
  const { model, ...restProps } = props;
  return (
    <ProForm.Item {...restProps}>
      <SelectFromModel model={model} {...props.fieldProps} />
    </ProForm.Item>
  );
};

export default ProSelectFromModel;
