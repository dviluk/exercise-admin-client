import React from 'react';
import ProTable, { ActionType } from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { Button } from 'antd';
import { SortOrder } from 'antd/lib/table/interface';
import { DeleteFilled, EditFilled, PlusOutlined, RedoOutlined } from '@ant-design/icons';
import MultiForm, { FormAction } from '@/components/ModalForm';
import utils from '@/utils';
import { ProFormInstance, ProFormText, ProFormTextArea } from '@ant-design/pro-form';

type CrudApi<M> = API.SimpleCrud<M, any, any, any>;

type SortType = {
  [key: string]: SortOrder;
};

type TableFetchResponse<M> = {
  data: M[];
  success: boolean;
  total: number;
} & Record<string, any>;

interface Refs<M, FI> {
  /**
   * Instancia del Modal.
   */
  modal: MultiForm<FI, M>;
  /**
   * Instancia del formulario del modal.
   */
  form: ProFormInstance<FI>;
}

interface ModalFormInputsProps<M, FI> extends Refs<M, FI> {
  /**
   * Indica la acción que se esta ejecutando en el formulario.
   */
  action: FormAction;
  /**
   * Contiene el recurso principal consultado.
   */
  model?: M;
}

type GetColumns<M = any, FI = any, CRUD = any> = (
  options: Refs<M, FI> & { onlyTrashed: boolean; crud: CRUD },
) => ProColumns<M>[];

type GetFormInputs<M = any, FI = any> = (props: ModalFormInputsProps<M, FI>) => React.ReactNode;

export interface CrudTableProps<M, FI, CRUD extends CrudApi<M>> {
  /**
   * Opciones para el modal.
   */
  modal?: {
    title?: string;
  };
  /**
   * Genera las columnas de la tabla.
   */
  columns?: GetColumns<M, FI, CRUD>;
  /**
   * Genera los inputs/contenido del modal principal.
   */
  formInputs?: GetFormInputs<M, FI>;
  /**
   * Instancia del Crud
   */
  crud: CRUD;
  /**
   * Se ejecuta al crear un registro.
   */
  onCreate?: (model: M) => void;
  /**
   * Se ejecuta al actualizar un registro.
   */
  onUpdate?: (model: M) => void;
  /**
   * Se ejecuta al eliminar un registro.
   */
  onDelete?: () => void;
  /**
   * Se ejecuta al restaurar un registro.
   */
  onRestore?: () => void;
}

export interface CrudTableState {
  /**
   * Indica si se están mostrando los elementos eliminados.
   */
  onlyTrashed: boolean;
}

export default class CrudTable<
  /**
   * Modelo
   */
  M,
  /**
   * Form Input
   */
  FI,
  /**
   * Collection Params
   */
  CP,
  /**
   * Table Params
   */
  TP,
  CRUD extends CrudApi<M> = any,
> extends React.Component<CrudTableProps<M, FI, CRUD>, CrudTableState> {
  state: CrudTableState = {
    onlyTrashed: false,
  };

  private modalRef = React.createRef<MultiForm<FI, M>>();
  private tableOptionsRef = React.createRef<ActionType>();

  render() {
    const { onlyTrashed } = this.state;
    const { crud } = this.props;

    return (
      <>
        <ProTable<M, TP>
          pagination={{ defaultPageSize: 10 }}
          columns={this.getColumns()}
          actionRef={this.tableOptionsRef as any}
          request={this.fetchData}
          toolBarRender={this.renderToolbar}
          defaultSize="small"
          scroll={{ y: '40vh' }}
        />
        <MultiForm<FI, M>
          ref={this.modalRef}
          title="create equipment"
          width={520}
          onSubmit={async (data, { model, action }) => {
            if (action === 'creating' && crud.store) {
              const res: any = await crud.store(data);
              if (this.props.onCreate) {
                this.props.onCreate(res.data);
              }
            } else if (action === 'editing' && model && crud.update) {
              const res: any = await crud.update(model.id, { ...data, onlyTrashed });
              if (this.props.onUpdate) {
                this.props.onUpdate(res.data);
              }
            } else if (action === 'deleting' && model && crud.destroy) {
              await crud.destroy(model.id, { onlyTrashed });
              if (this.props.onDelete) {
                this.props.onDelete();
              }
            } else if (action === 'restoring' && model && crud.restore) {
              await crud.restore(model.id);
              if (this.props.onRestore) {
                this.props.onRestore();
              }
            }

            this.tableOptionsRef.current!.reload();

            return true;
          }}
        >
          {this.renderFormContent}
        </MultiForm>
      </>
    );
  }

  private getColumns() {
    const { columns } = this.props;
    const { onlyTrashed } = this.state;

    const options = {
      modal: this.modalRef.current!,
      form: this.modalRef.current?.getFormInstance()!,
      crud: this.props.crud,
      onlyTrashed,
    };

    if (!columns) {
      return defaultColumns(options);
    }

    return columns(options);
  }

  private renderFormContent = (props: ModalFormInputsProps<M, FI>) => {
    const { formInputs } = this.props;

    if (!formInputs) {
      return getDefaultInputs(props);
    }

    return formInputs(props);
  };

  private fetchData = async (params: TP, sort: SortType): Promise<TableFetchResponse<M>> => {
    const { crud } = this.props;

    const data: any = utils.table.handleTableParams<CP>(params, sort);

    this.setState({ onlyTrashed: !!data.onlyTrashed });

    const response = await crud.all(data);

    return { ...response, total: response.meta.total };
  };

  renderToolbar = () => {
    const { modal } = this.props;

    const title = modal && modal.title;

    return [
      <Button
        icon={<PlusOutlined />}
        type="primary"
        onClick={() => {
          const modal = this.modalRef.current!;

          modal.set({
            action: 'creating',
            title: title || 'create',
            visible: true,
          });
        }}
      />,
    ];
  };
}

const defaultColumns: GetColumns = ({ onlyTrashed, modal, crud }) => [
  {
    title: 'name',
    dataIndex: 'name',
    valueType: 'text',
    defaultSortOrder: 'ascend',
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
    valueType: 'dateTimeRange',
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

const getDefaultInputs: GetFormInputs = ({}) => {
  return (
    <>
      <ProFormText name="name" label="Name" rules={[{ required: true }]} />
      <ProFormTextArea name="description" label="Description" rules={[{ required: true }]} />
    </>
  );
};
