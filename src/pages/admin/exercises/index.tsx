import { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import api, { ExercisesApiType } from '@/services/api';
import CrudTable, { CrudTableProps } from '@/components/CrudTable';
import { ProFormText, ProFormTextArea, ProFormUploadButton } from '@ant-design/pro-form';
import { Button, Image } from 'antd';
import { DeleteFilled, EditFilled, RedoOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

type Model = API.Exercises.Model;
type FormInputs = API.Exercises.FormInput;
// type TableParams = API.Exercises.TableParams;
// type CollectionParams = API.Exercises.CollectionParams;

type CrudProps = CrudTableProps<Model, FormInputs, ExercisesApiType>;

export default () => {
  const difficulties = useModel('difficulties');

  useEffect(() => {
    difficulties.select.fetch();
  }, []);

  const getColumns: CrudProps['columns'] = ({ onlyTrashed, modal, crud }) => [
    {
      title: 'image',
      hideInSearch: true,
      dataIndex: 'image_thumbnail_url',
      width: 70,
      onHeaderCell: () => ({
        style: { textAlign: 'center' },
      }),
      onCell: () => ({
        style: { textAlign: 'center' },
      }),
      render: (_, item) => {
        return (
          <Image
            src={item.image_thumbnail_url}
            placeholder
            preview={{ src: item.image_url }}
            height={65}
            width={65}
          />
        );
      },
    },
    {
      title: 'name',
      dataIndex: 'name',
      valueType: 'text',
      sorter: {
        //   compare: (a, b) => String(a.name).localeCompare(b.name),
        multiple: 1,
      },
    },
    {
      title: 'difficulty',
      dataIndex: 'difficulty',
      valueType: 'select',
      fieldProps: {
        defaultValue: '',
        options: [
          {
            value: '',
            label: 'all',
          },
          ...difficulties.select.items,
        ],
      },
      sorter: {
        //   compare: (a, b) => String(a.name).localeCompare(b.name),
        multiple: 1,
      },
    },
    {
      title: 'description',
      dataIndex: 'description',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: 'created_at',
      dataIndex: 'created_at_range',
      valueType: 'dateRange',
      hideInTable: true,
    },
    {
      title: 'created_at',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      hideInSearch: true,
      width: 150,
      sorter: {
        //   compare: (a, b) => String(a.created_at).localeCompare(b.created_at),
        multiple: 2,
      },
    },
    {
      title: 'updated_at',
      dataIndex: 'updated_at_range',
      valueType: 'dateTimeRange',
      hideInTable: true,
    },
    {
      title: 'updated_at',
      dataIndex: 'updated_at',
      valueType: 'dateTime',
      hideInSearch: true,
      width: 150,
      sorter: {
        //   compare: (a, b) => String(a.created_at).localeCompare(b.created_at),
        multiple: 3,
      },
    },
    {
      title: 'show_deleted',
      dataIndex: 'onlyTrashed',
      valueType: 'switch',
      hideInTable: true,
    },
    {
      title: 'options',
      valueType: 'option',
      width: 200,
      render: (_, item) => {
        return (
          <Button.Group>
            {onlyTrashed ? (
              <Button
                icon={<RedoOutlined />}
                type="link"
                children="Restore"
                onClick={() => {
                  modal.show({
                    loadModel: async (form, modal) => {
                      modal.set({
                        action: 'restoring',
                        content: 'restore this item?',
                      });

                      const response = await crud.find(item.id, { onlyTrashed });

                      modal.set({
                        title: `restore equipment: ${response.data.name}`,
                        model: response.data,
                      });

                      form.setFieldsValue({ ...response.data });
                    },
                  });
                }}
              />
            ) : (
              <Button
                icon={<EditFilled />}
                type="link"
                children="Edit"
                onClick={() => {
                  modal.show({
                    loadModel: async (form, modal) => {
                      modal.set({
                        action: 'editing',
                      });

                      const response = await crud.find(item.id, { onlyTrashed });

                      modal.setTitle(`edit exercise: ${response.data.name}`);
                      modal.setModel(response.data);

                      form.setFieldsValue({ ...response.data });
                    },
                  });
                }}
              />
            )}
            <Button
              icon={<DeleteFilled />}
              type="link"
              danger
              children={onlyTrashed ? 'Delete Permanently' : 'Delete'}
              onClick={() => {
                modal.show({
                  loadModel: async (form, modal) => {
                    modal.set({
                      content: 'Are you sure delete this task?',
                      action: 'deleting',
                      type: 'danger',
                    });

                    const response = await crud.find(item.id, { onlyTrashed });

                    modal.set({
                      title: `delete exercise: ${response.data.name}`,
                      model: response.data,
                    });

                    form.setFieldsValue({ ...response.data });
                  },
                });
              }}
            />
          </Button.Group>
        );
      },
    },
  ];

  const getFormInputs: CrudProps['formInputs'] = ({ model, form }) => {
    return (
      <>
        <ImageComponent
          name="image"
          defaultImageUrl={model && model.image_url}
          defaultImageThumbnailUrl={model && model.image_thumbnail_url}
          onRemove={() => {
            form.setFieldsValue({ image: undefined });
          }}
          onSelect={(image) => {
            form.setFieldsValue({ image });
          }}
        />
        <ImageComponent
          name="illustration"
          defaultImageUrl={model && model.illustration_url}
          defaultImageThumbnailUrl={model && model.illustration_thumbnail_url}
          onRemove={() => {
            form.setFieldsValue({ illustration: undefined });
          }}
          onSelect={(illustration) => {
            form.setFieldsValue({ illustration });
          }}
        />
        <ProFormText name="name" label="Name" rules={[{ required: true }]} />
        <ProFormTextArea name="description" label="Description" rules={[{ required: true }]} />
      </>
    );
  };

  return (
    <PageContainer>
      <CrudTable
        crud={api.exercises}
        formInputs={getFormInputs}
        columns={getColumns}
        modal={{ title: 'create exercise' }}
      />
    </PageContainer>
  );
};

interface ImageComponentProps {
  name: string;
  defaultImageUrl?: string;
  defaultImageThumbnailUrl?: string;
  onRemove: Function;
  onSelect: (image: File) => void;
}
const ImageComponent: React.FC<ImageComponentProps> = (props) => {
  const { name, defaultImageUrl, defaultImageThumbnailUrl, onRemove, onSelect } = props;

  const imageLoaded = defaultImageUrl || defaultImageThumbnailUrl;

  return (
    <>
      <ProFormText hidden name={name} />

      <div style={{ textAlign: 'center' }}>
        {imageLoaded && (
          <Image
            src={defaultImageThumbnailUrl || imageLoaded}
            preview={{ src: defaultImageUrl || imageLoaded }}
            placeholder
            width={100}
            height={100}
          />
        )}
        <ProFormUploadButton
          listType={imageLoaded ? 'text' : 'picture-card'}
          rules={[{ required: true }]}
          fieldProps={{
            maxCount: 1,
            onRemove: () => {
              if (onRemove) {
                onRemove();
              }
            },
            beforeUpload: (_, fileList) => {
              if (onSelect) {
                onSelect(fileList[0]);
              }

              return false;
            },
          }}
        />
      </div>
    </>
  );
};

interface SelectComponentProps<T> {
  items: T;
  onChange: (item: T) => void;
}
const SelectComponent: React.FC<SelectComponentProps<T>> = (props) => {
  const {} = props;

  return null;
};
