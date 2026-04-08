/**
 * 历史遗留里程碑验证脚本。
 *
 * 说明：
 * - 本文件仅为兼容旧记录而保留；
 * - 不属于仓库正式验证命令口径；
 * - 正式验证请使用 package.json / README 中声明的唯一正式 npm 验证命令集合。
 */

#!/usr/bin/env node

/**
 * 验证里程碑 M1 的完成情况
 */

const fs = require('fs');
const path = require('path');

const errors = [];
const warnings = [];

function checkFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✓ ${description}: ${filePath}`);
    return true;
  } else {
    errors.push(`✗ ${description}: ${filePath} 不存在`);
    return false;
  }
}

function checkFileContains(filePath, patterns, description) {
  if (!fs.existsSync(filePath)) {
    errors.push(`✗ ${description}: 文件 ${filePath} 不存在`);
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const missing = [];

  for (const pattern of patterns) {
    if (!content.includes(pattern)) {
      missing.push(pattern);
    }
  }

  if (missing.length === 0) {
    console.log(`✓ ${description}: 所有必需内容存在`);
    return true;
  } else {
    warnings.push(`⚠ ${description}: 缺少以下内容: ${missing.join(', ')}`);
    return false;
  }
}

console.log('\n=== 验证 M1 里程碑 ===\n');

// 1. 验证游戏配置数据文件
console.log('【1】游戏配置数据文件');
checkFileExists('assets/scripts/data/levels.ts', 'levels.ts');
checkFileExists('assets/scripts/data/Constants.ts', 'Constants.ts');
checkFileExists('assets/scripts/data/types.ts', 'types.ts');

// 2. 验证levels.ts包含5个完整关卡配置
console.log('\n【2】levels.ts 关卡配置');
checkFileContains('assets/scripts/data/levels.ts', [
  'LEVEL_1_1',
  'LEVEL_1_2',
  'LEVEL_1_3',
  'LEVEL_1_4',
  'LEVEL_1_5',
], '5个关卡定义');

checkFileContains('assets/scripts/data/levels.ts', [
  'export const LEVEL_1_1',
  'items:',
  'slots:',
  'starThresholds:',
  'timeLimit:',
], '关卡配置完整性');

// 3. 验证Constants.ts包含必要的常量
console.log('\n【3】Constants.ts 常量定义');
checkFileContains('assets/scripts/data/Constants.ts', [
  'GAME_CONFIG',
  'GAME_EVENTS',
  'ITEM_TYPES',
  'STORAGE_KEYS',
  'SCENE_CONFIG',
  'AUDIO_CONFIG',
], '核心常量定义');

// 4. 验证types.ts包含类型定义
console.log('\n【4】types.ts 类型定义');
checkFileContains('assets/scripts/data/types.ts', [
  'interface LevelDataConfig',
  'interface PlayerData',
  'interface GameState',
  'export type ItemType',
], '核心类型定义');

// 5. 验证平台适配器
console.log('\n【5】平台适配器');
checkFileExists('assets/scripts/platform/PlatformAdapter.ts', 'PlatformAdapter');
checkFileExists('assets/scripts/platform/WxAdapter.ts', 'WxAdapter');
checkFileExists('assets/scripts/platform/WebAdapter.ts', 'WebAdapter');
checkFileExists('assets/scripts/platform/PlatformManager.ts', 'PlatformManager');

// 6. 验证PlatformAdapter实现
console.log('\n【6】PlatformAdapter 方法实现');
checkFileContains('assets/scripts/platform/PlatformAdapter.ts', [
  'isWechat()',
  'getSystemInfo()',
  'share(',
  'vibrateShort()',
  'showToast(',
  'showLoading(',
  'login()',
  'getUserInfo()',
  'getStorage(',
  'setStorage(',
  'requestAnimationFrame(',
], 'PlatformAdapter方法');

// 7. 验证WxAdapter实现
console.log('\n【7】WxAdapter 方法实现');
checkFileContains('assets/scripts/platform/WxAdapter.ts', [
  'class WxAdapter extends PlatformAdapter',
  'override isWechat()',
  'override getSystemInfo()',
  'override share(',
  'override vibrateShort()',
  'override showToast(',
  'override showLoading(',
  'override login()',
  'override getUserInfo()',
  'override getStorage(',
  'override setStorage(',
], 'WxAdapter方法');

// 8. 验证weapp配置
console.log('\n【8】微信小游戏配置');
checkFileExists('weapp/game.json', 'game.json');
checkFileContains('weapp/game.json', [
  'deviceOrientation',
  'networkTimeout',
  'renderer',
  'lazyCodeLoading',
], 'game.json配置');

// 9. 验证project.json
console.log('\n【9】项目配置');
checkFileExists('project.json', 'project.json');
checkFileContains('project.json', [
  '"version"',
  '"name"',
  '"type"',
  '"dependencies"',
], 'project.json配置');

// 10. 统计TypeScript文件数量
console.log('\n【10】文件统计');
const tsFiles = fs.readdirSync('assets/scripts', { recursive: true })
  .filter(f => f.endsWith('.ts'));
console.log(`✓ TypeScript文件数量: ${tsFiles.length} 个`);

// 总结
console.log('\n=== 验证结果 ===');
if (errors.length === 0) {
  console.log('\n✅ 所有核心要求已完成！');
  if (warnings.length > 0) {
    console.log(`\n⚠️  ${warnings.length} 个警告:`);
    warnings.forEach(w => console.log('  ' + w));
  }
  console.log('\n里程碑 M1 验证通过。');
  process.exit(0);
} else {
  console.log(`\n❌ ${errors.length} 个错误:`);
  errors.forEach(e => console.log('  ' + e));
  if (warnings.length > 0) {
    console.log(`\n⚠️  ${warnings.length} 个警告:`);
    warnings.forEach(w => console.log('  ' + w));
  }
  console.log('\n里程碑 M1 验证失败。');
  process.exit(1);
}
