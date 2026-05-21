/* eslint-disable no-template-curly-in-string */
/**
 * 内置关键字
 */
export const KEY_WORDS = [
  // Groovy 关键字
  {
    label: 'def',
    kind: 17,
    documentation: '定义变量',
    insertText: 'def ',
  },
  {
    label: 'return',
    kind: 17,
    documentation: '返回值',
    insertText: 'return ',
  },
  {
    label: 'if',
    kind: 17,
    documentation: '条件语句',
    insertText: 'if (${1:condition}) {\n\t${2:// code}\n}',
    insertTextRules: 4,
  },
  {
    label: 'else',
    kind: 17,
    documentation: 'else 语句',
    insertText: 'else ',
  },
  {
    label: 'for',
    kind: 17,
    documentation: 'for 循环',
    insertText: 'for (${1:item} in ${2:collection}) {\n\t${3:// code}\n}',
    insertTextRules: 4,
  },
  {
    label: 'while',
    kind: 17,
    documentation: 'while 循环',
    insertText: 'while (${1:condition}) {\n\t${2:// code}\n}',
    insertTextRules: 4,
  },
  {
    label: 'switch',
    kind: 17,
    documentation: 'switch 语句',
    insertText: 'switch (${1:value}) {\n\t${2:// cases}\n}',
    insertTextRules: 4,
  },
  {
    label: 'case',
    kind: 17,
    documentation: 'case 分支',
    insertText: 'case ${1:value}:\n\t${2:// code}\n\tbreak',
    insertTextRules: 4,
  },
  {
    label: 'break',
    kind: 17,
    documentation: '跳出循环或switch',
    insertText: 'break',
  },
  {
    label: 'continue',
    kind: 17,
    documentation: '继续下一次循环',
    insertText: 'continue',
  },
  {
    label: 'throw',
    kind: 17,
    documentation: '抛出异常',
    insertText: 'throw new ${1:Exception}(${2:message})',
    insertTextRules: 4,
  },
  {
    label: 'try',
    kind: 17,
    documentation: '异常处理',
    insertText:
      'try {\n\t${1:// code}\n} catch (${2:Exception} ${3:e}) {\n\t${4:// handle}\n}',
    insertTextRules: 4,
  },
  {
    label: 'catch',
    kind: 17,
    documentation: '捕获异常',
    insertText: 'catch (${1:Exception} ${2:e}) {\n\t${3:// handle}\n}',
    insertTextRules: 4,
  },
  {
    label: 'finally',
    kind: 17,
    documentation: 'finally 块',
    insertText: 'finally {\n\t${1:// code}\n}',
    insertTextRules: 4,
  },

  // Groovy 特殊关键字
  {
    label: 'as',
    kind: 17,
    documentation: '类型转换',
    insertText: 'as ',
  },
  {
    label: 'in',
    kind: 17,
    documentation: '在集合中',
    insertText: 'in ',
  },

  // 访问修饰符
  {
    label: 'public',
    kind: 17,
    documentation: '公共访问',
    insertText: 'public ',
  },
  {
    label: 'private',
    kind: 17,
    documentation: '私有访问',
    insertText: 'private ',
  },
  {
    label: 'protected',
    kind: 17,
    documentation: '受保护访问',
    insertText: 'protected ',
  },

  // 类相关关键字
  {
    label: 'class',
    kind: 17,
    documentation: '定义类',
    insertText: 'class ${1:ClassName} {\n\t${2:// class body}\n}',
    insertTextRules: 4,
  },
  {
    label: 'interface',
    kind: 17,
    documentation: '定义接口',
    insertText: 'interface ${1:InterfaceName} {\n\t${2:// methods}\n}',
    insertTextRules: 4,
  },
  {
    label: 'extends',
    kind: 17,
    documentation: '继承类',
    insertText: 'extends ',
  },
  {
    label: 'implements',
    kind: 17,
    documentation: '实现接口',
    insertText: 'implements ',
  },
  {
    label: 'new',
    kind: 17,
    documentation: '创建对象',
    insertText: 'new ${1:Type}(${2:args})',
    insertTextRules: 4,
  },
  {
    label: 'this',
    kind: 17,
    documentation: '当前对象',
    insertText: 'this',
  },
  {
    label: 'super',
    kind: 17,
    documentation: '父类对象',
    insertText: 'super',
  },

  // 导入相关
  {
    label: 'import',
    kind: 17,
    documentation: '导入包',
    insertText: 'import ',
  },
  {
    label: 'package',
    kind: 17,
    documentation: '定义包',
    insertText: 'package ',
  },

  // 布尔值和null
  {
    label: 'true',
    kind: 17,
    documentation: '布尔真值',
    insertText: 'true',
  },
  {
    label: 'false',
    kind: 17,
    documentation: '布尔假值',
    insertText: 'false',
  },
  {
    label: 'null',
    kind: 17,
    documentation: '空值',
    insertText: 'null',
  },

  // Groovy 特有
  {
    label: 'it',
    kind: 17,
    documentation: '隐式参数',
    insertText: 'it',
  },
  {
    label: 'with',
    kind: 17,
    documentation: 'with 操作符',
    insertText: 'with {\n\t${1:// code}\n}',
    insertTextRules: 4,
  },
];

