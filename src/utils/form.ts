import type { ProFormInstance } from '@ant-design/pro-form';

/**
 * Muestra en el formulario los errores generados en el servidor.
 *
 * @param form Instancia del formulario
 * @param e Error 422
 */
export function setErrors<T>(form: ProFormInstance<T>, e: any) {
  // TODO: Buscar manera de obtener el código 422 del error
  const { data } = e;
  if (data && data.errors) {
    const { errors } = data;

    const fields: any[] = Object.keys(data.errors).map((key) => {
      return {
        name: key,
        errors: errors[key],
      };
    });

    form.setFields(fields);
  }
}

/**
 * Convierte un objeto a FormData.
 *
 * @param obj Objeto a convertir
 * @param rootName Nombre de la raíz del objeto
 * @param ignoreList Elementos que se ignoraran
 * @returns
 */
export function objectToFormData(obj: any, rootName?: string, ignoreList?: string[]) {
  const formData = new FormData();

  function appendFormData(data: any, root?: string) {
    if (!ignore(root)) {
      const newRoot = root || '';
      if (data instanceof File) {
        formData.append(newRoot, data);
      } else if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i += 1) {
          appendFormData(data[i], `${newRoot}[${i}]`);
        }
      } else if (typeof data === 'object') {
        Object.keys(data).forEach((key) => {
          if (newRoot === '') {
            appendFormData(data[key], key);
          } else {
            appendFormData(data[key], `${newRoot}.${key}`);
          }
        });
      } else if (data !== null && data !== undefined) {
        formData.append(newRoot, data);
      }
    }
  }

  function ignore(root?: string) {
    return (
      Array.isArray(ignoreList) &&
      ignoreList.some((x) => {
        return x === root;
      })
    );
  }

  appendFormData(obj, rootName);

  return formData;
}
