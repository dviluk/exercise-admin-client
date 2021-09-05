import { simpleCrud } from '@/utils/api';

export default simpleCrud<
  API.ExerciseGroups.Model,
  API.ExerciseGroups.CollectionParams,
  API.ExerciseGroups.FormInput
>('exercise-groups');
