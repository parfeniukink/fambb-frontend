import type { Identity } from "$lib/types/identity"
import type {
  CostCategory,
  CostShortcut,
  Currency,
  Equity,
} from "$lib/types/money"
import * as localStorageFacade from "$lib/infrastructure/localStorage"
import { costCategoriesList, equityList, userLogin } from "./api"
import type { Response } from "$lib/types/response"

class PersistentData {
  identity: Identity | null = $state(
    localStorageFacade.get<Identity>("identity")
  )
  authenticated: boolean = $derived(
    this.identity && this.identity.accessToken ? true : false
  )
  defulatCurrencyId: number | null = $derived.by(() => {
    if (
      this.identity &&
      this.identity.user.configuration &&
      this.identity.user.configuration.defaultCurrency
    ) {
      return this.identity.user.configuration.defaultCurrency.id
    }

    return null
  })
  defulatCostCategoryId: number | null = $derived.by(() => {
    if (
      this.identity &&
      this.identity.user.configuration &&
      this.identity.user.configuration.defaultCostCategory
    ) {
      return this.identity.user.configuration.defaultCostCategory.id
    }

    return null
  })
  currencies: Currency[] | null = $state(
    localStorageFacade.get<Currency[]>("currencies")
  )
  costCategories: CostCategory[] | null = $state(
    localStorageFacade.get<CostCategory[]>("costCategories")
  )

  // unauthorize user session
  async unauthorize(): Promise<void> {
    this.authenticated = false
    localStorageFacade.set("identity", null)
  }

  // authenticate user and save identity information
  async loadIdentity(username: string, password: string): Promise<void> {
    const identityResponse: Response<Identity> = await userLogin({
      username: username,
      password: password,
    })

    this.identity = identityResponse.result
    localStorageFacade.set<Identity>("identity", this.identity)
  }

  async initialize(): Promise<void> {
    const [equitiesResponse, costCategoriesResopnse] = await Promise.all([
      equityList(),
      costCategoriesList(),
    ])

    this.currencies = equitiesResponse.result.map((item) => item.currency)
    this.costCategories = costCategoriesResopnse.result

    localStorageFacade.set<Currency[]>("currencies", this.currencies)
    localStorageFacade.set<CostCategory[]>(
      "costCategories",
      this.costCategories
    )
  }
}

export const persistent: PersistentData = new PersistentData()
