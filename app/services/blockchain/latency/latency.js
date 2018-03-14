function getColor(latency) {
  if (latency < 500) {
    return 'green';
  }
  if (latency < 1000) {
    return 'orange';
  }
  if (latency > 1000) {
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
