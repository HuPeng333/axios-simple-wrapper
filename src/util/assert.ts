export const nonNull = <T>(obj: T | undefined, msg: string): T => {
  if (!obj) {
    throw new Error(msg)
  }
  return obj
}
