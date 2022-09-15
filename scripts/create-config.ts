import prompts, { PromptObject } from "prompts";
import { writeJSON } from "fs-extra";

(async () => {
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
    }
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

  const initial: PromptObject[] = [{
    type: 'multiselect',
  name: 'apps',
  message: 'What are we settingup today?',
  choices: [
    { title: 'Spotify credentials', value: 'spotify' },
    { title: 'Glances', value: 'glances' },
    { title: 'Ipmi credentials', value: 'ipmi'}
  ],
  max: 3,
  hint: '- Space to select. Return to submit'}
  ];

  const response = await prompts(initial);
  console.log(response)
  // await writeJSON("secrets.json", response);
  process.exit(0);
})();