/**
 * 内置数据类型
 */
export const DATA_TYPES = [
  {
    kind: 24,
    label: 'String',
    insertText: 'String',
    documentation: '字符串类型',
  },
  {
    kind: 24,
    label: 'Integer',
    insertText: 'Integer',
    documentation: '整数对象类型',
  },
  {
    kind: 24,
    label: 'Boolean',
    insertText: 'Boolean',
    documentation: '布尔对象类型',
  },
  { kind: 24, label: 'List', insertText: 'List', documentation: '列表类型' },
  { kind: 24, label: 'Map', insertText: 'Map', documentation: '映射类型' },
  { kind: 24, label: 'Set', insertText: 'Set', documentation: '集合类型' },
  {
    kind: 24,
    label: 'Closure',
    insertText: 'Closure',
    documentation: '闭包类型',
  },
];

/**
 * 内置集合方法
 */
export const COLLECTION_METHODS = [
  {
    label: 'each',
    kind: 0,
    documentation: '遍历集合中的每个元素',
    insertText: 'each { ${1:item} ->\n\t${2:// code}\n}',
    insertTextRules: 4,
  },
  {
    label: 'collect',
    kind: 0,
    documentation: '转换集合中的每个元素',
    insertText: 'collect { ${1:item} ->\n\t${2:transformedItem}\n}',
    insertTextRules: 4,
  },
  {
    label: 'findAll',
    kind: 0,
    documentation: '查找所有匹配的元素',
    insertText: 'findAll { ${1:item} ->\n\t${2:condition}\n}',
    insertTextRules: 4,
  },
  {
    label: 'join',
    kind: 0,
    documentation: '用分隔符连接集合元素',
    insertText: 'join("${1:,}")',
    insertTextRules: 4,
  },
  {
    label: 'reverse',
    kind: 0,
    documentation: '反转集合顺序',
    insertText: 'reverse()',
  },
  {
    label: 'sort',
    kind: 0,
    documentation: '排序集合',
    insertText: 'sort()',
  },
  {
    label: 'unique',
    kind: 0,
    documentation: '去除重复元素',
    insertText: 'unique()',
  },
  {
    label: 'size',
    kind: 0,
    documentation: '获取集合大小',
    insertText: 'size()',
  },
];

/**
 * 内置MAP方法
 */
