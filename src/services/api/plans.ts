import { simpleCrud } from '@/utils/api';

export default simpleCrud<API.Tags.Model, API.Tags.CollectionParams, API.Tags.FormInput>('plans');
