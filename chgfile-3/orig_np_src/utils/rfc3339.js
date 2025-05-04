const rfc3339 = d => {
  const pad = n => {
    return n < 10 ? '0' + n : n
  }
  return (
    d?.getFullYear() +
    '-' +
    pad(d?.getMonth() + 1) +
    '-' +
    pad(d?.getDate()) +
    'T' +
    pad(d?.getHours()) +
    ':' +
    pad(d?.getMinutes()) +
    ':' +
    pad(d?.getSeconds()) +
    'Z'
  )
}

export { rfc3339 }
