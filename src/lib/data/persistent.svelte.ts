import type { Identity } from "$lib/types/identity"
import type { CostCategory, Currency } from "$lib/types/money"
import * as localStorageFacade from "$lib/infrastructure/localStorage"
import { costCategoriesList, equityList, userAuth } from "./api"
import type { Response } from "$lib/types/response"

class PersistentData {
  identity: Identity | null = $state(
    localStorageFacade.get<Identity>("identity")
  )
  currencies: Currency[] | null = $state(
    localStorageFacade.get<Currency[]>("currencies")
  )
  costCategories: CostCategory[] | null = $state(
    localStorageFacade.get<CostCategory[]>("costCategories")
  )

  // DERIVED STATE
  mobileDevice: boolean = $derived(window.innerWidth <= 500)
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

  // unauthorize user session
  async unauthorize(): Promise<void> {
    this.identity = null
    localStorageFacade.set("identity", null)
  }

  // authenticate user and save identity information
  async loadIdentity(token: string): Promise<void> {
    try {
      const identityResponse: Response<Identity> = await userAuth({
        token: token,
      })
      this.identity = identityResponse.result
      localStorageFacade.set("identity", this.identity)
    } catch (e) {
      this.identity = null
      localStorageFacade.set("identity", null)
    }
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

  // flush the LocalStorage according to the application state
  flush(): void {
    if (this.identity)
      localStorageFacade.set<Identity>("identity", this.identity)
    if (this.currencies)
      localStorageFacade.set<Currency[]>("currencies", this.currencies)
    if (this.costCategories)
      localStorageFacade.set<CostCategory[]>(
        "costCategories",
        this.costCategories
      )
  }
}

export const persistent: PersistentData = new PersistentData()
