import { useState, useEffect, useImperativeHandle } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Image, Upload } from 'antd';
import type { RcFile } from 'antd/lib/upload';

export interface SelectImageProps {
  /**
   *   wip  documentar metodos.
   */
  ref?: any;
  /**
   * Imagen por default.
   */
  defaultImageUrl?: string;
  /**
   * Thumbnail d ela imagen por default.
   */
  defaultImageThumbnailUrl?: string;
  /**
   * Se ejecuta al cambiar de valor.
   */
  onChange?: (file?: File) => void;
  /**
   * Valor controlado del input.
   */
  value?: File;
  /**
   * Valor inicial del input.
   *
   * TODO: Falta que se muestre el valor inicial en el preview.
   */
  initialValue?: File;
}

/**
 * Input para seleccionar una imagen.
 */
const SelectImage: React.FC<SelectImageProps> = (props) => {
  const {
    ref,
    defaultImageUrl,
    defaultImageThumbnailUrl,
    onChange,
    value: valueProp,
    initialValue,
  } = props;

  const [imageFromInput, setImageFromInput] = useState<undefined | string>(undefined);
  const [value, setValue] = useState<File | undefined>(initialValue);

  useImperativeHandle(
    ref,
    () => ({
      getValue: () => {
        return value;
      },
      setValue: (val?: File) => {
        setImage(val);
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value],
  );

  function setImage(file?: File) {
    if (valueProp !== file) {
      if (file === undefined) {
        setImageFromInput(undefined);
      } else {
        readFile(file, (img) => {
          setImageFromInput(img);
        });
      }

      setValue(file);

      if (onChange) {
        onChange(file);
      }
    }
  }

  useEffect(() => {
    if (initialValue && onChange) {
      onChange(initialValue);
    }

    setImage(initialValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Se actualiza la imagen cuando `valueProp` es diferente al `value` del input
  // esto sirve para habilitar el modo `controlled`
  setImage(valueProp);

  const imageLoaded = imageFromInput || defaultImageUrl || defaultImageThumbnailUrl;

  function onRemove() {
    setImage(undefined);
  }

  function beforeUpload(_: RcFile, fileList: RcFile[]) {
    // TODO: check rcfile
    const file = fileList[0];

    setImage(file);

    return false;
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {imageLoaded && (
        <Image
          src={imageFromInput || defaultImageThumbnailUrl || imageLoaded}
          preview={{ src: imageFromInput || defaultImageUrl || imageLoaded }}
          placeholder
          width={100}
          height={100}
        />
      )}
      <div>
        <Upload
          listType={imageLoaded ? 'text' : 'picture-card'}
          maxCount={1}
          onRemove={onRemove}
          beforeUpload={beforeUpload}
        >
          <Button type="link" icon={<UploadOutlined />} />
        </Upload>
      </div>
    </div>
  );
};

export default SelectImage;

function readFile(file: File | undefined, onLoad: (file: string) => void) {
  if (!file) return;

  const fileReader = new FileReader();

  fileReader.onload = (e) => {
    if (e.target) {
      onLoad(e.target.result as any);
    }
  };

  fileReader.readAsDataURL(file);
}
