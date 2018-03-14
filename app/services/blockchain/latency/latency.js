function getColor(latency) {
  const status = getStatus(latency);
  switch (status) {
    case 'low':
      return 'green';
    case 'medium':
      return 'orange';
    case 'high':
      return 'red';
    default:
      return 'red';
  }
}

function getStatus(latency) {
  if (latency < 500) {
    return 'low';
  }
  if (latency < 1000) {
    return 'medium';
  }
  if (latency > 1000) {
    return 'high';
  }
}

export {
  getColor,
  getStatus
};
