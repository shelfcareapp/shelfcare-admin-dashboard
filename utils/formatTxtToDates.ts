export const formatTxtToDates = (text) =>
  text
    .split('\n')
    .map((row) => row.trim().split(/(?<=^\S+)\s+/))
    .map((element) => {
      return {
        date: new Date(element[0]),
        time: element[1] || ''
      };
    });
