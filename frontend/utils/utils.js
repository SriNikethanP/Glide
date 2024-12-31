export function formatTime(timestamp) {
  const date = new Date(timestamp);

  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;

  return formattedTime;
}

export const formatDate = (dateString) => {
  const messageDate = new Date(dateString);

  // Check if the date is valid
  if (!messageDate) {
    console.error("Invalid date:", dateString);
    return "";
  }

  const today = new Date();

  // Reset the time part for comparison purposes (only date)
  today.setHours(0, 0, 0, 0);

  // Check if the message was sent today
  if (messageDate >= today) {
    return "Today";
  }

  // Check if the message was sent yesterday
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (messageDate >= yesterday && messageDate < today) {
    return "Yesterday";
  }

  // For older dates, format in the "Month Day, Year" format
  return messageDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
