import { PageContainer } from '@ant-design/pro-layout';
import api from '@/services/api';
import CrudTable from '@/components/CrudTable';

// type Model = API.Goals.Model;
// type FormInputs = API.Goals.FormInput;
// type TableParams = API.Goals.TableParams;
// type CollectionParams = API.Goals.CollectionParams;

export default () => {
  return (
    <PageContainer>
      <CrudTable crud={api.goals} />
    </PageContainer>
  );
};
