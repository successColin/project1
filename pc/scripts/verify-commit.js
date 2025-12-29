import { readFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const msgPath = path.resolve('.git/COMMIT_EDITMSG')
const msg = readFileSync(msgPath, 'utf-8').trim()

const commitRE =
  /^(?:revert: )?(?:feat|fix|docs|dx|style|refactor|perf|test|workflow|build|ci|chore|types|wip|mod|release|strengthen)(?:\(.+\))?: .{1,50}/

// { value: 'feat', name: 'feat:     新增功能 | A new feature', emoji: ':sparkles:' },
// { value: 'fix', name: 'fix:      修复缺陷 | A bug fix', emoji: ':bug:' },
// { value: 'docs', name: 'docs:     文档更新 | Documentation only changes', emoji: ':memo:' },
// { value: 'style', name: 'style:    代码格式 | Changes that do not affect the meaning of the code', emoji: ':lipstick:' },
// { value: 'refactor', name: 'refactor: 代码重构 | A code change that neither fixes a bug nor adds a feature', emoji: ':recycle:' },
// { value: 'perf', name: 'perf:     性能提升 | A code change that improves performance', emoji: ':zap:' },
// { value: 'test', name: 'test:     测试相关 | Adding missing tests or correcting existing tests', emoji: ':white_check_mark:' },
// { value: 'build', name: 'build:    构建相关 | Changes that affect the build system or external dependencies', emoji: ':package:' },
// { value: 'ci', name: 'ci:       持续集成 | Changes to our CI configuration files and scripts', emoji: ':ferris_wheel:' },
// { value: 'chore', name: 'chore:    其他修改 | Other changes that don\'t modify src or test files', emoji: ':hammer:' },
// { value: 'revert', name: 'revert:   回退代码 | Reverts a previous commit', emoji: ':rewind:' },
if (!commitRE.test(msg)) {
  console.error(`
  ❌ 提交信息格式错误，请使用如下格式：
    feat(模块): 描述信息（最多50字符）

  示例：
    feat(login): 添加登录功能
    fix(api): 修复请求错误
  `)
  process.exit(1)
}
