import ProForm from '@ant-design/pro-form';
import type { ProFormFieldItemProps } from '@ant-design/pro-form/lib/interface';
import type { SelectImageProps } from '../../SelectImage';
import SelectImage from '../../SelectImage';

export interface ProSelectImageProps extends ProFormFieldItemProps {
  /**
   * Nombre del input.
   */
  name: string;
  /**
   * Props para el input `SelectImage`.
   */
  fieldProps: Partial<SelectImageProps>;
  /**
   * Valor inicial del input.
   */
  initialValue?: File;
}

const ProSelectImage: React.FC<ProSelectImageProps> = (props) => {
  return (
    <ProForm.Item {...props}>
      <SelectImage {...props.fieldProps} />
    </ProForm.Item>
  );
};

export default ProSelectImage;
