import { simpleCrud } from '@/utils/api';

export default simpleCrud<API.Goals.Model, API.Goals.CollectionParams, API.Goals.FormInput>(
  'goals',
);
