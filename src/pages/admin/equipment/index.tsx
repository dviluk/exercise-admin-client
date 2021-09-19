import { Button, Image } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { DeleteFilled, EditFilled, RedoOutlined } from '@ant-design/icons';
import { ProFormText, ProFormTextArea, ProFormUploadButton } from '@ant-design/pro-form';
import CrudTable, { CrudTableProps } from '@/components/CrudTable';
import api, { EquipmentApiType } from '@/services/api';

type Model = API.Equipment.Model;
type FormInputs = API.Equipment.FormInput;
// type TableParams = API.Equipment.TableParams;
// type CollectionParams = API.Equipment.CollectionParams;

type CrudProps = CrudTableProps<Model, FormInputs, EquipmentApiType>;

export default () => {
  return (
    <PageContainer>
      <CrudTable crud={api.equipment} formInputs={getFormInputs} columns={getColumns} />
    </PageContainer>
  );
};

const getFormInputs: CrudProps['formInputs'] = ({ model, form }) => {
  const modelLoaded = model !== undefined;

  return (
    <>
      <ProFormText hidden name="image" />

      <div style={{ textAlign: 'center' }}>
        {modelLoaded && (
          <Image
            src={model?.image_thumbnail_url}
            preview={{ src: model?.image_url }}
            placeholder
            width={100}
            height={100}
          />
        )}
        <ProFormUploadButton
          listType={modelLoaded ? 'text' : 'picture-card'}
          rules={[{ required: true }]}
          fieldProps={{
            maxCount: 1,
            onRemove: () => {
              form.setFieldsValue({ image: undefined });
            },
            beforeUpload: (_, fileList) => {
              form.setFieldsValue({ image: fileList[0] });

              return false;
            },
          }}
        />
      </div>

      <ProFormText name="name" label="Name" rules={[{ required: true }]} />
      <ProFormTextArea name="description" label="Description" rules={[{ required: true }]} />
    </>
  );
};

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

                    modal.setTitle(`edit equipment: ${response.data.name}`);
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
                    title: `delete equipment: ${response.data.name}`,
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
