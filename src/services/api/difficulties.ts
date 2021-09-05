import { simpleCrud } from '@/utils/api';

export default simpleCrud<
  API.Difficulties.Model,
  API.Difficulties.CollectionParams,
  API.Difficulties.FormInput
>('difficulties');
