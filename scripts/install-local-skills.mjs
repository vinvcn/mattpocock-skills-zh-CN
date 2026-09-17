import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(repoRoot, "skills");
const installRoot = process.env.CODEX_AGENTS_SKILLS_DIR ?? path.join(os.homedir(), ".agents", "skills");
const lockPath = path.join(path.dirname(installRoot), ".skill-lock.json");
const dryRun = process.argv.includes("--dry-run");
const sourceUrl = "https://github.com/vinvcn/mattpocock-skills-zh-CN.git";

function listSkillDirs() {
  const buckets = ["engineering", "productivity", "misc", "in-progress"];
  return buckets.flatMap((bucket) => {
    const bucketRoot = path.join(sourceRoot, bucket);
    if (!fs.existsSync(bucketRoot)) return [];
    return fs.readdirSync(bucketRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(bucketRoot, entry.name, "SKILL.md")))
      .map((entry) => ({ name: entry.name, source: path.join(bucketRoot, entry.name) }));
  });
}

function collectFiles(root, current = root) {
  return fs.readdirSync(current, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === ".git" || entry.name === "node_modules") return [];
    const fullPath = path.join(current, entry.name);
    if (entry.isDirectory()) return collectFiles(root, fullPath);
    return [{ fullPath, relativePath: path.relative(root, fullPath).split(path.sep).join("/") }];
  });
}

function folderHash(root) {
  const hash = crypto.createHash("sha256");
  for (const file of collectFiles(root).sort((a, b) => a.relativePath.localeCompare(b.relativePath))) {
    hash.update(file.relativePath);
    hash.update(fs.readFileSync(file.fullPath));
  }
  return hash.digest("hex");
}

const skills = listSkillDirs();
if (!skills.length) {
  console.error("没有找到可安装的 skill");
  process.exit(1);
}

console.log(`来源: ${repoRoot}`);
console.log(`目标: ${installRoot}`);
console.log(`skills: ${skills.length}`);

if (!dryRun) {
  fs.mkdirSync(path.dirname(installRoot), { recursive: true });
  if (fs.existsSync(installRoot)) {
    const stamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
    const backupRoot = `${installRoot}.backup-before-codex-sync-${stamp}`;
    fs.cpSync(installRoot, backupRoot, { recursive: true, errorOnExist: true });
    console.log(`已备份: ${backupRoot}`);
  }
  fs.mkdirSync(installRoot, { recursive: true });
}

let lock = { version: 3, skills: {} };
if (fs.existsSync(lockPath)) {
  try {
    lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
  } catch (error) {
    console.error(`无法读取 ${lockPath}: ${error.message}`);
    process.exit(1);
  }
}

const updatedAt = new Date().toISOString();
for (const { name, source } of skills) {
  const target = path.join(installRoot, name);
  console.log(`${dryRun ? "将同步" : "同步"}: ${name}`);
  if (!dryRun) fs.cpSync(source, target, { recursive: true, force: true });

  const previous = lock.skills[name] ?? {};
  lock.skills[name] = {
    ...previous,
    source,
    sourceType: "local",
    sourceUrl,
    skillPath: path.relative(repoRoot, path.join(source, "SKILL.md")).split(path.sep).join("/"),
    skillFolderHash: folderHash(source),
    pluginName: "mattpocock-skills-zh-CN",
    updatedAt,
  };
}

if (!dryRun) {
  fs.writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`);
  console.log(`已更新来源锁定: ${lockPath}`);
}

console.log(dryRun ? "预览完成。" : "本地 skill 同步完成。其他个人 skills 未修改；目标 skill 的旧版本可从备份恢复。");
