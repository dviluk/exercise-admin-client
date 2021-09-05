import { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType } from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { Button, Image } from 'antd';
import api from '@/services/api';
import { SortOrder } from 'antd/lib/table/interface';
import { DeleteFilled, EditFilled, PlusOutlined, RedoOutlined } from '@ant-design/icons';
import { ProFormText, ProFormTextArea, ProFormUploadButton } from '@ant-design/pro-form';
import ButtonGroup from 'antd/lib/button/button-group';
import MultiForm, { FormAction } from '@/components/ModalForm';
import utils from '@/utils';
import { useState } from 'react';

type SortType = {
  [key: string]: SortOrder;
};

export default () => {
  const modalRef = useRef<MultiForm<API.Equipment.FormInput, API.Equipment.Model>>(null);
  const tableRef = useRef<ActionType>();
  const [onlyTrashed, setWithTrashed] = useState(false);

  const columns: ProColumns<API.Equipment.Model>[] = [
    {
      title: 'image',
      hideInSearch: true,
      dataIndex: 'image_thumbnail_url',
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
      render: (_, item) => {
        return (
          <ButtonGroup>
            {onlyTrashed ? (
              <Button
                icon={<RedoOutlined />}
                type="link"
                children="Restore"
                onClick={() => {
                  modalRef.current!.show({
                    loadModel: async (form, modal) => {
                      modal.set({
                        action: 'restoring',
                        content: 'restore this item?',
                      });

                      const response = await api.equipment.find(item.id, { onlyTrashed });

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
                  modalRef.current!.show({
                    loadModel: async (form, modal) => {
                      modal.set({
                        action: 'editing',
                      });

                      const response = await api.equipment.find(item.id, { onlyTrashed });

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
                modalRef.current!.show({
                  loadModel: async (form, modal) => {
                    modal.set({
                      content: 'Are you sure delete this task?',
                      action: 'deleting',
                      type: 'danger',
                    });

                    const response = await api.equipment.find(item.id, { onlyTrashed });

                    modal.set({
                      title: `delete equipment: ${response.data.name}`,
                      model: response.data,
                    });

                    form.setFieldsValue({ ...response.data });
                  },
                });
              }}
            />
          </ButtonGroup>
        );
      },
    },
  ];

  async function fetchData(
    params: API.Equipment.TableParams,
    sort: SortType,
  ): Promise<API.CollectionResponse<API.Equipment.Model>> {
    const data = utils.table.handleTableParams<API.Equipment.CollectionParams>(params, sort);

    setWithTrashed(!!data.onlyTrashed);

    const response = await api.equipment.all(data);

    return response;
  }

  function renderToolbar() {
    return [
      <Button
        icon={<PlusOutlined />}
        type="primary"
        onClick={() => {
          const modal = modalRef.current!;

          modal.setAction('creating');
          modal.show();
        }}
      />,
    ];
  }

  return (
    <PageContainer>
      <ProTable<API.Equipment.Model, API.Equipment.TableParams>
        columns={columns}
        actionRef={tableRef}
        request={fetchData}
        toolBarRender={renderToolbar}
      />
      <MultiForm<API.Equipment.FormInput, API.Equipment.Model>
        ref={modalRef}
        title="create equipment"
        width={520}
        onSubmit={async (data, { model, action }) => {
          if (action === 'creating' && api.equipment.store) {
            await api.equipment.store(data);
          } else if (action === 'editing' && model && api.equipment.update) {
            await api.equipment.update(model.id, { ...data, onlyTrashed });
          } else if (action === 'deleting' && model && api.equipment.destroy) {
            await api.equipment.destroy(model.id, { onlyTrashed });
          } else if (action === 'restoring' && model && api.equipment.restore) {
            await api.equipment.restore(model.id);
          }

          tableRef.current!.reload();

          return true;
        }}
      >
        {({ form, model, action }) => {
          return <Inputs form={form} model={model} action={action} />;
        }}
      </MultiForm>
    </PageContainer>
  );
};

interface InputProps {
  form: ReturnType<MultiForm<API.Equipment.FormInput, API.Equipment.Model>['getFormInstance']>;
  model?: API.Equipment.Model;
  action: FormAction;
}
const Inputs: React.FC<InputProps> = (props) => {
  const { form, model } = props;
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
