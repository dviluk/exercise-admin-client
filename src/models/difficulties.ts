import { useCallback, useState } from 'react';
import api from '@/services/api';

type Select = API.Difficulties.Select;

export default () => {
  const [selectItems, setSelectItems] = useState<Select>([]);
  const [selectItemsFetched, setSelectItemsFetched] = useState(false);

  const fetchSelect = useCallback(async (force: boolean = false) => {
    if (!force && selectItemsFetched === true) {
      return;
    }

    try {
      const req = await api.difficulties.select();

      if (req.success === true) {
        setSelectItemsFetched(true);
        setSelectItems(req.data);
      }
    } catch (e) {}
  }, []);

  return {
    select: {
      fetched: selectItemsFetched,
      items: selectItems,
      fetch: fetchSelect,
    },
  };
};
