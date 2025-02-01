const timeLeft = (isoDate) => {
  const dateToCheck = new Date(isoDate);
  const dateAfterOneYear = new Date(dateToCheck);
  dateAfterOneYear.setFullYear(dateAfterOneYear.getFullYear() + 1);

  const currentDate = new Date();

  const timeDifference = dateAfterOneYear - currentDate;

  if (timeDifference < 0) {
    const exceededDays = Math.abs(
      Math.floor(timeDifference / (1000 * 60 * 60 * 24))
    );
    const exceededMonths = Math.floor(exceededDays / 30);
    const days = exceededDays % 30;

    return { exceeded: true, months: exceededMonths, days };
  }

  const totalDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;

  return { exceeded: false, months, days };
};

export default { timeLeft };
