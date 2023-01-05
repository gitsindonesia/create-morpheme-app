import { execa } from "execa"

export default (templateDir: string) => {
  execa("npx", ["husky install"], { cwd: templateDir })
  execa("npx", ["husky add .husky/commit-msg 'npx --no -- commitlint --edit ${1}'"], { cwd: templateDir })
}
