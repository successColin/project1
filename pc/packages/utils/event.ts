import { toHandlerName } from './convert'

type EventHandlers = Record<string, <T>(...args: T[]) => void>

export const getFilteredEventNames = <T>(emits: T) =>
  Object.keys(emits!).filter(e => !e.startsWith('update:'))

const createHandler =
  <B>(
    eventName: string,
    emit: <T>(event: string, ...args: T[]) => void,
    backups: B,
  ) =>
  <T>(...args: T[]) =>
    emit(eventName, ...args, backups as unknown as T)

export const createEventHandlers = <E, B>(
  emits: E,
  emit: <T>(event: string, ...args: T[]) => void,
  backups: B,
) => {
  return getFilteredEventNames(emits).reduce(
    (acc, key) =>
      Object.assign(acc, {
        [toHandlerName(key)]: createHandler(key, emit, backups),
      }),
    {} as EventHandlers,
  )
}
