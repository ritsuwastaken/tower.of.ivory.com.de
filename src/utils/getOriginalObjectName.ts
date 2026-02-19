import { Item } from '@/types/item'

export function getOriginalObjectName(data: Item): string {
  if (
    data.is_changed &&
    data.changes?.object_name &&
    data.changes.object_name.old
  ) {
    return data.changes.object_name.old
  }
  return data.object_name
}
