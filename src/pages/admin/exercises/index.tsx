import { PageContainer } from '@ant-design/pro-layout';
import api from '@/services/api';
import CrudTable from '@/components/CrudTable';

// type Model = API.Exercises.Model;
// type FormInputs = API.Exercises.FormInput;
// type TableParams = API.Exercises.TableParams;
// type CollectionParams = API.Exercises.CollectionParams;

export default () => {
  return (
    <PageContainer>
      <CrudTable crud={api.exercises} />
    </PageContainer>
  );
};
