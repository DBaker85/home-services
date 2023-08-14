import fsx from "fs-extra";
import chalk from "chalk";

interface Folder {
  name: string;
  exists: boolean;
  children: Folder[];
}

function createFolderStructure(baseDir: string, subDirs: string[]): Folder {
  const rootFolder: Folder = {
    name: baseDir,
    exists: fsx.existsSync(baseDir),
    children: [],
  };

  for (const subDir of subDirs) {
    const dirPathSegments = subDir.split("/");
    const dirName = dirPathSegments[dirPathSegments.length - 1];

    let currentFolder = rootFolder;
    for (let i = 0; i < dirPathSegments.length - 1; i++) {
      const segment = dirPathSegments[i];
      const existingChild = currentFolder.children.find(
        (child) => child.name === segment
      );

      if (existingChild != null) {
        currentFolder = existingChild;
      } else {
        const newChild: Folder = {
          name: segment,
          exists: false,
          children: [],
        };
        currentFolder.children.push(newChild);
        currentFolder = newChild;
      }
    }

    const finalChild: Folder = {
      name: dirName,
      exists: fsx.existsSync(baseDir + "/" + subDir), // Update the exists status based on existing subdirectory
      children: [],
    };

    currentFolder.children.push(finalChild);
  }
  return rootFolder;
}

function displayFolderTree(
  folder: Folder,
  prefix: string = "",
  last: boolean = true
): void {
  const branchSymbol = last ? "└─ " : "├─ ";
  const lineSymbol = last ? "   " : "│  ";
  const status = folder.exists
    ? `${chalk.gray("exists")}`
    : `${chalk.green("created")}`;
  console.log(
    `${prefix}${branchSymbol}${folder.name.replace("./", "")} ${status}`
  );

  for (let i = 0; i < folder.children.length; i++) {
    const child = folder.children[i];
    const isLast = i === folder.children.length - 1;
    displayFolderTree(child, `${prefix}${last ? "    " : lineSymbol}`, isLast);
  }
}

function createFolders(folder: Folder, parentPath: string = ""): void {
  const folderPath =
    parentPath !== "" ? `${parentPath}/${folder.name}` : folder.name;

  if (!folder.exists) {
    fsx.mkdirSync(folderPath);
  }

  for (const child of folder.children) {
    createFolders(child, folderPath);
  }
}

export const setupDirectories = ({
  baseDir,
  subDirs,
}: {
  baseDir: string;
  subDirs: string[];
}): void => {
  const folderStructure = createFolderStructure(baseDir, subDirs);

  console.log(`
  Creating data folders
  `);
  createFolders(folderStructure);
  displayFolderTree(folderStructure);
};
