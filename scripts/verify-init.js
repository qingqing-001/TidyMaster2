#!/usr/bin/env node

/**
 * 历史遗留 JS 验证入口。
 *
 * 说明：
 * - 本文件仅为兼容旧排障流程而保留；
 * - 不属于仓库正式验证命令口径；
 * - 正式验证请使用 package.json / README 中声明的唯一正式 npm 验证命令集合。
 *
 * 这个脚本在不运行 Cocos 引擎的情况下验证代码逻辑，现仅保留作历史排障参考。
 */

const fs = require('fs');
const path = require('path');

console.log('=== 代码初始化验证 ===\n');

let allPassed = true;

// 1. 验证核心管理器文件存在
console.log('【1】检查核心文件');
const coreFiles = [
  'assets/scripts/core/GameManager.ts',
  'assets/scripts/core/EventManager.ts',
  'assets/scripts/core/DataManager.ts',
  'assets/scripts/audio/AudioManager.ts',
  'assets/scripts/gameplay/LevelManager.ts',
  'assets/scripts/gameplay/TimerController.ts',
  'assets/scripts/gameplay/DragHandler.ts',
  'assets/scripts/gameplay/ItemController.ts',
  'assets/scripts/gameplay/SlotController.ts',
];

for (const file of coreFiles) {
  if (fs.existsSync(file)) {
    console.log(`  ✓ ${file}`);
  } else {
    console.log(`  ✗ ${file} 不存在`);
    allPassed = false;
  }
}

// 2. 验证场景文件存在
console.log('\n【2】检查场景文件');
const sceneFiles = [
  'assets/scenes/Launch.scene',
  'assets/scenes/Home.scene',
  'assets/scenes/Game.scene',
  'assets/scenes/Result.scene',
  'assets/scenes/MyRoom.scene',
];

for (const file of sceneFiles) {
  if (fs.existsSync(file)) {
    console.log(`  ✓ ${file}`);
  } else {
    console.log(`  ✗ ${file} 不存在`);
    allPassed = false;
  }
}

// 3. 验证场景脚本存在
console.log('\n【3】检查场景脚本');
const sceneScripts = [
  'assets/scripts/scenes/LaunchScene.ts',
  'assets/scripts/scenes/HomeScene.ts',
  'assets/scripts/scenes/GameScene.ts',
  'assets/scripts/scenes/ResultScene.ts',
];

for (const file of sceneScripts) {
  if (fs.existsSync(file)) {
    console.log(`  ✓ ${file}`);
  } else {
    console.log(`  ✗ ${file} 不存在`);
    allPassed = false;
  }
}

// 4. 验证 GameManager 场景切换逻辑
console.log('\n【4】验证 GameManager 场景切换逻辑');
const gameManagerCode = fs.readFileSync('assets/scripts/core/GameManager.ts', 'utf-8');

const sceneMethods = [
  'goToLaunchScene',
  'goToHomeScene', 
  'goToGameScene',
  'goToResultScene',
  'goToMyRoomScene',
  'loadScene',
  'transitionToScene',
];

for (const method of sceneMethods) {
  if (gameManagerCode.includes(method)) {
    console.log(`  ✓ 包含方法 ${method}()`);
  } else {
    console.log(`  ✗ 缺少方法 ${method}()`);
    allPassed = false;
  }
}

// 5. 验证事件系统
console.log('\n【5】验证事件系统');
const constantsCode = fs.readFileSync('assets/scripts/data/Constants.ts', 'utf-8');
if (constantsCode.includes('CHANGE_SCENE')) {
  console.log('  ✓ 包含 CHANGE_SCENE 事件');
} else {
  console.log('  ✗ 缺少 CHANGE_SCENE 事件');
  allPassed = false;
}

// 6. 验证 TypeScript 编译
console.log('\n【6】TypeScript 编译检查');
try {
  const { execSync } = require('child_process');
  execSync('npm exec tsc -- --noEmit', { stdio: 'pipe' });
  console.log('  ✓ TypeScript 编译通过');
} catch (e) {
  console.log('  ✗ TypeScript 编译有错误');
  allPassed = false;
}

// 7. 验证编辑器配置文档
console.log('\n【7】验证编辑器配置文档');
if (fs.existsSync('EDITOR_SETUP.md')) {
  const editorSetup = fs.readFileSync('EDITOR_SETUP.md', 'utf-8');
  if (editorSetup.includes('LaunchScene') && editorSetup.includes('HomeScene')) {
    console.log('  ✓ 编辑器配置文档完整');
  } else {
    console.log('  ✗ 编辑器配置文档不完整');
    allPassed = false;
  }
} else {
  console.log('  ✗ 缺少 EDITOR_SETUP.md');
  allPassed = false;
}

// 总结
console.log('\n=== 验证结果 ===');
if (allPassed) {
  console.log('\n✅ 代码层面验证通过！');
  console.log('\n说明:');
  console.log('- 所有核心代码文件存在');
  console.log('- 场景切换逻辑完整');
  console.log('- TypeScript 编译通过');
  console.log('- 编辑器配置文档完整');
  console.log('\n注意: 需要在 Cocos Creator 编辑器中完成以下步骤才能运行游戏:');
  console.log('1. 打开项目');
  console.log('2. 为场景挂载脚本组件');
  console.log('3. 配置启动场景');
  process.exit(0);
} else {
  console.log('\n❌ 验证失败');
  process.exit(1);
}
