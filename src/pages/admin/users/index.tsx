import { PageContainer } from '@ant-design/pro-layout';
import api from '@/services/api';
import CrudTable from '@/components/CrudTable';

// type Model = API.Users.Model;
// type FormInputs = API.Users.FormInput;
// type TableParams = API.Users.TableParams;
// type CollectionParams = API.Users.CollectionParams;

export default () => {
  return (
    <PageContainer>
      <CrudTable crud={api.users} />
    </PageContainer>
  );
};
