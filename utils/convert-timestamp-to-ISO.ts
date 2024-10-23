import { Timestamp } from 'firebase/firestore';

export const convertTimestampToISO = (data: any, isUpdated?: boolean) => {
  if (data?.createdAt instanceof Timestamp) {
    return {
      ...data,
      createdAt: data.createdAt.toDate().toISOString(),
      updatedAt: isUpdated ? new Date().toISOString() : null
    };
  }
  return data;
};