export const MAP_METHODS = [
  {
    label: 'each',
    kind: 0,
    documentation: '遍历Map中的每个键值对',
    insertText: 'each { ${1:key}, ${2:value} ->\n\t${3:// code}\n}',
    insertTextRules: 4,
  },
  {
    label: 'each',
    kind: 0,
    documentation: '遍历Map中的每个条目',
    insertText: 'each { ${1:entry} ->\n\t${2:// code}\n}',
    insertTextRules: 4,
  },
  {
    label: 'collect',
    kind: 0,
    documentation: '转换Map中的每个键值对',
    insertText: 'collect { ${1:key}, ${2:value} ->\n\t${3:transformedValue}\n}',
    insertTextRules: 4,
  },
  {
    label: 'find',
    kind: 0,
    documentation: '查找第一个匹配的键值对',
    insertText: 'find { ${1:key}, ${2:value} ->\n\t${3:condition}\n}',
    insertTextRules: 4,
  },
  {
    label: 'findAll',
    kind: 0,
    documentation: '查找所有匹配的键值对',
    insertText: 'findAll { ${1:key}, ${2:value} ->\n\t${3:condition}\n}',
    insertTextRules: 4,
  },
  {
    label: 'get',
    kind: 0,
    documentation: '根据键获取值',
    insertText: 'get("${1:key}")',
    insertTextRules: 4,
  },
  {
    label: 'put',
    kind: 0,
    documentation: '添加或更新键值对',
    insertText: 'put("${1:key}", ${2:value})',
    insertTextRules: 4,
  },
  {
    label: 'putAll',
    kind: 0,
    documentation: '添加另一个Map的所有键值对',
    insertText: 'putAll(${1:otherMap})',
  },
  {
    label: 'remove',
    kind: 0,
    documentation: '根据键移除键值对',
    insertText: 'remove("${1:key}")',
    insertTextRules: 4,
  },
  {
    label: 'containsKey',
    kind: 0,
    documentation: '检查是否包含指定键',
    insertText: 'containsKey("${1:key}")',
    insertTextRules: 4,
  },
  {
    label: 'containsValue',
    kind: 0,
    documentation: '检查是否包含指定值',
    insertText: 'containsValue(${1:value})',
    insertTextRules: 4,
  },
  {
    label: 'keySet',
    kind: 0,
    documentation: '获取所有键的集合',
    insertText: 'keySet()',
  },
  {
    label: 'values',
    kind: 0,
    documentation: '获取所有值的集合',
    insertText: 'values()',
  },
  {
    label: 'entrySet',
    kind: 0,
    documentation: '获取所有条目的集合',
    insertText: 'entrySet()',
  },
  {
    label: 'size',
    kind: 0,
    documentation: '获取键值对数量',
    insertText: 'size()',
  },
  {
    label: 'isEmpty',
    kind: 0,
    documentation: '检查Map是否为空',
    insertText: 'isEmpty()',
  },
  {
    label: 'clear',
    kind: 0,
    documentation: '清空所有键值对',
    insertText: 'clear()',
  },
  {
    label: 'getOrDefault',
    kind: 0,
    documentation: '获取值，如果不存在返回默认值',
    insertText: 'getOrDefault("${1:key}", ${2:defaultValue})',
    insertTextRules: 4,
  },
  {
    label: 'findResult',
    kind: 0,
    documentation: '查找第一个非空结果',
    insertText: 'findResult { ${1:key}, ${2:value} ->\n\t${3:result}\n}',
    insertTextRules: 4,
  },
  {
    label: 'groupBy',
    kind: 0,
    documentation: '根据条件分组',
    insertText: 'groupBy { ${1:key}, ${2:value} ->\n\t${3:groupKey}\n}',
    insertTextRules: 4,
  },
  {
    label: 'count',
    kind: 0,
    documentation: '统计满足条件的键值对数量',
    insertText: 'count { ${1:key}, ${2:value} ->\n\t${3:condition}\n}',
    insertTextRules: 4,
  },
  {
    label: 'sort',
    kind: 0,
    documentation: '根据键排序',
    insertText: 'sort()',
  },
  {
    label: 'sort',
    kind: 0,
    documentation: '使用比较器排序',
    insertText: 'sort { ${1:entry1}, ${2:entry2} ->\n\t${3:comparison}\n}',
    insertTextRules: 4,
  },
  {
    label: 'inject',
    kind: 0,
    documentation: '累积操作',
    insertText:
      'inject(${1:initialValue}) { ${2:acc}, ${3:key}, ${4:value} ->\n\t${5:result}\n}',
    insertTextRules: 4,
  },
];
/**
 * 内置字符串方法
 */
