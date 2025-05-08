export type Response<T> = {
  result: T
}

export type ResponseMulti<T> = {
  result: T[]
}

export type PaginatedResponse<T> = {
  result: T[]
  context: number
  left: number
}
