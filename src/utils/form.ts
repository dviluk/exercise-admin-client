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

/**
 * Convierte un objeto a FormData.
 *
 * @param obj Objeto a convertir
 * @param rootName Nombre de la raíz del objeto
 * @param ignoreList Elementos que se ignoraran
 * @returns
 */
export function objectToFormData(obj: any, rootName?: string, ignoreList?: string[]) {
  var formData = new FormData();

  function appendFormData(data: any, root?: string) {
    if (!ignore(root)) {
      root = root || '';
      if (data instanceof File) {
        formData.append(root, data);
      } else if (Array.isArray(data)) {
        for (var i = 0; i < data.length; i++) {
          appendFormData(data[i], root + '[' + i + ']');
        }
      } else if (typeof data === 'object' && data) {
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            if (root === '') {
              appendFormData(data[key], key);
            } else {
              appendFormData(data[key], root + '.' + key);
            }
          }
        }
      } else {
        if (data !== null && typeof data !== 'undefined') {
          formData.append(root, data);
        }
      }
    }
  }

  function ignore(root?: string) {
    return (
      Array.isArray(ignoreList) &&
      ignoreList.some(function (x) {
        return x === root;
      })
    );
  }

  appendFormData(obj, rootName);

  return formData;
}
