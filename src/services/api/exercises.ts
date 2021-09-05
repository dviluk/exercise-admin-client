import { simpleCrud } from '@/utils/api';

export default simpleCrud<
  API.Exercises.Model,
  API.Exercises.CollectionParams,
  API.Exercises.FormInput
>('exercises');
