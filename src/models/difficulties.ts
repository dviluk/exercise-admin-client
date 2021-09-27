import api from '@/services/api';
import { normalizeCollection } from '@/utils/models';
import { useCallback, useState } from 'react';
import { createSelector } from 'reselect';

type Select = API.Difficulties.Select;
type SelectById = Record<string, Select>;

export type DifficultiesModel = {
  select: {
    items: Select[];
    byId: SelectById;
    ids: string[];
    loading: boolean;
    fetched: boolean;
    fetch: () => Promise<void>;
  };
};

type SelectType = {
  ids: string[];
  byId: SelectById;
};

const selectDifficulties = (state: SelectType) => state;

export const selectDifficultiesSelector = createSelector(selectDifficulties, ({ ids, byId }) =>
  ids.map((id) => byId[id]),
);

export default (): DifficultiesModel => {
  const [selectItems, setSelectItems] = useState<SelectType>({ ids: [], byId: {} });
  const [selectFetched, setSelectFetched] = useState(false);
  const [selectLoading, setSelectLoading] = useState(false);

  const fetchSelect = useCallback(
    async (force: boolean = false) => {
      if ((!force && selectFetched === true) || selectLoading) {
        return;
      }

      setSelectLoading(true);

      try {
        const req = await api.difficulties.select();

        if (req.success === true) {
          setSelectFetched(true);

          setSelectItems(normalizeCollection(req.data, 'value'));
          setSelectLoading(false);
        }
      } catch (e) {
        //
      }
    },
    [selectFetched, selectLoading],
  );

  return {
    select: {
      loading: selectLoading,
      fetched: selectFetched,
      fetch: fetchSelect,
      ...selectItems,
      items: selectDifficultiesSelector(selectItems),
    },
  };
};
