import prompts, { PromptType, type PromptObject } from "prompts";
import { say } from "./messages";
import { moduleConfigs } from "./steps/2.addModules/moduleConfigs";
import { getUserPkgManager } from "./utils/getUserPkgManager";

const skipIfCheviotWasChosen =
  (typeIfNotMerino: PromptType) =>
  (_: unknown, preferences: Record<string, string>) =>
    ["minimal", "full", "vue", "admin", "auth"].includes(preferences.setStack)
      ? null
      : typeIfNotMerino;

const PROJECT_NAME_NOUNS = [
  "app",
  "project",
  "endeavour",
  "undertaking",
  "enterprise",
  "venture",
  "experiment",
  "effort",
  "operation",
  "affair",
  "pursuit",
  "struggle",
  "adventure",
  "thing",
  "opportunity",
];

const getRandomProjectNoun = () =>
  PROJECT_NAME_NOUNS[Math.floor(Math.random() * PROJECT_NAME_NOUNS.length)];

const PROMPT_QUESTIONS: PromptObject[] = [
  {
    type: "text",
    name: "setProjectName",
    message: "What will your project be called?",
    initial: `morpheme-${getRandomProjectNoun()}`,
  },
  {
    type: "select",
    name: "setStack",
    message: "What stack would you like to use for your new project?",
    choices: [
      {
        title: "Nuxt Minimal",
        description: "A minimal Nuxt + Morpheme UI starter template",
        value: "minimal",
      },
      {
        title: "Nuxt Starter",
        description:
          "A full batteries included Nuxt + Morpheme UI starter template",
        value: "full",
      },
      {
        title: "Nuxt Admin",
        description: "Extensible admin template with Nuxt + Morpheme UI",
        value: "admin",
      },
      {
        title: "Nuxt Auth",
        description: "Extensible auth template with Nuxt + Morpheme UI",
        value: "auth",
      },
      {
        title: "Vue",
        description: "A minimal Vue + Morpheme UI starter template",
        value: "vue",
      },
      {
        title: "Custom",
        description: "Start from minimal and adds what you need.",
        value: "custom",
      },
    ],
    initial: 0,
  },
  {
    type: skipIfCheviotWasChosen("multiselect"),
    name: "addModules",
    message: "Which modules would you like to use?",
    choices: Object.entries(moduleConfigs).map(
      ([key, { humanReadableName, description }]) => ({
        title: humanReadableName,
        description,
        value: key,
      })
    ),
  },
  {
    type: "confirm",
    name: "runGitInit",
    message: "Initialize a new git repository?",
    initial: true,
  },
  {
    type: skipIfCheviotWasChosen("select"),
    name: "addCi",
    message: "Initialize a default CI pipeline?",
    choices: [
      {
        title: "No CI",
        description: "Scaffold a project without any CI pipeline",
        value: "none",
      },
      {
        title: "GitHub Actions",
        description: "Run your CI with GitHub actions.",
        value: "github",
      },
    ],
    initial: 0,
  },
  {
    type: "confirm",
    name: "runInstall",
    message: () => {
      const packageManager = getUserPkgManager();
      return `Would you like to run \`${packageManager} install\` after finishing up?`;
    },
    initial: true,
  },
];

const onCancel = () => {
  say("Aborting mission - have a pleasent day 👋");
  process.exit();
};

export const getUserPreferences = () => prompts(PROMPT_QUESTIONS, { onCancel });
export type Preferences = Awaited<ReturnType<typeof getUserPreferences>>;
