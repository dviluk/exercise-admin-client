import { ProFormInstance } from '@ant-design/pro-form';

/**
 * Muestra en el formulario los errores generados en el servidor.
 *
 * @param form Instancia del formulario
 * @param e Error 422
 */
export function setErrors<T>(form: ProFormInstance<T>, e: any) {
  // TODO: Buscar manera de obtener el código 422 del error
  const data = e.data;
  if (data && data.errors) {
    var errors = data.errors;

    const fields: any[] = Object.keys(data.errors).map((key) => {
      return {
        name: key,
        errors: errors[key],
      };
    });

    form.setFields(fields);
  }
}
