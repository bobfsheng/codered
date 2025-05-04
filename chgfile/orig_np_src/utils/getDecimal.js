const getDecimal = num => {
  if (Number.isInteger(num)) {
    return 0
  }

  const decimalStr = num?.toString()?.split('.')[1]
  return decimalStr?.length
}

export { getDecimal }
