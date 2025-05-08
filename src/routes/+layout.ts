export const csr = true
export const ssr = false
export const prerender = false

// import { browser } from "$app/environment"
// import { userLogin } from "$lib/data/api"
// import type { Identity } from "$lib/types/identity"
// import type { LayoutLoad } from "./$types"

// export const load: LayoutLoad = async (): Promise<{
//   identity: Identity
// }> => {
//   if (!persistentData.identity || !persistentData.identity.accessToken) {
//     throw Error("no persistent identity found")
//   }

//   if (browser) {
//     const identityResponse = await userLogin({
//       username: "john",
//       password: "password",
//     })
//     return { identity: identityResponse.result }
//   }
//   throw new Error("can not load user")
// }