export const STRING_METHODS = [
  {
    label: 'each',
    kind: 0,
    documentation: '遍历字符串中的每个字符',
    insertText: 'each { ${1:ch} ->\n\t${2:// code}\n}',
    insertTextRules: 4,
  },
  {
    label: 'reverse',
    kind: 0,
    documentation: '反转字符串',
    insertText: 'reverse()',
  },
  {
    label: 'split',
    kind: 0,
    documentation: '按正则表达式分割字符串',
    insertText: 'split(/${1:pattern}/)',
    insertTextRules: 4,
  },
  {
    label: 'join',
    kind: 0,
    documentation: '连接字符串数组',
    insertText: 'join("${1:,}")',
    insertTextRules: 4,
  },
  {
    label: 'length',
    kind: 0,
    documentation: '获取字符串长度',
    insertText: 'length()',
  },
  {
    label: 'substring',
    kind: 0,
    documentation: '提取子字符串',
    insertText: 'substring(${1:beginIndex})',
    insertTextRules: 4,
  },
];

/**
 * 内置数值方法
 */
export const NUMBAR_METHODS = [
  {
    label: 'each',
    kind: 0,
    documentation: '遍历数字范围',
    insertText: 'each { ${1:num} ->\n\t${2:// code}\n}',
    insertTextRules: 4,
  },
  {
    label: 'reverse',
    kind: 0,
    documentation: '反转数字范围',
    insertText: 'reverse()',
  },
  {
    label: 'join',
    kind: 0,
    documentation: '将数字连接为字符串',
    insertText: 'join("${1:,}")',
    insertTextRules: 4,
  },
];

/**
 * 内置通用方法
 */
export const COMMON_METHODS = [
  {
    label: 'toString',
    kind: 0,
    documentation: '转换为字符串',
    insertText: 'toString()',
  },
  {
    label: 'asType',
    kind: 0,
    documentation: '转换为指定类型',
    insertText: 'asType(${1:Class})',
    insertTextRules: 4,
  },
];

/**
 * 内置通用函数
 */
export const COMMON_FUNCTION = [
  // 输出
  {
    label: 'println',
    kind: 1,
    documentation: '输出一行文本并换行',
    insertText: 'println(${1:value})',
    insertTextRules: 4,
  },
  {
    label: 'print',
    kind: 1,
    documentation: '输出文本不换行',
    insertText: 'print(${1:value})',
    insertTextRules: 4,
  },
  {
    label: 'printf',
    kind: 1,
    documentation: '格式化输出',
    insertText: 'printf("${1:format}", ${2:args})',
    insertTextRules: 4,
  },
  {
    label: 'sprintf',
    kind: 1,
    documentation: '返回格式化字符串',
    insertText: 'sprintf("${1:format}", ${2:args})',
    insertTextRules: 4,
  },

  // 断言和工具方法
  {
    label: 'assert',
    kind: 1,
    documentation: '断言条件为真',
    insertText: 'assert ${1:condition}',
    insertTextRules: 4,
  },
  {
    label: 'sleep',
    kind: 1,
    documentation: '暂停执行指定的毫秒数',
    insertText: 'sleep(${1:millis})',
    insertTextRules: 4,
  },

  {
    label: 'psdecodelist',
    kind: 1,
    documentation: '代码表',
    insertText: 'psdecodelist(${1:params}) {\n\t${2:// code}\n}',
    insertTextRules: 4,
  },
];
