export const computePaging = (page: number, limit: number) => {
  const safePage = Number.isFinite(page) && page >= 1 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit >= 1 ? limit : 10;
  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
  };
};