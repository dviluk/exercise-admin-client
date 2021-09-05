import { PageContainer } from '@ant-design/pro-layout';
import api from '@/services/api';
import CrudTable from '@/components/CrudTable';

// type Model = API.ExerciseGroups.Model;
// type FormInputs = API.ExerciseGroups.FormInput;
// type TableParams = API.ExerciseGroups.TableParams;
// type CollectionParams = API.ExerciseGroups.CollectionParams;

export default () => {
  return (
    <PageContainer>
      <CrudTable crud={api.exerciseGroups} />
    </PageContainer>
  );
};
