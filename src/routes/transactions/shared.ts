import type { CostCategory, Currency, SelectionItem } from "$lib/types/money"

export function currenciesToSelectionItems(items: Currency[]): SelectionItem[] {
  return items.map((item) => ({ value: item.id, content: item.sign }))
}

export function costCategoriesToSelectionItems(
  items: CostCategory[]
): SelectionItem[] {
  return items ? items.map((item) => ({ value: item.id, content: item.name })) : []
}

// todo: move to the infrastructure
export function stringsToSelectionItems(items: string[]): SelectionItem[] {
  return items ? items.map((item, _) => ({ value: item, content: item })) : []
}
