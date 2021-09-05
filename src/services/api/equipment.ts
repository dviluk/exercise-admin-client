import { simpleCrud } from '@/utils/api';

const extra = {
  hello: '',
};
export default simpleCrud<
  API.Equipment.Model,
  API.Equipment.CollectionParams,
  API.Equipment.FormInput,
  typeof extra
>('equipment', extra);
