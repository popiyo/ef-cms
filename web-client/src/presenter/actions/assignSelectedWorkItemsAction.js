import { state } from 'cerebral';

export default async ({ applicationContext, get, store }) => {
  const selectedWorkItems = get(state.selectedWorkItems);
  const sectionWorkQueue = get(state.sectionWorkQueue);
  const workQueue = get(state.workQueue);
  const assigneeId = get(state.assigneeId);
  const assigneeName = get(state.assigneeName);
  const userId = get(state.user.token);

  await applicationContext.getUseCases().assignWorkItems({
    applicationContext,
    workItems: selectedWorkItems.map(workItem => ({
      workItemId: workItem.workItemId,
      assigneeId,
      assigneeName,
    })),
    userId,
  });

  store.set(
    state.sectionWorkQueue,
    sectionWorkQueue.map(workItem => {
      if (
        selectedWorkItems.find(item => item.workItemId === workItem.workItemId)
      ) {
        return {
          ...workItem,
          assigneeId,
          assigneeName,
        };
      } else {
        return workItem;
      }
    }),
  );

  selectedWorkItems.forEach(item => {
    if (!workQueue.find(existing => existing.workItemId === item.workItemId)) {
      workQueue.push(item);
    }
  });

  const filteredWorkQueue = workQueue.filter(
    item => item.assigneeId !== userId,
  );

  store.set(state.workQueue, filteredWorkQueue);
  store.set(state.selectedWorkItems, []);
};
