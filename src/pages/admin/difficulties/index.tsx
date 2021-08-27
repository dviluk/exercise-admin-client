import { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, RequestData } from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { Button } from 'antd';
import api from '@/services/api';
import { SortOrder } from 'antd/lib/table/interface';
import { DeleteFilled, EditFilled, PlusOutlined } from '@ant-design/icons';
import { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import ButtonGroup from 'antd/lib/button/button-group';
import MultiForm from '@/components/ModalForm';

type SortType = {
  [key: string]: SortOrder;
};

async function fetchData(
  params: API.Difficulties.CollectionParams,
  sort: SortType,
): Promise<RequestData<API.Difficulties.Model>> {
  const data: any = {
    ...params,
  };

  if (Object.keys(sort).length > 0) {
    Object.keys(sort).forEach((key, index) => {
      data[`sort[${index}][column]`] = key;
      data[`sort[${index}][direction]`] = sort[key];
    });
  }

  const response = await api.difficulties.all({ ...data });

  return response;
}

export default () => {
  const modalRef = useRef<MultiForm<API.Difficulties.FormInput, API.Difficulties.Model>>(null);
  const tableRef = useRef<ActionType>();

  const columns: ProColumns<API.Difficulties.Model>[] = [
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
    },
    {
      title: 'created_at',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      sorter: {
        //   compare: (a, b) => String(a.created_at).localeCompare(b.created_at),
        multiple: 2,
      },
    },
    {
      title: 'updated_at',
      dataIndex: 'updated_at',
      valueType: 'dateTime',
      sorter: {
        //   compare: (a, b) => String(a.created_at).localeCompare(b.created_at),
        multiple: 3,
      },
    },
    {
      title: 'options',
      valueType: 'option',
      render: (_, item) => {
        return (
          <ButtonGroup>
            <Button
              icon={<EditFilled />}
              type="link"
              children="Edit"
              onClick={() => {
                modalRef.current!.show({
                  loadModel: async (form, modal) => {
                    modal.set({
                      action: 'editing',
                      type: 'warning',
                    });

                    const response = await api.difficulties.find(item.id);

                    modal.setTitle(`edit difficulty: ${response.data.name}`);
                    modal.setModel(response.data);

                    form.setFieldsValue({ ...response.data });
                  },
                });
              }}
            />
            <Button
              icon={<DeleteFilled />}
              type="link"
              danger
              children="Delete"
              onClick={() => {
                modalRef.current!.show({
                  loadModel: async (form, modal) => {
                    modal.set({
                      content: 'Are you sure delete this task?',
                      action: 'deleting',
                      type: 'danger',
                    });

                    const response = await api.difficulties.find(item.id);

                    modal.set({
                      title: `delete difficulty: ${response.data.name}`,
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
      <ProTable<API.Difficulties.Model, API.Difficulties.CollectionParams>
        columns={columns}
        actionRef={tableRef}
        request={fetchData}
        toolBarRender={renderToolbar}
      />
      <MultiForm<API.Difficulties.FormInput, API.Difficulties.Model>
        ref={modalRef}
        title="create difficulty"
        width={520}
        onSubmit={async (data, { model, action }) => {
          if (action === 'creating') {
            await api.difficulties.store(data);
          } else if (action === 'editing' && model) {
            await api.difficulties.update(model.id, data);
          } else if (action === 'deleting' && model) {
            api.difficulties.destroy(model.id);
          }

          tableRef.current!.reload();

          return true;
        }}
      >
        <DifficultyInputs />
      </MultiForm>
    </PageContainer>
  );
};

const DifficultyInputs = () => {
  return (
    <>
      <ProFormText name="name" label="Name" rules={[{ required: true }]} />
      <ProFormTextArea name="description" label="Description" rules={[{ required: false }]} />
    </>
  );
};
