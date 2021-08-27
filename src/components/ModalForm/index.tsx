import React from 'react';
import { Spin } from 'antd';
import { ModalForm, ModalFormProps, ProFormInstance } from '@ant-design/pro-form';
import utils from '@/utils';

interface ModalShowOptions<T, M> {
  loadModel?: (formInstance: ProFormInstance<T>, modalInstance: MultiForm<T, M>) => Promise<void>;
  title?: string;
}

type FormAction = 'creating' | 'editing' | 'deleting';
type FormType = 'primary' | 'danger' | 'warning' | 'info' | 'success';

interface onSubmitOptions<T, M> {
  form: ProFormInstance<T>;
  model?: M;
  action: FormAction;
}
interface ModalProps<T, M> extends Pick<ModalFormProps<T>, 'width'> {
  /**
   * Acción al enviar el formulario.
   */
  onSubmit?: (formData: T, options: onSubmitOptions<T, M>) => Promise<boolean>;
  /**
   * Acción al haber un error al enviar el formulario.
   */
  onError?: React.ReactEventHandler<HTMLFormElement>;
  /**
   * Contenido por default.
   */
  children: React.ReactNode;
  /**
   * Titilo por default.
   */
  title?: string;
  /**
   * Indica el modo por default del modal.
   */
  type?: FormType;
  /**
   * Indica el modo por default del modal.
   */
  action?: FormAction;
}

interface ModalState<T, M> {
  /**
   * Indica si el modelo se esta mostrando
   */
  visible: boolean;
  /**
   * Indica si se esta mostrando el loading
   */
  loading: boolean;
  /**
   * Remplaza el titulo del modal por default (this.props.title) solo
   * si se especifica con setTitle(), se reinicia al ocultar el modal.
   */
  title?: string;
  /**
   * Remplaza el contenido del modal (this.props.title) si se especifica con setTitle(),
   * se reinicia al ocultar el modal.
   */
  content?: React.ReactNode;
  /**
   * Remplaza una sola vez al onSubmit por defualt (this.props.onSubmit),
   * se reinicia al ocultar el modal.
   */
  onSubmit?: ModalProps<T, M>['onSubmit'];
  /**
   * Modelo que se esta usando en el modal. Común mente es el resource que se esta
   * editando en el modal.
   */
  model?: M;
  /**
   * Indica el modo en el que se encuentra el formulario.
   */
  action?: FormAction;
  /**
   * Indica el tipo del formulario, según el tipo se mostraran colores diferentes.
   */
  type?: FormType;
}

export default class MultiForm<T, M = {}> extends React.Component<
  ModalProps<T, M>,
  ModalState<T, M>
> {
  static defaultProps = {
    type: 'primary',
    action: 'creating',
  };

  state: ModalState<T, M> = {
    visible: false,
    loading: false,
    title: undefined,
    onSubmit: undefined,
    model: undefined,
    content: undefined,
    action: undefined,
    type: undefined,
  };

  formRef = React.createRef<ProFormInstance<T>>();

  render() {
    const type = this.state.type || this.props.type;

    return (
      <ModalForm<T>
        formRef={this.formRef as any}
        visible={this.state.visible}
        title={this.state.title}
        width={this.props.width}
        autoComplete="off"
        submitter={{
          submitButtonProps: {
            loading: this.state.loading,
            danger: type === 'danger',
          },
          resetButtonProps: {
            loading: this.state.loading,
          },
        }}
        onFinish={async (formData) => {
          let success = false;

          const form = this.getFormInstance();

          try {
            this.loading();

            if (this.props.onSubmit) {
              success = await this.props.onSubmit(formData, {
                form,
                model: this.state.model,
                action: this.state.action || this.props.action!,
              });
            }

            if (success) {
              this.hide();
              form.resetFields();
            }
          } catch (e) {
            utils.form.setErrors(form, e);

            if (this.props.onError) {
              this.props.onError(e);
            }
          } finally {
            this.loading(false);
          }
        }}
        onError={(e) => {
          console.error('ModalForm.onError', e);
        }}
        modalProps={{
          onCancel: () => {
            this.hide();
          },
        }}
      >
        <Spin spinning={this.state.loading}>{this.state.content || this.props.children}</Spin>
      </ModalForm>
    );
  }

  public async show(options: ModalShowOptions<T, M> = {}) {
    if (options.loadModel) {
      this.setState({ visible: true, loading: true });
      await options.loadModel(this.getFormInstance(), this);
      this.setState({ loading: false });
    }

    var newState: Partial<ModalState<T, M>> = {
      visible: true,
    };

    if (options.title) {
      newState.title = options.title;
    }

    this.setState(newState as any);
  }

  public hide() {
    this.setState({
      visible: false,
      title: this.props.title || '',
      onSubmit: undefined,
      model: undefined,
      action: undefined,
      type: undefined,
      content: undefined,
    });

    this.getFormInstance().resetFields();
  }

  public loading(loading: boolean = true) {
    this.setState({ loading });
  }

  public setTitle(title: string) {
    this.setState({ title });
  }

  public setContent(content: React.ReactNode) {
    this.setState({ content });
  }

  public setModel(model: M) {
    this.setState({ model });
  }

  public setAction(action: FormAction) {
    this.setState({ action });
  }

  public set(state: Partial<ModalState<T, M>>) {
    this.setState({ ...(state as any) });
  }

  public getFormInstance() {
    return this.formRef.current!;
  }
}
