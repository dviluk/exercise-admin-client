import type { CrudTableProps } from '@/components/CrudTable';
import CrudTable from '@/components/CrudTable';
import ProSelectFromModel from '@/components/Fields/Pro/ProSelectFromModel';
import ProSelectImage from '@/components/Fields/Pro/ProSelectImage';
import type { ExercisesApiType } from '@/services/api';
import api from '@/services/api';
import { DeleteFilled, EditFilled, RedoOutlined } from '@ant-design/icons';
import { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Image } from 'antd';
import { useEffect } from 'react';
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
    difficulties.all.fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        loading: difficulties.select.loading,
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
                    loadModel: async (form) => {
                      modal.set({
                        action: 'restoring',
                        content: 'restore this item?',
                      });

                      const response = await crud.edit(item.id, { onlyTrashed });

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
                    loadModel: async (form) => {
                      modal.set({
                        action: 'editing',
                      });

                      const response = await crud.edit(item.id, { onlyTrashed });

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
                  loadModel: async (form) => {
                    modal.set({
                      content: 'Are you sure delete this task?',
                      action: 'deleting',
                      type: 'danger',
                    });

                    const response = await crud.edit(item.id, { onlyTrashed });

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

  const getFormInputs: CrudProps['formInputs'] = ({ model }) => {
    const imageRequired = model && model.image_url ? false : true;
    const illustrationRequired = model && model.illustration_url ? false : true;
    return (
      <>
        <ProSelectImage
          name="image"
          label="Image"
          rules={[{ required: imageRequired }]}
          fieldProps={{
            defaultImageUrl: model && model.image_url,
            defaultImageThumbnailUrl: model && model.image_thumbnail_url,
          }}
        />
        <ProSelectImage
          name="illustration"
          label="Illustration"
          rules={[{ required: illustrationRequired }]}
          fieldProps={{
            defaultImageUrl: model && model.illustration_url,
            defaultImageThumbnailUrl: model && model.illustration_thumbnail_url,
          }}
        />
        <ProFormText name="name" label="Name" rules={[{ required: true }]} />
        <ProFormTextArea name="description" label="Description" rules={[{ required: true }]} />
        <ProSelectFromModel
          name="difficulty_id"
          label="Difficulty"
          model="difficulties"
          rules={[{ required: true }]}
        />
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
