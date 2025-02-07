import * as fs from 'fs';
import * as path from 'path';

let filePath = '';

function createFileIfNotExists(appPath: string): void {
  const dbFolderPath = path.join(appPath, 'userProgress');
  const dbFilePath = path.join(dbFolderPath, 'usernamesStore.json');
  console.log('Checking if file exists', appPath);
  if (!fs.existsSync(dbFolderPath)) {
    console.log('Creating folder', dbFolderPath);
    fs.mkdirSync(dbFolderPath, { recursive: true });
  }

  if (!fs.existsSync(dbFilePath)) {
    console.log('Creating file', dbFilePath);
    fs.writeFileSync(dbFilePath, '{}');
    filePath = dbFilePath;
  } else {
    filePath = dbFilePath;
  }

  console.log('File ', filePath);
}

function getExistingUserOrCreate(username: string): string | undefined {
  try {
    console.log('Reading user progress', username, filePath);
    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    if (jsonData[username] === undefined) {
      jsonData[username] = '1';
      fs.writeFileSync(filePath, JSON.stringify(jsonData));
      console.log('User created', username);
    }
    return jsonData[username];
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

function increaseUserProgress(username: string): boolean {
  try {
    console.log('Increasing user progress', username, filePath);
    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    if (jsonData[username] !== undefined) {
      jsonData[username] = String(Number(jsonData[username]) + 1);
    } else {
      console.error('User does not exist', username);
      return false;
    }
    fs.writeFileSync(filePath, JSON.stringify(jsonData));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export { getExistingUserOrCreate, increaseUserProgress, createFileIfNotExists };
