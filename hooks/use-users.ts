import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useEffect, useState } from 'react';
import { SelectableUser } from 'types';

export const useUsers = () => {
  const [users, setUsers] = useState<SelectableUser[]>([]);

  useEffect(() => {
    const usersRef = collection(db, 'chats');

    const unsubscribe = onSnapshot(
      usersRef,
      (snapshot) => {
        const fetchedUsers: SelectableUser[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'Unknown',
            email: data.email || 'No email',
            address: data.address || 'No address',
            phone: data.phone || 'No phone',
            entranceInfo: data.entranceInfo || 'No entrance info',
            postalCode: data.postalCode || 'No postal code'
          };
        });
        setUsers(fetchedUsers);
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  return { users };
};
