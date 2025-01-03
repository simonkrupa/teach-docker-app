import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(
  __dirname,
  '../../main/data/userProgress/usernamesStore.json',
);

function readUserProgress(username: string): string | undefined {
  try {
    console.log('Reading user progress', username, filePath);
    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    return jsonData[username];
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

function getExistingUserOrCreate(username: string): boolean {
  try {
    console.log('Reading user progress', username, filePath);
    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    if (jsonData[username] === undefined) {
      jsonData[username] = '0';
      fs.writeFileSync(filePath, JSON.stringify(jsonData));
      console.log('User created', username);
    }
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

function writeUserProgress(username: string): boolean {
  try {
    console.log('Writing user progress', username, filePath);
    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    if (jsonData[username] === undefined) {
      jsonData[username] = '0';
    } else {
      jsonData[username] = String(Number(jsonData[username]) + 1);
    }
    fs.writeFileSync(filePath, JSON.stringify(jsonData));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

module.exports = {
  readUserProgress,
  writeUserProgress,
  getExistingUserOrCreate,
};
