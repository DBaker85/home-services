import { setupDirectories } from "./helpers/helpers";

const setupFolders = (): void => {
  try {
    setupDirectories({
      baseDir: "./docker-data",
      subDirs: ["mongo", "topology", "topology/certs"],
    });
    process.exit(0);
  } catch (err) {
    console.log("Something went wrong");
    console.log(err);
    process.exit(1);
  }
};

setupFolders();
