import { downloadTemplate } from "giget"
import { getResolver } from "../getResolver"
import { Preferences } from "../prompts"
import { getUserPkgManager } from "../utils/getUserPkgManager"
import { writeFile } from "node:fs/promises"
import { say } from "../messages"

const GITHUB_GITS_UI = "github:gitsindonesia/ui-component"
const STARTER = `${GITHUB_GITS_UI}/starter`
const MINIMAL_TEMPLATE = `${STARTER}/nuxt-minimal`
const VUE_TEMPLATE = `${STARTER}/vue`
const ADMIN_TEMPLATE = `${STARTER}/nuxt-admin`
const AUTH_TEMPLATE = `${STARTER}/nuxt-auth`
const KITCHEN_SINK_TEMPLATE = `${STARTER}/kitchen-sink`
const COMMERCE_TEMPLATE = `${STARTER}/nuxt-commerce`

const KNOWN_TEMPLATES = {
  "minimal": MINIMAL_TEMPLATE,
  "full": "github:gitsindonesia/nuxt-starter",
  "vue": VUE_TEMPLATE,
  "admin": ADMIN_TEMPLATE,
  "auth": AUTH_TEMPLATE,
  "commerce": COMMERCE_TEMPLATE,
  "kitchen-sink": KITCHEN_SINK_TEMPLATE,
  "custom": MINIMAL_TEMPLATE,
}

// nuxt 3 + pnpm needs to shamefully hoist + we want to auto-install required peer dependencies (last one taken from: https://github.com/antfu/vitesse/blob/main/.npmrc)
const npmrc = `
shamefully-hoist=true
strict-peer-dependencies=false
`

export default async (preferences: Preferences) => {
  const templateName = KNOWN_TEMPLATES[preferences.setStack as keyof typeof KNOWN_TEMPLATES]

  // 1. Download template
  let template
  try {
    template = await downloadTemplate(templateName, {
      dir: preferences.setProjectName,
      registry: "https://raw.githubusercontent.com/nuxt/starter/templates/templates"
    })
  } catch (error) {
    console.log()
    say(`Failed to initialize project folder - does a folder with the same name already exist? Aborting mission. Here is the full error: \n${error}`)
    process.exit()
  }

  const resolver = getResolver(template.dir)

  const usingPnpm = getUserPkgManager() == "pnpm"
  if (usingPnpm) {
    await writeFile(resolver(".npmrc"), npmrc)
  }

  return template
}
