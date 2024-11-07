import { isAfter } from 'date-fns';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { formatTxtToDates } from 'utils/formatTxtToDates';

export const useTimeOptions = () => {
  const [pickupDates, setPickupDates] = useState<
    { date: Date; time: string }[]
  >([]);
  const [returnDates, setReturnDates] = useState<
    { date: Date; time: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const removeDuplicates = (datesArray: { date: Date; time: string }[]) => {
    return datesArray.filter(
      (value, index, self) =>
        index ===
        self.findIndex((t) => t.date.getTime() === value.date.getTime())
    );
  };

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const [pickupDateResponse, returnDateResponse] = await Promise.all([
          fetch(
            'https://m8v1yt95qjd1nofn.public.blob.vercel-storage.com/pickupDates.txt'
          ),
          fetch(
            'https://m8v1yt95qjd1nofn.public.blob.vercel-storage.com/returnDates.txt'
          )
        ]);

        const pickupDatesText = await pickupDateResponse.text();
        const returnDatesText = await returnDateResponse.text();

        const today = new Date();
        const parsedPickupDates = removeDuplicates(
          formatTxtToDates(pickupDatesText)
        ).filter((date) => isAfter(date.date, today));
        const parsedReturnDates = removeDuplicates(
          formatTxtToDates(returnDatesText)
        ).filter((date) => isAfter(date.date, today));

        setPickupDates(parsedPickupDates);
        setReturnDates(parsedReturnDates);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch dates. Please try again later.');
        setLoading(false);
      }
    };

    fetchDates();
  }, []);

  return { pickupDates, returnDates, loading };
};
