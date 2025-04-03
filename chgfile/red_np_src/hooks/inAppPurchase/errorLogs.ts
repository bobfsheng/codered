export const errorLog = ({ message, error }: { message: string; error: unknown }) => {
  // console.error('An error happened', message, error)
  console.log('An error happened', message, error)
}
