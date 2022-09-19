import prompts, { PromptObject } from "prompts";
import fsx from "fs-extra";
import { resolve } from "path";
import prettier from "prettier";
import chalk from "chalk";

enum AppName {
  spotify = "spotify",
  glances = "glances",
  ipmi = "ipmi",
}

const ipmiPrompts: PromptObject[] = [
  {
    type: "text",
    name: "IpmiIp",
    message: `Enter the ip adress for ipmi control`,
  },
  {
    type: "text",
    name: "IpmiUser",
    message: "Enter your ipmi user name",
  },
  {
    type: "text",
    name: "IpmiPassword",
    message: "Enter your Ipmi password",
  },
];

const glancesPrompts: PromptObject[] = [
  {
    type: "text",
    name: "glancesIp",
    message: `Enter the ip adress of your glances web instance`,
  },
];

const spotifyPrompts: PromptObject[] = [
  {
    type: "text",
    name: "clientId",
    message: `Enter Spotify client id`,
  },
  {
    type: "text",
    name: "clientSecret",
    message: "Enter your Spotify client secret",
  },
  {
    type: "text",
    name: "userId",
    message: "Enter user id",
  },
  {
    type: "text",
    name: "dailyDriveId",
    message: "Enter daily drive id",
  },
];

const initial: PromptObject[] = [
  {
    type: "multiselect",
    name: "apps",
    message: "What are we setting up today?",
    choices: [
      { title: "Spotify credentials", value: AppName.spotify },
      { title: "Glances", value: AppName.glances },
      { title: "Ipmi credentials", value: AppName.ipmi },
    ],
    max: 3,
    min: 1,
    hint: "- Space to select. Return to submit",
  },
];

(async () => {
  try {
    const prettierConfig = await prettier.resolveConfig(process.cwd());

    const { apps } = await prompts(initial);

    if (apps.includes(AppName.spotify)) {
      console.log(`
      Setting up ${chalk.bgGreen("Spotify")} Credentials
      `);
      const spotifyResp = await prompts(spotifyPrompts);
      await fsx.writeFile(
        resolve("packages", "secrets", "spotify.local.json"),
        prettier.format(JSON.stringify(spotifyResp), {
          ...prettierConfig,
          parser: "json",
        })
      );
    }

    if (apps.includes(AppName.glances)) {
      console.log(`
      Setting up ${chalk.bgBlue("Glances")}
      `);
      const glancesResp = await prompts(glancesPrompts);
      await fsx.writeFile(
        resolve("packages", "secrets", "glances.local.json"),
        prettier.format(JSON.stringify(glancesResp), {
          ...prettierConfig,
          parser: "json",
        })
      );
    }

    if (apps.includes(AppName.ipmi)) {
      console.log(`
      Setting up ${chalk.bgYellow("Ipmi")} credentials
      `);
      const ipmiResp = await prompts(ipmiPrompts);
      await fsx.writeFile(
        resolve("packages", "secrets", "ipmi.local.json"),
        prettier.format(JSON.stringify(ipmiResp), {
          ...prettierConfig,
          parser: "json",
        })
      );
    }

    process.exit(0);
  } catch {
    process.exit(1);
  }
})();
